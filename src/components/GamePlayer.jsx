import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Maximize2,
  RotateCw,
  Star,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Tv,
  Gamepad,
  Info
} from 'lucide-react';
import { openInAboutBlank } from '../utils/cloak.js';

export const GamePlayer = ({
  game,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSelectGame,
  allGames,
}) => {
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const playerContainerRef = useRef(null);
  const iframeRef = useRef(null);

  // Fullscreen trigger
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (playerContainerRef.current?.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Reload iframe
  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Copy Iframe HTML embed code
  const handleCopyIframe = () => {
    const embedCode = `<iframe src="${window.location.origin}${game.iframeUrl}" width="800" height="600" frameborder="0" allow="autoplay; fullscreen; keyboard" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Stealth popout
  const handleStealthPopout = () => {
    openInAboutBlank(game.iframeUrl, game.title);
  };

  // Related games
  const relatedGames = allGames
    .filter((g) => g.id !== game.id && g.category === game.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Games Catalog</span>
        </button>

        {/* Unboxed Metadata (Zero-Pill discipline) */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-indigo-400 font-medium">{game.category}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{game.releaseYear}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{game.playedCount.toLocaleString()} plays</span>
        </div>
      </div>

      {/* Main Game Stage */}
      <div
        ref={playerContainerRef}
        className={`relative w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl transition-all duration-300 ${
          isTheater
            ? 'h-[85vh] z-30'
            : 'h-[650px] max-h-[75vh]'
        }`}
      >
        {/* Iframe Viewport */}
        {game.embedType === 'html' && game.embedHtml ? (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            srcDoc={game.embedHtml}
            title={game.title}
            className="w-full h-full border-0 bg-slate-950"
            allow="autoplay; fullscreen; keyboard; gamepad"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
          />
        ) : (
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full border-0 bg-slate-950"
            allow="autoplay; fullscreen; keyboard; gamepad"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
          />
        )}
      </div>

      {/* Controls & Actions Toolbar */}
      <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left Game info */}
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{game.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Stored as iframe in <code className="text-indigo-400 font-mono">games.json</code></p>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Reload Button */}
          <button
            onClick={handleReload}
            title="Restart Game"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>

          {/* Theater Mode */}
          <button
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
            className={`p-2 border rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              isTheater
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">{isTheater ? 'Compact' : 'Theater'}</span>
          </button>

          {/* Fullscreen Mode */}
          <button
            onClick={handleToggleFullscreen}
            title="Fullscreen"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          {/* Stealth Popout */}
          <button
            onClick={handleStealthPopout}
            title="Open in stealth about:blank window"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">About:Blank Popout</span>
          </button>

          {/* Copy Iframe HTML */}
          <button
            onClick={handleCopyIframe}
            title="Copy Iframe HTML Embed Code"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedCode ? 'Copied!' : 'Copy Embed'}</span>
          </button>

          {/* View Raw JSON */}
          <button
            onClick={() => setShowJsonModal(true)}
            title="Inspect Raw Game JSON"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={(e) => onToggleFavorite(e, game.id)}
            title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
            className={`p-2 border rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>
        </div>
      </div>

      {/* Game Details & Controls Instructions Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-white font-semibold mb-3">
            <Gamepad className="w-4 h-4 text-indigo-400" />
            <h3>Controls & Gameplay</h3>
          </div>
          <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-xs leading-relaxed">
            {game.controls}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex justify-between">
              <span>Category</span>
              <span className="font-semibold text-slate-200">{game.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Rating</span>
              <span className="font-mono tabular-nums text-amber-400 font-semibold">{Number(game.rating).toFixed(1)} / 5.0</span>
            </div>
            <div className="flex justify-between">
              <span>Storage Source</span>
              <span className="font-mono text-slate-300">JSON Record</span>
            </div>
          </div>
        </div>

        {/* Description Column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <h3>About this Game</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {game.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Tags: {game.tags?.join(' · ')}</span>
            <span className="font-mono text-indigo-400">{game.iframeUrl}</span>
          </div>
        </div>
      </div>

      {/* Related Games in this category */}
      {relatedGames.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-4">More {game.category} Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedGames.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectGame(rel)}
                className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-3 cursor-pointer transition-colors flex items-center gap-3"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${rel.thumbnailGradient || 'from-indigo-600 to-slate-900'} shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
                  {rel.title.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{rel.title}</h4>
                  <p className="text-xs text-slate-400 font-mono tabular-nums">{Number(rel.rating).toFixed(1)} ★ · {rel.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">JSON Record: {game.title}</h3>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Close
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto max-h-96 border border-slate-800">
              {JSON.stringify(game, null, 2)}
            </pre>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(game, null, 2));
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Game JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
