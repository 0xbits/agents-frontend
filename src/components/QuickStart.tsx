"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, Terminal, ExternalLink } from "lucide-react";

const EXAMPLES = [
  {
    label: "Search MCP agents",
    curl: 'curl "https://agents-services.b1ts.dev/api/agents/search?mcp=true&limit=3"',
    description: "Find agents with MCP support",
  },
  {
    label: "Get agent details",
    curl: 'curl "https://agents-services.b1ts.dev/api/agents/13445"',
    description: "Fetch full metadata for an agent",
  },
  {
    label: "Check health",
    curl: 'curl "https://agents-services.b1ts.dev/api/agents/13445/health"',
    description: "Verify agent endpoints are responding",
  },
  {
    label: "Registry stats",
    curl: 'curl "https://agents-services.b1ts.dev/api/stats"',
    description: "Get aggregate statistics",
  },
];

export function QuickStart() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--foreground-muted)]" />
          <span className="text-sm font-medium">Quick Start</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[var(--foreground-subtle)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--foreground-subtle)]" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-[var(--foreground-subtle)]">
            Try it now — no setup required:
          </p>

          <div className="space-y-2">
            {EXAMPLES.map((example, index) => (
              <div
                key={example.label}
                className="flex items-center gap-2 p-3 rounded-xl bg-[var(--background)] border border-[var(--surface-border)]"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--foreground-subtle)] mb-1">
                    {example.label}
                  </div>
                  <code className="text-xs font-mono text-[var(--foreground-muted)] break-all">
                    {example.curl}
                  </code>
                </div>
                <button
                  onClick={() => handleCopy(example.curl, index)}
                  className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  title="Copy"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[var(--foreground-subtle)]" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href="/docs/mcp"
              className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] inline-flex items-center gap-1"
            >
              View Full Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/docs/mcp#setup"
              className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] inline-flex items-center gap-1"
            >
              Add to Your Agent
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
