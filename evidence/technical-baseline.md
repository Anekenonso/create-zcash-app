# Technical Baseline & Pinned Dependency Specification

**Status:** Locked & Verified  
**Date:** 2026-10-01  
**Gate:** G1A (Technical Baseline) — **PASSED**

---

## 1. Pinned Runtime & Toolchain

| Tool | Version | Purpose | Policy |
|---|---|---|---|
| **Node.js** | `v24.19.0` | Execution runtime | Pinned in `.nvmrc` |
| **npm** | `11.17.0` | Package manager & workspace orchestrator | Required in `package.json` engines |
| **TypeScript** | `5.7.2` | Type-safety & contract verification | Strict mode enabled |
| **Vite** | `8.3.2` | Modern ESNext bundler and local dev server | Configured with native WASM support |
| **Rollup** | `4.63.6` | Production chunking & asset bundling | Pinned in template |
| **React** | `19.3.0` | UI component library | Pinned in template |

---

## 2. Pinned Zcash Cryptographic Stack

```text
Package: @chainsafe/webzjs-keys
Version: 0.1.0 (Exact)
Why required: Browser-side WASM ZIP32 key derivation and Bech32 Unified Address encoding.
What breaks if removed: Application cannot generate seeds, USKs, or UFVKs.
Known failure modes: Missing WASM MIME-type handling if server misconfigured.
Mitigation: Bundled directly via Vite WASM asset loader.

Package: @bytezhang/webzjs-wallet
Version: 0.1.0-alpha.23 (Exact)
Why required: Browser light client wallet engine, Rayon thread-pool manager, compact block scanner, and PCZT transaction builder.
What breaks if removed: Cannot sync note commitments or construct shielded Halo 2/Sapling transactions.
Known failure modes: Fails if SharedArrayBuffer or crossOriginIsolated is disabled.
Mitigation: Mandatory COOP/COEP headers enforced across Vite dev server and deployment configs.
```

---

## 3. Verified Network Infrastructure

| Role | Endpoint | Status | Protocol |
|---|---|---|---|
| **Primary Testnet Light Server** | `https://testnet.zec.rocks:443` | Active / Verified | gRPC / TLS |
| **Secondary Testnet Proxy** | `https://zcash-testnet.chainsafe.dev` | Active (Redirects to testnet.zec.rocks) | gRPC-Web |
| **Testnet Block Explorer** | `https://blockexplorer.one/zcash/testnet` | Active | Web UI |
| **Testnet Faucet** | `https://fauzec.com` (Zcash Foundation) | Active / Verified | Web UI / Mined on Demand |

---

## 4. Multi-Platform Deployment Cross-Origin Isolation

All template configurations enforce the mandatory cross-origin headers required for WebAssembly multi-threading (`SharedArrayBuffer`):

1. **Vite Dev Server:** [templates/vite-react-ts/vite.config.ts](file:///c:/Users/USER/Documents/Software%20Development/AI%20SaaS/create-zcash-app/templates/vite-react-ts/vite.config.ts)
2. **Vercel:** [templates/vite-react-ts/vercel.json](file:///c:/Users/USER/Documents/Software%20Development/AI%20SaaS/create-zcash-app/templates/vite-react-ts/vercel.json)
3. **Netlify:** [templates/vite-react-ts/netlify.toml](file:///c:/Users/USER/Documents/Software%20Development/AI%20SaaS/create-zcash-app/templates/vite-react-ts/netlify.toml)
4. **Cloudflare Pages:** [templates/vite-react-ts/public/_headers](file:///c:/Users/USER/Documents/Software%20Development/AI%20SaaS/create-zcash-app/templates/vite-react-ts/public/_headers)
