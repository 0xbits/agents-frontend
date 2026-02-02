"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, Star } from "lucide-react";

interface AgentHeroProps {
  name?: string | null;
  id: string;
  image?: string | null;
  description?: string | null;
  externalUrl?: string | null;
  registrationDate?: string;
  etherscanUrl?: string | null;
  avgRating?: number | null;
  feedbackCount?: number;
}

export function AgentHero({
  name,
  id,
  image,
  description,
  externalUrl,
  registrationDate,
  etherscanUrl,
  avgRating,
  feedbackCount,
}: AgentHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const interfaceUrl = etherscanUrl
    ? etherscanUrl.replace('etherscan.io', 'app.interface.social').replace('/address/', '/')
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-[var(--foreground-subtle)]">
          <a href="/" className="hover:text-[var(--foreground-muted)] transition-colors">
            ← Back
          </a>
          {interfaceUrl && (
            <>
              <a
                href={interfaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--foreground-muted)] transition-colors"
              >
                Interface
              </a>
              <span className="text-[var(--surface-border)]">·</span>
              <a
                href={etherscanUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--foreground-muted)] transition-colors"
              >
                Etherscan
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] px-4 py-2 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--surface-border-hover)] transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Share"}
        </button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-6 md:flex-row md:items-start flex-1">
          <div
            className="h-20 w-20 shrink-0 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-hover)] flex items-center justify-center text-2xl font-medium text-[var(--foreground-muted)]"
            aria-label={name || `Agent #${id}`}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name || `Agent #${id}`}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <span>{name?.charAt(0)?.toUpperCase() || "#"}</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--foreground)]">
                {name || `Agent #${id}`}
              </h1>
            </div>
            <p className="text-sm text-[var(--foreground-subtle)] font-mono mt-1">#{id}</p>

            {description && (
              <p className="mt-4 text-base leading-relaxed text-[var(--foreground-muted)]">
                {description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-subtle)]">
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--foreground-muted)] transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {externalUrl}
                </a>
              )}
              {registrationDate && <span>Registered {registrationDate}</span>}
            </div>
          </div>
        </div>

        {/* Reputation in Hero (right side) */}
        <div className="md:ml-8 p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] min-w-[140px]">
          <h3 className="text-xs text-[var(--foreground-subtle)] uppercase tracking-wider mb-3">
            Reputation
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[var(--foreground-muted)]" />
              <span className="text-lg font-medium text-[var(--foreground)]">
                {avgRating != null ? avgRating.toFixed(1) : "—"}
              </span>
            </div>
            <div className="text-sm text-[var(--foreground-subtle)]">
              {feedbackCount ?? 0} {(feedbackCount ?? 0) === 1 ? "review" : "reviews"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
