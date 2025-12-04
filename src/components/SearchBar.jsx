
// src/components/SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ className = "" }) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return; // no empty searches
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`} role="search" aria-label="Site search">
      <div className="group flex items-center gap-2 w-full max-w-md rounded-full border border-gray-300 bg-white/70 px-4 py-2 shadow-sm transition-colors focus-within:border-gray-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10">
        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* Input */}
        <input
          type="search"
          placeholder="Search products, categories…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="peer w-full bg-transparent text-gray-800 placeholder:text-gray-400 outline-none"
          autoComplete="off"
          aria-label="Search"
        />

        {/* Optional submit button (kept minimal). Remove if you want pure Enter only. */}
        <button
          type="submit"
          className="hidden sm:inline-flex rounded-full bg-gray-900 text-white px-3 py-1 text-sm font-medium hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          Search
        </button>
      </div>
    </form>
  );
}
