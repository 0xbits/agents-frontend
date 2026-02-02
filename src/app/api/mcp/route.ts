import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import * as z from "zod/v4";
import {
  getAgentTool,
  getAgentToolsTool,
  getMcpConfigTool,
  getStatsTool,
  searchAgentsTool,
} from "@/lib/mcp-tools";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SessionEntry = {
  transport: WebSseTransport;
  server: McpServer;
};

const sessions = new Map<string, SessionEntry>();

class WebSseTransport {
  onmessage?: (message: JSONRPCMessage) => void;
  onclose?: () => void;
  onerror?: (error: Error) => void;

  private closed = false;
  private encoder = new TextEncoder();
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private endpoint: string;

  constructor(writer: WritableStreamDefaultWriter<Uint8Array>, endpoint: string) {
    this.writer = writer;
    this.endpoint = endpoint;
  }

  async start() {
    this.sendEvent("endpoint", this.endpoint);
  }

  async send(message: JSONRPCMessage) {
    this.sendEvent("message", JSON.stringify(message));
  }

  async close() {
    if (this.closed) return;
    this.closed = true;
    try {
      await this.writer.close();
    } catch (error) {
      this.onerror?.(error instanceof Error ? error : new Error("SSE writer error"));
    }
    this.onclose?.();
  }

  handleMessage(message: JSONRPCMessage) {
    try {
      this.onmessage?.(message);
    } catch (error) {
      this.onerror?.(error instanceof Error ? error : new Error("SSE message error"));
    }
  }

  private sendEvent(event: string, data: string) {
    if (this.closed) return;
    const payload = `event: ${event}\ndata: ${data}\n\n`;
    void this.writer.write(this.encoder.encode(payload));
  }
}

const createServer = () => {
  const server = new McpServer({
    name: "agents.b1ts.dev",
    version: "1.0.0",
  });

  server.tool(
    "search_agents",
    {
      query: z.string().optional().describe("Search query"),
      has_mcp: z.boolean().optional().describe("Filter to MCP-enabled agents"),
      has_a2a: z.boolean().optional().describe("Filter to A2A-enabled agents"),
      has_x402: z.boolean().optional().describe("Filter to x402-enabled agents"),
      tag: z.string().optional().describe("Filter by tag"),
      limit: z.number().optional().describe("Max results (default 10)"),
    },
    async (input) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(await searchAgentsTool(input), null, 2),
        },
      ],
    })
  );

  server.tool(
    "get_agent",
    {
      id: z.string().describe("Agent ID"),
    },
    async (input) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(await getAgentTool(input), null, 2),
        },
      ],
    })
  );

  server.tool(
    "get_agent_tools",
    {
      id: z.string().describe("Agent ID"),
    },
    async (input) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(await getAgentToolsTool(input), null, 2),
        },
      ],
    })
  );

  server.tool(
    "get_mcp_config",
    {
      id: z.string().describe("Agent ID"),
    },
    async (input) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(await getMcpConfigTool(input), null, 2),
        },
      ],
    })
  );

  server.tool("get_stats", {}, async () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(await getStatsTool(), null, 2),
      },
    ],
  }));

  return server;
};

const getSessionId = (requestUrl: URL) =>
  requestUrl.searchParams.get("sessionId") ?? requestUrl.searchParams.get("session_id");

export async function GET(request: Request) {
  // Use headers to construct proper public URL (request.url may be localhost in SSR)
  const host = request.headers.get("host") || "agents.b1ts.dev";
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const sessionId = crypto.randomUUID();
  const endpointUrl = new URL(`${proto}://${host}/api/mcp`);
  endpointUrl.searchParams.set("sessionId", sessionId);

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();

  const transport = new WebSseTransport(writer, endpointUrl.toString());
  transport.onclose = () => {
    sessions.delete(sessionId);
  };
  transport.onerror = () => {
    sessions.delete(sessionId);
  };
  const server = createServer();
  await server.connect(transport);
  sessions.set(sessionId, { transport, server });

  request.signal.addEventListener("abort", () => {
    const session = sessions.get(sessionId);
    if (!session) return;
    void session.transport.close();
    sessions.delete(sessionId);
  });

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  return new Response(readable, { status: 200, headers });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const sessionId = getSessionId(requestUrl);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing sessionId query parameter." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  let message: JSONRPCMessage;
  try {
    message = (await request.json()) as JSONRPCMessage;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  session.transport.handleMessage(message);
  return new Response(null, { status: 202 });
}
