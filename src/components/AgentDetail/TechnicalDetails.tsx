"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface TechnicalDetailsProps {
  owner: string;
  wallet?: string | null;
  registeredBlock: string;
  metadataUpdatedAt?: string | null;
  uri?: string | null;
}

const formatTimestamp = (value?: string | null) => {
  if (!value) return "";
  const ts = Number(value);
  if (Number.isNaN(ts)) return value;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts * 1000));
};

export function TechnicalDetails({
  owner,
  wallet,
  registeredBlock,
  metadataUpdatedAt,
  uri,
}: TechnicalDetailsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(owner);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mt-12">
      <details className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
        <summary className="cursor-pointer text-sm font-medium text-[var(--foreground)]">
          Technical Details
        </summary>
        <div className="mt-4 space-y-3 text-sm text-[var(--foreground-muted)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--foreground-subtle)]">Owner</span>
            <code className="text-xs text-[var(--foreground-muted)] break-all">{owner}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--surface-border)] px-2 py-1 text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          {wallet && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[var(--foreground-subtle)]">Wallet</span>
              <code className="text-xs text-[var(--foreground-muted)] break-all">{wallet}</code>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--foreground-subtle)]">Registered block</span>
            <span>{registeredBlock}</span>
          </div>
          {metadataUpdatedAt && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[var(--foreground-subtle)]">Metadata updated</span>
              <span>{formatTimestamp(metadataUpdatedAt)}</span>
            </div>
          )}
          {uri && (
            <div className="flex flex-col gap-1">
              <span className="text-[var(--foreground-subtle)]">Raw URI</span>
              <code className="text-xs text-[var(--foreground-muted)] break-all">{uri}</code>
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
