import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  Minus,
  Plus,
  ScanSearch,
  Sparkles,
  Undo2,
  X,
} from 'lucide-react';
import {
  AIAdvisorMode,
  AIAdvisorPreferences,
  AIAdvisorResult,
  requestAIAdvice,
} from '../services/aiService';
import { BuildState, SkillTreeData } from '../types';

interface GeminiAssistantProps {
  treeData: SkillTreeData;
  buildState: BuildState;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyBuild: (skills: { skillId: string; rank: number }[]) => void;
  onUndo: () => void;
  canUndo: boolean;
}

const initialPreferences: AIAdvisorPreferences = {
  budget: 76,
  squadSize: 'solo',
  focus: 'balanced',
  playstyle: 'safe',
  notes: '',
};

const selectClass =
  'h-10 w-full border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-orange-500';

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({
  treeData,
  buildState,
  isOpen,
  onOpenChange,
  onApplyBuild,
  onUndo,
  canUndo,
}) => {
  const [mode, setMode] = useState<AIAdvisorMode>('generate');
  const [preferences, setPreferences] = useState<AIAdvisorPreferences>(initialPreferences);
  const [result, setResult] = useState<AIAdvisorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skillNames = useMemo(
    () => Object.fromEntries(Object.values(treeData.skills).map((skill) => [skill.id, skill.name])),
    [treeData]
  );

  const updatePreference = <K extends keyof AIAdvisorPreferences>(
    key: K,
    value: AIAdvisorPreferences[K]
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  const handleGenerate = async () => {
    if (mode === 'review' && buildState.pointsSpent === 0) {
      setError('Allocate some points before reviewing a build.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await requestAIAdvice(mode, preferences, treeData, buildState));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'AI request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      className="fixed bottom-0 right-0 top-14 z-50 flex w-full flex-col border-l border-zinc-800 bg-[#0b0c10]/98 shadow-2xl backdrop-blur-xl sm:w-[410px]"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-orange-500/40 bg-orange-500/10 text-orange-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase text-white">AI Build Advisor</h2>
            <p className="text-xs text-zinc-500">ARC Raiders skill analysis</p>
          </div>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="flex h-9 w-9 items-center justify-center text-zinc-500 hover:bg-zinc-800 hover:text-white"
          title="Close AI Advisor"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-5 grid grid-cols-2 border border-zinc-800 bg-zinc-950 p-1">
          {(['generate', 'review'] as AIAdvisorMode[]).map((item) => (
            <button
              key={item}
              onClick={() => {
                setMode(item);
                setResult(null);
                setError(null);
              }}
              className={`h-9 text-xs font-bold uppercase transition-colors ${
                mode === item ? 'bg-orange-500 text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {item === 'generate' ? 'Create Build' : 'Review Build'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1.5 text-xs font-semibold uppercase text-zinc-500">
            Point Budget
            <select
              className={selectClass}
              value={preferences.budget}
              onChange={(event) =>
                updatePreference('budget', Number(event.target.value) as AIAdvisorPreferences['budget'])
              }
            >
              {[76, 81, 86, 91].map((budget) => (
                <option key={budget} value={budget}>{budget} points</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 text-xs font-semibold uppercase text-zinc-500">
            Squad
            <select
              className={selectClass}
              value={preferences.squadSize}
              onChange={(event) =>
                updatePreference('squadSize', event.target.value as AIAdvisorPreferences['squadSize'])
              }
            >
              <option value="solo">Solo</option>
              <option value="duo">Duo</option>
              <option value="trio">Trio</option>
            </select>
          </label>

          <label className="space-y-1.5 text-xs font-semibold uppercase text-zinc-500">
            Focus
            <select
              className={selectClass}
              value={preferences.focus}
              onChange={(event) =>
                updatePreference('focus', event.target.value as AIAdvisorPreferences['focus'])
              }
            >
              <option value="balanced">Balanced</option>
              <option value="pvp">PvP</option>
              <option value="arc-hunting">ARC Hunting</option>
              <option value="looting">Looting</option>
              <option value="trials">Trials</option>
            </select>
          </label>

          <label className="space-y-1.5 text-xs font-semibold uppercase text-zinc-500">
            Playstyle
            <select
              className={selectClass}
              value={preferences.playstyle}
              onChange={(event) =>
                updatePreference('playstyle', event.target.value as AIAdvisorPreferences['playstyle'])
              }
            >
              <option value="safe">Safe</option>
              <option value="aggressive">Aggressive</option>
              <option value="stealth">Stealth</option>
              <option value="mobility">High Mobility</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block space-y-1.5 text-xs font-semibold uppercase text-zinc-500">
          Additional Priorities
          <textarea
            value={preferences.notes}
            onChange={(event) => updatePreference('notes', event.target.value)}
            placeholder="Must-have skills, weapons, habits, or constraints..."
            className="min-h-24 w-full resize-none border border-zinc-700 bg-zinc-950 p-3 text-sm font-normal normal-case text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-orange-500"
            maxLength={800}
          />
        </label>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 bg-orange-500 text-xs font-bold uppercase text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : <ScanSearch size={16} />}
          {isLoading ? 'Analyzing...' : mode === 'generate' ? 'Generate Build' : 'Analyze Current Build'}
        </button>

        {error && (
          <div className="mt-4 flex gap-2 border border-red-900/70 bg-red-950/30 p-3 text-xs text-red-300">
            <AlertCircle className="mt-0.5 shrink-0" size={15} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <section className="mt-6 space-y-5 border-t border-zinc-800 pt-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="font-display text-base font-bold text-white">{result.title}</h3>
                <span className="shrink-0 border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-400">
                  {result.totalPoints} pts
                </span>
              </div>
              <p className="text-sm leading-6 text-zinc-400">{result.summary}</p>
            </div>

            {result.reasons.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-zinc-500">Why this works</h4>
                <ul className="space-y-2">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 shrink-0 text-green-400" size={14} /> {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.changes.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-zinc-500">Build changes</h4>
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {result.changes.map((change) => (
                    <div key={change.skillId} className="border border-zinc-800 bg-zinc-950/70 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-zinc-200">
                          {skillNames[change.skillId] || change.skillId}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-bold ${change.to > change.from ? 'text-green-400' : 'text-red-400'}`}>
                          {change.to > change.from ? <Plus size={12} /> : <Minus size={12} />}
                          {change.from} → {change.to}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">{change.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.tradeoffs.length > 0 && (
              <div className="border border-yellow-800/50 bg-yellow-950/20 p-3">
                <h4 className="mb-2 text-xs font-bold uppercase text-yellow-500">Tradeoffs</h4>
                {result.tradeoffs.map((tradeoff, index) => (
                  <p key={index} className="text-xs leading-5 text-yellow-100/70">{tradeoff}</p>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="flex shrink-0 gap-2 border-t border-zinc-800 bg-zinc-950/80 p-4">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex h-10 items-center justify-center gap-2 border border-zinc-700 px-4 text-xs font-bold uppercase text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Undo2 size={14} /> Undo
        </button>
        <button
          onClick={() => result && onApplyBuild(result.allocations)}
          disabled={!result}
          className="flex h-10 flex-1 items-center justify-center gap-2 bg-green-500 text-xs font-bold uppercase text-black hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Check size={14} /> Apply Build
        </button>
      </footer>
    </aside>
  );
};

export default GeminiAssistant;
