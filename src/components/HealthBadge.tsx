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
      <Circle className={`h-2 w-2 fill-current ${colors[status]}`} />
      <span className="text-[var(--foreground-subtle)]">{labels[status]}</span>
      {showLatency && latencyMs != null && (
        <span className="text-[var(--foreground-subtle)]">({latencyMs}ms)</span>
      )}
    </div>
  );
}
