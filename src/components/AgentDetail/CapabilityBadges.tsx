import { Badge } from "@/components/Badge";

interface CapabilityBadgesProps {
  hasMCP?: boolean;
  hasA2A?: boolean;
  x402Support?: boolean;
  chain?: string | null;
  active?: boolean;
}

const formatChain = (chain?: string | null) => {
  if (!chain) return null;
  return chain
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export function CapabilityBadges({ hasMCP, hasA2A, x402Support, chain, active }: CapabilityBadgesProps) {
  const chainLabel = formatChain(chain);

  return (
    <div className="flex flex-wrap gap-2">
      {typeof active === "boolean" && (
        <Badge variant={active ? "green" : "amber"}>{active ? "Active" : "Inactive"}</Badge>
      )}
      {hasMCP && <Badge variant="blue">MCP</Badge>}
      {hasA2A && <Badge variant="purple">A2A</Badge>}
      {x402Support && <Badge variant="green">x402</Badge>}
      {chainLabel && <Badge variant="muted">{chainLabel}</Badge>}
    </div>
  );
}
