"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Wallet, Loader2 } from "lucide-react";

interface WalletSearchProps {
  placeholder?: string;
  className?: string;
}

export function WalletSearch({ 
  placeholder = "Search by wallet (0x...) or ENS",
  className = "" 
}: WalletSearchProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveENS = async (name: string): Promise<string | null> => {
    try {
      // Use public ENS resolution endpoint
      const response = await fetch(`https://api.ensdata.net/${name}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.address || null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    // Check if it's already a valid address
    if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      router.push(`/wallets/${trimmed}`);
      return;
    }

    // Check if it looks like an ENS name
    if (trimmed.includes(".")) {
      setIsResolving(true);
      try {
        const resolved = await resolveENS(trimmed);
        if (resolved) {
          router.push(`/wallets/${resolved}`);
        } else {
          setError("Could not resolve ENS name");
        }
      } catch {
        setError("Failed to resolve ENS");
      } finally {
        setIsResolving(false);
      }
      return;
    }

    setError("Enter a valid address (0x...) or ENS name");
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]">
          {isResolving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-12 py-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--surface-border-hover)] transition-colors font-mono text-sm"
        />
        <button
          type="submit"
          disabled={isResolving || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[var(--background)] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] disabled:opacity-40 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </form>
  );
}
