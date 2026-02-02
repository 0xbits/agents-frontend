# TASK: Tool-Level Search

## Overview
Enable searching by specific tool/capability name, not just agent name/description.

## Why
Users want to find "an agent with `get_weather` tool" or "agents that can analyze tokens". Currently search only matches agent metadata, not the tools inside.

## Current State
- API has `/search` endpoint that searches agent name/description
- Agent detail shows tools array from MCP services
- Tools are stored in `services[].tools[]` in agent metadata

## Required Changes

### Backend (Indexer)
The indexer already extracts tools. Need to:
1. Index tools as searchable field
2. Add `/search?tool=get_portfolio` filter
3. Add `/tools` endpoint to list all known tools

### API Changes

#### New: `GET /tools`
List all unique tools across all agents.
```json
{
  "tools": [
    { "name": "get_portfolio", "agentCount": 3 },
    { "name": "analyze_token", "agentCount": 5 },
    { "name": "get_weather", "agentCount": 12 }
  ],
  "total": 156
}
```

#### Enhanced: `GET /search`
Add `tool` query param:
```
GET /search?tool=analyze_token
GET /search?q=defi&tool=get_portfolio
```

### Frontend Changes

#### Search Enhancement
1. Add tool autocomplete to search bar
2. Show "Searching tools..." when query matches tool pattern
3. Display matched tools in results

#### New: Tools Browse Page (Optional)
`/tools` page showing all available tools with agent counts.

## Implementation

### `src/lib/api.ts`
```typescript
export async function searchTools(query?: string): Promise<{ tools: Tool[] }> {
  const res = await fetch(`${API_URL}/tools?q=${query || ""}`);
  return res.json();
}

// Update searchAgents to accept tool param
export async function searchAgents(
  query: string,
  options?: { tool?: string; mcp?: boolean; ... }
)
```

### `src/components/SearchBar.tsx`
Add tool suggestions dropdown when typing tool-like queries.

### `src/app/page.tsx`
Handle `?tool=` URL param, display "Tools matching X" section.

## Acceptance Criteria
- [ ] `/search?tool=X` returns agents with that tool
- [ ] `/tools` endpoint lists all tools with counts
- [ ] Search bar suggests tools
- [ ] URL param `?tool=X` works

## Files to Modify
- Backend indexer (if needed for tool indexing)
- `src/lib/api.ts` — new functions
- `src/components/SearchBar.tsx` — tool suggestions
- `src/app/page.tsx` — tool param handling

## Note
If indexer changes are needed, flag them — may need separate task for backend.
