"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar, AgentCard, HowItWorks, AccessMethods } from "@/components";
import { QuickFilters } from "@/components/QuickFilters";
import { CapabilityCard } from "@/components/CapabilityCard";
import { searchAgents, getTopAgents, getStats, type Agent } from "@/lib/api";
import { X } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalFeedback: 0,
    agentsWithURI: 0,
    agentsWithMetadata: 0,
    agentsWithMCP: 0,
    agentsWithA2A: 0,
    agentsWithX402: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null);

  // Load initial data or handle URL params
  useEffect(() => {
    const tag = searchParams.get("tag");
    const protocol = searchParams.get("protocol");
    const mcp = searchParams.get("mcp") === "true";
    const a2a = searchParams.get("a2a") === "true";
    const x402 = searchParams.get("x402") === "true";
    
    async function loadData() {
      setIsLoading(true);
      try {
        const statsData = await getStats();
        setStats({
          totalAgents: statsData.totalAgents ?? 0,
          totalFeedback: statsData.totalFeedback ?? 0,
          agentsWithURI: statsData.agentsWithURI ?? 0,
          agentsWithMetadata: statsData.agentsWithMetadata ?? 0,
          agentsWithMCP: statsData.agentsWithMCP ?? 0,
          agentsWithA2A: statsData.agentsWithA2A ?? 0,
          agentsWithX402: statsData.agentsWithX402 ?? 0,
        });
        
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
        } else if (mcp) {
          setActiveFilter({ type: "mcp", value: "true" });
          setHasSearched(true);
          const data = await searchAgents("", { limit: 20, sort: "feedback", mcp: true });
          setAgents(data.results);
        } else if (a2a) {
          setActiveFilter({ type: "a2a", value: "true" });
          setHasSearched(true);
          const data = await searchAgents("", { limit: 20, sort: "feedback", a2a: true });
          setAgents(data.results);
        } else if (x402) {
          setActiveFilter({ type: "x402", value: "true" });
          setHasSearched(true);
          const data = await searchAgents("", { limit: 20, sort: "feedback", x402: true });
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
    setActiveFilter(null);
    
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

  const quickFilters = [
    { label: "MCP", type: "mcp" as const, value: "true" },
    { label: "A2A", type: "a2a" as const, value: "true" },
    { label: "x402", type: "x402" as const, value: "true" },
    { label: "DeFi", type: "tag" as const, value: "defi" },
    { label: "Trading", type: "tag" as const, value: "trading" },
  ];

  const handleQuickFilterToggle = (filter: { type: string; value: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    const isActive =
      activeFilter?.type === filter.type && activeFilter?.value === filter.value;

    params.delete("tag");
    params.delete("protocol");
    params.delete("mcp");
    params.delete("a2a");
    params.delete("x402");

    if (!isActive) {
      if (filter.type === "tag") params.set("tag", filter.value);
      if (filter.type === "protocol") params.set("protocol", filter.value);
      if (filter.type === "mcp") params.set("mcp", "true");
      if (filter.type === "a2a") params.set("a2a", "true");
      if (filter.type === "x402") params.set("x402", "true");
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--surface-border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-medium tracking-tight">agents</span>
          </a>
          
          <nav className="flex items-center gap-6 text-sm text-[var(--foreground-subtle)]">
            <a 
              href="/"
              className="hover:text-[var(--foreground-muted)] transition-colors"
            >
              Agents
            </a>
            <a 
              href="https://github.com/0xbits/8004-indexer#api" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground-muted)] transition-colors"
            >
              API
            </a>
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
              Find skills your agent needs
            </h1>
            
            <p className="text-lg text-[var(--foreground-muted)] mb-10 max-w-xl mx-auto leading-relaxed">
              Discover MCP tools, A2A skills, and verified agent capabilities — indexed from Ethereum, cleaned, and ready to use.
            </p>
            
            <SearchBar onSearch={handleSearch} autoFocus />

            <QuickFilters
              options={quickFilters}
              activeFilter={activeFilter}
              onToggle={handleQuickFilterToggle}
            />
          </div>
        </section>

        <HowItWorks />

        {/* Results */}
        <section className="px-6 pb-16">
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
                      image: agent.image ?? undefined,
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

        {/* Browse by capability */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                Browse by capability
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <CapabilityCard
                title="MCP Tools"
                icon="🔧"
                count={stats.agentsWithMCP || 0}
                href="/?mcp=true"
                description="Tool-enabled agents with MCP endpoints."
              />
              <CapabilityCard
                title="A2A Ready"
                icon="🤖"
                count={stats.agentsWithA2A || 0}
                href="/?a2a=true"
                description="Agents exposing A2A skills."
              />
              <CapabilityCard
                title="x402 Payments"
                icon="💰"
                count={stats.agentsWithX402 || 0}
                href="/?x402=true"
                description="Agents accepting x402 payments."
              />
            </div>
          </div>
        </section>

        <AccessMethods />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--surface-border)] py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--foreground-subtle)]">
          <div className="flex items-center gap-4">
            <span>Built by Bits ✨</span>
            <span>
              {stats.totalAgents.toLocaleString()} agents indexed
            </span>
            <a
              href="https://eips.ethereum.org/EIPS/eip-8004"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground-muted)] transition-colors"
            >
              Powered by ERC-8004
            </a>
          </div>
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
