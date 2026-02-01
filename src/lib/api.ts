const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.agents.b1ts.dev";

export interface Agent {
  id: string;
  owner: string;
  uri?: string;
  wallet?: string;
  name?: string;
  description?: string;
  image?: string;
  active?: boolean;
  feedbackCount: number;
  avgRating?: number;
  registeredAt: string;
  registeredBlock: string;
  services?: { name: string; endpoint: string; version?: string }[];
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
  options: { limit?: number; offset?: number; sort?: string } = {}
): Promise<SearchResponse> {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (options.limit) params.set("limit", options.limit.toString());
  if (options.offset) params.set("offset", options.offset.toString());
  if (options.sort) params.set("sort", options.sort);

  const res = await fetch(`${API_URL}/search?${params}`, {
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
