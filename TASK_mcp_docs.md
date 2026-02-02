# TASK: MCP Documentation Page

## Goal
Create a `/docs/mcp` page explaining how to use the MCP server with Claude Desktop, Cursor, and OpenClaw.

## Create New File: `src/app/docs/mcp/page.tsx`

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Terminal, MessageSquare, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "MCP Setup | agents.b1ts.dev",
  description: "Connect your AI to the agent registry via MCP",
};

// Page content below
```

## Page Structure

### Header
- Back link to homepage
- Title: "Connect via MCP"
- Subtitle: "Add the agent registry to your AI assistant in 2 minutes"

### Section 1: What is MCP?
Brief explanation:
- Model Context Protocol — standard for AI tool integration
- Lets Claude/Cursor/OpenClaw discover and use tools
- Our MCP server exposes the agent registry as searchable tools

### Section 2: Quick Setup

**Tabs or sections for each client:**

#### Claude Desktop
```json
// Add to ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "8004-registry": {
      "url": "https://agents-services.b1ts.dev/mcp",
      "transport": "sse"
    }
  }
}
```
Instructions:
1. Open Claude Desktop settings
2. Edit config file (show path for Mac/Windows/Linux)
3. Add the config
4. Restart Claude Desktop

#### Cursor
```json
// Add to ~/.cursor/mcp.json
{
  "mcpServers": {
    "8004-registry": {
      "url": "https://agents-services.b1ts.dev/mcp",
      "transport": "sse"
    }
  }
}
```

#### OpenClaw
```yaml
# Add to ~/.openclaw/config.yaml under mcpServers:
mcpServers:
  8004-registry:
    url: https://agents-services.b1ts.dev/mcp
    transport: sse
```

### Section 3: Available Tools

Table or cards showing each tool:

| Tool | Description | Example |
|------|-------------|---------|
| `search_agents` | Search agents by query, tags, or capabilities | "Find DeFi agents with MCP" |
| `get_agent` | Get detailed info about a specific agent | "Get agent 12345" |
| `get_agent_tools` | List tools/skills from an agent | "What tools does agent 123 have?" |
| `get_agent_health` | Check if agent endpoint is healthy | "Is agent 456 online?" |
| `get_stats` | Get registry statistics | "How many agents are indexed?" |

### Section 4: Example Prompts

Show real prompts users can try:
- "Search for agents that can do trading"
- "Find all agents with A2A skills"
- "Get details on agent 12345"
- "Which payment agents accept x402?"
- "How many MCP agents are in the registry?"

### Section 5: Troubleshooting

Common issues:
- "Tools not showing up" → Restart client, check config path
- "Connection failed" → Check URL, try curl to verify
- "No results" → Try broader search terms

## Styling
- Match existing site style (dark theme, subtle borders)
- Use code blocks with copy buttons
- Lucide icons for visual interest
- Responsive layout

## Components to Create

`src/components/docs/CodeBlock.tsx`:
```tsx
// Reusable code block with copy button
interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}
```

`src/components/docs/SetupTabs.tsx`:
```tsx
// Tabs for Claude/Cursor/OpenClaw setup
// Client-side component with useState for active tab
```

## Navigation

Add "Docs" link to header nav in `page.tsx`:
```tsx
<a href="/docs/mcp" className="...">
  Docs
</a>
```

## Files to Create
- `src/app/docs/mcp/page.tsx` — main docs page
- `src/components/docs/CodeBlock.tsx` — code block with copy
- `src/components/docs/SetupTabs.tsx` — client setup tabs

## Files to Modify
- `src/app/page.tsx` — add Docs link to nav
- `src/components/AccessMethods.tsx` — change MCP href to `/docs/mcp`

## Testing
1. `/docs/mcp` page loads
2. Copy buttons work
3. All client configs are correct
4. Back link works
5. Mobile responsive
6. Header nav includes Docs link
