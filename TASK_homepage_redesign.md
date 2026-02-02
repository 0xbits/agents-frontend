# TASK: Homepage Redesign & Agent Page Enhancements

## Overview
Three related improvements:
1. Homepage redesign - focus on discovery value proposition
2. Agent page feedback display
3. "Try it out" module for agents with MCP/A2A endpoints

---

## 1. Homepage Redesign

### Current Issues
- Stats in hero section are less relevant now (URI count not useful)
- Homepage should emphasize discovery capabilities
- Stats should move to footer

### Goals
- Hero: Clear value prop + search + quick filter buttons
- Discovery focus: "Find agents by capability"
- Stats in footer (more modest)

### New Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header (same)                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Discover AI Agents on Ethereum                      │
│    Find agents with MCP tools, A2A skills, x402 payments    │
│                                                             │
│         [_____________Search________________]               │
│                                                             │
│    Quick filters:  [MCP] [A2A] [x402] [DeFi] [Trading]     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FEATURED AGENTS (or "TOP AGENTS")                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │     │ │     │ │     │ │     │ │     │ │     │          │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  BROWSE BY CAPABILITY                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ 🔧 MCP Tools │ │ 🤖 A2A Ready │ │ 💰 x402 Pay  │        │
│  │ 60 agents    │ │ 86 agents    │ │ 4,031 agents │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                      │
│ Built by Bits ✨ │ 20,441 agents indexed │ ERC-8004         │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Notes

1. **Quick Filter Pills**
   - Clickable chips that toggle filters
   - When clicked, add query param and search
   - Show: MCP, A2A, x402, and a few popular tags (defi, trading)

2. **Browse by Capability Section**
   - Three cards linking to filtered views
   - Shows count from stats endpoint
   - Clicking goes to `/?mcp=true` etc.

3. **Footer Stats**
   - Move stats from hero to footer
   - Show: total agents, agents with metadata, feedback count
   - Remove "with URI" (not useful)

### Files to Modify
- `src/app/page.tsx` — main redesign
- `src/lib/api.ts` — may need stats fields

---

## 2. Agent Page Feedback Display

### Current State
Shows "Feedback endpoint (coming soon)" but doesn't display feedback.

### API Endpoint
`GET /agents/:id/feedback` — already exists in indexer

### Response Format
```json
{
  "feedback": [
    {
      "id": "1",
      "agentId": "13445",
      "sender": "0x...",
      "rating": 95,
      "comment": "Great agent!",
      "createdAt": "1769729987"
    }
  ]
}
```

### Implementation

1. **Add API function** in `src/lib/api.ts`:
```typescript
export async function getAgentFeedback(id: string): Promise<FeedbackResponse> {
  const res = await fetch(`${API_URL}/agents/${id}/feedback`);
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return res.json();
}
```

2. **Create FeedbackSection component**:
```
src/components/AgentDetail/FeedbackSection.tsx
```

3. **Display in agent page**:
- Show list of feedback items
- Each item: rating, comment (if any), sender address, date
- Handle empty state gracefully

### Design
```
┌─────────────────────────────────────────────┐
│ FEEDBACK (77)                               │
├─────────────────────────────────────────────┤
│ ★ 98  "Excellent portfolio analysis"        │
│       0x1234...5678 · Jan 15, 2026          │
├─────────────────────────────────────────────┤
│ ★ 95  No comment                            │
│       0xabcd...ef01 · Jan 14, 2026          │
└─────────────────────────────────────────────┘
```

---

## 3. "Try It Out" Module

### Concept
For agents with MCP or A2A endpoints, allow users to test them directly.

### Scope (MVP)
Start simple:
1. Show available MCP tools / A2A skills
2. Allow selecting one
3. Input parameters
4. Show "request preview" (don't actually call yet)

### Future
- Actually make the call (requires handling auth, payments, etc.)
- For x402 agents, show payment requirement

### Implementation

1. **TryItModule component**:
```
src/components/AgentDetail/TryItModule.tsx
```

2. **Only show when**:
- Agent has `hasMCP === true` with valid MCP endpoint in services
- OR agent has `hasA2A === true` with valid A2A endpoint

3. **UI**:
```
┌─────────────────────────────────────────────────────────┐
│ TRY IT OUT                                              │
├─────────────────────────────────────────────────────────┤
│ Endpoint: https://www.gekkoterminal.xyz/mcp             │
│                                                         │
│ Select tool: [▼ get_portfolio                    ]      │
│                                                         │
│ Parameters:                                             │
│ wallet_address: [_____________________________]         │
│                                                         │
│ [Generate Request]                                      │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ POST /mcp                                           │ │
│ │ {                                                   │ │
│ │   "method": "tools/call",                          │ │
│ │   "params": {                                      │ │
│ │     "name": "get_portfolio",                       │ │
│ │     "arguments": { "wallet_address": "0x..." }    │ │
│ │   }                                                │ │
│ │ }                                                  │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

4. **Note**: MVP just generates the request format, doesn't execute.

---

## Files to Create/Modify

### Create
- `src/components/AgentDetail/FeedbackSection.tsx`
- `src/components/AgentDetail/TryItModule.tsx`
- `src/components/QuickFilters.tsx` (for homepage)
- `src/components/CapabilityCard.tsx` (for homepage browse section)

### Modify
- `src/app/page.tsx` — homepage redesign
- `src/app/agents/[id]/page.tsx` — add FeedbackSection, TryItModule
- `src/lib/api.ts` — add getAgentFeedback, update stats interface

---

## Acceptance Criteria

1. **Homepage**
   - Quick filter pills for MCP/A2A/x402
   - "Browse by Capability" section with counts
   - Stats moved to footer
   - Cleaner, more discovery-focused

2. **Feedback Display**
   - Shows actual feedback on agent page
   - Handles empty state
   - Shows rating, comment, sender, date

3. **Try It Module**
   - Appears only for MCP/A2A agents
   - Lists available tools/skills
   - Generates request preview
   - Clean, code-like output formatting

---

## DO NOT
- Add new npm dependencies
- Make actual API calls to agent endpoints (just preview)
- Add authentication
- Change existing working functionality
