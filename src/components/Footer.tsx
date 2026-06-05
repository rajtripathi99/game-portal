import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0f1724]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#0ea5e9] flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span className="text-lg font-extrabold">
                <span className="text-gradient">Game</span>
                <span className="text-white">Portal</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-text leading-relaxed">
              Play thousands of free online games. No downloads, no installs
              &mdash; just instant fun in your browser.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Action",
                "Puzzle",
                "Racing",
                "Shooting",
                "Sports",
                "Arcade",
                "Adventure",
                "Strategy",
              ].map((cat) => (
                <Link
                  key={cat}
                  href={`/search?category=${cat}`}
                  className="text-sm text-secondary-text hover:text-accent transition-colors duration-200"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              About
            </h3>
            <p className="text-sm text-secondary-text leading-relaxed">
              GamePortal is a free-to-play gaming platform featuring the best HTML5
              games. All games run directly in your browser.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} GamePortal. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Powered by GameMonetize
          </p>
        </div>
      </div>
    </footer>
  );
}
