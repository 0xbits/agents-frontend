"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Play, Loader2, AlertCircle, CheckCircle, Info, RefreshCw } from "lucide-react";

interface TryItModuleProps {
  mcpEndpoint?: string | null;
  a2aEndpoint?: string | null;
  mcpTools?: string[] | null;
  a2aSkills?: string[] | null;
}

type Mode = "mcp" | "a2a";

interface SchemaProperty {
  type?: string;
  description?: string;
  enum?: string[];
  default?: unknown;
}

interface ToolSchema {
  name: string;
  description?: string;
  inputSchema?: {
    type?: string;
    properties?: Record<string, SchemaProperty>;
    required?: string[];
  };
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
  const [params, setParams] = useState<Record<string, string>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  
  // Schema fetching state
  const [schemas, setSchemas] = useState<ToolSchema[]>([]);
  const [schemasLoading, setSchemaLoading] = useState(false);
  const [schemasError, setSchemasError] = useState<string | null>(null);

  // Fetch tool schemas from MCP endpoint
  const fetchToolSchemas = useCallback(async (endpoint: string) => {
    setSchemaLoading(true);
    setSchemasError(null);
    
    try {
      const request = {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/list",
        params: {},
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Failed to fetch tools");
      }

      const tools = data.result?.tools ?? data.tools ?? [];
      setSchemas(tools);
      
      // Auto-select first tool if none selected
      if (tools.length > 0 && !selectedName) {
        setSelectedName(tools[0].name);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch schemas";
      setSchemasError(message);
      // Fall back to tool names only
      setSchemas([]);
    } finally {
      setSchemaLoading(false);
    }
  }, [selectedName]);

  // Fetch schemas when MCP endpoint changes
  useEffect(() => {
    if (mode === "mcp" && mcpEndpoint) {
      fetchToolSchemas(mcpEndpoint);
    } else {
      setSchemas([]);
    }
  }, [mode, mcpEndpoint, fetchToolSchemas]);

  // Reset params when tool changes
  useEffect(() => {
    setParams({});
    setResult(null);
  }, [selectedName]);

  useEffect(() => {
    if (!mode) return;
    const options = mode === "mcp" 
      ? (schemas.length > 0 ? schemas.map(s => s.name) : mcpTools ?? [])
      : a2aSkills ?? [];
    if (options.length > 0 && !selectedName) {
      setSelectedName(options[0]);
    }
  }, [mode, schemas, mcpTools, a2aSkills, selectedName]);

  useEffect(() => {
    if (!mode && modes.length > 0) {
      setMode(modes[0]);
    }
  }, [mode, modes]);

  if (!mode) return null;

  const endpoint = mode === "mcp" ? mcpEndpoint : a2aEndpoint;
  
  // Get current tool schema
  const currentSchema = schemas.find(s => s.name === selectedName);
  const hasSchema = currentSchema?.inputSchema?.properties;
  
  // Options for dropdown
  const options = mode === "mcp" 
    ? (schemas.length > 0 ? schemas.map(s => s.name) : mcpTools ?? [])
    : a2aSkills ?? [];

  const handleParamChange = (key: string, value: string) => {
    setParams(current => ({ ...current, [key]: value }));
  };

  const buildArguments = () => {
    const args: Record<string, unknown> = {};
    
    if (hasSchema && currentSchema?.inputSchema?.properties) {
      // Use schema to properly type params
      for (const [key, prop] of Object.entries(currentSchema.inputSchema.properties)) {
        const value = params[key];
        if (value === undefined || value === "") continue;
        
        // Type coercion based on schema
        if (prop.type === "number" || prop.type === "integer") {
          args[key] = Number(value);
        } else if (prop.type === "boolean") {
          args[key] = value === "true";
        } else if (prop.type === "array") {
          try {
            args[key] = JSON.parse(value);
          } catch {
            args[key] = value.split(",").map(s => s.trim());
          }
        } else if (prop.type === "object") {
          try {
            args[key] = JSON.parse(value);
          } catch {
            args[key] = value;
          }
        } else {
          args[key] = value;
        }
      }
    } else {
      // Manual mode - just use string values
      for (const [key, value] of Object.entries(params)) {
        if (key.trim() && value) {
          args[key.trim()] = value;
        }
      }
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
          headers: { "Content-Type": "application/json" },
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
        // A2A
        const request = {
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tasks/send",
          params: {
            message: {
              role: "user",
              parts: [{
                type: "text",
                text: JSON.stringify({
                  skill: selectedName,
                  arguments: buildArguments(),
                }),
              }],
            },
          },
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

  // Render schema-driven form field
  const renderSchemaField = (key: string, prop: SchemaProperty) => {
    const isRequired = currentSchema?.inputSchema?.required?.includes(key);
    const value = params[key] ?? "";
    
    return (
      <div key={key} className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
          <span className="font-mono">{key}</span>
          {isRequired && <span className="text-red-400">*</span>}
          {prop.type && (
            <span className="text-[var(--foreground-subtle)]">({prop.type})</span>
          )}
        </label>
        {prop.description && (
          <p className="text-xs text-[var(--foreground-subtle)] mb-1">{prop.description}</p>
        )}
        {prop.enum ? (
          <select
            value={value}
            onChange={(e) => handleParamChange(key, e.target.value)}
            className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--foreground)]"
          >
            <option value="">Select...</option>
            {prop.enum.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : prop.type === "boolean" ? (
          <select
            value={value}
            onChange={(e) => handleParamChange(key, e.target.value)}
            className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--foreground)]"
          >
            <option value="">Select...</option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        ) : (
          <input
            type={prop.type === "number" || prop.type === "integer" ? "number" : "text"}
            value={value}
            onChange={(e) => handleParamChange(key, e.target.value)}
            placeholder={prop.default !== undefined ? String(prop.default) : `Enter ${key}`}
            className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--foreground)] font-mono"
          />
        )}
      </div>
    );
  };

  // Render manual param input (fallback)
  const renderManualParams = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[var(--foreground-subtle)]">
          Parameters
        </span>
        <button
          type="button"
          onClick={() => {
            const newKey = `param${Object.keys(params).length + 1}`;
            setParams(current => ({ ...current, [newKey]: "" }));
          }}
          className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
        >
          + Add parameter
        </button>
      </div>
      <div className="space-y-2">
        {Object.entries(params).map(([key, value], index) => (
          <div key={`param-${index}`} className="flex items-center gap-2">
            <input
              type="text"
              value={key}
              onChange={(e) => {
                const newParams = { ...params };
                delete newParams[key];
                newParams[e.target.value] = value;
                setParams(newParams);
              }}
              placeholder="parameter"
              className="flex-1 rounded-lg border border-[var(--surface-border)] bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--foreground)] font-mono"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleParamChange(key, e.target.value)}
              placeholder="value"
              className="flex-1 rounded-lg border border-[var(--surface-border)] bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--foreground)]"
            />
            <button
              type="button"
              onClick={() => {
                const newParams = { ...params };
                delete newParams[key];
                setParams(newParams);
              }}
              className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] px-2"
            >
              ×
            </button>
          </div>
        ))}
        {Object.keys(params).length === 0 && (
          <p className="text-xs text-[var(--foreground-subtle)] italic">
            No parameters configured. Click &quot;+ Add parameter&quot; to add one.
          </p>
        )}
      </div>
    </div>
  );

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
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-wider text-[var(--foreground-subtle)]">
              Select {mode === "mcp" ? "tool" : "skill"}
            </label>
            {mode === "mcp" && mcpEndpoint && (
              <button
                type="button"
                onClick={() => fetchToolSchemas(mcpEndpoint)}
                disabled={schemasLoading}
                className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] inline-flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${schemasLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
          </div>
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
          
          {/* Tool description */}
          {currentSchema?.description && (
            <p className="text-xs text-[var(--foreground-subtle)] flex items-start gap-2 mt-2">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {currentSchema.description}
            </p>
          )}
        </div>

        {/* Schema status */}
        {mode === "mcp" && schemasError && (
          <div className="text-xs text-amber-500 flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Schema fetch failed: {schemasError}. Using manual input.
          </div>
        )}

        {/* Parameters - schema-driven or manual */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider text-[var(--foreground-subtle)]">
            Parameters
            {hasSchema && (
              <span className="ml-2 text-green-500 font-normal normal-case">
                ✓ schema loaded
              </span>
            )}
          </span>
          
          {hasSchema && currentSchema?.inputSchema?.properties ? (
            <div className="space-y-4">
              {Object.entries(currentSchema.inputSchema.properties).map(([key, prop]) =>
                renderSchemaField(key, prop)
              )}
            </div>
          ) : (
            renderManualParams()
          )}
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
