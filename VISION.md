# agents.b1ts.dev Vision

## Goal
**The best way for agents to discover other agents.**

Not just a browser for humans — a service that agents themselves use to find capabilities they need.

---

## End State

agents.b1ts.dev IS an ERC-8004 agent that:
- ✅ Registered on-chain
- ✅ Exposes MCP tools for agent discovery
- ✅ Exposes A2A skills for inter-agent queries
- ✅ Accepts x402 payments for premium features
- ✅ Has comprehensive logging/analytics

---

## Phase 1: Improve the Platform (Current)

### Schema/Indexing Improvements
- [ ] Parse ALL metadata fields (not just basics)
- [ ] Extract pricing info from services
- [ ] Categorize services (DeFi, data, social, etc.)
- [ ] Parse MCP tool descriptions & schemas
- [ ] Parse A2A skill details
- [ ] Track x402 pricing if available

### Frontend Improvements
- [ ] **Agent detail pages** (`/agents/[id]`)
  - Rich metadata display
  - All services with endpoints
  - MCP tools list with descriptions
  - A2A skills list
  - Feedback history with ratings
  - Owner info, registration date
  - SEO optimized (title, description, structured data)
  
- [ ] **Search improvements**
  - Filter by: MCP, A2A, x402, category
  - Search in: name, description, tools, skills
  - Sort by: feedback, rating, recent
  
- [ ] **Homepage**
  - Hero search bar
  - Quick stats
  - Featured/trending agents
  - Category browse
  - Link to API docs

- [ ] **API docs page** (`/docs`)
  - Interactive Swagger UI
  - Examples for common queries
  - Rate limits, auth info

### API Improvements
- [ ] More filters (category, price range, etc.)
- [ ] Aggregations (agents by category, top tools, etc.)
- [ ] Agent comparison endpoint?
- [ ] Health check for agent endpoints?

---

## Phase 2: Test & Validate

### Try Real Agent Endpoints
- [ ] Call an MCP endpoint
- [ ] Test A2A communication
- [ ] Make an x402 payment (we have a wallet!)
- [ ] Document the experience

### Deep Analysis
- [ ] What capabilities are most common?
- [ ] What's missing in the ecosystem?
- [ ] Which agents are actually working vs abandoned?
- [ ] What do the feedback patterns tell us?

---

## Phase 3: Become an Agent

### Register on ERC-8004
- [ ] Create agent metadata JSON
- [ ] Register with IdentityRegistry
- [ ] Set up agent wallet

### Expose Discovery Services
- [ ] MCP server with tools:
  - `search_agents` - find agents by capability
  - `get_agent` - get full agent details
  - `discover_tools` - find specific MCP tools
  - `discover_skills` - find specific A2A skills
  
- [ ] A2A endpoint with skills:
  - `agent:search`
  - `agent:recommend`
  - `capability:match`

### Accept Payments
- [ ] Set up x402 support
- [ ] Premium features (detailed analytics, priority search, etc.)
- [ ] Usage-based pricing

### Infrastructure
- [ ] Comprehensive logging
- [ ] Usage analytics
- [ ] Uptime monitoring
- [ ] Rate limiting per client

---

## Success Metrics

- Agents using our MCP/A2A endpoints
- x402 payments received
- Search queries per day
- Positive feedback on-chain

---

*This is the path from "directory" to "agent infrastructure"*
