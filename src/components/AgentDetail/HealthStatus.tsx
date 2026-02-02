"use client";

import { useEffect, useState } from "react";
import { getAgentHealth, type AgentHealth } from "@/lib/api";
import { HealthBadge } from "@/components/HealthBadge";

interface HealthStatusProps {
  agentId: string;
}

export function HealthStatus({ agentId }: HealthStatusProps) {
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    setLoading(true);
    getAgentHealth(agentId)
      .then((data) => {
        if (isActive) setHealth(data);
      })
      .catch(() => {
        if (isActive) setHealth(null);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [agentId]);

  if (loading) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="h-4 w-16 rounded bg-[var(--surface-hover)] animate-pulse" />
      </div>
    );
  }

  if (!health || health.status === "unknown") return null;

  return (
    <div className="flex items-center gap-4 text-sm">
      <HealthBadge status={health.status} />
      {health.latencyMs != null && (
        <span className="text-[var(--foreground-subtle)]">{health.latencyMs}ms</span>
      )}
      {typeof health.mcpValid === "boolean" && health.mcpValid && (
        <span className="text-[var(--foreground-subtle)]">
          MCP: {health.mcpToolsCount ?? 0} tools
        </span>
      )}
      {typeof health.a2aValid === "boolean" && health.a2aValid && (
        <span className="text-[var(--foreground-subtle)]">
          A2A: {health.a2aSkillsCount ?? 0} skills
        </span>
      )}
    </div>
  );
}
