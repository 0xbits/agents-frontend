import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAgent, getAgentFeedback } from "@/lib/api";
import { Badge } from "@/components/Badge";
import { AgentHero } from "@/components/AgentDetail/AgentHero";
import { CapabilityBadges } from "@/components/AgentDetail/CapabilityBadges";
import { ServicesSection } from "@/components/AgentDetail/ServicesSection";
import { ToolsList } from "@/components/AgentDetail/ToolsList";
import { TechnicalDetails } from "@/components/AgentDetail/TechnicalDetails";
import { FeedbackSection } from "@/components/AgentDetail/FeedbackSection";
import { TryItModule } from "@/components/AgentDetail/TryItModule";
import { CopyConfigButtons } from "@/components/AgentDetail/CopyConfigButtons";

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const ts = Number(value);
  if (Number.isNaN(ts)) return value;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(ts * 1000)
  );
};

const findServiceEndpoint = (services: { name: string; endpoint: string; description?: string | null }[] | null | undefined, match: RegExp) => {
  if (!services) return null;
  for (const service of services) {
    const haystack = `${service.name} ${service.description ?? ""} ${service.endpoint}`.toLowerCase();
    if (match.test(haystack) && service.endpoint) return service.endpoint;
  }
  return null;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const agent = await getAgent(id);
    const titleName = agent.name || `Agent #${id}`;
    const description = agent.description?.slice(0, 160) || undefined;

    return {
      title: `${titleName} | agents.b1ts.dev`,
      description,
      openGraph: {
        title: agent.name || titleName,
        description: agent.description || description,
        images: agent.image ? [agent.image] : [],
      },
    };
  } catch {
    return {
      title: `Agent #${id} | agents.b1ts.dev`,
      description: "Agent details",
    };
  }
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgent(id).catch(() => notFound());
  const feedbackResponse = await getAgentFeedback(id).catch(() => ({ feedback: [] }));
  const feedbackItems = feedbackResponse.feedback ?? [];

  const registrationDate = formatDate(agent.registeredAt);
  const etherscanUrl = agent.owner
    ? `https://etherscan.io/address/${agent.owner}`
    : null;
  const mcpEndpoint = agent.hasMCP ? findServiceEndpoint(agent.services, /mcp/i) : null;
  const a2aEndpoint = agent.hasA2A ? findServiceEndpoint(agent.services, /a2a/i) : null;
  const showTryItModule = Boolean((agent.hasMCP && mcpEndpoint) || (agent.hasA2A && a2aEndpoint));

  return (
    <div className="min-h-screen">
      <main className="pt-20 pb-24">
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <AgentHero
              name={agent.name}
              id={agent.id}
              image={agent.image}
              description={agent.description}
              externalUrl={agent.externalUrl}
              registrationDate={registrationDate}
              etherscanUrl={etherscanUrl}
            />

            <div className="mt-6">
              <CapabilityBadges
                hasMCP={agent.hasMCP}
                hasA2A={agent.hasA2A}
                x402Support={agent.x402Support}
                chain={agent.chain}
                active={agent.active}
              />
            </div>

            {(agent.tags?.length || agent.protocols?.length) && (
              <section className="mt-10">
                <div className="grid gap-6 md:grid-cols-2">
                  {agent.tags && agent.tags.length > 0 && (
                    <div>
                      <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                        Tags
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {agent.tags.map((tag) => (
                          <a
                            key={tag}
                            href={`/?tag=${encodeURIComponent(tag)}`}
                            className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] hover:border-[var(--surface-border-hover)] transition-colors"
                          >
                            {tag}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {agent.protocols && agent.protocols.length > 0 && (
                    <div>
                      <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                        Protocols
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {agent.protocols.map((protocol) => (
                          <a
                            key={protocol}
                            href={`/?protocol=${encodeURIComponent(protocol)}`}
                            className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] hover:border-[var(--surface-border-hover)] transition-colors"
                          >
                            {protocol}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <ServicesSection services={agent.services} />

            <ToolsList title="Available Tools" items={agent.mcpTools} />
            <ToolsList title="A2A Skills" items={agent.a2aSkills} />

            {showTryItModule && (
              <section className="mt-12 space-y-4">
                <CopyConfigButtons
                  agent={agent}
                  mcpEndpoint={mcpEndpoint}
                  a2aEndpoint={a2aEndpoint}
                />
                <TryItModule
                  mcpEndpoint={mcpEndpoint}
                  a2aEndpoint={a2aEndpoint}
                  mcpTools={agent.mcpTools}
                  a2aSkills={agent.a2aSkills}
                />
              </section>
            )}

            <section className="mt-12">
              <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
                Trust & Reputation
              </h2>
              <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {agent.supportedTrust?.map((trust) => (
                    <Badge key={trust} variant="muted">
                      {trust}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--foreground-muted)]">
                  {agent.avgRating != null && (
                    <div>
                      <span className="text-[var(--foreground-subtle)]">Avg rating</span>
                      <div className="text-lg font-medium text-[var(--foreground)]">
                        {agent.avgRating.toFixed(1)}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-[var(--foreground-subtle)]">Feedback</span>
                    <div className="text-lg font-medium text-[var(--foreground)]">
                      {agent.feedbackCount}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <FeedbackSection items={feedbackItems} />

            <TechnicalDetails
              owner={agent.owner}
              wallet={agent.wallet}
              registeredBlock={agent.registeredBlock}
              metadataUpdatedAt={agent.metadataUpdatedAt}
              uri={agent.uri}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
