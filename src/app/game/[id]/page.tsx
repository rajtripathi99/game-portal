"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import { Game } from "@/types/game";
import Image from "next/image";
import Link from "next/link";
import GameGrid from "@/components/GameGrid";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const { id } = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!gameContainerRef.current) return;

    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const fetchGame = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all games and find the one matching the ID
      const res = await fetch(`/api/games?page=1`);
      const data: Game[] = await res.json();

      if (Array.isArray(data)) {
        const found = data.find((g) => g.id === id);
        if (found) {
          setGame(found);
          // Get related games from same category
          const related = data
            .filter((g) => g.id !== id && g.category === found.category)
            .slice(0, 12);
          setRelatedGames(
            related.length > 0
              ? related
              : data.filter((g) => g.id !== id).slice(0, 12)
          );
        } else {
          // Try additional pages
          for (let p = 2; p <= 5; p++) {
            const res2 = await fetch(`/api/games?page=${p}`);
            const data2: Game[] = await res2.json();
            if (Array.isArray(data2)) {
              const found2 = data2.find((g) => g.id === id);
              if (found2) {
                setGame(found2);
                const related2 = data2
                  .filter(
                    (g) => g.id !== id && g.category === found2.category
                  )
                  .slice(0, 12);
                setRelatedGames(
                  related2.length > 0
                    ? related2
                    : data2.filter((g) => g.id !== id).slice(0, 12)
                );
                break;
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch game:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-secondary-text text-sm">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Game Not Found
          </h1>
          <p className="text-secondary-text mb-6">
            The game you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
          >
            <span className="relative z-10">← Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const tags = game.tags
    ? game.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/search?category=${game.category}`}
            className="hover:text-accent transition-colors"
          >
            {game.category}
          </Link>
          <span>/</span>
          <span className="text-secondary-text truncate max-w-[200px]">
            {game.title}
          </span>
        </nav>

        {/* Game Player / Thumbnail */}
        {isPlaying ? (
          <div
            ref={gameContainerRef}
            className={`relative w-full overflow-hidden bg-black mb-8 animate-fade-in-up ${
              isFullscreen ? "rounded-none" : "rounded-2xl border border-white/5"
            }`}
          >
            {/* Game toolbar */}
            <div className={`flex items-center justify-between px-4 py-2 bg-[#0f1724] border-b border-white/5 ${
              isFullscreen ? "absolute top-0 left-0 right-0 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300" : ""
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm text-secondary-text font-medium">
                  Now Playing: {game.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-secondary-text hover:text-white hover:bg-white/10 transition-all inline-flex items-center gap-1.5"
                  id="fullscreen-btn"
                >
                  {isFullscreen ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 14 4 20 10 20" />
                        <polyline points="20 10 20 4 14 4" />
                        <line x1="14" y1="10" x2="21" y2="3" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      Fullscreen
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    }
                    setIsPlaying(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-secondary-text hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
                  id="close-game-btn"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <div
              className={`w-full ${isFullscreen ? "h-full" : ""}`}
              style={isFullscreen ? {} : { aspectRatio: `${game.width}/${game.height}` }}
            >
              <iframe
                src={game.url}
                title={game.title}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; gamepad"
                allowFullScreen
                id="game-iframe"
              />
            </div>
          </div>
        ) : (
          <div
            className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/5 mb-8 group cursor-pointer"
            style={{
              aspectRatio: `${game.width}/${game.height}`,
              maxHeight: "550px",
            }}
            onClick={() => setIsPlaying(true)}
            id="game-thumbnail"
          >
            <Image
              src={game.thumb}
              alt={game.title}
              fill
              sizes="100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:via-black/40 transition-all duration-300" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-accent flex items-center justify-center shadow-2xl shadow-accent/40 animate-pulse-glow group-hover:scale-110 transition-transform duration-300"
                id="play-game-btn"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="ml-1"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-sm text-white/80 font-medium">
                Click to Play
              </p>
            </div>
          </div>
        )}

        {/* Game Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {game.title}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/20">
                      {game.category}
                    </span>
                    <span className="text-muted text-xs">
                      {game.width}×{game.height}
                    </span>
                  </div>
                </div>
                {!isPlaying && (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="btn-primary px-6 py-3 rounded-xl text-sm shrink-0 inline-flex items-center gap-2"
                    id="play-btn-side"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="relative z-10"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span className="relative z-10">Play Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl border border-white/5 p-5">
              <h2 className="text-base font-semibold text-white mb-3">
                About This Game
              </h2>
              <p className="text-secondary-text text-sm leading-relaxed">
                {game.description.replace(/&[a-z]+;/gi, " ")}
              </p>
            </div>

            {/* Instructions */}
            {game.instructions && (
              <div className="bg-card rounded-xl border border-white/5 p-5">
                <h2 className="text-base font-semibold text-white mb-3">
                  🎮 How to Play
                </h2>
                <p className="text-secondary-text text-sm leading-relaxed">
                  {game.instructions}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-card rounded-xl border border-white/5 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="tag-chip px-3 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Game Details */}
            <div className="bg-card rounded-xl border border-white/5 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                Game Details
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Category</dt>
                  <dd className="text-secondary-text font-medium">
                    {game.category}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-3">
                  <dt className="text-muted">Resolution</dt>
                  <dd className="text-secondary-text font-medium">
                    {game.width}×{game.height}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-3">
                  <dt className="text-muted">Platform</dt>
                  <dd className="text-secondary-text font-medium">
                    Browser / HTML5
                  </dd>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-3">
                  <dt className="text-muted">Price</dt>
                  <dd className="text-accent font-semibold">Free</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section className="mb-12">
            <GameGrid
              games={relatedGames}
              title="🎯 You Might Also Like"
              subtitle={`More ${game.category} games`}
            />
          </section>
        )}
      </div>
    </div>
  );
}
