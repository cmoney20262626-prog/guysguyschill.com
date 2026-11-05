import React from 'react';
import { Shield } from 'lucide-react';

export const Navbar = ({
  currentView,
  onNavigate,
  onOpenCloakModal,
  onOpenJsonStudio,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onNavigate('catalog')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 hover:text-indigo-400 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Shield className="w-4 h-4" />
          </span>
          <span>VaultArcade</span>
        </button>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'catalog' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onNavigate('favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'favorites' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Favorites {favoritesCount > 0 && `(${favoritesCount})`}
          </button>
          <button
            onClick={onOpenJsonStudio}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-white"
          >
            JSON Library
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              currentView === 'about' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Portal Guide
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCloakModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:border-slate-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Stealth Cloak</span>
          </button>
        </div>
      </div>
    </header>
  );
};
