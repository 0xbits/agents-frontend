# Task: Homepage Quick Start & Inline Try

## Objective
Add a "Quick Start" section to the homepage with working examples, and enable trying agents directly from search results.

## Part 1: Quick Start Section

**Location:** `src/app/page.tsx` - Add below search bar, above results

**Design:**
```
┌─────────────────────────────────────────────────────────────┐
│  🚀 Quick Start                               [Collapse ▼]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Try it now — no setup required:                            │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ curl "https://agents-services.b1ts.dev/api/agents/   │  │
│  │       search?mcp=true&limit=3"                 [Copy] │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  More examples:                                             │
│  • Get agent details    [Copy curl]                         │
│  • Check agent health   [Copy curl]                         │
│  • Registry stats       [Copy curl]                         │
│                                                             │
│  [View Full Docs →]  [Add to Your Agent →]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**

Create new component `src/components/QuickStart.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, Terminal, ExternalLink } from "lucide-react";

const EXAMPLES = [
  {
    label: "Search MCP agents",
    curl: 'curl "https://agents-services.b1ts.dev/api/agents/search?mcp=true&limit=3"',
    description: "Find agents with MCP support"
  },
  {
    label: "Get agent details",
    curl: 'curl "https://agents-services.b1ts.dev/api/agents/13445"',
    description: "Fetch full metadata for an agent"
  },
  {
    label: "Check health",
    curl: 'curl "https://agents-services.b1ts.dev/api/agents/13445/health"',
    description: "Verify agent endpoints are responding"
  },
  {
    label: "Registry stats",
    curl: 'curl "https://agents-services.b1ts.dev/api/stats"',
    description: "Get aggregate statistics"
  }
];

export function QuickStart() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[var(--foreground-muted)]" />
          <span className="text-sm font-medium">Quick Start</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[var(--foreground-subtle)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--foreground-subtle)]" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-[var(--foreground-subtle)]">
            Try it now — no setup required:
          </p>

          <div className="space-y-2">
            {EXAMPLES.map((example, index) => (
              <div
                key={example.label}
                className="flex items-center gap-2 p-3 rounded-xl bg-[var(--background)] border border-[var(--surface-border)]"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--foreground-subtle)] mb-1">
                    {example.label}
                  </div>
                  <code className="text-xs font-mono text-[var(--foreground-muted)] break-all">
                    {example.curl}
                  </code>
                </div>
                <button
                  onClick={() => handleCopy(example.curl, index)}
                  className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  title="Copy"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[var(--foreground-subtle)]" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href="/docs/mcp"
              className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] inline-flex items-center gap-1"
            >
              View Full Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/docs/mcp#setup"
              className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] inline-flex items-center gap-1"
            >
              Add to Your Agent
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Integration in page.tsx:**
```tsx
import { QuickStart } from "@/components/QuickStart";

// In HomeContent, add after search bar and before results:
<div className="mt-6">
  <QuickStart />
</div>
```

## Part 2: Inline TryIt on Agent Cards

**Goal:** Expand agent cards to show "Try It" inline without navigating away.

**Design:**
```
┌─────────────────────────────────────────────────────────────┐
│  🤖 DeFi Assistant                                    [▶ Try]│
│  Agent #13445                                               │
│  Description text here...                                   │
│                                                             │
│  [MCP ✓] [A2A] [Healthy ●]                                  │
│  Tools: swap_tokens, get_price, estimate_gas                │
└─────────────────────────────────────────────────────────────┘

When [Try] clicked, expands to:

┌─────────────────────────────────────────────────────────────┐
│  🤖 DeFi Assistant                                   [▲ Hide]│
│  Agent #13445                                               │
│  ...                                                        │
├─────────────────────────────────────────────────────────────┤
│  Try it out                                                 │
│                                                             │
│  Endpoint: https://agent-endpoint.com/mcp                   │
│                                                             │
│  Tool: [swap_tokens ▼]                                      │
│                                                             │
│  Parameters:                                                │
│  ┌─────────────┬─────────────────────────┐                  │
│  │ tokenIn     │ USDC                    │                  │
│  │ tokenOut    │ ETH                     │                  │
│  │ amount      │ 100                     │  [+ Add param]   │
│  └─────────────┴─────────────────────────┘                  │
│                                                             │
│  [Execute ▶]                                                │
│                                                             │
│  Response:                                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ { "status": "success", "quote": "0.05 ETH" }        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**

Modify `src/components/AgentCard.tsx`:

1. Add state for expansion
2. Add TryIt section (can reuse logic from TryItModule)
3. Keep collapsed state clean

Key additions:
```tsx
const [isExpanded, setIsExpanded] = useState(false);
const [selectedTool, setSelectedTool] = useState("");
const [params, setParams] = useState<{key: string, value: string}[]>([]);
const [result, setResult] = useState<any>(null);
const [isExecuting, setIsExecuting] = useState(false);

// Find MCP endpoint from services
const mcpEndpoint = agent.services?.find(s => /mcp/i.test(s.name))?.endpoint;
const tools = agent.mcpTools ?? [];
```

## Part 3: Agent Card Enhancements

While modifying AgentCard, also improve:

1. **Show tools/skills preview** (first 3, then "+N more")
2. **Health badge** (reuse HealthBadge component)
3. **Clickable tags** that filter search
4. **Better rating display** (stars, not just number)

## Testing

1. Homepage loads with QuickStart visible
2. Copy buttons work
3. Agent cards expand on click
4. Execute sends correct request
5. Response displays properly
6. Works on mobile (responsive)

## Files to Modify

- [ ] `src/components/QuickStart.tsx` (new)
- [ ] `src/components/AgentCard.tsx` (modify)
- [ ] `src/app/page.tsx` (integrate QuickStart)
- [ ] `src/components/index.ts` (export QuickStart)
