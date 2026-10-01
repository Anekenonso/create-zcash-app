# Zcash Vite + React + TypeScript Template

This template is the verified **Stage 1 Vertical Slice** for [`create-zcash-app`](../../README.md). It provides an instant, zero-config browser client capable of deriving Zcash Unified Addresses, synchronizing chain tips via gRPC-Web in < 3 seconds, and generating client-side Halo 2 zero-knowledge proofs.

---

## Key Features

- **Cross-Origin Isolation:** Pre-configured COOP/COEP headers in `vite.config.ts`, `vercel.json`, `netlify.toml`, and `public/_headers`.
- **Tip Birth-Height Sync:** Enforces `birthdayHeight = currentTip - 5` to sync compact blocks in under 3 seconds.
- **Shielded Note Proving:** Browser Web Worker offloading for Halo 2 (Orchard) zero-knowledge SNARK proof generation.
- **Modern Glassmorphism UI:** Interactive 5-step guided pipeline with seed masking, live telemetry, and explorer links.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server with isolation headers
npm run dev

# Run TypeScript strict typecheck
npm run typecheck

# Build production bundle with WASM chunks
npm run build
```

---

## Deployment

Deploy directly to Vercel, Netlify, or Cloudflare Pages with zero configuration — all necessary cross-origin isolation headers are committed in the template root.
