import Link from "next/link";
import { Globe, Code, Plug, Puzzle } from "lucide-react";
import { Badge } from "@/components/Badge";

const METHODS = [
  {
    title: "Web App",
    description: "Browse agents visually.",
    icon: Globe,
    href: "/",
  },
  {
    title: "REST API",
    description: "Integrate directly.",
    icon: Code,
    href: "https://github.com/0xbits/8004-indexer#api",
  },
  {
    title: "MCP Server",
    description: "Connect your AI agent.",
    icon: Plug,
    href: "/docs/mcp",
    badge: "Live",
  },
  {
    title: "AgentSkill",
    description: "Drop-in OpenClaw skill.",
    icon: Puzzle,
    comingSoon: true,
  },
];

export function AccessMethods() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
            Access your way
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {METHODS.map((method) => {
            const Icon = method.icon;
            const content = (
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--surface-border-hover)] hover:-translate-y-0.5">
                <div>
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[var(--foreground-muted)]" aria-hidden />
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                      {method.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-[var(--foreground-subtle)]">
                    {method.description}
                  </p>
                </div>
                {method.comingSoon ? (
                  <div className="mt-6">
                    <Badge variant="muted">Coming soon</Badge>
                  </div>
                ) : method.badge ? (
                  <div className="mt-6">
                    <Badge variant="green">{method.badge}</Badge>
                  </div>
                ) : null}
              </div>
            );

            if (method.href) {
              return (
                <Link
                  key={method.title}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={method.title} aria-disabled="true">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
