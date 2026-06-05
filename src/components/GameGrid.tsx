"use client";

import { Game } from "@/types/game";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";

interface GameGridProps {
  games: Game[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
}

export default function GameGrid({
  games,
  loading = false,
  title,
  subtitle,
}: GameGridProps) {
  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-secondary-text text-sm mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 18 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))
          : games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
      </div>
      {!loading && games.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-secondary-text text-lg font-medium">
            No games found
          </p>
          <p className="text-muted text-sm mt-1">
            Try a different search or browse our categories
          </p>
        </div>
      )}
    </section>
  );
}
