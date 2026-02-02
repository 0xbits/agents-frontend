"use client";

import { useMemo, useState, useEffect } from "react";
import { Play, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface TryItModuleProps {
  mcpEndpoint?: string | null;
  a2aEndpoint?: string | null;
  mcpTools?: string[] | null;
  a2aSkills?: string[] | null;
}

type Mode = "mcp" | "a2a";

interface ParamRow {
  key: string;
  value: string;
}

interface ExecutionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  latencyMs?: number;
}

export function TryItModule({
  mcpEndpoint,
  a2aEndpoint,
  mcpTools,
  a2aSkills,
}: TryItModuleProps) {
  const modes = useMemo(() => {
    const available: Mode[] = [];
    if (mcpEndpoint) available.push("mcp");
    if (a2aEndpoint) available.push("a2a");
    return available;
  }, [mcpEndpoint, a2aEndpoint]);

  const [mode, setMode] = useState<Mode | null>(modes[0] ?? null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [params, setParams] = useState<ParamRow[]>([{ key: "", value: "" }]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  useEffect(() => {
    if (!mode) return;
    const options = mode === "mcp" ? mcpTools ?? [] : a2aSkills ?? [];
    setSelectedName(options[0] ?? "");
    setResult(null);
  }, [mode, mcpTools, a2aSkills]);

  useEffect(() => {
    if (!mode && modes.length > 0) {
      setMode(modes[0]);
    }
  }, [mode, modes]);

  if (!mode) return null;

  const options = mode === "mcp" ? mcpTools ?? [] : a2aSkills ?? [];
  const endpoint = mode === "mcp" ? mcpEndpoint : a2aEndpoint;

  const handleParamChange = (index: number, field: "key" | "value", value: string) => {
    setParams((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addParamRow = () => {
    setParams((current) => [...current, { key: "", value: "" }]);
  };

  const removeParamRow = (index: number) => {
    setParams((current) => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const buildArguments = () => {
    const args: Record<string, string> = {};
    for (const row of params) {
      if (row.key.trim().length === 0) continue;
      args[row.key.trim()] = row.value;
    }
    return args;
  };

  const executeRequest = async () => {
    if (!endpoint || !selectedName) return;
    
    setIsExecuting(true);
    setResult(null);
    
    const startTime = performance.now();
    
    try {
      if (mode === "mcp") {
        // MCP uses JSON-RPC over HTTP POST
        const request = {
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: selectedName,
            arguments: buildArguments(),
          },
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        const latencyMs = Math.round(performance.now() - startTime);

        if (!response.ok) {
          const errorText = await response.text();
          setResult({
            success: false,
            error: `HTTP ${response.status}: ${errorText || response.statusText}`,
            latencyMs,
          });
          return;
        }

        const data = await response.json();
        
        if (data.error) {
          setResult({
            success: false,
            error: data.error.message || JSON.stringify(data.error),
            latencyMs,
          });
        } else {
          setResult({
            success: true,
            data: data.result ?? data,
            latencyMs,
          });
        }
      } else {
        // A2A uses JSON-RPC style as well
        const request = {
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tasks/send",
          params: {
            message: {
              role: "user",
              parts: [
                {
                  type: "text",
                  text: JSON.stringify({
                    skill: selectedName,
                    arguments: buildArguments(),
                  }),
                },
              ],
            },
          },
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        const latencyMs = Math.round(performance.now() - startTime);

        if (!response.ok) {
          const errorText = await response.text();
          setResult({
            success: false,
            error: `HTTP ${response.status}: ${errorText || response.statusText}`,
            latencyMs,
          });
          return;
        }

        const data = await response.json();
        
        if (data.error) {
          setResult({
            success: false,
            error: data.error.message || JSON.stringify(data.error),
            latencyMs,
          });
        } else {
          setResult({
            success: true,
            data: data.result ?? data,
            latencyMs,
          });
        }
      }
    } catch (err) {
      const latencyMs = Math.round(performance.now() - startTime);
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Request failed",
        latencyMs,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getRequestPreview = () => {
    if (mode === "mcp") {
      return {
        jsonrpc: "2.0",
        id: "...",
        method: "tools/call",
        params: {
          name: selectedName,
          arguments: buildArguments(),
        },
      };
    } else {
      return {
        jsonrpc: "2.0",
        id: "...",
        method: "tasks/send",
        params: {
          message: {
            role: "user",
            parts: [{ type: "text", text: `{skill: "${selectedName}", ...}` }],
          },
        },
      };
    }
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
          Try it out
        </h2>
        {result?.latencyMs !== undefined && (
          <span className="text-xs text-[var(--foreground-subtle)]">
            {result.latencyMs}ms
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--foreground-subtle)]">
          <span className="uppercase tracking-wider text-xs">Endpoint</span>
          <span className="text-[var(--foreground-muted)] break-all font-mono text-xs">{endpoint}</span>
        </div>

        {modes.length > 1 && (
          <div className="flex items-center gap-2">
            {modes.map((availableMode) => (
              <button
                key={availableMode}
                type="button"
                onClick={() => setMode(availableMode)}
                className={`
                  rounded-full border px-3 py-1 text-xs uppercase tracking-wider
                  transition-colors
                  ${
                    mode === availableMode
                      ? "border-[var(--surface-border-hover)] text-[var(--foreground)]"
                      : "border-[var(--surface-border)] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
                  }
                `}
              >
                {availableMode}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-[var(--foreground-subtle)]">
            Select {mode === "mcp" ? "tool" : "skill"}
          </label>
          <select
            value={selectedName}
            onChange={(event) => {
              setSelectedName(event.target.value);
              setResult(null);
            }}
            className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--background-subtle)] px-4 py-3 text-sm text-[var(--foreground)]"
          >
            {options.length === 0 ? (
              <option value="">No options available</option>
            ) : (
              options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[var(--foreground-subtle)]">
              Parameters
            </span>
            <button
              type="button"
              onClick={addParamRow}
              className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
            >
              + Add parameter
            </button>
          </div>
          <div className="space-y-2">
            {params.map((row, index) => (
              <div key={`param-${index}`} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.key}
                  onChange={(event) => handleParamChange(index, "key", event.target.value)}
                  placeholder="parameter"
                  className="flex-1 rounded-lg border border-[var(--surface-border)] bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--foreground)] font-mono"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(event) => handleParamChange(index, "value", event.target.value)}
                  placeholder="value"
                  className="flex-1 rounded-lg border border-[var(--surface-border)] bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--foreground)]"
                />
                {params.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParamRow(index)}
                    className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] px-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={executeRequest}
            disabled={!selectedName || isExecuting}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Execute
              </>
            )}
          </button>
          <span className="text-xs text-[var(--foreground-subtle)]">
            POST to {mode === "mcp" ? "MCP" : "A2A"} endpoint
          </span>
        </div>

        {/* Request Preview */}
        <details className="group">
          <summary className="text-xs text-[var(--foreground-subtle)] cursor-pointer hover:text-[var(--foreground-muted)]">
            Show request body
          </summary>
          <pre className="mt-2 rounded-xl border border-[var(--surface-border)] bg-[var(--background-subtle)] p-4 text-xs text-[var(--foreground-subtle)] whitespace-pre-wrap overflow-x-auto font-mono">
            {JSON.stringify(getRequestPreview(), null, 2)}
          </pre>
        </details>

        {/* Response */}
        {result && (
          <div className={`rounded-xl border p-4 ${
            result.success 
              ? "border-green-500/30 bg-green-500/5" 
              : "border-red-500/30 bg-red-500/5"
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {result.success ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Success</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">Error</span>
                </>
              )}
            </div>
            <pre className="text-xs whitespace-pre-wrap overflow-x-auto font-mono text-[var(--foreground-muted)]">
              {result.success 
                ? JSON.stringify(result.data, null, 2)
                : result.error
              }
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
