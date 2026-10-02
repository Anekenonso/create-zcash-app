# create-zcash-app

> **Zero-Config Zcash Shielded Web Application Scaffolder**  
> Build privacy-preserving browser apps with client-side zero-knowledge proofs in minutes.

[![npm version](https://img.shields.io/npm/v/create-zcash-app.svg)](https://www.npmjs.com/package/create-zcash-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Quick Start

Scaffold a new Zcash shielded web application with a single command:

```bash
npx create-zcash-app my-shielded-app
```

Then navigate into your new project and start the development server:

```bash
cd my-shielded-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome, Brave, or Firefox.

---

## What's Included

Every project generated with `create-zcash-app` comes pre-configured with:

- **Browser-Native Zcash WASM SDK**: Multi-threaded Halo 2 Zero-Knowledge proving engine running inside Web Workers.
- **Tip Birth-Height Sync**: Syncs new accounts in **under 3 seconds** by querying the chain tip instead of scanning 3M+ blocks from genesis.
- **Automated Cross-Origin Isolation**: Pre-configured `COOP` (`same-origin`) and `COEP` (`require-corp`) headers across **Vite**, **Vercel**, **Netlify**, and **Cloudflare Pages**.
- **ZIP 32 Key Derivation**: 24-word BIP39 mnemonic derivation, Unified Full Viewing Keys (UFVK), and Bech32 Unified Addresses (`utest1...`).
- **Complete Onboarding Pipeline**: 5-step guided flow: WASM initialization, key derivation, tip sync, testnet faucet funding, and shielded transaction broadcast.
- **Strict TypeScript Contracts**: Decoupled client SDK (`src/zcash/`) with frozen data contracts and zero protocol leaks into UI components.

---

## CLI Options

```bash
npx create-zcash-app [project-name] [options]
```

| Option | Alias | Description | Default |
|---|---|---|---|
| `--template <name>` | `-t` | Template to scaffold | `vite-react-ts` |
| `--git` / `--no-git` | | Initialize a Git repository | `true` |
| `--install` / `--no-install` | | Automatically run `npm install` | `false` |
| `--dry-run` | | Simulate scaffolding without writing files | `false` |
| `--version` | `-v` | Display version number | |
| `--help` | `-h` | Show help and usage instructions | |

---

## Development Scripts (Generated Project)

Inside your scaffolded project:

- `npm run dev`: Starts local Vite dev server with COOP/COEP cross-origin isolation.
- `npm run build`: Bundles the application with WASM binaries for production.
- `npm run typecheck`: Runs strict TypeScript type checking against frozen client contracts.
- `npm run preview`: Locally previews the production build.

---

## License

MIT © [Anekenonso](https://github.com/Anekenonso/create-zcash-app)
