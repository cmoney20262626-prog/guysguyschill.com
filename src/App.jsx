/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import DEFAULT_GAMES_DATA from './data/games.json';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { JsonStudioModal } from './components/JsonStudioModal.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { PortalGuide } from './components/PortalGuide.jsx';
import {
  applyCloak,
  loadSavedCloak,
  triggerPanicRedirect
} from './utils/cloak.js';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Star,
  Play,
  RotateCcw,
  Gamepad2,
  FileCode2,
  Shield
} from 'lucide-react';

const CATEGORIES = ['All', 'Action', 'Arcade', 'Puzzle', 'Sports', 'Classic'];

export default function App() {
  // State: Games list loaded from localStorage or default JSON
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem('vaultarcade_games');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_GAMES_DATA;
  });

  // State: Active game player view
  const [selectedGame, setSelectedGame] = useState(null);

  // State: Favorites list
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('vaultarcade_favs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['snake', '2048', 'tetris'];
  });

  // State: Filters and Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [currentView, setCurrentView] = useState('catalog');

  // State: Modals
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isJsonStudioOpen, setIsJsonStudioOpen] = useState(false);

  // State: Cloak Profile & Panic Hotkey
  const [activeCloak, setActiveCloak] = useState(loadSavedCloak);
  const [panicKey, setPanicKey] = useState(() => {
    return localStorage.getItem('vaultarcade_panic_key') || ']';
  });
  const [panicUrl, setPanicUrl] = useState(() => {
    return localStorage.getItem('vaultarcade_panic_url') || 'https://classroom.google.com';
  });

  // Apply saved cloak on mount
  useEffect(() => {
    applyCloak(activeCloak);
  }, [activeCloak]);

  // Global Panic Key Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid firing panic key when typing in an input or textarea
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === panicKey) {
        e.preventDefault();
        triggerPanicRedirect(panicUrl);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, panicUrl]);

  // Sync games to localStorage
  const handleUpdateGames = (newGames) => {
    setGames(newGames);
    try {
      localStorage.setItem('vaultarcade_games', JSON.stringify(newGames));
    } catch (e) {}
  };

  const handleAddGame = (newGame) => {
    const updated = [newGame, ...games];
    handleUpdateGames(updated);
  };

  const handleImportGames = (imported) => {
    const existingIds = new Set(games.map(g => g.id));
    const merged = [...games];
    imported.forEach(g => {
      if (!existingIds.has(g.id)) {
        merged.push(g);
      }
    });
    handleUpdateGames(merged);
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('vaultarcade_games');
    setGames(DEFAULT_GAMES_DATA);
  };

  const handleToggleFavorite = (e, gameId) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      localStorage.setItem('vaultarcade_favs', JSON.stringify(next));
      return next;
    });
  };

  // Launch game & increment play counter
  const handleSelectGame = (game) => {
    const updated = games.map((g) => {
      if (g.id === game.id) {
        return { ...g, playedCount: (g.playedCount || 0) + 1 };
      }
      return g;
    });
    handleUpdateGames(updated);
    setSelectedGame({ ...game, playedCount: (game.playedCount || 0) + 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered and Sorted games
  const filteredGames = useMemo(() => {
    return games
      .filter((g) => {
        if (currentView === 'favorites' && !favorites.includes(g.id)) {
          return false;
        }
        if (selectedCategory !== 'All' && g.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = g.title.toLowerCase().includes(q);
          const matchDesc = g.description.toLowerCase().includes(q);
          const matchTags = g.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.playedCount || 0) - (a.playedCount || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return parseInt(b.releaseYear || '0') - parseInt(a.releaseYear || '0');
        if (sortBy === 'alpha') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, selectedCategory, searchQuery, sortBy, currentView, favorites]);

  // Featured Hero Game
  const featuredGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0];
  }, [games]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setSelectedGame(null);
          setCurrentView(view);
        }}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenJsonStudio={() => setIsJsonStudioOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedGame ? (
          /* Active Game Player View (Iframe Viewport) */
          <GamePlayer
            game={selectedGame}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => setSelectedGame(null)}
            onSelectGame={handleSelectGame}
            allGames={games}
          />
        ) : currentView === 'about' ? (
          /* Portal Guide View */
          <PortalGuide
            onBackToCatalog={() => setCurrentView('catalog')}
            onOpenJsonStudio={() => setIsJsonStudioOpen(true)}
            onOpenCloakModal={() => setIsCloakModalOpen(true)}
          />
        ) : (
          /* Games Catalog View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Hero Section: Featured Game Spotlight (when in all catalog view without search) */}
            {currentView === 'catalog' && !searchQuery && selectedCategory === 'All' && featuredGame && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 sm:p-10 shadow-2xl">
                <div className="relative z-10 max-w-2xl space-y-4">
                  {/* Unboxed Featured Tag */}
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Featured Title</span>
                    <span aria-hidden="true" className="text-slate-500">·</span>
                    <span className="text-slate-300 font-mono tabular-nums">{featuredGame.playedCount.toLocaleString()} plays</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {featuredGame.title}
                  </h1>

                  <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                    {featuredGame.description}
                  </p>

                  <div className="pt-2 flex items-center gap-4">
                    <button
                      onClick={() => handleSelectGame(featuredGame)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Now</span>
                    </button>

                    <button
                      onClick={(e) => handleToggleFavorite(e, featuredGame.id)}
                      className={`px-4 py-3 border rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                        favorites.includes(featuredGame.id)
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(featuredGame.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{favorites.includes(featuredGame.id) ? 'Favorited' : 'Favorite'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Decorative Graphic */}
                <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 rounded-2xl bg-gradient-to-tr from-indigo-600/20 to-purple-600/30 border border-indigo-500/20 items-center justify-center backdrop-blur-sm">
                  <Gamepad2 className="w-24 h-24 text-indigo-400/80" />
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Box */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search games by title, tags, or controls..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sorting and Secondary Controls */}
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="popular" className="bg-slate-900">Most Popular</option>
                      <option value="rating" className="bg-slate-900">Highest Rated</option>
                      <option value="newest" className="bg-slate-900">Release Year</option>
                      <option value="alpha" className="bg-slate-900">Alphabetical</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsJsonStudioOpen(true)}
                    className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Manage JSON</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs (Interactive Segmented Buttons) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                      }`}
                    >
                      {cat} {cat === 'All' ? `(${games.length})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {currentView === 'favorites' ? 'Your Favorite Games' : `${selectedCategory} Games`}
                </h2>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  ({filteredGames.length})
                </span>
              </div>

              {/* Panic Shortcut reminder */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <span>Panic Key:</span>
                <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 font-bold">{panicKey}</kbd>
              </div>
            </div>

            {/* Games Card Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectGame={handleSelectGame}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
                <div>
                  <h3 className="text-base font-semibold text-white">No games found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    {searchQuery
                      ? `No titles or tags match "${searchQuery}". Try a different search term or reset filters.`
                      : 'You do not have any saved favorite games yet.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setCurrentView('catalog');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* JSON Game Studio Modal */}
      <JsonStudioModal
        isOpen={isJsonStudioOpen}
        onClose={() => setIsJsonStudioOpen(false)}
        games={games}
        onAddGame={handleAddGame}
        onImportGames={handleImportGames}
        onResetDefaults={handleResetDefaults}
      />

      {/* Stealth Cloak Modal */}
      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activeProfile={activeCloak}
        onSelectProfile={(p) => {
          setActiveCloak(p);
          localStorage.setItem('vaultarcade_cloak', p.id);
        }}
        panicKey={panicKey}
        onSetPanicKey={(k) => {
          setPanicKey(k);
          localStorage.setItem('vaultarcade_panic_key', k);
        }}
        panicUrl={panicUrl}
        onSetPanicUrl={(u) => {
          setPanicUrl(u);
          localStorage.setItem('vaultarcade_panic_url', u);
        }}
      />

      {/* Clean Quiet Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">VaultArcade</span>
            <span>·</span>
            <span>Unblocked Games Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedGame(null);
                setCurrentView('catalog');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Catalog
            </button>
            <button
              onClick={() => setIsJsonStudioOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              JSON Studio
            </button>
            <button
              onClick={() => setIsCloakModalOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Stealth Cloak
            </button>
            <button
              onClick={() => {
                setSelectedGame(null);
                setCurrentView('about');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Portal Guide
            </button>
          </div>

          <div className="font-mono text-[11px] text-slate-600">
            Stored as iframes in games.json
          </div>
        </div>
      </footer>
    </div>
  );
}
