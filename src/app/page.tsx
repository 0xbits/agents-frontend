"use client";

import { useState, useEffect } from "react";
import { SearchBar, AgentCard, Agent } from "@/components";
import { Boxes, Activity, Users } from "lucide-react";

// Mock data - will be replaced with GraphQL queries
const MOCK_AGENTS: Agent[] = [
  {
    id: "22721",
    name: "Remittance Agent",
    description: "Cross-border payment automation with multi-currency support and compliance checks.",
    uri: "https://8004mint.com/.well-known/remittance-agent.json",
    rating: 4.8,
    feedbackCount: 129,
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    services: ["MCP", "A2A"],
    skills: ["payments", "compliance"],
    isVerified: true,
    isActive: true,
  },
  {
    id: "13445",
    name: "Gekko",
    description: "Advanced DeFi trading agent with multi-protocol support and MEV protection.",
    rating: 4.9,
    feedbackCount: 77,
    owner: "0xabcdef1234567890abcdef1234567890abcdef12",
    services: ["MCP"],
    skills: ["trading", "DeFi", "MEV"],
    isVerified: true,
    isActive: true,
  },
  {
    id: "18532",
    name: "DataWeaver",
    description: "On-chain data aggregation and analysis across multiple L1s and L2s.",
    rating: 4.6,
    feedbackCount: 45,
    owner: "0x9876543210fedcba9876543210fedcba98765432",
    services: ["A2A", "OASF"],
    skills: ["data", "analytics", "multichain"],
    isActive: true,
  },
  {
    id: "9821",
    name: "SocialPilot",
    description: "Automated social media management with sentiment analysis and engagement optimization.",
    rating: 4.4,
    feedbackCount: 32,
    owner: "0xfedcba9876543210fedcba9876543210fedcba98",
    services: ["MCP"],
    skills: ["social", "automation", "sentiment"],
    isActive: false,
  },
  {
    id: "15673",
    name: "ContractGuard",
    description: "Smart contract security auditing and vulnerability detection agent.",
    rating: 4.7,
    feedbackCount: 28,
    owner: "0x456789abcdef0123456789abcdef0123456789ab",
    services: ["A2A"],
    skills: ["security", "auditing", "smart-contracts"],
    isVerified: true,
    isActive: true,
  },
  {
    id: "20145",
    name: "NFT Curator",
    description: "NFT discovery, valuation, and portfolio management with rarity analysis.",
    rating: 4.3,
    feedbackCount: 19,
    owner: "0xcdef0123456789abcdef0123456789abcdef0123",
    services: ["MCP", "OASF"],
    skills: ["NFT", "valuation", "curation"],
    isActive: true,
  },
];

const STATS = [
  { label: "Agents", value: "20,392", icon: Boxes },
  { label: "Feedback", value: "647", icon: Activity },
  { label: "Owners", value: "8,241", icon: Users },
];

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Filter mock data (will be replaced with GraphQL)
    const filtered = MOCK_AGENTS.filter(agent => 
      agent.name?.toLowerCase().includes(query.toLowerCase()) ||
      agent.description?.toLowerCase().includes(query.toLowerCase()) ||
      agent.skills?.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
      agent.services?.some(s => s.toLowerCase().includes(query.toLowerCase()))
    );
    
    setAgents(filtered.length > 0 ? filtered : MOCK_AGENTS);
    setIsLoading(false);
  };

  // Load featured agents on mount
  useEffect(() => {
    setAgents(MOCK_AGENTS.slice(0, 3));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--surface-border)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium tracking-tight">agents.b1ts.dev</span>
          </div>
          
          <nav className="flex items-center gap-6 text-sm text-[var(--foreground-subtle)]">
            <a href="#" className="hover:text-[var(--foreground-muted)] transition-colors">Explore</a>
            <a href="#" className="hover:text-[var(--foreground-muted)] transition-colors">Docs</a>
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

      {/* Hero - understated */}
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
            
            {/* Stats - subtle row */}
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

        {/* Results / Featured */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                {hasSearched ? "Results" : "Featured"}
              </h2>
              {!hasSearched && (
                <button 
                  onClick={() => handleSearch("")}
                  className="text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
                >
                  View all
                </button>
              )}
            </div>
            
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
                    agent={agent} 
                    delay={index * 80}
                  />
                ))}
              </div>
            )}
            
            {hasSearched && agents.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <p className="text-[var(--foreground-subtle)]">No agents found.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer - minimal */}
      <footer className="border-t border-[var(--surface-border)] py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[var(--foreground-subtle)]">
          <span>Built by Bits</span>
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
