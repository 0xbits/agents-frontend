# TASK: Homepage Redesign

## Goal
Redesign the homepage layout, remove emojis, reframe "How it works" as value props, and integrate health stats.

## Current Issues
1. Section order is wrong — capabilities buried below "How it works"
2. Emojis everywhere — too playful for a dev tool
3. "How it works" is process-focused, not value-focused
4. MCP Server link goes to raw endpoint (nothing renders)
5. No health stats shown

## Changes Required

### 1. Reorder Sections in `src/app/page.tsx`

**Current order:**
```
Hero + Search
HowItWorks
Results (Top Agents)
Browse by Capability
McpConfig
AccessMethods
Footer
```

**New order:**
```
Hero + Search
Browse by Capability (moved up!)
Results (Top Agents)
WhyRegistry (renamed)
McpConfig (add id="connect")
AccessMethods
Footer
```

### 2. Remove Emojis — Use Lucide Icons

**Files to update:**

`src/components/CapabilityCard.tsx`:
- Remove `icon` prop or make it accept Lucide component
- Use these icons:
  - MCP Tools → `<Wrench />`
  - A2A Ready → `<Bot />`
  - x402 Payments → `<Coins />`

`src/components/HowItWorks.tsx` → rename to `WhyRegistry.tsx`:
- Remove emoji icons
- Use Lucide icons or just step numbers

`src/components/AccessMethods.tsx`:
- Replace emojis with Lucide icons:
  - Web App → `<Globe />`
  - REST API → `<Code />`
  - MCP Server → `<Plug />`
  - AgentSkill → `<Puzzle />`

`src/app/page.tsx`:
- Update footer: remove ✨ emoji from "Built by Bits"

### 3. Rename "How it Works" → "Why this registry"

Rename file: `src/components/HowItWorks.tsx` → `src/components/WhyRegistry.tsx`

**New content (perks, not process):**

```typescript
const PERKS = [
  {
    title: "Verified",
    description: "On-chain registration via ERC-8004. Spam filtered, metadata validated.",
    icon: Shield, // from lucide-react
  },
  {
    title: "Interoperable", 
    description: "MCP tools, A2A skills, and x402 payments — all indexed and searchable.",
    icon: Layers,
  },
  {
    title: "Real-time",
    description: "Live indexing from Ethereum. Health checks every 30 minutes.",
    icon: Zap,
  },
];
```

Update section header from "How it works" to "Why this registry"

Remove the "Index → Clean → Access" subtitle.

### 4. Fix MCP Server Link

In `src/components/AccessMethods.tsx`:

Change:
```typescript
{
  title: "MCP Server",
  description: "Connect your AI agent.",
  icon: Plug,
  href: MCP_ENDPOINT, // broken - goes to raw endpoint
  badge: "Live",
},
```

To:
```typescript
{
  title: "MCP Server", 
  description: "Connect your AI agent.",
  icon: Plug,
  href: "#connect", // anchor to McpConfig section
  badge: "Live",
},
```

In `src/components/McpConfig.tsx`:
- Add `id="connect"` to the section element

### 5. Add Health Stats to Homepage

**Add to stats state in `page.tsx`:**
```typescript
const [healthStats, setHealthStats] = useState({
  total: 0,
  healthy: 0,
  unhealthy: 0,
});
```

**Fetch from services API:**
```typescript
// In loadData()
try {
  const healthRes = await fetch('https://agents-services.b1ts.dev/health/stats');
  if (healthRes.ok) {
    const health = await healthRes.json();
    setHealthStats({
      total: health.total || 0,
      healthy: health.counts?.healthy || 0,
      unhealthy: (health.counts?.unhealthy || 0) + (health.counts?.unreachable || 0),
    });
  }
} catch (e) {
  // Health stats optional, don't fail
}
```

**Display in footer or stats area:**
```tsx
<span>{healthStats.healthy} agents online</span>
```

Or add to capability cards as secondary stat.

### 6. Update Exports

In `src/components/index.ts`:
- Change `HowItWorks` export to `WhyRegistry`

## Files to Modify
- `src/app/page.tsx` — reorder sections, fetch health, update imports
- `src/components/HowItWorks.tsx` → rename to `WhyRegistry.tsx`, new content
- `src/components/CapabilityCard.tsx` — Lucide icons instead of emoji
- `src/components/AccessMethods.tsx` — Lucide icons, fix MCP href
- `src/components/McpConfig.tsx` — add id="connect"
- `src/components/index.ts` — update exports

## Dependencies
Already installed: `lucide-react`

## Testing
1. Homepage loads without emojis
2. Capabilities section appears right after search
3. "Why this registry" shows perks not process
4. MCP Server link scrolls to config section
5. Health stats appear (graceful fallback if API unavailable)
6. All Lucide icons render correctly
