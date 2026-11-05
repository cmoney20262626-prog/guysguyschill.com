import React from 'react';
import { Star, Play, Sparkles, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
}) => {
  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative flex flex-col bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-indigo-500/10"
    >
      {/* Thumbnail Surface */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${game.thumbnailGradient || 'from-indigo-900 via-slate-900 to-slate-950'} flex items-center justify-center overflow-hidden`}>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Central Game Icon Representation */}
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:border-indigo-400/40 transition-transform duration-300">
          <Gamepad2 className="w-8 h-8 text-indigo-300" />
        </div>

        {/* Play Overlay Button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
          <span className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </span>
        </div>

        {/* Favorite Action Button */}
        <button
          onClick={(e) => onToggleFavorite(e, game.id)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 z-20 p-2 rounded-lg backdrop-blur-md transition-colors ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
              : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Unboxed featured tag */}
        {game.featured && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-amber-500/20">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Card Content & Zero-Pill Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-indigo-400">{game.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{game.releaseYear}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{game.playedCount.toLocaleString()} plays</span>
          </div>

          <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Footer info: Rating and embed status */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono tabular-nums font-semibold text-slate-200">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{Number(game.rating).toFixed(1)}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {game.custom ? 'Custom JSON' : 'Verified Iframe'}
          </span>
        </div>
      </div>
    </div>
  );
};
