import { Shield, Layers, Zap } from "lucide-react";

const PERKS = [
  {
    title: "Verified",
    description: "On-chain registration via ERC-8004. Spam filtered, metadata validated.",
    icon: Shield,
  },
  {
    title: "Interoperable",
    description: "MCP tools, A2A skills, and x402 payments — all indexed and searchable.",
    icon: Layers,
  },
  {
    title: "Real-time",
    description: "Live indexing from Ethereum. Health checks every 30 minutes.",
    icon: Zap,
  },
];

export function WhyRegistry() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
            Why this registry
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 md:p-8">
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-hover)] p-5"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[var(--foreground-muted)]" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[var(--foreground)]">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
