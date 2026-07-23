import { handleAiRequest } from '../../server.mjs';

export default async function handler(req, res) {
  await handleAiRequest(req, res);
}
