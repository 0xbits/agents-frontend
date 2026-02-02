# TASK: Copy MCP/A2A Config Button

## Overview
Add one-click buttons to copy ready-to-use configuration for MCP and A2A endpoints.

## Why
Users see an MCP endpoint but still need to manually construct config JSON. Reduce friction to zero.

## Requirements

### MCP Config Button
On agent detail page, for agents with MCP service, show:
```
[📋 Copy MCP Config]
```

Clicking copies to clipboard:
```json
{
  "mcpServers": {
    "gekko": {
      "url": "https://www.gekkoterminal.xyz/mcp",
      "transport": "sse"
    }
  }
}
```

### A2A Config Button  
For agents with A2A service:
```
[📋 Copy A2A Endpoint]
```

Copies:
```json
{
  "name": "Gekko",
  "url": "https://www.gekkoterminal.xyz/.well-known/agent-card.json",
  "skills": ["portfolio_management", "token_analysis"]
}
```

### OpenClaw Config Button
Generate OpenClaw-compatible MCP config:
```
[📋 Copy for OpenClaw]
```

Copies:
```yaml
mcp:
  servers:
    gekko:
      url: https://www.gekkoterminal.xyz/mcp
```

## Implementation

### New Component: `src/components/AgentDetail/CopyConfigButtons.tsx`

```typescript
interface CopyConfigButtonsProps {
  agent: Agent;
  mcpEndpoint?: string;
  a2aEndpoint?: string;
}

export function CopyConfigButtons({ agent, mcpEndpoint, a2aEndpoint }: CopyConfigButtonsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyMcpConfig = () => {
    const config = {
      mcpServers: {
        [agent.name?.toLowerCase().replace(/\s+/g, '-') || `agent-${agent.id}`]: {
          url: mcpEndpoint,
          transport: "sse"
        }
      }
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied('mcp');
    setTimeout(() => setCopied(null), 2000);
  };

  // Similar for A2A and OpenClaw...

  return (
    <div className="flex flex-wrap gap-2">
      {mcpEndpoint && (
        <button onClick={copyMcpConfig} className="...">
          {copied === 'mcp' ? '✓ Copied!' : '📋 Copy MCP Config'}
        </button>
      )}
      {a2aEndpoint && (
        <button onClick={copyA2aConfig} className="...">
          {copied === 'a2a' ? '✓ Copied!' : '📋 Copy A2A Config'}
        </button>
      )}
    </div>
  );
}
```

### Integration in Agent Detail Page
Add after the Services section or in the "Try it" module:

```typescript
<CopyConfigButtons
  agent={agent}
  mcpEndpoint={mcpService?.endpoint}
  a2aEndpoint={a2aService?.endpoint}
/>
```

## UI Design
- Small buttons, subtle styling (border, not filled)
- Show checkmark + "Copied!" for 2 seconds after click
- Group together in a row
- Consider dropdown for multiple formats:
  ```
  [📋 Copy Config ▾]
    > Claude Desktop (JSON)
    > OpenClaw (YAML)
    > Raw Endpoint URL
  ```

## Acceptance Criteria
- [ ] MCP config button visible for MCP agents
- [ ] A2A config button visible for A2A agents
- [ ] Click copies valid JSON to clipboard
- [ ] Visual feedback on copy (checkmark/text change)
- [ ] Config uses agent name as key (slugified)

## Files to Create/Modify
- Create `src/components/AgentDetail/CopyConfigButtons.tsx`
- Modify `src/app/agents/[id]/page.tsx` — add component
- Possibly modify `src/components/AgentDetail/TryItModule.tsx` — integrate there

## DO NOT
- Add toast/notification library
- Make async clipboard operations complex
- Break existing Try It module
