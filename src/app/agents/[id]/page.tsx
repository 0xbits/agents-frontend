import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAgent, getAgentFeedback } from "@/lib/api";
import { Badge } from "@/components/Badge";
import { AgentHero } from "@/components/AgentDetail/AgentHero";
import { CapabilityBadges } from "@/components/AgentDetail/CapabilityBadges";
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
  
  const hasMcpTools = agent.mcpTools && agent.mcpTools.length > 0;
  const hasA2aSkills = agent.a2aSkills && agent.a2aSkills.length > 0;
  const hasOnlyOneSide = (hasMcpTools && !hasA2aSkills) || (!hasMcpTools && hasA2aSkills);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - same as homepage */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--surface-border)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-medium tracking-tight">agents</a>
          
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface)]">
            <a
              href="/"
              className="w-20 py-1.5 text-sm rounded-md transition-colors text-center bg-[var(--background)] text-[var(--foreground)] shadow-sm"
            >
              Agents
            </a>
            <a
              href="/?tab=install"
              className="w-20 py-1.5 text-sm rounded-md transition-colors text-center text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
            >
              Install
            </a>
          </div>
          
          <a 
            href="https://github.com/0xbits" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-24">
        <section className="px-6 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Hero with Reputation on right */}
            <AgentHero
              name={agent.name}
              id={agent.id}
              image={agent.image}
              description={agent.description}
              externalUrl={agent.externalUrl}
              registrationDate={registrationDate}
              etherscanUrl={etherscanUrl}
              avgRating={agent.avgRating}
              feedbackCount={agent.feedbackCount}
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

            {/* Services - Full Width */}
            {agent.services && agent.services.length > 0 && (
              <div className="mt-10 space-y-3">
                <h2 className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
                  Services
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* Tools & Skills - Two columns (or full width if only one) */}
            {(hasMcpTools || hasA2aSkills) && (
              <div className={`mt-8 grid gap-6 ${hasOnlyOneSide ? "" : "sm:grid-cols-2"}`}>
                {hasA2aSkills && (
                  <ToolsList title="A2A Skills" items={agent.a2aSkills} />
                )}
                {hasMcpTools && (
                  <ToolsList title="MCP Tools" items={agent.mcpTools} />
                )}
              </div>
            )}

            {/* Copy Config Buttons */}
            {(mcpEndpoint || a2aEndpoint) && (
              <div className="mt-6">
                <CopyConfigButtons
                  agent={agent}
                  mcpEndpoint={mcpEndpoint}
                  a2aEndpoint={a2aEndpoint}
                />
              </div>
            )}

            {/* Try It Module */}
            {showTryItModule && (
              <TryItModule
                mcpEndpoint={mcpEndpoint}
                a2aEndpoint={a2aEndpoint}
                mcpTools={agent.mcpTools}
                a2aSkills={agent.a2aSkills}
              />
            )}

            {/* Technical Details */}
            <TechnicalDetails
              owner={agent.owner}
              wallet={agent.wallet}
              registeredBlock={agent.registeredBlock}
              metadataUpdatedAt={agent.metadataUpdatedAt}
              uri={agent.uri}
            />

            {/* Feedback - At Bottom */}
            <FeedbackSection
              items={feedbackItems}
              avgRating={agent.avgRating}
              agentId={agent.id}
            />
          </div>
        </section>
      </main>

      {/* Footer - same as homepage */}
      <footer className="fixed bottom-4 left-6 right-6 flex items-center justify-between text-xs text-[var(--foreground-subtle)]">
        <a
          href="https://b1ts.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--foreground-muted)] transition-colors"
        >
          Built by Bits
        </a>
        <a
          href="https://eips.ethereum.org/EIPS/eip-8004"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--foreground-muted)] transition-colors font-mono"
        >
          ERC8004
        </a>
      </footer>
    </div>
  );
}
