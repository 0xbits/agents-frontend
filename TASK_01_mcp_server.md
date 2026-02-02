# TASK: MCP Server for agents.b1ts.dev

## Overview
Build an MCP server that exposes the agents API, so AI agents can search for tools/capabilities programmatically.

## Why
The platform helps agents find skills — but agents can't use it without a human. An MCP server lets agents query directly from their context.

## Architecture
Create a new Next.js API route that implements MCP protocol (stdio over HTTP or SSE).

### Option A: Standalone MCP Server (Recommended)
Create `/mcp` directory with a standalone MCP server that can be:
1. Run locally via `npx`
2. Hosted as SSE endpoint at `/api/mcp`

### Option B: Simple API + Config Generator
If MCP is complex, at minimum provide:
- `/api/mcp-config` — returns ready-to-use config JSON
- Document how to use the REST API as pseudo-MCP

## MCP Tools to Implement

### `search_agents`
```typescript
{
  name: "search_agents",
  description: "Search for AI agents by capability, tool, or keyword",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      has_mcp: { type: "boolean", description: "Filter to MCP-enabled agents" },
      has_a2a: { type: "boolean", description: "Filter to A2A-enabled agents" },
      has_x402: { type: "boolean", description: "Filter to x402-enabled agents" },
      tag: { type: "string", description: "Filter by tag" },
      limit: { type: "number", description: "Max results (default 10)" }
    }
  }
}
```

### `get_agent`
```typescript
{
  name: "get_agent",
  description: "Get detailed information about a specific agent",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Agent ID" }
    },
    required: ["id"]
  }
}
```

### `get_agent_tools`
```typescript
{
  name: "get_agent_tools",
  description: "List all MCP tools available from an agent",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Agent ID" }
    },
    required: ["id"]
  }
}
```

### `get_mcp_config`
```typescript
{
  name: "get_mcp_config",
  description: "Generate MCP config JSON for an agent, ready to paste into claude_desktop_config.json",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Agent ID" }
    },
    required: ["id"]
  }
}
```

### `get_stats`
```typescript
{
  name: "get_stats",
  description: "Get registry statistics",
  inputSchema: { type: "object", properties: {} }
}
```

## Implementation

### File: `src/app/api/mcp/route.ts`
SSE-based MCP endpoint using `@modelcontextprotocol/sdk`.

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

// ... implement tools using existing API functions
```

### Alternative: Standalone Package
Create `packages/mcp-server/` with:
- `index.ts` — MCP server implementation
- `package.json` — publishable to npm as `@b1ts/agents-mcp`

## Testing
1. Connect via Claude Desktop or MCP inspector
2. Run `search_agents({ query: "defi", has_mcp: true })`
3. Verify results match web UI

## Acceptance Criteria
- [ ] MCP endpoint accessible at `/api/mcp` or as standalone
- [ ] All 5 tools implemented and working
- [ ] Returns valid MCP protocol responses
- [ ] Config generation produces working JSON

## Files to Create/Modify
- `src/app/api/mcp/route.ts` — SSE MCP endpoint
- `src/lib/mcp-tools.ts` — Tool implementations
- `package.json` — add `@modelcontextprotocol/sdk`
- `README.md` — document MCP usage

## DO NOT
- Break existing API routes
- Add heavy dependencies beyond MCP SDK
