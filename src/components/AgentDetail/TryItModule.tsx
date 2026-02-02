"use client";

import { useMemo, useState, useEffect } from "react";

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
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (!mode) return;
    const options = mode === "mcp" ? mcpTools ?? [] : a2aSkills ?? [];
    setSelectedName(options[0] ?? "");
  }, [mode, mcpTools, a2aSkills]);

  useEffect(() => {
    if (!mode && modes.length > 0) {
      setMode(modes[0]);
    }
  }, [mode, modes]);

  if (!mode) return null;

  const options = mode === "mcp" ? mcpTools ?? [] : a2aSkills ?? [];
  const endpoint = mode === "mcp" ? mcpEndpoint : a2aEndpoint;
  const method = mode === "mcp" ? "tools/call" : "skills/call";

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

  const generatePreview = () => {
    const request = {
      method,
      params: {
        name: selectedName,
        arguments: buildArguments(),
      },
    };

    setPreview(JSON.stringify(request, null, 2));
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
          Try it out
        </h2>
      </div>

      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--foreground-subtle)]">
          <span className="uppercase tracking-wider text-xs">Endpoint</span>
          <span className="text-[var(--foreground-muted)] break-all">{endpoint}</span>
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
            onChange={(event) => setSelectedName(event.target.value)}
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
              Add parameter
            </button>
          </div>
          <div className="space-y-2">
            {params.map((row, index) => (
              <div key={`${row.key}-${index}`} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.key}
                  onChange={(event) => handleParamChange(index, "key", event.target.value)}
                  placeholder="parameter"
                  className="flex-1 rounded-lg border border-[var(--surface-border)] bg-[var(--background-subtle)] px-3 py-2 text-sm text-[var(--foreground)]"
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
                    className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={generatePreview}
            disabled={!selectedName}
            className="rounded-xl border border-[var(--surface-border-hover)] px-4 py-2 text-sm text-[var(--foreground)] hover:border-[var(--foreground)] disabled:opacity-50"
          >
            Generate request
          </button>
          <span className="text-xs text-[var(--foreground-subtle)]">
            Preview only — no request sent
          </span>
        </div>

        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--background-subtle)] p-4">
          <pre className="text-xs text-[var(--foreground-subtle)] whitespace-pre-wrap">
            {preview
              ? `POST ${endpoint}\n${preview}`
              : "Generate a request to preview the payload."}
          </pre>
        </div>
      </div>
    </section>
  );
}
