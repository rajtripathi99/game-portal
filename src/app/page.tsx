"use client";

import { useEffect, useState, useCallback } from "react";
import { Game } from "@/types/game";
import GameGrid from "@/components/GameGrid";
import Link from "next/link";

const CATEGORIES = [
  "Action",
  "Puzzle",
  "Racing",
  "Shooting",
  "Sports",
  "Arcade",
  "Adventure",
  "Strategy",
  "Hypercasual",
];

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchGames = useCallback(async (pageNum: number, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const res = await fetch(`/api/games?page=${pageNum}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setGames((prev) => (append ? [...prev, ...data] : data));
      }
    } catch (err) {
      console.error("Failed to fetch games:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchGames(1);
  }, [fetchGames]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGames(nextPage, true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24" id="hero">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-accent-secondary uppercase tracking-wider">
              Free to Play
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4">
            Play{" "}
            <span className="text-gradient">Awesome Games</span>
            <br />
            <span className="text-secondary-text font-light text-3xl md:text-4xl lg:text-5xl">
              Right in Your Browser
            </span>
          </h1>
          <p className="text-secondary-text text-base md:text-lg max-w-2xl mx-auto mb-8">
            Thousands of free HTML5 games — no downloads, no installs. Just
            click and play instantly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat}
                href={`/search?category=${cat}`}
                className="tag-chip px-4 py-2 rounded-full text-sm font-medium"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <GameGrid
          games={games}
          loading={loading}
          title="🔥 Trending Games"
          subtitle="The most popular games right now"
        />

        {/* Load More */}
        {!loading && games.length > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="btn-primary px-8 py-3 rounded-xl text-sm relative inline-flex items-center gap-2 disabled:opacity-60"
              id="load-more-btn"
            >
              <span className="relative z-10">
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Load More Games"
                )}
              </span>
            </button>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          📂 Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/search?category=${cat}`}
              className="group relative overflow-hidden rounded-xl bg-card border border-white/5 hover:border-accent/30 p-5 text-center transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
              id={`category-${cat.toLowerCase()}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 group-hover:from-accent/5 group-hover:to-accent/10 transition-all duration-300" />
              <span className="relative text-sm font-semibold text-white group-hover:text-accent transition-colors">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
