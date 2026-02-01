# agents.b1ts.dev

The registry for ERC-8004 Trustless Agents on Ethereum.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Data:** GraphQL API from [8004-indexer](https://github.com/0xbits/8004-indexer)

## Design

Deep Space — monochrome, minimal, subtle.

- Near-black backgrounds (#09090b)
- White text with muted grays
- Subtle glow effects on interaction
- Generous negative space

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deployed on Railway. Push to `main` to deploy.

```bash
pnpm build
pnpm start
```

## Data Source

Indexes ERC-8004 contracts on Ethereum mainnet:

- IdentityRegistry: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- ReputationRegistry: `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`

## License

MIT
