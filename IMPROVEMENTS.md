# agents.b1ts.dev Improvements

## Current Issues

### Data Quality
- Agent metadata (name, description, image) are NULL
- We index the URI but don't fetch/parse it
- Missing: services, MCP tools, A2A skills, x402 support

### Example: Agent #22721 (top by feedback)
**What we show:** "Agent #22721" with no details

**What the URI contains:**
```json
{
  "name": "Remittance",
  "description": "The first ERC8004 agent to verify payment stability",
  "image": "https://8004mint.com/remit-logo.png",
  "services": [
    {"name": "MCP", "endpoint": "...", "mcpTools": ["check_remittance_status", ...]},
    {"name": "A2A", "endpoint": "...", "a2aSkills": ["blockchain_analysis"]}
  ],
  "x402Support": false,
  "active": true
}
```

## Indexer Improvements Needed

### 1. URI Fetching Worker
- Fetch HTTP URIs
- Resolve IPFS URIs (via gateway)
- Decode data: base64 URIs
- Handle rate limits, retries, timeouts

### 2. Metadata Parsing
- Parse ERC-8004 JSON schema
- Extract: name, description, image
- Extract services: MCP, A2A, web, etc.
- Extract capabilities: tools, skills, x402 support

### 3. New Database Fields
```sql
-- agents table additions
name TEXT,
description TEXT,
image TEXT,
services JSONB,
mcp_tools TEXT[],
a2a_skills TEXT[],
x402_support BOOLEAN,
metadata_fetched_at TIMESTAMP
```

### 4. Search Improvements
- Full-text search on name, description
- Filter by service type (MCP, A2A)
- Filter by capability/skill
- Filter by x402 support

## Frontend Improvements

### Bug Fixes
- [ ] Display actual agent names (once indexer provides them)
- [ ] Add agent detail page (`/agents/[id]`)
- [ ] Fix `/docs` link (→ Swagger or dedicated page)
- [ ] Remove "Explore" nav link (redundant)
- [ ] "Github" → "GitHub", link to frontend repo
- [ ] Title: "agents" not "agents.b1ts.dev"

### New Features
- [ ] Agent detail page with full metadata
- [ ] Services display (MCP endpoints, A2A cards)
- [ ] Tools/skills tags
- [ ] Feedback history view
- [ ] WebSocket for live updates
- [ ] Smart search by capability

## Priority Order

1. **Indexer: URI fetching** - This unblocks everything
2. **Database schema update** - Store the metadata
3. **API updates** - Expose new fields
4. **Frontend: Display metadata** - Show names, descriptions
5. **Frontend: Detail page** - Full agent view
6. **Frontend: Search improvements** - Filter by capability
