"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar, AgentCard, AgentsView } from "@/components";
import { searchAgents, getTopAgents, getStats, type Agent } from "@/lib/api";
import { X, Copy, Check, ArrowRight } from "lucide-react";

function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`p-1.5 rounded hover:bg-[var(--surface-hover)] transition-colors ${className}`}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<"agents" | "install">("agents");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState({
    totalAgents: 0,
    agentsWithMCP: 0,
    agentsWithA2A: 0,
    agentsWithX402: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  useEffect(() => {
    const mcp = searchParams.get("mcp") === "true";
    const a2a = searchParams.get("a2a") === "true";
    const x402 = searchParams.get("x402") === "true";
    
    const filters = new Set<string>();
    if (mcp) filters.add("mcp");
    if (a2a) filters.add("a2a");
    if (x402) filters.add("x402");
    setActiveFilters(filters);
    
    async function loadData() {
      setIsLoading(true);
      try {
        const statsData = await getStats();
        setStats({
          totalAgents: statsData.totalAgents ?? 0,
          agentsWithMCP: statsData.agentsWithMCP ?? 0,
          agentsWithA2A: statsData.agentsWithA2A ?? 0,
          agentsWithX402: statsData.agentsWithX402 ?? 0,
        });
        
        if (mcp || a2a || x402) {
          setHasSearched(true);
          const data = await searchAgents("", { limit: 20, sort: "feedback", mcp, a2a, x402 });
          setAgents(data.results);
        } else {
          const topData = await getTopAgents("feedback", 9);
          setAgents(topData.agents);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to connect to API");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    
    try {
      const data = await searchAgents(query, { 
        limit: 20, 
        sort: "feedback",
        mcp: activeFilters.has("mcp"),
        a2a: activeFilters.has("a2a"),
        x402: activeFilters.has("x402"),
      });
      setAgents(data.results);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (activeFilters.has(filter)) {
      params.delete(filter);
    } else {
      params.set(filter, "true");
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const clearFilters = () => {
    router.push("/");
  };

  const filterButtons = [
    { key: "mcp", label: "MCP", count: stats.agentsWithMCP },
    { key: "a2a", label: "A2A", count: stats.agentsWithA2A },
    { key: "x402", label: "x402", count: stats.agentsWithX402 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--surface-border)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-medium tracking-tight">agents</a>
          
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface)]">
            <button
              onClick={() => setTab("agents")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                tab === "agents"
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setTab("install")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                tab === "install"
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
              }`}
            >
              Install
            </button>
          </div>
          
          <a 
            href="https://github.com/0xbits" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {tab === "agents" ? (
          <>
            {/* Search + Filters */}
            <section className="py-12 px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-8 text-center text-[var(--foreground)]">
                  Find agent capabilities
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="flex-1">
                    <SearchBar onSearch={handleSearch} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {filterButtons.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => toggleFilter(f.key)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          activeFilters.has(f.key)
                            ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                            : "border-[var(--surface-border)] text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)]"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                    {activeFilters.size > 0 && (
                      <button
                        onClick={clearFilters}
                        className="p-2 text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Results */}
            <section className="px-6 pb-12">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
                    {hasSearched || activeFilters.size > 0 ? "Results" : "Popular"}
                  </span>
                  {!hasSearched && activeFilters.size === 0 && (
                    <button 
                      onClick={() => handleSearch("")}
                      className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
                    >
                      View all →
                    </button>
                  )}
                </div>
                
                {error && (
                  <div className="text-center py-10 text-[var(--foreground-subtle)]">
                    <p>{error}</p>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-48 rounded-xl animate-shimmer" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent, index) => (
                      <AgentCard 
                        key={agent.id} 
                        agent={{
                          id: agent.id,
                          name: agent.name ?? undefined,
                          description: agent.description ?? undefined,
                          uri: agent.uri ?? undefined,
                          image: agent.image ?? undefined,
                          rating: agent.avgRating ?? undefined,
                          feedbackCount: agent.feedbackCount,
                          owner: agent.owner,
                          isActive: true,
                        }} 
                        delay={index * 50}
                      />
                    ))}
                  </div>
                )}
                
                {(hasSearched || activeFilters.size > 0) && agents.length === 0 && !isLoading && !error && (
                  <div className="text-center py-16">
                    <p className="text-[var(--foreground-subtle)]">No agents found</p>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Install CTA */}
            <section className="px-6 py-16 border-t border-[var(--surface-border)]">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-xl font-medium mb-3 text-[var(--foreground)]">
                  Connect your agent
                </h2>
                <p className="text-sm text-[var(--foreground-muted)] mb-6">
                  Access {stats.totalAgents.toLocaleString()} agents via MCP
                </p>
                
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] mb-6 max-w-md mx-auto">
                  <code className="flex-1 text-sm font-mono text-[var(--foreground-muted)] text-left truncate">
                    https://agents-services.b1ts.dev/mcp
                  </code>
                  <CopyButton text="https://agents-services.b1ts.dev/mcp" />
                </div>
                
                <button
                  onClick={() => setTab("install")}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
                >
                  Full setup guide
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </>
        ) : (
          <AgentsView />
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 left-6 right-6 flex items-center justify-between text-xs text-[var(--foreground-subtle)]">
        <a
          href="https://b1ts.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--foreground-muted)] transition-colors"
        >
          Built by Bits
        </a>
        <a
          href="https://eips.ethereum.org/EIPS/eip-8004"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--foreground-muted)] transition-colors font-mono"
        >
          ERC8004
        </a>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--foreground-muted)]">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
