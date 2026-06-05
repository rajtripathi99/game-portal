"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-effect shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
            id="header-logo"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange to-[#e85d00] flex items-center justify-center shadow-lg shadow-orange/20 group-hover:shadow-orange/40 transition-shadow duration-300">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-gradient">Game</span>
              <span className="text-white">Hub</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg mx-8"
            id="search-form"
          >
            <div className="relative w-full">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                id="search-input"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" id="main-nav">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/search?category=Action"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Action
            </Link>
            <Link
              href="/search?category=Puzzle"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Puzzle
            </Link>
            <Link
              href="/search?category=Racing"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Racing
            </Link>
            <Link
              href="/search?category=Shooting"
              className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-text hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Shooting
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-secondary-text hover:text-white hover:bg-white/5 transition-colors"
            id="mobile-menu-toggle"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-white/5 animate-fade-in-up">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full px-4 py-3 rounded-xl text-sm"
                id="mobile-search-input"
              />
            </form>
            <div className="flex flex-wrap gap-2">
              {["Home", "Action", "Puzzle", "Racing", "Shooting"].map(
                (item) => (
                  <Link
                    key={item}
                    href={
                      item === "Home" ? "/" : `/search?category=${item}`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-secondary-text hover:text-white hover:bg-white/5 transition-all"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
