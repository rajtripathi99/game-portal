"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Game } from "@/types/game";
import GameGrid from "@/components/GameGrid";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Action",
  "Puzzle",
  "Racing",
  "Shooting",
  "Sports",
  "Arcade",
  "Adventure",
  "Strategy",
  "Hypercasual",
  "Multiplayer",
  "Stickman",
  "Cooking",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All");

  const fetchGames = useCallback(
    async (pageNum: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const params = new URLSearchParams();
        params.set("page", String(pageNum));
        if (query) params.set("q", query);

        const res = await fetch(`/api/games?${params.toString()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllGames((prev) => (append ? [...prev, ...data] : data));
        }
      } catch (err) {
        console.error("Failed to search games:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query]
  );

  useEffect(() => {
    setPage(1);
    fetchGames(1);
  }, [fetchGames]);

  // Auto-detect if search query matches a category name
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else if (query) {
      const matchedCategory = CATEGORIES.find(
        (cat) => cat.toLowerCase() === query.toLowerCase()
      );
      setActiveCategory(matchedCategory || "All");
    } else {
      setActiveCategory("All");
    }
  }, [categoryParam, query]);

  // Client-side filtering: category + text search with relevance scoring
  const filteredGames = (() => {
    // Category filter first
    const categoryFiltered =
      !activeCategory || activeCategory === "All"
        ? allGames
        : allGames.filter(
            (g) => g.category.toLowerCase() === activeCategory.toLowerCase()
          );

    // If query matches a category name, just return category-filtered results
    const matchedCategory = CATEGORIES.find(
      (cat) => cat.toLowerCase() === query.toLowerCase()
    );
    if (!query || matchedCategory) return categoryFiltered;

    // Split query into individual words
    const searchWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 1);

    if (searchWords.length === 0) return categoryFiltered;

    // Score and filter games
    const scored = categoryFiltered
      .map((g) => {
        const title = g.title.toLowerCase();
        const tags = g.tags.toLowerCase();
        const category = g.category.toLowerCase();
        const description = g.description.toLowerCase();

        let score = 0;
        let matchedWords = 0;

        for (const word of searchWords) {
          let wordMatched = false;

          // Title matches get highest priority
          if (title.includes(word)) {
            score += 10;
            wordMatched = true;
          }
          // Tag matches are strong signals
          if (tags.includes(word)) {
            score += 5;
            wordMatched = true;
          }
          // Category match
          if (category.includes(word)) {
            score += 4;
            wordMatched = true;
          }
          // Description match (weakest)
          if (description.includes(word)) {
            score += 1;
            wordMatched = true;
          }

          if (wordMatched) matchedWords++;
        }

        // Bonus for matching ALL search words (reward multi-word precision)
        if (matchedWords === searchWords.length && searchWords.length > 1) {
          score += 20;
        }

        return { game: g, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.game);

    return scored;
  })();

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchGames(nextPage, true);
  };

  const title = query
    ? `Results for "${query}"`
    : activeCategory && activeCategory !== "All"
    ? `${activeCategory} Games`
    : "All Games";

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-secondary-text">
            {query ? "Search" : "Browse"}
          </span>
        </nav>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {title}
          </h1>
          {query && (
            <p className="text-secondary-text">
              Showing results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {/* Category filters */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex items-center gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "bg-surface text-secondary-text hover:text-white hover:bg-white/10 border border-white/5"
                }`}
                id={`filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-14 h-14 mb-4">
              <div className="absolute inset-0 rounded-full border-3 border-white/5" />
              <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-accent animate-spin" />
            </div>
            <p className="text-secondary-text text-sm font-medium animate-pulse">
              Loading games...
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && <GameGrid games={filteredGames} loading={false} />}

        {/* Load More */}
        {!loading && allGames.length > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="btn-primary px-8 py-3 rounded-xl text-sm relative inline-flex items-center gap-2 disabled:opacity-60"
              id="search-load-more"
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
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
