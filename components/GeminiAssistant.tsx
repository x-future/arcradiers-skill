import React, { useState } from 'react';
import { generateBuildSuggestion } from '../services/geminiService';
import { SkillTreeData } from '../types';
import { Sparkles, Loader2, AlertCircle, Terminal } from 'lucide-react';

interface GeminiAssistantProps {
  treeData: SkillTreeData;
  onApplyBuild: (skills: { skillId: string; rank: number }[]) => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ treeData, onApplyBuild }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const suggestions = await generateBuildSuggestion(prompt, treeData);
      onApplyBuild(suggestions);
      setIsOpen(false);
      setPrompt('');
    } catch (err) {
      setError("Connection Failure. Verify API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 flex items-center gap-3 bg-arc-500 text-black px-6 py-3 shadow-[0_0_20px_rgba(255,94,0,0.3)] hover:shadow-[0_0_30px_rgba(255,94,0,0.5)] hover:bg-white transition-all hover:-translate-y-1 font-display font-bold z-40 group clip-path-slant"
        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
      >
        <Sparkles size={20} className="group-hover:animate-spin" />
        AI AUTO-SPEC
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-arc-950 border border-arc-700 w-full max-w-lg shadow-2xl relative">
        {/* Header */}
        <div className="bg-arc-900 p-4 border-b border-arc-700 flex justify-between items-center">
          <h2 className="text-white font-display font-bold flex items-center gap-2 uppercase tracking-wider">
            <Terminal className="text-arc-500" size={18} />
            Tactical Analysis AI
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-arc-600 hover:text-white transition-colors font-bold"
          >
            [CLOSE]
          </button>
        </div>
        
        {/* Decorative Lines */}
        <div className="h-0.5 w-full bg-arc-500/20">
           <div className="h-full w-1/3 bg-arc-500 animate-scan"></div>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-slate-400 text-sm font-mono">
            :: SYSTEM READY :: <br/>
            Enter parameters for loadout optimization. The AI will allocate points based on combat role requirements.
          </p>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="> E.g. Stealth sniper with high mobility..."
            className="w-full bg-black border border-arc-800 text-arc-300 p-4 focus:outline-none focus:border-arc-500 min-h-[120px] resize-none text-sm font-mono placeholder-arc-800"
            disabled={isLoading}
            spellCheck={false}
          />

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-950/30 border border-red-900 p-3">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 border border-arc-800 hover:border-arc-600 text-slate-500 hover:text-white py-3 font-display font-bold text-xs uppercase tracking-widest transition-colors"
              disabled={isLoading}
            >
              Abort
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="flex-1 bg-arc-500 hover:bg-arc-400 text-black py-3 font-display font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,94,0,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  EXECUTE
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Footer disclaimer */}
        <div className="bg-black p-2 text-right border-t border-arc-900">
          <p className="text-[9px] text-arc-900 font-mono">POWERED BY GEMINI 2.5 FLASH // V.0.9.2</p>
        </div>

        {/* Corner Decals */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-arc-500"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-arc-500"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-arc-500"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-arc-500"></div>
      </div>
    </div>
  );
};

export default GeminiAssistant;