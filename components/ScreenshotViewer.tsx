import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Code } from 'lucide-react';

interface BuildState {
  pointsSpent: number;
  skills: { [id: string]: number };
}

interface ScreenshotViewerProps {
  shortId: string;
  onBack: () => void;
}

export default function ScreenshotViewer({ shortId, onBack }: ScreenshotViewerProps) {
  const [buildState, setBuildState] = useState<BuildState | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load build data from localStorage
    const storageKey = `arcraiders_screenshot_${shortId}`;
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setBuildState(data.buildState);
        setScreenshotDataUrl(data.screenshotDataUrl);
        setLoading(false);
      } catch (err) {
        setError('Failed to load screenshot data');
        setLoading(false);
      }
    } else {
      setError('Screenshot not found');
      setLoading(false);
    }
  }, [shortId]);

  const handleDownload = () => {
    if (!screenshotDataUrl) return;
    const link = document.createElement('a');
    link.href = screenshotDataUrl;
    link.download = `arcraiders-build-${shortId}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ARC Raiders Skill Build',
          text: 'Check out my ARC Raiders skill tree build!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#07080d' }}>
        <div className="text-center">
          <div className="text-2xl text-cyan-400 mb-4">Loading screenshot...</div>
          <div className="text-sm text-zinc-500">Please wait</div>
        </div>
      </div>
    );
  }

  if (error || !buildState || !screenshotDataUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#07080d' }}>
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl text-white font-bold mb-4">Screenshot Not Found</h1>
          <p className="text-zinc-400 mb-6">{error || 'This screenshot may have expired or does not exist.'}</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all text-cyan-400 font-semibold"
          >
            <ArrowLeft size={18} /> Go to Skill Tree Builder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#07080d' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/60 backdrop-blur-xl bg-zinc-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-semibold">Back to Builder</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-all text-orange-400 font-semibold text-sm"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all text-purple-400 font-semibold text-sm"
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Screenshot Image */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-2xl">
              <img
                src={screenshotDataUrl}
                alt="ARC Raiders Skill Tree Build"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Build Info Sidebar */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                ARC Raiders Build
              </h1>
              <p className="text-zinc-400 text-sm">
                Shared via ArcRaidersKill.com
              </p>
            </div>

            {/* Build Stats */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Total Points</span>
                <span className="text-2xl font-bold text-cyan-400">{buildState.pointsSpent}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Conditioning</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                        style={{ width: `${Math.min((buildState.pointsSpent / 75) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-cyan-400 font-semibold w-8 text-right">
                      {Object.values(buildState.skills).reduce((acc: number, val) => acc + (val as number), 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Mobility</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                        style={{ width: `${Math.min((buildState.pointsSpent / 75) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-purple-400 font-semibold w-8 text-right">
                      {Object.values(buildState.skills).reduce((acc: number, val) => acc + (val as number), 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Survival</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                        style={{ width: `${Math.min((buildState.pointsSpent / 75) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-orange-400 font-semibold w-8 text-right">
                      {Object.values(buildState.skills).reduce((acc: number, val) => acc + (val as number), 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share URL */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Code size={16} className="text-zinc-400" />
                <span className="text-zinc-400 text-sm font-semibold">Share URL</span>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-700/50 rounded-lg p-3">
                <code className="text-xs text-zinc-300 break-all">
                  {window.location.href}
                </code>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-2">Want to create your own build?</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Use our interactive skill tree builder to plan your perfect ARC Raiders build.
              </p>
              <button
                onClick={onBack}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all text-cyan-400 font-semibold"
              >
                <Code size={16} /> Start Building
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
