import Link from "next/link";
import Image from "next/image";
import { Game } from "@/types/game";

interface GameCardProps {
  game: Game;
  index?: number;
}

export default function GameCard({ game, index = 0 }: GameCardProps) {
  return (
    <Link
      href={`/game/${game.id}`}
      className="game-card group block rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-orange/20"
      style={{ animationDelay: `${index * 50}ms` }}
      id={`game-card-${game.id}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
        <Image
          src={game.thumb}
          alt={game.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-orange/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-orange/30">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="white"
              className="ml-0.5"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-sm border border-white/10">
            {game.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-orange transition-colors duration-200">
          {game.title}
        </h3>
        <p className="text-xs text-muted mt-1 line-clamp-1">
          {game.description.replace(/&[a-z]+;/gi, " ")}
        </p>
      </div>
    </Link>
  );
}
