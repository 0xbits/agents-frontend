"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const MCP_ENDPOINT = "https://agents-services.b1ts.dev/mcp";

const CONFIG = {
  mcpServers: {
    "8004-registry": {
      url: MCP_ENDPOINT,
      transport: "sse",
    },
  },
};

const TOOLS = [
  { name: "search_agents", description: "Search for agents by query, tags, or capabilities" },
  { name: "get_agent", description: "Get detailed info about a specific agent" },
  { name: "get_agent_tools", description: "List tools/skills available from an agent" },
  { name: "get_agent_health", description: "Check if an agent endpoint is healthy" },
  { name: "get_stats", description: "Get registry statistics" },
];

export function McpConfig() {
  const [copied, setCopied] = useState(false);

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(CONFIG, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="connect" className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
            Connect your AI
          </h2>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Config card */}
          <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                MCP Configuration
              </h3>
              <button
                onClick={copyConfig}
                className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>
            
            <pre className="text-xs text-[var(--foreground-subtle)] bg-[var(--background-subtle)] rounded-lg p-4 overflow-x-auto">
              {JSON.stringify(CONFIG, null, 2)}
            </pre>
            
            <p className="mt-4 text-xs text-[var(--foreground-subtle)]">
              Add this to your Claude Desktop, Cursor, or OpenClaw config to discover and connect to agents.
            </p>
          </div>
          
          {/* Tools card */}
          <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Available Tools
            </h3>
            
            <div className="space-y-3">
              {TOOLS.map((tool) => (
                <div key={tool.name} className="flex flex-col gap-1">
                  <code className="text-xs text-[var(--foreground-muted)] font-mono">
                    {tool.name}
                  </code>
                  <p className="text-xs text-[var(--foreground-subtle)]">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
