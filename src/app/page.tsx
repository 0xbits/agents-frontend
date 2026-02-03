"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar, AgentCard, QuickStart } from "@/components";
import { searchAgents, getTopAgents, getStats, type Agent } from "@/lib/api";
import { X, Copy, Check, ArrowRight, ExternalLink } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded hover:bg-[var(--surface-hover)] transition-colors">
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function InstallView() {
  const endpoints = [
    { label: "MCP Server", url: "https://agents-services.b1ts.dev/mcp" },
    { label: "REST API", url: "https://agents-api.b1ts.dev" },
  ];

  const tools = [
    { name: "search_agents", desc: "Search and filter agents" },
    { name: "get_agent", desc: "Get agent details by ID" },
    { name: "get_agent_tools", desc: "List agent's MCP tools" },
    { name: "get_agent_health", desc: "Check agent health status" },
    { name: "get_stats", desc: "Registry statistics" },
  ];

  const mcpConfig = `{
  "mcpServers": {
    "agents": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://agents-services.b1ts.dev/mcp"]
    }
  }
}`;

  return (
    <div className="py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Quick Start */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Quick Start</h2>
          {endpoints.map((endpoint) => (
            <div key={endpoint.label} className="space-y-1">
              <div className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
                {endpoint.label}
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)]">
                <code className="flex-1 text-sm font-mono text-[var(--foreground-muted)]">
                  {endpoint.url}
                </code>
                <CopyButton text={endpoint.url} />
              </div>
            </div>
          ))}
        </div>

        {/* Setup Guide */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Setup Guide</h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            Add to your Claude Desktop, Cursor, or OpenClaw config:
          </p>
          <div className="relative">
            <pre className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] text-sm font-mono text-[var(--foreground-muted)] overflow-x-auto">
              {mcpConfig}
            </pre>
            <div className="absolute top-3 right-3">
              <CopyButton text={mcpConfig} />
            </div>
          </div>
        </div>

        {/* Available Tools */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Available Tools</h2>
          <div className="space-y-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)]"
              >
                <code className="text-sm font-mono text-[var(--foreground-muted)]">
                  {tool.name}
                </code>
                <span className="text-xs text-[var(--foreground-subtle)]">
                  {tool.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <a
            href="/docs/mcp"
            className="inline-flex items-center gap-1.5 text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
          >
            Full Documentation
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://agents-api.b1ts.dev/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
          >
            API Reference
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
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
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [protocolFilter, setProtocolFilter] = useState<string | null>(null);

  useEffect(() => {
    const mcp = searchParams.get("mcp") === "true";
    const a2a = searchParams.get("a2a") === "true";
    const x402 = searchParams.get("x402") === "true";
    const defi = searchParams.get("defi") === "true";
    const social = searchParams.get("social") === "true";
    const tag = searchParams.get("tag");
    const protocol = searchParams.get("protocol");
    
    const filters = new Set<string>();
    if (mcp) filters.add("mcp");
    if (a2a) filters.add("a2a");
    if (x402) filters.add("x402");
    if (defi) filters.add("defi");
    if (social) filters.add("social");
    setActiveFilters(filters);
    setTagFilter(tag);
    setProtocolFilter(protocol);
    
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
        
        if (mcp || a2a || x402 || defi || social || tag || protocol) {
          setHasSearched(true);
          const data = await searchAgents("", { 
            limit: 20, 
            sort: "feedback", 
            mcp, 
            a2a, 
            x402,
            tag: defi ? "defi" : social ? "social" : tag || undefined,
            protocol: protocol || undefined,
          });
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
        tag: activeFilters.has("defi") ? "defi" : activeFilters.has("social") ? "social" : tagFilter || undefined,
        protocol: protocolFilter || undefined,
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
    
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  };

  const clearFilters = () => {
    router.push("/");
  };

  const hasAnyFilter = activeFilters.size > 0 || tagFilter || protocolFilter;

  const filterButtons = [
    { key: "defi", label: "DeFi" },
    { key: "social", label: "Social" },
    { key: "mcp", label: "MCP" },
    { key: "a2a", label: "A2A" },
    { key: "x402", label: "x402" },
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
              className={`w-20 py-1.5 text-sm rounded-md transition-colors text-center ${
                tab === "agents"
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setTab("install")}
              className={`w-20 py-1.5 text-sm rounded-md transition-colors text-center ${
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
      <main className="flex-1 pt-20 pb-24">
        {tab === "agents" ? (
          <>
            {/* Search + Filters */}
            <section className="py-12 px-6">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-2 text-center">
                  Find agent capabilities
                </h1>
                <p className="text-[var(--foreground-muted)] text-center mb-8">
                  Find skills your agent needs
                </p>
                
                {/* Search on its own line */}
                <div className="mb-4">
                  <SearchBar onSearch={handleSearch} />
                </div>

                <div className="mb-4">
                  <QuickStart />
                </div>
                
                {/* Filters on second line */}
                <div className="flex flex-wrap items-center gap-2">
                  {filterButtons.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => toggleFilter(f.key)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        activeFilters.has(f.key)
                          ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                          : "border-[var(--surface-border)] text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                  
                  {hasAnyFilter && (
                    <button
                      onClick={clearFilters}
                      className="p-1.5 text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
                      title="Clear filters"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Active tag/protocol filter */}
                {(tagFilter || protocolFilter) && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    {tagFilter && (
                      <span className="px-2 py-1 rounded-full bg-[var(--surface)] text-[var(--foreground-muted)]">
                        tag: {tagFilter}
                      </span>
                    )}
                    {protocolFilter && (
                      <span className="px-2 py-1 rounded-full bg-[var(--surface)] text-[var(--foreground-muted)]">
                        protocol: {protocolFilter}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Results */}
            <section className="px-6 pb-12">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
                    {hasSearched || hasAnyFilter ? "Results" : "Popular"}
                  </span>
                  {!hasSearched && !hasAnyFilter && (
                    <button 
                      onClick={() => handleSearch("")}
                      className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
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
                
                {(hasSearched || hasAnyFilter) && agents.length === 0 && !isLoading && !error && (
                  <div className="text-center py-16">
                    <p className="text-[var(--foreground-subtle)]">No agents found</p>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Install CTA */}
            <section className="px-6 py-12 border-t border-[var(--surface-border)]">
              <div className="max-w-xl mx-auto text-center">
                <p className="text-sm text-[var(--foreground-muted)] mb-4">
                  Connect your agent to {stats.totalAgents.toLocaleString()} capabilities via MCP
                </p>
                
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] mb-4">
                  <code className="flex-1 text-sm font-mono text-[var(--foreground-muted)] text-left truncate">
                    https://agents-services.b1ts.dev/mcp
                  </code>
                  <CopyButton text="https://agents-services.b1ts.dev/mcp" />
                </div>
                
                <button
                  onClick={() => setTab("install")}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[var(--foreground)] text-[var(--background)] rounded-lg hover:opacity-90 transition-opacity"
                >
                  Setup guide
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </section>

            {/* Stats Bar */}
            <section className="px-6 py-8 border-t border-[var(--surface-border)]">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-8 sm:gap-16 text-center">
                  <div>
                    <div className="text-2xl font-medium text-[var(--foreground)]">
                      {stats.totalAgents.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider mt-1">
                      Total Agents
                    </div>
                  </div>
                  <div className="w-px h-10 bg-[var(--surface-border)]" />
                  <div>
                    <div className="text-2xl font-medium text-[var(--foreground)]">
                      {stats.agentsWithMCP.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider mt-1">
                      With MCP
                    </div>
                  </div>
                  <div className="w-px h-10 bg-[var(--surface-border)]" />
                  <div>
                    <div className="text-2xl font-medium text-[var(--foreground)]">
                      {stats.agentsWithA2A.toLocaleString()}
                    </div>
                    <div className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider mt-1">
                      With A2A
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <InstallView />
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
