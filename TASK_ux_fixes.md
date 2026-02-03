# Task: UX Fixes from Review

## Issues to Fix

### 1. TryIt Module - Parameter Hints
**File:** `src/components/AgentDetail/TryItModule.tsx`

**Problem:** Users don't know which parameters each tool expects.

**Solution:** 
- Fetch tool schema from MCP endpoint (tools have `inputSchema` in JSON-RPC response)
- Display parameter names, types, and whether required
- Pre-populate parameter fields based on schema
- Show placeholder text with expected type (e.g., "address (string, required)")

**Design:**
```
Select tool: [get_portfolio ▼]

Parameters:
┌─────────────────────────────────────────────┐
│ wallet_address (string, required)           │
│ [0x...]                                     │
├─────────────────────────────────────────────┤
│ chain (string, optional)                    │
│ [base]                                      │
└─────────────────────────────────────────────┘
```

### 2. Rating Scale Mismatch
**Files:** 
- `src/components/AgentDetail/FeedbackSection.tsx`
- `src/components/AgentCard.tsx`
- `src/components/AgentDetail/AgentHero.tsx`

**Problem:** Showing 5 stars but ratings are 0-100 scale. Filter buttons say "5★" but no one has rating of 5.

**Solution:**
- Remove star icons entirely OR
- Convert 0-100 to 0-5 scale for display (divide by 20)
- Update filter buttons to use ranges: "90-100", "70-89", "50-69", etc. OR just show score ranges
- Better: Just show the numeric score without stars, it's cleaner for 0-100

**Recommendation:** Show numeric score (e.g., "98") without stars. Simpler, no confusion.

### 3. Leave Feedback Link
**File:** `src/components/AgentDetail/FeedbackSection.tsx`

**Problem:** Links to placeholder `0x...#writeContract`

**Solution:**
- Use real ReputationRegistry contract address: need to find this in the indexer or config
- If no real contract yet, hide the "Leave Feedback" CTA entirely
- Check `~/projects/8004-indexer/ponder.config.ts` for contract addresses

### 4. Card Rating Inconsistency  
**File:** `src/components/AgentCard.tsx`

**Problem:** Some cards show "98.0 (77)" others show "— (129)". Dash when rating is null but feedbackCount exists.

**Solution:**
- If rating is null/undefined, don't show rating section at all
- Only show when both rating AND feedbackCount > 0
- Current code already has `agent.feedbackCount != null && agent.feedbackCount > 0` but rating can still be null

### 5. Remove Redundant MCP Banner
**File:** `src/app/page.tsx`

**Problem:** QuickStart has curl examples, then there's another MCP endpoint section at bottom. Redundant.

**Solution:** Remove the bottom MCP banner section (the one with "Connect your agent to X capabilities via MCP")

### 6. Add x402 Count to Stats
**Files:**
- `src/app/page.tsx` (display)
- `src/lib/api.ts` (if stats endpoint needs update)
- Check if `~/projects/8004-services` stats endpoint includes x402 count

**Solution:** Add x402 count to the stats display alongside MCP and A2A counts.

## Priority Order
1. Rating display fix (most confusing)
2. TryIt parameter hints (most requested)
3. Card inconsistency 
4. Remove MCP banner
5. Add x402 stats
6. Leave Feedback link (hide if no real contract)

## Testing
- Check homepage cards display consistently
- Check agent detail page feedback section
- Test TryIt module shows parameter hints
- Verify stats show x402 count
