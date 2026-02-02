# Task: Homepage Redesign v2 — Two Audiences

## Concept

Split homepage into two tabs:
- **For Humans** — Search & discover agents (current UX, polished)
- **For Agents** — Lowkey technical view (endpoints, MCP config, API)

## Design

### Header
```
agents                                    [For Humans] [For Agents]    GitHub
```

Tabs toggle between views. Clean, minimal.

### For Humans Tab
- Hero: "Find skills your agent needs"
- Search bar (prominent)
- Quick filters: MCP, A2A, x402
- Agent cards grid
- Stats subtle at bottom

### For Agents Tab
Super minimal. Just the essentials:
```
┌─────────────────────────────────────────┐
│                                         │
│  MCP Endpoint                           │
│  https://agents-services.b1ts.dev/mcp   │
│  [Copy]                                 │
│                                         │
│  API                                    │
│  https://agents-api.b1ts.dev            │
│  [Copy]                                 │
│                                         │
│  Tools: search_agents, get_agent,       │
│         get_agent_tools, get_agent_health│
│         get_stats                       │
│                                         │
│  Docs → /docs/mcp                       │
│                                         │
└─────────────────────────────────────────┘
```

No fluff. Just endpoints and what's available.

### Footer
```
                                          ERC8004
```
Bottom right corner only. No "Powered by".

## Implementation

### 1. Add tab state
```tsx
const [tab, setTab] = useState<"humans" | "agents">("humans");
```

### 2. Header with tabs
```tsx
<header>
  <a href="/">agents</a>
  
  <div className="tabs">
    <button 
      onClick={() => setTab("humans")}
      className={tab === "humans" ? "active" : ""}
    >
      For Humans
    </button>
    <button 
      onClick={() => setTab("agents")}
      className={tab === "agents" ? "active" : ""}
    >
      For Agents
    </button>
  </div>
  
  <a href="https://github.com/...">GitHub</a>
</header>
```

### 3. Conditional content
```tsx
{tab === "humans" ? (
  <HumansView ... />
) : (
  <AgentsView />
)}
```

### 4. AgentsView component
New component — super minimal:
- MCP endpoint with copy button
- API endpoint with copy button  
- List of available tools
- Link to docs

### 5. Footer
```tsx
<footer className="fixed bottom-4 right-6 text-xs text-[var(--foreground-subtle)]">
  <a href="https://eips.ethereum.org/EIPS/eip-8004" target="_blank">
    ERC8004
  </a>
</footer>
```

## Files to modify
- `src/app/page.tsx` — Main restructure
- Create `src/components/AgentsView.tsx` — New component

## Style notes
- Tabs: subtle, not loud. Maybe just underline active.
- For Agents view: monospace for endpoints, lots of whitespace
- Footer: fixed position, bottom-right, very subtle
