"use client";

import { useState, useCallback } from "react";
import { Search, ArrowRight } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search agents by capability, skill, or name...",
  autoFocus = false 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div 
        className={`
          relative flex items-center gap-3 px-5 py-4
          bg-[var(--surface)] border rounded-2xl
          transition-all duration-300
          ${isFocused 
            ? 'border-[var(--surface-border-hover)] shadow-[0_0_60px_var(--accent-glow)]' 
            : 'border-[var(--surface-border)] hover:border-[var(--surface-border-hover)]'
          }
        `}
      >
        <Search 
          className={`w-5 h-5 transition-colors duration-200 ${
            isFocused ? 'text-[var(--foreground)]' : 'text-[var(--foreground-subtle)]'
          }`} 
        />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="
            flex-1 bg-transparent outline-none
            text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]
            text-base
          "
        />
        
        {query.length > 0 && (
          <button
            type="submit"
            className="
              flex items-center gap-2 px-4 py-2
              bg-[var(--foreground)] text-[var(--background)] rounded-xl
              text-sm font-medium
              hover:bg-[var(--foreground-muted)]
              transition-colors duration-200
            "
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-3 mt-4 text-sm text-[var(--foreground-subtle)]">
        {["DeFi", "data", "social", "security"].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuery(suggestion);
              onSearch?.(suggestion);
            }}
            className="
              px-3 py-1.5 rounded-lg
              border border-[var(--surface-border)]
              hover:border-[var(--surface-border-hover)] hover:text-[var(--foreground-muted)]
              transition-all duration-200
            "
          >
            {suggestion}
          </button>
        ))}
      </div>
    </form>
  );
}
