"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "./CodeBlock";

const CLAUDE_CONFIG = `{
  "mcpServers": {
    "8004-registry": {
      "url": "https://agents-services.b1ts.dev/mcp",
      "transport": "sse"
    }
  }
}`;

const CURSOR_CONFIG = `{
  "mcpServers": {
    "8004-registry": {
      "url": "https://agents-services.b1ts.dev/mcp",
      "transport": "sse"
    }
  }
}`;

const OPENCLAW_CONFIG = `mcpServers:
  8004-registry:
    url: https://agents-services.b1ts.dev/mcp
    transport: sse
`;

const TABS = [
  {
    id: "claude",
    label: "Claude Desktop",
    filename: "claude_desktop_config.json",
    language: "json",
    code: CLAUDE_CONFIG,
    paths: [
      "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
      "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
      "Linux: ~/.config/Claude/claude_desktop_config.json",
    ],
    steps: [
      "Open Claude Desktop settings.",
      "Open the config file at the path above.",
      "Add the MCP server block and save.",
      "Restart Claude Desktop to load tools.",
    ],
  },
  {
    id: "cursor",
    label: "Cursor",
    filename: "mcp.json",
    language: "json",
    code: CURSOR_CONFIG,
    paths: ["~/.cursor/mcp.json"],
    steps: [
      "Open Cursor settings and locate MCP config.",
      "Create the file if it does not exist.",
      "Paste the MCP server block and save.",
      "Restart Cursor to refresh tool discovery.",
    ],
  },
  {
    id: "openclaw",
    label: "OpenClaw",
    filename: "config.yaml",
    language: "yaml",
    code: OPENCLAW_CONFIG,
    paths: ["~/.openclaw/config.yaml"],
    steps: [
      "Open your OpenClaw config file.",
      "Add the MCP server under mcpServers.",
      "Save and restart OpenClaw.",
    ],
  },
];

export function SetupTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const current = useMemo(() => TABS.find((tab) => tab.id === active) ?? TABS[0], [active]);

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors border ${
              active === tab.id
                ? "bg-[var(--background)] text-[var(--foreground)] border-[var(--surface-border-hover)]"
                : "text-[var(--foreground-subtle)] border-transparent hover:border-[var(--surface-border)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Config file</h3>
            <ul className="mt-2 space-y-1 text-xs text-[var(--foreground-subtle)]">
              {current.paths.map((path) => (
                <li key={path}>{path}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Steps</h3>
            <ol className="mt-2 space-y-2 text-xs text-[var(--foreground-subtle)]">
              {current.steps.map((step, index) => (
                <li key={step}>{`${index + 1}. ${step}`}</li>
              ))}
            </ol>
          </div>
        </div>

        <CodeBlock
          code={current.code}
          language={current.language}
          filename={current.filename}
        />
      </div>
    </div>
  );
}
