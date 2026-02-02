// Complete Agent type from API
// Reference: data/agent_gekko.json

export interface AgentService {
  name: string; // "MCP", "A2A", "OASF", "web", "email", "twitter", "agentWallet"
  endpoint: string;
  version?: string;
  description?: string;
  capabilities?: string[]; // for MCP
  tools?: string[]; // for MCP
  skills?: string[]; // for A2A/OASF
}

export interface AgentDetail {
  id: string;
  owner: string;
  uri?: string;
  wallet?: string;
  
  // Basic info
  name?: string;
  description?: string;
  image?: string;
  externalUrl?: string;
  active?: boolean;
  
  // Capabilities
  hasMCP: boolean;
  hasA2A: boolean;
  x402Support: boolean;
  mcpCapabilities?: string[]; // ["tools", "resources", "prompts"]
  mcpTools?: string[]; // ["get_portfolio", "analyze_token", ...]
  a2aSkills?: string[]; // ["portfolio_management", "token_analysis", ...]
  
  // Categorization
  tags?: string[]; // ["defi", "yield-optimization", ...]
  protocols?: string[]; // ["morpho", "yearn"]
  chain?: string; // "base"
  chainId?: number; // 8453
  
  // Trust & Reputation
  supportedTrust?: string[]; // ["reputation", "crypto-economic"]
  feedbackCount: number;
  avgRating?: number; // 0-100
  
  // Services
  services?: AgentService[];
  
  // Timestamps
  registeredAt: string; // unix timestamp as string
  registeredBlock: string;
  metadataFetched: boolean;
  metadataUpdatedAt?: string; // unix timestamp
}
