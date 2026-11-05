import React, { useState } from 'react';
import {
  X,
  FileCode,
  Download,
  Upload,
  Plus,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

export const JsonStudioModal = ({
  isOpen,
  onClose,
  games,
  onAddGame,
  onImportGames,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState('add');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form states for adding custom game
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeUrl, setIframeUrl] = useState('');
  const [embedHtml, setEmbedHtml] = useState('');
  const [embedMode, setEmbedMode] = useState('url');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [releaseYear, setReleaseYear] = useState('2024');

  // Import JSON textarea
  const [importJsonText, setImportJsonText] = useState('');

  if (!isOpen) return null;

  const handleCreateGame = (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Game title is required.');
      return;
    }

    if (embedMode === 'url' && !iframeUrl.trim()) {
      setErrorMsg('Please enter a valid iframe URL.');
      return;
    }

    if (embedMode === 'html' && !embedHtml.trim()) {
      setErrorMsg('Please enter HTML/iframe embed code.');
      return;
    }

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);

    const newGame = {
      id,
      title: title.trim(),
      category,
      description: description.trim() || 'Custom user added game via JSON.',
      controls: controls.trim() || 'Refer to in-game instructions.',
      iframeUrl: embedMode === 'url' ? iframeUrl.trim() : '',
      embedType: embedMode,
      embedHtml: embedMode === 'html' ? embedHtml.trim() : undefined,
      rating: 5.0,
      playedCount: 1,
      tags: [category, 'Custom', 'JSON'],
      releaseYear: releaseYear || '2024',
      thumbnailGradient: 'from-violet-600 via-indigo-700 to-slate-900',
      custom: true
    };

    onAddGame(newGame);
    setSuccessMsg(`Game "${newGame.title}" successfully saved into JSON storage!`);
    setTitle('');
    setIframeUrl('');
    setEmbedHtml('');
    setDescription('');
    setControls('');

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  const handleExportDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'games.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSubmit = () => {
    setErrorMsg(null);
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Imported JSON must be an array of game objects.');
      }
      if (parsed.length === 0) {
        throw new Error('Array is empty.');
      }
      onImportGames(parsed);
      setSuccessMsg(`Successfully imported ${parsed.length} games from JSON!`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid JSON format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-white">JSON Game Studio</h2>
              <p className="text-xs text-slate-400">Manage iframe game records directly in JSON format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (Interactive Buttons) */}
        <div className="flex gap-1 p-1 bg-slate-950 rounded-xl my-4 border border-slate-800">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'add'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Game</span>
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'view'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>View games.json</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Add New Game */}
        {activeTab === 'add' && (
          <form onSubmit={handleCreateGame} className="overflow-y-auto space-y-4 pr-1 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Game Title</label>
                <input
                  type="text"
                  placeholder="e.g. Retro Bowl, Subway Surfers, Slope"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Action">Action</option>
                  <option value="Arcade">Arcade</option>
                  <option value="Puzzle">Puzzle</option>
                  <option value="Sports">Sports</option>
                  <option value="Classic">Classic</option>
                  <option value="Driving">Driving</option>
                  <option value="Strategy">Strategy</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Iframe Source Type</label>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setEmbedMode('url')}
                    className={`px-2 py-0.5 rounded ${embedMode === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    Iframe URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmbedMode('html')}
                    className={`px-2 py-0.5 rounded ${embedMode === 'html' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    Raw HTML / Embed Code
                  </button>
                </div>
              </div>

              {embedMode === 'url' ? (
                <input
                  type="url"
                  placeholder="https://example.com/unblocked-game.html or /games/mygame.html"
                  value={iframeUrl}
                  onChange={(e) => setIframeUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              ) : (
                <textarea
                  rows={3}
                  placeholder="<iframe src='...' width='800' height='600'></iframe> or <html>...</html>"
                  value={embedHtml}
                  onChange={(e) => setEmbedHtml(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Controls Description</label>
                <input
                  type="text"
                  placeholder="e.g. WASD to move, Space to Jump"
                  value={controls}
                  onChange={(e) => setControls(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Release Year</label>
                <input
                  type="text"
                  placeholder="2024"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Game Description</label>
              <textarea
                rows={2}
                placeholder="Brief summary of gameplay, objectives, and mechanics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Save Game to JSON</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: View Raw JSON */}
        {activeTab === 'view' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Total Games in JSON: <b className="text-white font-mono">{games.length}</b></span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(games, null, 2));
                  setSuccessMsg('Entire JSON catalog copied to clipboard!');
                  setTimeout(() => setSuccessMsg(null), 2000);
                }}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Copy All JSON
              </button>
            </div>
            <pre className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-indigo-300 overflow-auto">
              {JSON.stringify(games, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 3: Export */}
        {activeTab === 'export' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Download className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Download games.json</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Export all {games.length} unblocked games including your custom additions as a portable JSON file.
              </p>
            </div>
            <button
              onClick={handleExportDownload}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download games.json</span>
            </button>
          </div>
        )}

        {/* Tab 4: Import */}
        {activeTab === 'import' && (
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <p className="text-xs text-slate-400">
              Paste a JSON array containing game entries. Each game should have <code className="text-indigo-400">id</code>, <code className="text-indigo-400">title</code>, <code className="text-indigo-400">category</code>, and <code className="text-indigo-400">iframeUrl</code>.
            </p>
            <textarea
              rows={8}
              placeholder="Paste JSON array here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset games database to original defaults? This will erase custom additions.')) {
                    onResetDefaults();
                    setSuccessMsg('Games library restored to defaults.');
                    setTimeout(() => {
                      setSuccessMsg(null);
                      onClose();
                    }, 1200);
                  }
                }}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Import JSON Records</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
