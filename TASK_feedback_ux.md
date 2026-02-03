# Task: Feedback & Reputation UX

## Objective
Enhance feedback display to build trust, and provide clear paths to leave feedback.

## Part 1: Enhanced Feedback Section

**Location:** `src/components/AgentDetail/FeedbackSection.tsx`

**Current:** Basic list of feedback items
**Target:** Rich feedback display with ratings, filters, and action buttons

**Design:**
```
┌─────────────────────────────────────────────────────────────┐
│  Reputation                                                 │
│                                                             │
│  ★★★★☆  4.2 average  •  23 reviews                         │
│                                                             │
│  Filter: [All] [5★] [4★] [3★] [2★] [1★]                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ★★★★★  5.0                          2 days ago     │    │
│  │  Tags: fast-response, accurate                      │    │
│  │  0x1234...5678                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ★★★★☆  4.0                          1 week ago     │    │
│  │  Tags: helpful                                      │    │
│  │  0xabcd...ef01                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [Load more]                                                │
│                                                             │
│  ────────────────────────────────────────────────────────── │
│                                                             │
│  [Leave Feedback →]                                         │
│  Submit feedback on-chain via the ReputationRegistry        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
"use client";

import { useState, useMemo } from "react";
import { Star, ExternalLink, MessageSquare } from "lucide-react";

interface FeedbackItem {
  client: string;
  rating: number;
  tags?: string[];
  createdAt: string;
  isRevoked?: boolean;
}

interface FeedbackSectionProps {
  items: FeedbackItem[];
  avgRating?: number | null;
  agentId?: string;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const stars = Array(5).fill(0).map((_, i) => i < Math.round(rating));
  const sizeClass = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((filled, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            filled 
              ? "fill-yellow-400 text-yellow-400" 
              : "fill-none text-[var(--foreground-subtle)]"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(Number(dateStr) * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function FeedbackSection({ items, avgRating, agentId }: FeedbackSectionProps) {
  const [filter, setFilter] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const filteredItems = useMemo(() => {
    let result = items.filter(item => !item.isRevoked);
    if (filter !== null) {
      result = result.filter(item => Math.round(item.rating) === filter);
    }
    return result;
  }, [items, filter]);
  
  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 5);
  const hasMore = filteredItems.length > 5;
  
  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    items.filter(i => !i.isRevoked).forEach(item => {
      const rounded = Math.round(item.rating);
      if (counts[rounded] !== undefined) counts[rounded]++;
    });
    return counts;
  }, [items]);

  const validItems = items.filter(i => !i.isRevoked);

  return (
    <section className="mt-10">
      <h2 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
        Reputation
      </h2>
      
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
        {/* Summary */}
        <div className="flex items-center gap-4 mb-6">
          <StarRating rating={avgRating ?? 0} size="lg" />
          <div>
            <span className="text-lg font-semibold text-[var(--foreground)]">
              {avgRating?.toFixed(1) ?? "—"}
            </span>
            <span className="text-sm text-[var(--foreground-subtle)] ml-1">
              average
            </span>
          </div>
          <span className="text-sm text-[var(--foreground-subtle)]">
            • {validItems.length} {validItems.length === 1 ? "review" : "reviews"}
          </span>
        </div>
        
        {/* Filters */}
        {validItems.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter(null)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filter === null
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "bg-[var(--background)] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
              }`}
            >
              All ({validItems.length})
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilter(filter === rating ? null : rating)}
                disabled={ratingCounts[rating] === 0}
                className={`px-3 py-1 rounded-full text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  filter === rating
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--background)] text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
                }`}
              >
                {rating}★ ({ratingCounts[rating]})
              </button>
            ))}
          </div>
        )}
        
        {/* Feedback Items */}
        {displayItems.length > 0 ? (
          <div className="space-y-3">
            {displayItems.map((item, index) => (
              <div
                key={`${item.client}-${index}`}
                className="p-4 rounded-xl bg-[var(--background)] border border-[var(--surface-border)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={item.rating} />
                  <span className="text-xs text-[var(--foreground-subtle)]">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.filter(Boolean).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-[var(--surface)] text-xs text-[var(--foreground-subtle)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <a
                  href={`https://etherscan.io/address/${item.client}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] font-mono"
                >
                  {truncateAddress(item.client)}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[var(--foreground-subtle)]">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No feedback yet</p>
          </div>
        )}
        
        {/* Load More */}
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 text-sm text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
          >
            Show all {filteredItems.length} reviews
          </button>
        )}
        
        {/* Leave Feedback CTA */}
        <div className="mt-6 pt-6 border-t border-[var(--surface-border)]">
          <a
            href={`https://etherscan.io/address/0x...#writeContract`} // TODO: actual contract address
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            Leave Feedback
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
            Submit feedback on-chain via the ReputationRegistry contract
          </p>
        </div>
      </div>
    </section>
  );
}
```

## Part 2: Rating Display on Agent Cards

Add star rating to AgentCard when agent has feedback:

```tsx
// In AgentCard.tsx
{agent.feedbackCount > 0 && (
  <div className="flex items-center gap-1 text-xs">
    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
    <span className="text-[var(--foreground-muted)]">
      {agent.avgRating?.toFixed(1)}
    </span>
    <span className="text-[var(--foreground-subtle)]">
      ({agent.feedbackCount})
    </span>
  </div>
)}
```

## Part 3: Feedback API Documentation

Update llms.txt to include feedback info:

```
## Feedback / Reputation

Each agent has on-chain reputation:
- GET /agents/:id includes feedbackCount and avgRating
- Feedback is submitted via ReputationRegistry contract
- Rating scale: 1-5 (stored as value with decimals)
- Tags: tag1, tag2 for categorization

Feedback fields:
- value: Rating value (e.g., 4500000 = 4.5 with 6 decimals)
- tag1, tag2: Optional categorization tags
- endpoint: Which endpoint was used
- feedbackURI: Optional link to detailed feedback
```

## Testing

1. Feedback section displays correctly
2. Star ratings render properly
3. Filters work
4. Empty state shows when no feedback
5. Load more works
6. External links work
7. Dates format correctly

## Files to Modify

- [ ] `src/components/AgentDetail/FeedbackSection.tsx` (rewrite)
- [ ] `src/components/AgentCard.tsx` (add rating display)
- [ ] `src/lib/api.ts` (ensure feedback types are correct)
