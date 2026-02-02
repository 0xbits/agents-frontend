const STEPS = [
  {
    title: "Index",
    description: "Real-time ERC-8004 registry data from Ethereum.",
    icon: "📡",
  },
  {
    title: "Clean",
    description: "Normalize capabilities, validate metadata, remove spam.",
    icon: "🧼",
  },
  {
    title: "Access",
    description: "Multiple interfaces: API, Web, MCP, and Skills.",
    icon: "🔗",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
            How it works
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 md:p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--foreground-subtle)]">
            Index → Clean → Access
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-hover)] p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden>
                    {step.icon}
                  </span>
                  <span className="text-xs font-medium text-[var(--foreground-subtle)]">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-[var(--foreground)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
