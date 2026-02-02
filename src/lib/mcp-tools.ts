import { getAgent, getStats, searchAgents, type Agent } from "@/lib/api";

export interface SearchAgentsInput {
  query?: string;
  has_mcp?: boolean;
  has_a2a?: boolean;
  has_x402?: boolean;
  tag?: string;
  limit?: number;
}

export interface AgentIdInput {
  id: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");

const findServiceEndpoint = (
  services: { name: string; endpoint: string; description?: string | null }[] | null | undefined,
  match: RegExp
) => {
  if (!services) return null;
  for (const service of services) {
    const haystack = `${service.name} ${service.description ?? ""} ${service.endpoint}`.toLowerCase();
    if (match.test(haystack) && service.endpoint) return service.endpoint;
  }
  return null;
};

const uniqueStrings = (values: Array<string | null | undefined>) => {
  const seen = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    if (seen.has(value)) continue;
    seen.add(value);
  }
  return Array.from(seen);
};

const getMcpEndpoint = (agent: Agent) => {
  if (!agent.hasMCP) return null;
  return findServiceEndpoint(agent.services, /mcp/i) ?? agent.uri ?? null;
};

export async function searchAgentsTool(input: SearchAgentsInput) {
  const limit = input.limit ?? 10;
  return searchAgents(input.query ?? "", {
    limit,
    tag: input.tag,
    mcp: input.has_mcp,
    a2a: input.has_a2a,
    x402: input.has_x402,
  });
}

export async function getAgentTool(input: AgentIdInput) {
  return getAgent(input.id);
}

export async function getAgentToolsTool(input: AgentIdInput) {
  const agent = await getAgent(input.id);
  const serviceTools = agent.services?.flatMap((service) => service.tools ?? []) ?? [];
  return {
    id: agent.id,
    name: agent.name ?? null,
    tools: uniqueStrings([...(agent.mcpTools ?? []), ...(agent.mcpCapabilities ?? []), ...serviceTools]),
  };
}

export async function getMcpConfigTool(input: AgentIdInput) {
  const agent = await getAgent(input.id);
  const endpoint = getMcpEndpoint(agent);
  if (!endpoint) {
    return {
      id: agent.id,
      name: agent.name ?? null,
      config: null,
      error: "MCP endpoint not found for this agent.",
    };
  }

  const agentKeyBase = agent.name ? slugify(agent.name) : "";
  const agentKey = agentKeyBase.length > 0 ? agentKeyBase : `agent-${agent.id}`;

  return {
    id: agent.id,
    name: agent.name ?? null,
    config: {
      mcpServers: {
        [agentKey]: {
          url: endpoint,
          transport: "sse",
        },
      },
    },
  };
}

export async function getStatsTool() {
  return getStats();
}
