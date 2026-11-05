import React from 'react';
import { ShieldCheck, Code, Globe, EyeOff, Gamepad } from 'lucide-react';

export const PortalGuide = ({
  onBackToCatalog,
  onOpenJsonStudio,
  onOpenCloakModal,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Portal Guide & Architecture</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-2xl">
          VaultArcade is a high-performance unblocked games catalog powered by self-contained HTML5 games,
          iframe sandboxes, and structured JSON libraries.
        </p>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">JSON-Driven Catalog</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every game is stored as a lightweight schema object in <code className="text-indigo-400 font-mono">games.json</code>, enabling instant import, export, and custom game injection without rebuilding code.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Isolated Iframe Sandbox</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Games execute in isolated HTML5 iframes with dedicated canvas contexts and Web Audio synthesizers, guaranteeing smooth 60 FPS gameplay without cross-origin friction.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Stealth Tab Cloak</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch your tab icon and title instantly to Google Classroom, Google Drive, Canvas, or Desmos, backed by a quick-trigger Panic Key redirect.
          </p>
        </div>
      </div>

      {/* Detailed Spec: How to Add Custom Games */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Gamepad className="w-5 h-5 text-indigo-400" />
          <span>Adding Custom Games via JSON</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          You can add any web game, itch.io embed, GitHub pages game, or self-hosted HTML file into your personal VaultArcade database:
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
{`{
  "id": "my-custom-game",
  "title": "Super Hexagon Clone",
  "category": "Arcade",
  "description": "High-velocity dodging simulator.",
  "controls": "Left / Right arrows to rotate",
  "iframeUrl": "https://example.com/game/index.html",
  "rating": 5.0,
  "playedCount": 1,
  "tags": ["Arcade", "Custom"],
  "releaseYear": "2024"
}`}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onOpenJsonStudio}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Open JSON Studio
          </button>
          <button
            onClick={onOpenCloakModal}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Configure Stealth Cloak
          </button>
        </div>
      </div>

      {/* Anti-AI & Privacy Statement */}
      <div className="border border-slate-800 rounded-xl p-6 bg-slate-900/50 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">Pure Deterministic Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            VaultArcade has zero AI wrappers, zero third-party telemetry trackers, and zero intrusive ads.
            All game states, favorites, and settings persist securely in your browser's local storage.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onBackToCatalog}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Return to Games Catalog
        </button>
      </div>
    </div>
  );
};
