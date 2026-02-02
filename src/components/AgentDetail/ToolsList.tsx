"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ToolsListProps {
  title: string;
  items?: string[] | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      onClick={handleCopy} 
      className="p-1 rounded hover:bg-[var(--surface-hover)] transition-colors opacity-0 group-hover:opacity-100"
      title="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-[var(--foreground-subtle)]" />}
    </button>
  );
}

export function ToolsList({ title, items }: ToolsListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item}
            className="group flex items-center justify-between p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--surface-border)]"
          >
            <code className="text-sm font-mono text-[var(--foreground-muted)]">
              {item}
            </code>
            <CopyButton text={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
