import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Terminal, MessageSquare, Zap } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { SetupTabs } from "@/components/docs/SetupTabs";

export const metadata: Metadata = {
  title: "MCP Setup | agents.b1ts.dev",
  description: "Connect your AI to the agent registry via MCP",
};

const TOOLS = [
  {
    name: "search_agents",
    description: "Search agents by query, tags, or capabilities",
    example: "Find DeFi agents with MCP",
  },
  {
    name: "get_agent",
    description: "Get detailed info about a specific agent",
    example: "Get agent 12345",
  },
  {
    name: "get_agent_tools",
    description: "List tools/skills from an agent",
    example: "What tools does agent 123 have?",
  },
  {
    name: "get_agent_health",
    description: "Check if agent endpoint is healthy",
    example: "Is agent 456 online?",
  },
  {
    name: "get_stats",
    description: "Get registry statistics",
    example: "How many agents are indexed?",
  },
];

const PROMPTS = [
  "Search for agents that can do trading",
  "Find all agents with A2A skills",
  "Get details on agent 12345",
  "Which payment agents accept x402?",
  "How many MCP agents are in the registry?",
];

const TROUBLESHOOTING = [
  {
    title: "Tools not showing up",
    detail: "Restart the client and confirm the config path is correct.",
  },
  {
    title: "Connection failed",
    detail: "Verify the URL and test connectivity with curl.",
  },
  {
    title: "No results",
    detail: "Try broader search terms or remove filters.",
  },
];

export default function McpDocsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex flex-col gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to agents
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Connect via MCP
            </h1>
            <p className="mt-3 text-base text-[var(--foreground-muted)] max-w-2xl">
              Add the agent registry to your AI assistant in 2 minutes.
            </p>
          </div>
        </header>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Model Context Protocol",
              description:
                "A standard that lets AI apps discover and use external tools.",
              icon: Terminal,
            },
            {
              title: "Works across clients",
              description:
                "Claude, Cursor, and OpenClaw can all load the same MCP server.",
              icon: MessageSquare,
            },
            {
              title: "Registry as tools",
              description:
                "Search and query agents as MCP tools from within your assistant.",
              icon: Zap,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-[var(--foreground-muted)]" />
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h2>
                </div>
                <p className="mt-3 text-sm text-[var(--foreground-subtle)]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
              Quick setup
            </h2>
          </div>
          <SetupTabs />
        </section>

        <section className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
              Available tools
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--surface-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface)] text-[var(--foreground-subtle)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Tool</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--background)]">
                {TOOLS.map((tool) => (
                  <tr
                    key={tool.name}
                    className="border-t border-[var(--surface-border)]"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[var(--foreground-muted)]">
                      {tool.name}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground-subtle)]">
                      {tool.description}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground-subtle)]">
                      {tool.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Example prompts
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--foreground-subtle)]">
              {PROMPTS.map((prompt) => (
                <li key={prompt}>• {prompt}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <Copy className="h-4 w-4" />
                Test the connection
              </div>
              <p className="mt-3 text-sm text-[var(--foreground-subtle)]">
                Use curl to confirm the MCP endpoint is reachable.
              </p>
              <div className="mt-4">
                <CodeBlock
                  code={`curl https://agents-services.b1ts.dev/mcp`}
                  language="bash"
                  filename="curl"
                />
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <Check className="h-4 w-4" />
                Ready to build
              </div>
              <p className="mt-3 text-sm text-[var(--foreground-subtle)]">
                Once connected, ask your assistant to search, inspect, and monitor agents.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
              Troubleshooting
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TROUBLESHOOTING.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--foreground-subtle)]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
