"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar, AgentCard } from "@/components";
import { searchAgents, getTopAgents, getStats, type Agent } from "@/lib/api";
import { Boxes, Activity, Users, X } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState({ totalAgents: 0, totalFeedback: 0, agentsWithURI: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null);

  // Load initial data or handle URL params
  useEffect(() => {
    const tag = searchParams.get("tag");
    const protocol = searchParams.get("protocol");
    
    async function loadData() {
      setIsLoading(true);
      try {
        const statsData = await getStats();
        setStats(statsData);
        
        if (tag) {
          setActiveFilter({ type: "tag", value: tag });
          setHasSearched(true);
          const data = await searchAgents("", { limit: 20, sort: "feedback", tag });
          setAgents(data.results);
        } else if (protocol) {
          setActiveFilter({ type: "protocol", value: protocol });
          setHasSearched(true);
          const data = await searchAgents("", { limit: 20, sort: "feedback", protocol });
          setAgents(data.results);
        } else {
          setActiveFilter(null);
          const topData = await getTopAgents("feedback", 6);
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
      const data = await searchAgents(query, { limit: 20, sort: "feedback" });
      setAgents(data.results);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const STATS = [
    { label: "Agents", value: stats.totalAgents.toLocaleString(), icon: Boxes },
    { label: "Feedback", value: stats.totalFeedback.toLocaleString(), icon: Activity },
    { label: "With URI", value: stats.agentsWithURI.toLocaleString(), icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--surface-border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium tracking-tight">agents.b1ts.dev</span>
          </div>
          
          <nav className="flex items-center gap-6 text-sm text-[var(--foreground-subtle)]">
            <a href="#" className="hover:text-[var(--foreground-muted)] transition-colors">Explore</a>
            <a href="/docs" className="hover:text-[var(--foreground-muted)] transition-colors">API</a>
            <a 
              href="https://github.com/0xbits/8004-indexer" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground-muted)] transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 pt-20">
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mb-4 text-[var(--foreground)]">
              Discover AI Agents
            </h1>
            
            <p className="text-lg text-[var(--foreground-muted)] mb-12 max-w-xl mx-auto leading-relaxed">
              The registry for ERC-8004 Trustless Agents on Ethereum.
            </p>
            
            <SearchBar onSearch={handleSearch} autoFocus />
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-20 text-sm">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-[var(--foreground-subtle)]">
                  <stat.icon className="w-4 h-4" />
                  <span className="font-medium text-[var(--foreground-muted)]">{stat.value}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  {activeFilter 
                    ? `${activeFilter.type}: ${activeFilter.value}` 
                    : hasSearched 
                      ? "Results" 
                      : "Top Agents"}
                </h2>
                {activeFilter && (
                  <button
                    onClick={() => router.push("/")}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--surface-border)] px-2 py-1 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] hover:border-[var(--surface-border-hover)] transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
              {!hasSearched && !activeFilter && (
                <button 
                  onClick={() => handleSearch("")}
                  className="text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
                >
                  View all
                </button>
              )}
            </div>
            
            {error && (
              <div className="text-center py-10 text-[var(--foreground-subtle)]">
                <p>{error}</p>
                <p className="text-sm mt-2">API may be starting up...</p>
              </div>
            )}
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-56 rounded-2xl animate-shimmer" />
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
                      rating: agent.avgRating ?? undefined,
                      feedbackCount: agent.feedbackCount,
                      owner: agent.owner,
                      isActive: true,
                    }} 
                    delay={index * 80}
                  />
                ))}
              </div>
            )}
            
            {hasSearched && agents.length === 0 && !isLoading && !error && (
              <div className="text-center py-20">
                <p className="text-[var(--foreground-subtle)]">No agents found.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--surface-border)] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[var(--foreground-subtle)]">
          <span>Built by Bits ✨</span>
          <a 
            href="https://eips.ethereum.org/EIPS/eip-8004" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--foreground-muted)] transition-colors"
          >
            ERC-8004
          </a>
        </div>
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
