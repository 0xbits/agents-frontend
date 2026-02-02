# TASK: Agent Health UI

## Goal
Display health status from the services API on agent detail pages and optionally on agent cards.

## Health API

**Endpoint:** `https://agents-services.b1ts.dev/health/:agentId`

**Response:**
```json
{
  "agentId": 12345,
  "status": "healthy" | "unhealthy" | "unreachable" | "unknown",
  "lastCheckedAt": "2026-02-02T15:00:00Z",
  "lastHealthyAt": "2026-02-02T15:00:00Z",
  "latencyMs": 234,
  "httpStatus": 200,
  "mcpValid": true,
  "mcpToolsCount": 5,
  "mcpError": null,
  "a2aValid": true,
  "a2aSkillsCount": 3,
  "a2aError": null,
  "x402Price": "0.001",
  "x402Currency": "ETH"
}
```

## Changes Required

### 1. Create Health Badge Component

`src/components/HealthBadge.tsx`:

```tsx
import { Circle } from "lucide-react";

interface HealthBadgeProps {
  status: "healthy" | "unhealthy" | "unreachable" | "unknown";
  latencyMs?: number;
  showLatency?: boolean;
}

export function HealthBadge({ status, latencyMs, showLatency = false }: HealthBadgeProps) {
  const colors = {
    healthy: "text-emerald-400",
    unhealthy: "text-amber-400", 
    unreachable: "text-red-400",
    unknown: "text-gray-400",
  };

  const labels = {
    healthy: "Online",
    unhealthy: "Degraded",
    unreachable: "Offline",
    unknown: "Unknown",
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <Circle className={`w-2 h-2 fill-current ${colors[status]}`} />
      <span className="text-[var(--foreground-subtle)]">{labels[status]}</span>
      {showLatency && latencyMs && (
        <span className="text-[var(--foreground-subtle)]">({latencyMs}ms)</span>
      )}
    </div>
  );
}
```

### 2. Create Health Details Component

`src/components/AgentDetail/HealthStatus.tsx`:

For agent detail page — shows full health info:

```tsx
interface HealthStatusProps {
  agentId: string;
}

export function HealthStatus({ agentId }: HealthStatusProps) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://agents-services.b1ts.dev/health/${agentId}`)
      .then(res => res.json())
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, [agentId]);

  if (loading) return <div className="animate-pulse">...</div>;
  if (!health || health.status === "unknown") return null;

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
      <h3 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
        Health Status
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--foreground-subtle)]">Status</span>
          <HealthBadge status={health.status} />
        </div>
        
        {health.latencyMs && (
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

        {health.mcpValid !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-subtle)]">MCP endpoint</span>
            <span className="text-sm text-[var(--foreground-muted)]">
              {health.mcpValid ? `Valid (${health.mcpToolsCount} tools)` : health.mcpError || "Invalid"}
            </span>
          </div>
        )}

        {health.a2aValid !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-subtle)]">A2A endpoint</span>
            <span className="text-sm text-[var(--foreground-muted)]">
              {health.a2aValid ? `Valid (${health.a2aSkillsCount} skills)` : health.a2aError || "Invalid"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3. Add Health to Agent Detail Page

In `src/app/agents/[id]/page.tsx`:

Import and add HealthStatus component:

```tsx
import { HealthStatus } from "@/components/AgentDetail/HealthStatus";

// In the page layout, add after metadata section:
<HealthStatus agentId={params.id} />
```

### 4. Optional: Health Badge on Agent Cards

In `src/components/AgentCard.tsx`:

Add optional health indicator (small dot):

```tsx
interface Agent {
  // ... existing fields
  healthStatus?: "healthy" | "unhealthy" | "unreachable" | "unknown";
}

// In the card, add small status dot if health is known:
{agent.healthStatus && agent.healthStatus !== "unknown" && (
  <HealthBadge status={agent.healthStatus} />
)}
```

This requires fetching health data in the parent — may want to skip for performance, or batch fetch.

### 5. Add API Helper

In `src/lib/api.ts`:

```typescript
export async function getAgentHealth(agentId: string): Promise<AgentHealth | null> {
  try {
    const res = await fetch(`https://agents-services.b1ts.dev/health/${agentId}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface AgentHealth {
  agentId: number;
  status: "healthy" | "unhealthy" | "unreachable" | "unknown";
  lastCheckedAt?: string;
  lastHealthyAt?: string;
  latencyMs?: number;
  httpStatus?: number;
  mcpValid?: boolean;
  mcpToolsCount?: number;
  mcpError?: string;
  a2aValid?: boolean;
  a2aSkillsCount?: number;
  a2aError?: string;
  x402Price?: string;
  x402Currency?: string;
}
```

## Files to Create
- `src/components/HealthBadge.tsx` — reusable status badge
- `src/components/AgentDetail/HealthStatus.tsx` — full health panel

## Files to Modify
- `src/app/agents/[id]/page.tsx` — add HealthStatus component
- `src/lib/api.ts` — add getAgentHealth helper and types
- `src/components/index.ts` — export HealthBadge

## Testing
1. Agent detail page shows health section (if data available)
2. Health badge shows correct color for each status
3. Graceful fallback when health API unavailable
4. Latency and timestamps display correctly
5. MCP/A2A validation info shows when available
