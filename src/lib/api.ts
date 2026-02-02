const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://agents-api.b1ts.dev";

export interface AgentService {
  name: string;
  endpoint: string;
  version?: string | null;
  description?: string | null;
  capabilities?: string[] | null;
  tools?: string[] | null;
  skills?: string[] | null;
}

export interface Agent {
  id: string;
  owner: string;
  uri?: string | null;
  wallet?: string | null;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  externalUrl?: string | null;
  active?: boolean;
  x402Support?: boolean;
  hasMCP?: boolean;
  hasA2A?: boolean;
  mcpCapabilities?: string[] | null;
  mcpTools?: string[] | null;
  a2aSkills?: string[] | null;
  tags?: string[] | null;
  protocols?: string[] | null;
  chain?: string | null;
  chainId?: number | null;
  supportedTrust?: string[] | null;
  feedbackCount: number;
  avgRating?: number | null;
  registeredAt: string;
  registeredBlock: string;
  metadataFetched?: boolean;
  metadataUpdatedAt?: string | null;
  services?: AgentService[] | null;
}

export interface SearchResponse {
  query: string;
  count: number;
  offset: number;
  limit: number;
  results: Agent[];
}

export interface StatsResponse {
  totalAgents: number;
  totalFeedback: number;
  agentsWithURI: number;
}

export async function searchAgents(
  query: string = "",
  options: { 
    limit?: number; 
    offset?: number; 
    sort?: string;
    tag?: string;
    protocol?: string;
    mcp?: boolean;
    a2a?: boolean;
    x402?: boolean;
  } = {}
): Promise<SearchResponse> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (options.limit) params.set("limit", options.limit.toString());
  if (options.offset) params.set("offset", options.offset.toString());
  if (options.sort) params.set("sort", options.sort);
  if (options.tag) params.set("tag", options.tag);
  if (options.protocol) params.set("protocol", options.protocol);
  if (options.mcp) params.set("mcp", "true");
  if (options.a2a) params.set("a2a", "true");
  if (options.x402) params.set("x402", "true");

  const res = await fetch(`${API_URL}/agents?${params}`, {
    next: { revalidate: 60 },
  });
  
  if (!res.ok) throw new Error("Failed to search agents");
  return res.json();
}

export async function getAgent(id: string): Promise<Agent> {
  const res = await fetch(`${API_URL}/agents/${id}`, {
    next: { revalidate: 60 },
  });
  
  if (!res.ok) throw new Error("Agent not found");
  return res.json();
}

export async function getTopAgents(
  by: "feedback" | "rating" = "feedback",
  limit: number = 10
): Promise<{ agents: Agent[] }> {
  const res = await fetch(`${API_URL}/top?by=${by}&limit=${limit}`, {
    next: { revalidate: 60 },
  });
  
  if (!res.ok) throw new Error("Failed to fetch top agents");
  return res.json();
}

export async function getStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_URL}/stats`, {
    next: { revalidate: 300 },
  });
  
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
