import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
let createViteServer;
let fileEnv = {};

if (isMainModule) {
  const viteModule = await import('vite');
  createViteServer = viteModule.createServer;
  fileEnv = viteModule.loadEnv(mode, rootDir, '');
}

const env = { ...fileEnv, ...process.env };
const port = Number(env.PORT || 3000);
const host = env.HOST || '127.0.0.1';
const rapidApiHost = env.RAPIDAPI_HOST || 'gpt-5-6-sol.p.rapidapi.com';
const rapidApiModel = env.RAPIDAPI_MODEL || 'gpt-5.6-sol';
const requestCounts = new Map();

const vite = !isMainModule || isProduction
  ? null
  : await createViteServer({
      root: rootDir,
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > 128 * 1024) throw new Error('REQUEST_TOO_LARGE');
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function isRateLimited(req) {
  const now = Date.now();
  const forwardedFor = req.headers?.['x-forwarded-for'];
  const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]?.trim())
    || req.socket?.remoteAddress
    || 'unknown';
  const current = requestCounts.get(ip);

  if (!current || now - current.startedAt > 60_000) {
    requestCounts.set(ip, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  return current.count > 8;
}

function sanitizeInput(body) {
  const allowedModes = new Set(['generate', 'review']);
  const allowedBudgets = new Set([76, 81, 86, 91]);
  const preferences = body?.preferences || {};
  const rawSkills = Array.isArray(body?.skills) ? body.skills.slice(0, 80) : [];

  if (!allowedModes.has(body?.mode)) throw new Error('INVALID_MODE');
  if (!allowedBudgets.has(preferences.budget)) throw new Error('INVALID_BUDGET');
  if (rawSkills.length === 0) throw new Error('INVALID_SKILLS');

  const skills = rawSkills.map((skill) => ({
    id: String(skill.id || '').slice(0, 80),
    name: String(skill.name || '').slice(0, 120),
    description: String(skill.description || '').slice(0, 500),
    category: String(skill.category || '').slice(0, 40),
    maxRank: Math.max(1, Math.min(5, Number(skill.maxRank) || 1)),
    parentIds: Array.isArray(skill.parentIds)
      ? skill.parentIds.slice(0, 4).map((id) => String(id).slice(0, 80))
      : [],
    reqPointsInTree: Math.max(0, Math.min(91, Number(skill.reqPointsInTree) || 0)),
  }));

  const validIds = new Set(skills.map((skill) => skill.id));
  if (validIds.size !== skills.length || validIds.has('')) throw new Error('INVALID_SKILLS');

  const currentSkills = {};
  for (const [id, rank] of Object.entries(body?.currentBuild?.skills || {})) {
    if (validIds.has(id)) currentSkills[id] = Math.max(0, Math.floor(Number(rank) || 0));
  }

  return {
    mode: body.mode,
    preferences: {
      budget: preferences.budget,
      squadSize: String(preferences.squadSize || 'solo').slice(0, 20),
      focus: String(preferences.focus || 'balanced').slice(0, 30),
      playstyle: String(preferences.playstyle || 'safe').slice(0, 30),
      notes: String(preferences.notes || '').slice(0, 800),
    },
    currentBuild: currentSkills,
    skills,
    treeVersion: String(body?.treeVersion || 'unknown').slice(0, 30),
  };
}

function buildMessages(input) {
  const system = `You are an expert ARC Raiders skill-tree advisor. Return JSON only, without markdown fences.

Use only the supplied skill IDs. Respect every maxRank, parent path, branch spending requirement, and the point budget. A skill with parents is available when at least one parent has a rank above zero. Branch requirements use the final total points in that category.

For generate mode, allocate exactly the requested budget. For review mode, analyze the current build and return a valid improved allocation using no more than the budget.

Return this shape:
{"title":"string","summary":"string","allocations":[{"skillId":"string","rank":1}],"upgradeOrder":["skillId"],"reasons":["string"],"tradeoffs":["string"],"changes":[{"skillId":"string","from":0,"to":1,"reason":"string"}],"warnings":["string"]}`;

  const user = JSON.stringify({
    task: input.mode,
    gameVersion: input.treeVersion,
    preferences: input.preferences,
    currentBuild: input.currentBuild,
    skills: input.skills,
  });

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}

function callRapidApi(messages) {
  const apiKey = env.RAPIDAPI_KEY;
  if (!apiKey) return Promise.reject(new Error('MISSING_API_KEY'));

  const payload = JSON.stringify({ model: rapidApiModel, messages });

  return new Promise((resolve, reject) => {
    const upstream = https.request(
      {
        method: 'POST',
        hostname: rapidApiHost,
        path: '/chat/completions',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': rapidApiHost,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 120_000,
      },
      (upstreamRes) => {
        const chunks = [];
        upstreamRes.on('data', (chunk) => chunks.push(chunk));
        upstreamRes.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          if (!upstreamRes.statusCode || upstreamRes.statusCode >= 400) {
            reject(new Error(`UPSTREAM_${upstreamRes.statusCode || 500}`));
            return;
          }
          try {
            resolve(JSON.parse(text));
          } catch {
            reject(new Error('INVALID_UPSTREAM_RESPONSE'));
          }
        });
      }
    );

    upstream.on('timeout', () => upstream.destroy(new Error('UPSTREAM_TIMEOUT')));
    upstream.on('error', reject);
    upstream.write(payload);
    upstream.end();
  });
}

function extractModelJson(payload) {
  let content = payload?.choices?.[0]?.message?.content ?? payload?.result ?? payload?.output;
  if (Array.isArray(content)) {
    content = content.map((part) => part?.text || '').join('');
  }
  if (typeof content === 'object' && content !== null) return content;
  if (typeof content !== 'string') throw new Error('INVALID_MODEL_CONTENT');

  const cleaned = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

function validateResult(raw, input) {
  if (!raw || !Array.isArray(raw.allocations)) throw new Error('INVALID_AI_BUILD');

  const skillMap = new Map(input.skills.map((skill) => [skill.id, skill]));
  const allocations = [];
  const allocationMap = new Map();

  for (const item of raw.allocations) {
    const skill = skillMap.get(item?.skillId);
    const rank = Number(item?.rank);
    if (!skill || !Number.isInteger(rank) || rank < 1 || rank > skill.maxRank) {
      throw new Error('INVALID_AI_BUILD');
    }
    if (allocationMap.has(skill.id)) throw new Error('INVALID_AI_BUILD');
    allocationMap.set(skill.id, rank);
    allocations.push({ skillId: skill.id, rank });
  }

  const totalPoints = allocations.reduce((sum, item) => sum + item.rank, 0);
  if (totalPoints > input.preferences.budget) throw new Error('AI_BUILD_OVER_BUDGET');
  if (input.mode === 'generate' && totalPoints !== input.preferences.budget) {
    throw new Error('AI_BUILD_INCOMPLETE');
  }

  const categoryPoints = new Map();
  for (const item of allocations) {
    const category = skillMap.get(item.skillId).category;
    categoryPoints.set(category, (categoryPoints.get(category) || 0) + item.rank);
  }

  for (const item of allocations) {
    const skill = skillMap.get(item.skillId);
    const hasParent =
      skill.parentIds.length === 0 || skill.parentIds.some((id) => (allocationMap.get(id) || 0) > 0);
    const meetsBranchRequirement =
      !skill.reqPointsInTree || (categoryPoints.get(skill.category) || 0) >= skill.reqPointsInTree;
    if (!hasParent || !meetsBranchRequirement) throw new Error('AI_BUILD_BREAKS_REQUIREMENTS');
  }

  const rawChanges = new Map(
    (Array.isArray(raw.changes) ? raw.changes : []).map((change) => [change?.skillId, change])
  );
  const allIds = new Set([...Object.keys(input.currentBuild), ...allocationMap.keys()]);
  const changes = [...allIds]
    .map((skillId) => {
      const from = input.currentBuild[skillId] || 0;
      const to = allocationMap.get(skillId) || 0;
      if (from === to) return null;
      return {
        skillId,
        from,
        to,
        reason: String(rawChanges.get(skillId)?.reason || 'Recommended for this build.').slice(0, 300),
      };
    })
    .filter(Boolean);

  const cleanStrings = (value, limit) =>
    (Array.isArray(value) ? value : []).slice(0, limit).map((item) => String(item).slice(0, 500));

  return {
    title: String(raw.title || 'AI Recommended Build').slice(0, 100),
    summary: String(raw.summary || '').slice(0, 1200),
    allocations,
    upgradeOrder: cleanStrings(raw.upgradeOrder, 100).filter((id) => skillMap.has(id)),
    reasons: cleanStrings(raw.reasons, 6),
    tradeoffs: cleanStrings(raw.tradeoffs, 6),
    changes,
    warnings: cleanStrings(raw.warnings, 6),
    totalPoints,
  };
}

export async function handleAiRequest(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }
  if (isRateLimited(req)) {
    sendJson(res, 429, { error: 'Too many AI requests. Please wait a minute.' });
    return;
  }

  try {
    const input = sanitizeInput(await readJson(req));
    const upstreamPayload = await callRapidApi(buildMessages(input));
    const result = validateResult(extractModelJson(upstreamPayload), input);
    sendJson(res, 200, result);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    if (code === 'MISSING_API_KEY') {
      sendJson(res, 503, { error: 'AI service is not configured.' });
    } else if (code === 'UPSTREAM_TIMEOUT') {
      sendJson(res, 504, { error: 'AI provider timed out. Please try again.', code });
    } else if (code.startsWith('AI_BUILD_') || code.startsWith('INVALID_AI_')) {
      sendJson(res, 502, { error: 'AI returned an invalid skill build. Please retry.', code });
    } else if (code.startsWith('INVALID_') || code === 'REQUEST_TOO_LARGE') {
      sendJson(res, 400, { error: 'The AI request was invalid.', code });
    } else {
      sendJson(res, 502, { error: 'AI provider request failed. Please try again.', code });
    }
  }
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

async function serveProduction(req, res) {
  const distDir = path.join(rootDir, 'dist');
  const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let filePath = path.resolve(distDir, `.${requestPath}`);
  if (!filePath.startsWith(distDir)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    filePath = path.join(distDir, 'index.html');
  }

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(content);
  } catch {
    res.writeHead(404).end('Not found');
  }
}

if (isMainModule) {
  const server = http.createServer(async (req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/api/ai/build') {
      await handleAiRequest(req, res);
      return;
    }

    if (vite) {
      vite.middlewares(req, res, () => {
        res.writeHead(404).end('Not found');
      });
      return;
    }

    await serveProduction(req, res);
  });

  server.listen(port, host, () => {
    console.log(`ARC Raiders server running at http://${host}:${port}`);
  });
}
