"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
      title="Copy"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export function AgentsView() {
  const endpoints = [
    {
      label: "MCP Server",
      url: "https://agents-services.b1ts.dev/mcp",
      description: "Connect your agent via Model Context Protocol",
    },
    {
      label: "REST API",
      url: "https://agents-api.b1ts.dev",
      description: "Query agents, search, get stats",
    },
  ];

  const tools = [
    { name: "search_agents", desc: "Search and filter agents" },
    { name: "get_agent", desc: "Get agent details by ID" },
    { name: "get_agent_tools", desc: "List agent's MCP tools" },
    { name: "get_agent_health", desc: "Check agent health status" },
    { name: "get_stats", desc: "Registry statistics" },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-xl w-full space-y-12">
        {/* Endpoints */}
        <div className="space-y-6">
          {endpoints.map((endpoint) => (
            <div key={endpoint.label} className="space-y-2">
              <div className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
                {endpoint.label}
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)]">
                <code className="flex-1 text-sm font-mono text-[var(--foreground-muted)]">
                  {endpoint.url}
                </code>
                <CopyButton text={endpoint.url} />
              </div>
              <p className="text-xs text-[var(--foreground-subtle)]">
                {endpoint.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div className="space-y-3">
          <div className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
            Available Tools
          </div>
          <div className="grid gap-2">
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
            Setup Guide
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
