# Task: Next-Level Discovery & Feedback UX

## Overview
Make the registry a **destination for discovery**, not just a search tool. Inspiration from 8004scan.io feedback page.

## Part 1: Feedback Comments & Rich Display

### Problem
Our feedback only shows tags, not actual text comments. 8004scan shows full reviews like:
- "love ethy!! best trading assistant to create custom workflows"
- "Minara feels like a very practical AI assistant..."

### Investigation Needed
1. Check if `feedbackURI` contains comment data (fetch it if URL)
2. Check on-chain event data - is comment stored elsewhere?
3. Check 8004scan API to see their data source

### Implementation
**Indexer changes** (`8004-indexer`):
- Add `comment` field to feedback schema
- If `feedbackURI` is a URL, fetch and store the content
- If `feedbackURI` is inline data, parse it

**API changes** (`8004-services`):
- Include `comment` in feedback response
- Add `/api/feedback` endpoint for global feed (like 8004scan)

**Frontend changes** (`8004-app`):
- Show comment text in FeedbackSection
- Add global `/feedback` page with feed of all feedback
- Stats: Total, Avg Score, Unique Users, Last 24h

---

## Part 2: Wallet Profiles - "Who does vitalik.eth use?"

### Concept
Given a wallet address, show:
- Agents they own
- Agents they've endorsed (left positive feedback)
- Their feedback history

### New Endpoints
```
GET /api/wallets/:address
{
  address: "0x...",
  ens: "vitalik.eth", // resolve if available
  owned: [...],      // agents they registered
  endorsed: [...],   // agents they rated 70+
  feedbackGiven: [...], // all their feedback
}

GET /api/wallets/:address/feedback
// All feedback this wallet has given

GET /api/wallets/:address/agents
// All agents this wallet owns
```

### Frontend
- `/wallet/:address` page
- "View profile" link on feedback items
- ENS resolution for display

---

## Part 3: TryIt Parameter Hints

### Problem
Users don't know what params to provide for tools.

### Solution
Fetch tool schemas from MCP endpoint at runtime:
1. When agent page loads, call MCP endpoint `tools/list`
2. Cache the response (tools with inputSchema)
3. When user selects a tool, show schema-based inputs

### Implementation
**TryItModule.tsx changes:**
```tsx
// Fetch tools with schemas when MCP endpoint available
const [toolSchemas, setToolSchemas] = useState<Record<string, any>>({});

useEffect(() => {
  if (mcpEndpoint) {
    fetch(mcpEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'tools-list',
        method: 'tools/list',
      }),
    })
    .then(res => res.json())
    .then(data => {
      const schemas: Record<string, any> = {};
      data.result?.tools?.forEach((tool: any) => {
        schemas[tool.name] = tool.inputSchema;
      });
      setToolSchemas(schemas);
    })
    .catch(() => {}); // Fail silently
  }
}, [mcpEndpoint]);

// Then render inputs based on toolSchemas[selectedTool]
```

---

## Part 4: Global Feed & Leaderboard

### New Pages

**`/feedback` - Global Feedback Feed**
- All recent feedback across all agents
- Filter by: rating range, tags, time
- Search by wallet address
- Stats at top (like 8004scan)

**`/leaderboard` - Top Agents**
- Sort by: rating, feedback count, tools count
- Time filters: all time, 30d, 7d
- Category filters: DeFi, Social, etc.

### New API Endpoints
```
GET /api/feedback?limit=50&offset=0&minRating=70
GET /api/leaderboard?sort=rating&period=30d&tag=defi
```

---

## Part 5: Discovery Features

### "Similar Agents"
On agent detail page, show related agents based on:
- Same tags
- Same protocols
- Used by same wallets

### "Trending"
Homepage section showing:
- Most feedback in last 24h
- Rising stars (new agents with good ratings)

### Search Improvements
- Search by wallet address (find their agents)
- Search by tool name (find agents with specific tools)
- Autocomplete for tags/protocols

---

## Priority Order

1. **Feedback comments** - Low-hanging fruit, big impact
2. **TryIt params** - Makes the tool actually usable
3. **Wallet profiles** - "vitalik.eth uses..." is compelling
4. **Global feed** - Discovery destination
5. **Leaderboard** - Gamification
6. **Similar agents** - Keep users exploring

---

## Files to Modify

### Indexer (`8004-indexer`)
- `ponder.schema.ts` - Add comment field
- `src/ReputationRegistry.ts` - Parse feedbackURI
- May need new enrichment worker for URI fetching

### Services (`8004-services`)
- `src/index.ts` - New endpoints
- New files: `src/wallets.ts`, `src/feed.ts`

### App (`8004-app`)
- `src/components/AgentDetail/TryItModule.tsx` - Schema fetch
- `src/components/AgentDetail/FeedbackSection.tsx` - Show comments
- `src/app/feedback/page.tsx` - New page
- `src/app/wallet/[address]/page.tsx` - New page
- `src/app/leaderboard/page.tsx` - New page
