# Task: Frontend Polish & Fixes

## Overview
Comprehensive UI/UX improvements across homepage, install page, and agent detail page.

---

## 1. Homepage (`src/app/page.tsx`)

### 1.1 Search & Filters Layout
- Search bar on its **own line** (full width)
- Below: filter buttons row — **all on same line**: DeFi, Social, MCP, A2A, x402
- Mobile: filters should wrap gracefully

```
┌─────────────────────────────────────────────┐
│  [Search agents...]                          │
└─────────────────────────────────────────────┘
  [DeFi] [Social] [MCP] [A2A] [x402]  [✕]
```

### 1.2 Tagline
Restore hero tagline: **"Find skills your agent needs"**

### 1.3 Stats Bar
Add centered stats section at bottom (before footer):
- 3 core metrics: Total Agents | Live Agents | With MCP (or similar)
- Subtle, minimal styling

### 1.4 Setup Guide CTA
Change "Setup guide →" text to a **button** style (more prominent call-to-action)

---

## 2. Install Page (within `page.tsx`)

### 2.1 Single Page Layout
Combine into one scrollable page:
1. Quick Start (endpoints + copy buttons)
2. Setup Guide (config code block)
3. Available Tools (list with descriptions)
4. Links to full docs

Currently `InstallView` is inline — ensure it flows as single coherent page.

---

## 3. Agent Detail Page (`src/app/agents/[id]/page.tsx`)

### 3.1 Agent ID Format
Always display agent ID with `#` prefix: `#3311` not `3311`

### 3.2 Layout Restructure

```
┌─────────────────────────────────────────────────────┐
│ HERO (name, image, description)      │ REPUTATION  │
│                                      │ Rating: 4.2 │
│ [MCP] [A2A] [x402] • healthy 23ms   │ Feedback: 12│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SERVICES (full width grid)                          │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│ │ MCP         │ │ A2A         │ │ Web         │    │
│ │ endpoint... │ │ endpoint... │ │ endpoint... │    │
│ └─────────────┘ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────────────────────┘

┌────────────────────────┬────────────────────────────┐
│ A2A SKILLS             │ MCP TOOLS                  │
│ • skill_1              │ • tool_1                   │
│ • skill_2              │ • tool_2                   │
│                        │                            │
│ [Copy A2A Config]      │ [Copy MCP Config]          │
└────────────────────────┴────────────────────────────┘
(If only one side has content, make it full width)

┌─────────────────────────────────────────────────────┐
│ TRY IT (full width)                                 │
│ Select tool: [dropdown]                             │
│ Parameters: [input fields based on tool]            │
│ [Execute]                                           │
│ Response: { ... }                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ TECHNICAL DETAILS                                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FEEDBACK (at bottom)                                │
│ ┌─────────────────────────────────────────────┐    │
│ │ 4.5 • 0x1234...5678 • #quality #fast        │    │
│ └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 3.3 Reputation in Hero
Move rating + feedback count to **right side of hero header** (not separate section below)

### 3.4 Fix Rating Display
Rating currently broken — ensure `agent.avgRating` displays correctly

### 3.5 "View on Interface" → "Interface"
Rename the external link text

### 3.6 Feedback Section
- Move to **bottom** (after technical details)
- Format addresses as `0x1234...5678` (first 6 + last 4 chars)
- Link addresses to `https://app.interface.social/{address}`
- Check if `feedbackURI` contains comments to display (per ERC-8004 spec)

### 3.7 Try It Module — Actually Callable!
The Try It section must be **functional**:
- Dropdown to select tool/skill
- Dynamic input fields for parameters (based on tool schema if available)
- Execute button that **actually calls the MCP/A2A endpoint**
- Display real response JSON

### 3.8 Header/Footer
Agent page should use **same header/footer as homepage**:
- Header: "agents" logo | [Agents] [Install] tabs | GitHub link
- Footer: "Built by Bits" | "ERC8004"

---

## 4. Docs (8004-indexer repo)

### 4.1 Scalar Styling
Verify Scalar is deployed and replacing SwaggerUI at `https://agents-api.b1ts.dev/docs`

If still showing SwaggerUI, check:
- Package installed: `@scalar/hono-api-reference`
- Import correct: `import { apiReference } from "@scalar/hono-api-reference"`
- Route configured properly

---

## Files to Modify

**8004-app:**
- `src/app/page.tsx` — homepage + install
- `src/app/agents/[id]/page.tsx` — agent detail
- `src/components/AgentDetail/TryItModule.tsx` — make callable
- `src/components/AgentDetail/FeedbackSection.tsx` — address formatting + links
- May need shared layout component for header/footer

**8004-indexer:**
- `src/api/index.ts` — verify Scalar config

---

## Testing

After implementation:
1. Homepage: verify search/filters layout, stats bar, tagline
2. Install page: scrolls as single page
3. Agent page: check layout, Try It actually works, feedback at bottom
4. Mobile: everything responsive
5. Docs: shows Scalar not SwaggerUI

---

## Self-Review Prompts
1. Is the filter row truly single-line on desktop?
2. Does Try It actually make HTTP requests and show responses?
3. Are all agent IDs prefixed with #?
4. Do feedback addresses link to interface.social?
5. Is Rating displayed correctly in hero?
