"use client";

import { useEffect, useRef, useState } from "react";
import type { Agent } from "@/lib/api";

interface CopyConfigButtonsProps {
  agent: Agent;
  mcpEndpoint?: string | null;
  a2aEndpoint?: string | null;
}

type CopyTarget = "mcp" | "a2a" | null;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");

export function CopyConfigButtons({ agent, mcpEndpoint, a2aEndpoint }: CopyConfigButtonsProps) {
  const [copied, setCopied] = useState<CopyTarget>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const setCopiedFor = (target: CopyTarget) => {
    setCopied(target);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setCopied(null), 2000);
  };

  const agentKeyBase = agent.name ? slugify(agent.name) : "";
  const agentKey = agentKeyBase.length > 0 ? agentKeyBase : `agent-${agent.id}`;
  const displayName = agent.name ?? `Agent ${agent.id}`;

  const copyMcpConfig = () => {
    if (!mcpEndpoint) return;
    const config = {
      mcpServers: {
        [agentKey]: {
          url: mcpEndpoint,
          transport: "sse",
        },
      },
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedFor("mcp");
  };

  const copyA2aConfig = () => {
    if (!a2aEndpoint) return;
    const config = {
      name: displayName,
      url: a2aEndpoint,
      skills: agent.a2aSkills ?? [],
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedFor("a2a");
  };

  if (!mcpEndpoint && !a2aEndpoint) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {mcpEndpoint && (
        <button
          type="button"
          onClick={copyMcpConfig}
          className="rounded-full border border-[var(--surface-border)] px-4 py-2 text-xs uppercase tracking-wider text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] hover:border-[var(--surface-border-hover)] transition-colors"
        >
          {copied === "mcp" ? "Copied!" : "📋 Copy MCP Config"}
        </button>
      )}
      {a2aEndpoint && (
        <button
          type="button"
          onClick={copyA2aConfig}
          className="rounded-full border border-[var(--surface-border)] px-4 py-2 text-xs uppercase tracking-wider text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] hover:border-[var(--surface-border-hover)] transition-colors"
        >
          {copied === "a2a" ? "Copied!" : "📋 Copy A2A Config"}
        </button>
      )}
    </div>
  );
}
