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
      <div className="mt-10 animate-pulse rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
        <div className="h-4 w-24 rounded bg-[var(--surface-hover)]" />
        <div className="mt-4 space-y-3">
          <div className="h-3 w-40 rounded bg-[var(--surface-hover)]" />
          <div className="h-3 w-36 rounded bg-[var(--surface-hover)]" />
          <div className="h-3 w-44 rounded bg-[var(--surface-hover)]" />
        </div>
      </div>
    );
  }

  if (!health || health.status === "unknown") return null;

  return (
    <div className="mt-10 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
        Health Status
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--foreground-subtle)]">Status</span>
          <HealthBadge status={health.status} />
        </div>

        {health.latencyMs != null && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-subtle)]">Latency</span>
            <span className="text-sm text-[var(--foreground-muted)]">{health.latencyMs}ms</span>
          </div>
        )}

        {health.lastCheckedAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-subtle)]">Last checked</span>
            <span className="text-sm text-[var(--foreground-muted)]">
              {new Date(health.lastCheckedAt).toLocaleString()}
            </span>
          </div>
        )}

        {typeof health.mcpValid === "boolean" && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-subtle)]">MCP endpoint</span>
            <span className="text-sm text-[var(--foreground-muted)]">
              {health.mcpValid
                ? `Valid (${health.mcpToolsCount ?? 0} tools)`
                : health.mcpError || "Invalid"}
            </span>
          </div>
        )}

        {typeof health.a2aValid === "boolean" && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-subtle)]">A2A endpoint</span>
            <span className="text-sm text-[var(--foreground-muted)]">
              {health.a2aValid
                ? `Valid (${health.a2aSkillsCount ?? 0} skills)`
                : health.a2aError || "Invalid"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
