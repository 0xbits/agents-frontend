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
import { HealthStatus } from "@/components/AgentDetail/HealthStatus";

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
          <div className="max-w-5xl mx-auto">
            {/* Hero */}
            <AgentHero
              name={agent.name}
              id={agent.id}
              image={agent.image}
              description={agent.description}
              externalUrl={agent.externalUrl}
              registrationDate={registrationDate}
              etherscanUrl={etherscanUrl}
            />

            {/* Capabilities + Health (inline) */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <CapabilityBadges
                hasMCP={agent.hasMCP}
                hasA2A={agent.hasA2A}
                x402Support={agent.x402Support}
                chain={agent.chain}
                active={agent.active}
              />
              <div className="hidden sm:block w-px h-4 bg-[var(--surface-border)]" />
              <HealthStatus agentId={id} />
            </div>

            {/* Tags & Protocols */}
            {(agent.tags?.length || agent.protocols?.length) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {agent.tags?.map((tag) => (
                  <a
                    key={tag}
                    href={`/?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)] transition-colors"
                  >
                    {tag}
                  </a>
                ))}
                {agent.protocols?.map((protocol) => (
                  <a
                    key={protocol}
                    href={`/?protocol=${encodeURIComponent(protocol)}`}
                    className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)] transition-colors"
                  >
                    {protocol}
                  </a>
                ))}
              </div>
            )}

            {/* Two Column Layout */}
            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              {/* Left: Services + Tools */}
              <div className="lg:col-span-2 space-y-8">
                {/* Services */}
                {agent.services && agent.services.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
                      Services
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {agent.services.map((service, index) => (
                        <div
                          key={`${service.name}-${index}`}
                          className="p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-sm font-medium text-[var(--foreground)]">
                              {service.name}
                            </span>
                            {service.version && (
                              <span className="text-xs text-[var(--foreground-subtle)]">
                                {service.version}
                              </span>
                            )}
                          </div>
                          <code className="text-xs text-[var(--foreground-muted)] break-all">
                            {service.endpoint}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools & Skills */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <ToolsList title="MCP Tools" items={agent.mcpTools} />
                  <ToolsList title="A2A Skills" items={agent.a2aSkills} />
                </div>

                {/* Try It */}
                {showTryItModule && (
                  <div className="space-y-4">
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
                  </div>
                )}
              </div>

              {/* Right: Reputation + Feedback */}
              <div className="space-y-6">
                {/* Trust & Reputation */}
                <div className="p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]">
                  <h3 className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider mb-3">
                    Reputation
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--foreground-subtle)]">Rating</span>
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {agent.avgRating != null ? agent.avgRating.toFixed(1) : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--foreground-subtle)]">Feedback</span>
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {agent.feedbackCount}
                      </span>
                    </div>
                    {agent.supportedTrust && agent.supportedTrust.length > 0 && (
                      <div className="pt-2 border-t border-[var(--surface-border)]">
                        <span className="text-xs text-[var(--foreground-subtle)]">Trust mechanisms</span>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {agent.supportedTrust.map((trust) => (
                            <Badge key={trust} variant="muted">
                              {trust}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback List */}
                {feedbackItems.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
                      Recent Feedback
                    </h3>
                    <div className="space-y-2">
                      {feedbackItems.slice(0, 5).map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--foreground-muted)]">
                              {item.rating?.toFixed(1) || "—"}
                            </span>
                            <span className="text-xs text-[var(--foreground-subtle)]">
                              {item.client?.slice(0, 8)}...
                            </span>
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-1 flex gap-1">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs text-[var(--foreground-subtle)]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Details */}
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
