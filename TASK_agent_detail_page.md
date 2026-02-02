# TASK: Agent Detail Page

## Objective
Build `/agents/[id]` route to display rich agent details. This is the most important page for users who want to learn about and interact with an agent.

## Data Files (in `data/` folder)
- `agent_gekko.json` — Rich example with all fields populated
- `agent_captain_dackie.json` — Another rich example
- `agent_minara.json` — Simpler example
- `agent_remittance.json` — Minimal example
- `stats.json` — Global stats

## Existing Code Patterns
- `src/lib/api.ts` — API functions, `getAgent(id)` already exists
- `src/components/AgentCard.tsx` — Styling patterns, CSS variables
- `src/app/page.tsx` — Layout structure, header/footer

## Design System (CSS Variables)
```css
--background: #09090b
--foreground: #fafafa
--foreground-muted: #a1a1aa
--foreground-subtle: #52525b
--surface: #18181b
--surface-hover: #27272a
--surface-border: #27272a
--surface-border-hover: #3f3f46
--accent-glow: rgba(250, 250, 250, 0.03)
```

## Requirements

### 1. Create Route `/agents/[id]/page.tsx`
Server component that fetches agent data and renders detail view.

### 2. Page Sections

#### Hero Section
- Agent image (or first-letter avatar fallback)
- Name + ID
- Description (full, not truncated)
- External URL link if available
- Registration date (formatted)

#### Capability Badges Row
Display these as pill badges when true/present:
- `hasMCP` → "MCP" badge (blue tint)
- `hasA2A` → "A2A" badge (purple tint)
- `x402Support` → "x402" badge (green tint)
- `chain` → Chain badge (e.g., "Base")
- `active` → "Active" or "Inactive" indicator

#### Tags & Protocols Section
- Tags as clickable chips (link to `/?tag=xxx` search)
- Protocols as chips (link to `/?protocol=xxx` search)

#### Services Section
Display `services` array as cards:
```
┌─────────────────────────────────────┐
│ MCP                        v2025-11 │
│ https://gekkoterminal.xyz/mcp       │
│ Model Context Protocol server...    │
│ Tools: get_portfolio, analyze_token │
└─────────────────────────────────────┘
```
Each service card shows:
- `name` (MCP, A2A, web, email, twitter, etc.)
- `endpoint`
- `version` (if present)
- `description` (if present)
- `tools` (for MCP services)
- `skills` (for A2A/OASF services)

#### MCP Tools Section (if `mcpTools` exists)
List all tools with their names:
```
Available Tools (6)
• get_portfolio
• analyze_token
• get_vault_yields
• get_market_intelligence
• get_gas_prices
• simulate_swap
```

#### A2A Skills Section (if `a2aSkills` exists)
Similar list for A2A skills.

#### Trust & Reputation Section
- `supportedTrust` array as badges
- `avgRating` displayed as score (if present)
- `feedbackCount` shown
- Link to feedback endpoint (future)

#### Technical Details (collapsible)
- Owner address (with copy button)
- Wallet address
- Registered at block
- Metadata updated at timestamp
- Raw URI (for debugging)

### 3. SEO Meta Tags
Generate dynamic meta tags:
```tsx
export async function generateMetadata({ params }) {
  const agent = await getAgent(params.id);
  return {
    title: `${agent.name || `Agent #${params.id}`} | agents.b1ts.dev`,
    description: agent.description?.slice(0, 160),
    openGraph: {
      title: agent.name,
      description: agent.description,
      images: agent.image ? [agent.image] : [],
    },
  };
}
```

### 4. Navigation
- Back link to homepage
- "View on Etherscan" link using owner address
- Share button (copy URL)

### 5. Error Handling
- 404 page if agent not found
- Loading skeleton while fetching
- Graceful handling of missing fields

## Component Structure
```
src/app/agents/[id]/
├── page.tsx          # Main page (server component)
├── loading.tsx       # Loading skeleton
└── not-found.tsx     # 404 state

src/components/
├── AgentDetail/
│   ├── AgentHero.tsx
│   ├── CapabilityBadges.tsx
│   ├── ServicesSection.tsx
│   ├── ToolsList.tsx
│   └── TechnicalDetails.tsx
└── Badge.tsx         # Reusable badge component
```

## API Type Updates
Update `src/lib/api.ts` Agent interface to include all fields from the API response. Reference `data/agent_gekko.json` for the complete type.

## Acceptance Criteria
1. `/agents/13445` shows Gekko with all 6 MCP tools listed
2. Services section shows MCP, A2A, web, email, twitter services
3. Tags (defi, yield-optimization, etc.) display as clickable chips
4. Page has proper meta tags for SEO
5. Works for agents with minimal data (just ID and owner)
6. Mobile responsive layout
7. Matches existing design system (dark theme, CSS variables)

## DO NOT
- Add new npm dependencies
- Change existing components' behavior
- Modify the API or backend
- Add authentication/login features
