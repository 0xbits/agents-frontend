# TASK: Fix Agent Pages + Homepage Redesign

## Overview
Two main tasks:
1. Fix agent detail pages (currently breaking due to API field mismatch)
2. Redesign homepage with better positioning/value proposition

---

## 1. Fix Agent Detail Pages

### Problem
The agent pages show "Application error" due to FeedbackSection expecting wrong field names.

### API Response Format
`GET /agents/:id/feedback` returns:
```json
{
  "agentId": "13445",
  "count": 20,
  "feedback": [
    {
      "client": "0x7f84de91...",  // NOT "sender"
      "rating": 80,
      "tags": ["GEKKO"],
      "createdAt": "1769819471",
      "isRevoked": false
      // Note: no "comment" field, no "id" field
    }
  ]
}
```

### Fix Required
Update `src/lib/api.ts` FeedbackItem interface:
```typescript
export interface FeedbackItem {
  client: string;       // was "sender"
  rating: number;
  tags?: string[];
  createdAt: string;
  isRevoked?: boolean;
  // Remove: id, agentId, comment (not in API)
}
```

Update `src/components/AgentDetail/FeedbackSection.tsx`:
- Use `item.client` instead of `item.sender`
- Handle missing comment gracefully (show tags instead, or "No comment")
- Generate key from index since there's no `id` field

---

## 2. Homepage Redesign

### Current Problems
- Generic copy that doesn't explain value prop
- "Discover AI Agents on Ethereum" doesn't explain what we solve

### New Positioning
**Problem we solve:** Developers and agents need tools, data, and capabilities to power their experiences. Finding reliable, interoperable agent skills is hard.

**Our solution:** A powerful indexer that cleans and normalizes ERC-8004 registry data, exposed through multiple interfaces.

### New Homepage Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header: agents | API | GitHub                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Find skills your agent needs                        │
│                                                             │
│    Discover MCP tools, A2A skills, and verified agent       │
│    capabilities — indexed from Ethereum, cleaned,           │
│    and ready to use.                                        │
│                                                             │
│         [_____________Search________________]               │
│                                                             │
│    Quick filters:  [MCP] [A2A] [x402] [DeFi] [Trading]     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HOW IT WORKS (new section)                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. INDEX  →  2. CLEAN  →  3. ACCESS                  │  │
│  │                                                      │  │
│  │ Real-time    Normalize     Multiple                  │  │
│  │ ERC-8004     capabilities, interfaces:              │  │
│  │ registry     validate      API, Web,                │  │
│  │ data         metadata      MCP, Skills              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  TOP AGENTS                                                 │
│  [cards...]                                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  BROWSE BY CAPABILITY                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ 🔧 MCP Tools │ │ 🤖 A2A Ready │ │ 💰 x402 Pay  │        │
│  │ 60 agents    │ │ 88 agents    │ │ 4,033 agents │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ACCESS YOUR WAY (new section)                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐│
│  │ 🌐 Web App │ │ 📡 REST API│ │ 🔌 MCP     │ │ 🧩 Skills││
│  │ Browse     │ │ Integrate  │ │ (coming)   │ │ (coming) ││
│  │ agents     │ │ directly   │ │ Connect    │ │ Reusable ││
│  │ visually   │ │            │ │ your LLM   │ │ modules  ││
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Footer                                                      │
│ Built by Bits ✨ │ 20K+ agents │ Powered by ERC-8004        │
└─────────────────────────────────────────────────────────────┘
```

### New Sections to Add

#### "How It Works" Section
Three steps with icons:
1. **Index** — Real-time ERC-8004 registry data from Ethereum
2. **Clean** — Normalize capabilities, validate metadata, remove spam
3. **Access** — Multiple interfaces: API, Web, MCP, Skills

#### "Access Your Way" Section  
Four cards showing different access methods:
1. **Web App** — "Browse agents visually" (current, linked to /)
2. **REST API** — "Integrate directly" (linked to GitHub#api)
3. **MCP Server** — "Connect your LLM" (coming soon badge)
4. **AgentSkill** — "Reusable modules" (coming soon badge)

### Copy Updates
- Hero title: "Find skills your agent needs"
- Hero subtitle: "Discover MCP tools, A2A skills, and verified agent capabilities — indexed from Ethereum, cleaned, and ready to use."
- Footer: "Built by Bits ✨ | 20,449 agents indexed | Powered by ERC-8004"

---

## Files to Modify

### Fix Agent Pages
- `src/lib/api.ts` — Fix FeedbackItem interface
- `src/components/AgentDetail/FeedbackSection.tsx` — Use correct field names

### Homepage Redesign
- `src/app/page.tsx` — Add new sections, update copy
- Create `src/components/HowItWorks.tsx` — Pipeline visualization
- Create `src/components/AccessMethods.tsx` — Four access method cards

---

## Acceptance Criteria

1. **Agent pages work** — No more "Application error"
2. **Feedback displays** — Shows rating, client address, date
3. **Homepage has "How It Works"** — Three-step pipeline
4. **Homepage has "Access Your Way"** — Four method cards
5. **Better copy throughout** — Value prop is clear
6. **Footer updated** — Shows agent count, "Powered by ERC-8004"

---

## DO NOT
- Add new npm dependencies
- Change the dark theme / design system
- Remove existing working functionality
- Make actual API calls to external agent endpoints
