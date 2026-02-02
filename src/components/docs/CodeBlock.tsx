"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "text", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--surface-border)] bg-[var(--background-subtle)]">
        <div className="flex items-center gap-3 text-xs text-[var(--foreground-subtle)]">
          <span className="font-medium text-[var(--foreground-muted)]">
            {filename || "Snippet"}
          </span>
          <span className="uppercase tracking-wide">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="text-xs text-[var(--foreground-subtle)] bg-[var(--background-subtle)] px-4 py-4 overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
