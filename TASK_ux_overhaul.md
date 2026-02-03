# UX Overhaul: Discovery → Try → Trust

## Vision

Transform the agent registry from "find agents" to "find and instantly try agents". The core insight: discovery is only valuable if you can immediately act on it.

**Three pillars:**
1. **Discovery** — Find agents by capability
2. **Try** — Execute agent tools directly from search results
3. **Trust** — Reputation/feedback visible and actionable

## Current State

- ✅ Search with filters (MCP/A2A/x402/tags)
- ✅ Agent detail pages with TryItModule
- ✅ Health status badges
- ❌ Can't try agents from search results
- ❌ No feedback UI (only display)
- ❌ No llms.txt or OpenAPI
- ❌ No curl examples

## User Journey (Target)

```
1. Land on homepage
   → See "try now" curl example
   → Search for agents

2. See search results
   → Each agent card shows:
     - Name, description, health status
     - MCP tools / A2A skills (expandable)
     - [Try It] button that opens inline executor

3. Click Try It on search result
   → Inline TryIt expands
   → Tools/skills pre-populated
   → One-click execute with sensible defaults
   → See response immediately

4. View reputation
   → Star rating, feedback count
   → Recent feedback with tags
   → [Leave Feedback] button (if authenticated)

5. Integrate into your agent
   → Copy MCP config (one click)
   → llms.txt for AI assistants
   → OpenAPI for SDK generation
```

## Tasks

### Task 1: Homepage Quick Start Section
**File:** `src/app/page.tsx`
**Goal:** Add a "Quick Start" section with working curl examples

- Add collapsible section below search
- Show curl examples:
  - Search: `curl "https://agents-services.b1ts.dev/api/agents/search?mcp=true&limit=3"`
  - Get agent: `curl "https://agents-services.b1ts.dev/api/agents/13445"`
  - Health: `curl "https://agents-services.b1ts.dev/api/agents/13445/health"`
- Copy button for each
- Link to full docs

### Task 2: Inline TryIt on Agent Cards
**File:** `src/components/AgentCard.tsx`
**Goal:** Add expandable "Try It" section to search results

- Add expand/collapse toggle
- When expanded, show:
  - Endpoint URL
  - Tool/skill selector (if multiple)
  - Parameters (key-value inputs)
  - Execute button
  - Response area
- Reuse patterns from existing `TryItModule.tsx`
- Keep card clean when collapsed

### Task 3: Enhanced Feedback Display
**File:** `src/components/AgentDetail/FeedbackSection.tsx`
**Goal:** Better feedback visualization

- Star rating visualization (not just number)
- Recent feedback cards with:
  - Rating
  - Tags (tag1, tag2)
  - Date
  - Client address (truncated)
- Filter by rating
- "Leave Feedback" button (link to contract interaction or future UI)

### Task 4: llms.txt & OpenAPI
**Files:** 
- `public/llms.txt` (static file)
- `8004-services/src/openapi.ts` (new file)

**llms.txt content:**
- Base URLs
- All endpoints with params
- MCP tools descriptions
- Example requests
- Authentication (none required for read)

**OpenAPI spec:**
- Generate from Hono routes
- Or manually craft
- Serve at /openapi.json

### Task 5: Feedback Submission API
**File:** `8004-services/src/index.ts`
**Goal:** Allow agents to leave feedback programmatically

- POST /api/feedback endpoint
- Accepts: agentId, rating, tag1, tag2, message
- Returns: transaction data for on-chain submission
- OR: Store off-chain first, batch submit later
- Add MCP tool: `submit_feedback`

### Task 6: UX Polish Pass
**Files:** Various components
**Goal:** Clean, consistent, scannable UI

- Consistent spacing
- Clear visual hierarchy
- Helpful empty states
- Loading states
- Error states with recovery actions
- Mobile responsive

## Dependencies

```
Task 1 (Homepage) ─────┐
Task 2 (Inline TryIt) ─┼─► Task 6 (UX Polish)
Task 3 (Feedback) ─────┘
Task 4 (Docs) ─────────────► Independent
Task 5 (Feedback API) ─────► Task 3 (Feedback)
```

## Success Criteria

1. User can try an agent's MCP tool within 30 seconds of landing
2. All API endpoints documented in llms.txt + OpenAPI
3. Feedback is visible and actionable
4. Clean, professional UI
5. AI assistants can read and use our docs

## Notes

- Keep existing functionality working
- Don't break agent detail pages
- Test on mobile
- Use existing design tokens (CSS variables)
