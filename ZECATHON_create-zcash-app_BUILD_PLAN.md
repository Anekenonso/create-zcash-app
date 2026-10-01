# ZECATHON — `create-zcash-app`
## Senior Software Engineering Build Plan & Evolution Specification

**Organizer:** zkSNARKs (@zksnarks_)  
**Hackathon Prize Pool:** $100,000 USD (Main Tracks) + $5,000 USD in $ZEC (Wildcard Track)  
**Primary Objective:** Build the smallest developer tool that materially reduces the time and failure rate required for a web/TypeScript developer to reach a real Zcash shielded transaction.

> **Core Philosophy (Non-Negotiable):**
> 1. **Problem first. Evidence second. Product third.**
> 2. **Build the smallest credible system that proves an important idea extremely well.**
> 3. **UI handles presentation; deterministic code owns authority; blockchain enforces finality.**
> 4. **Prove the important claim before polishing the product.**
> 5. **This workbook is the single source of truth.** Unknown is a valid state; never mark UNKNOWN as PASS.

---

# 1. Strategic Two-Stage Architecture & Timeline

To maximize impact, community visibility, and prize leverage, development is structured into two distinct, cumulative stages:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: Wildcard Track — "Zero to Shielded Transaction" Onboarding    │
│ Target: Sunday, October 4, 2026, 23:59 UTC ($5,000 USD in $ZEC)       │
│                                                                        │
│ • Focus: The core browser Zcash vertical slice & guided web flow       │
│ • Deliverable: High-clarity Vite + React + TS shielded web experience  │
│   (Wasm Init → Tip Sync → Key Derivation → Shielded Proof → Broadcast) │
│ • Demo Asset: 2-minute clean walkthrough video submitted to @zksnarks_ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ (Hardened, proven web core)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: Core & Tooling Track — `create-zcash-app` Scaffolder CLI      │
│ Target: Wednesday, October 28, 2026, 23:59 UTC ($100k Prize Pool)     │
│                                                                        │
│ • Focus: `npx create-zcash-app` CLI scaffolder, thin client SDK layer  │
│ • Deliverable: Monorepo CLI generating reproducible developer template │
│ • Proof Claim: "Zero to verified shielded testnet tx in < 10 minutes"   │
│ • Evidence: Clean-room timer benchmarks, failure injection, judge pack │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 2. Product Identity & The One-Sentence Thesis

**Working Name:** `create-zcash-app`  
**Target User:** Web3 front-end and TypeScript developers building privacy-preserving web applications who do not have Rust / protocol-engineering backgrounds.  

**Current Alternative:**  
Developers must manually compile or wire low-level WASM crates (`librustzcash`), debug Web Worker threading and `SharedArrayBuffer` browser header errors, find undocumented gRPC-Web proxy endpoints, and implement trial-decryption sync loops from scratch. 95% of web developers give up before sending their first shielded note.

**One-Sentence Technical Thesis:**  
> **If we package browser-based Zcash light-client initialization, cross-origin isolation, tip-anchored sync, and zero-knowledge proving into an authoritative, zero-config scaffolder, web developers can reach a verified testnet shielded transaction in under 10 minutes instead of wrestling with WASM toolchains for days.**

## What We Are NOT Building (V1 Non-Goals)
To protect velocity and guarantee delivery, V1 explicitly excludes:
- Custodial or backend wallet services
- Multi-account / multi-seed derivation suites
- Hardware wallet integrations (Ledger/Keystone)
- Mobile/React Native wrappers
- Custom light-servers or custom ZK proving circuits
- Unnecessary AI wrappers or non-deterministic gimmicks

---

# 3. Critical Technical Realities & Architectural Safeguards

To prevent the failure modes typical of browser-based cryptographic apps, the project enforces four non-negotiable architectural safeguards:

### 3.1. Tip Birth-Height Sync Rule (The 10-Minute Enabler)
Scanning historical compact blocks in browser IndexedDB can take 30+ minutes.
- **Rule:** Newly generated demo accounts **must** query the latest block height from the light server first and initialize `birthdayHeight = currentTip - 5` (a small safety cushion).
- **Outcome:** Initial sync requires scanning fewer than 10 compact blocks, finishing in **< 3 seconds**.
- For imported accounts: UI mandates explicit birthday height entry and warns of scan duration if older heights are specified.

### 3.2. Cross-Origin Isolation (COOP / COEP Headers)
WASM zero-knowledge proof generation (Halo 2 / Orchard / Sapling) requires multi-threaded Web Workers and `SharedArrayBuffer`. Browsers block `SharedArrayBuffer` unless cross-origin isolation is enforced.
- **Rule:** The template dev server (`vite.config.ts`) and all static deployment configs (`vercel.json`, `netlify.toml`, `_headers`) **must** include:
  ```http
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  ```

### 3.3. gRPC-Web & CORS Gateway Standard
Browsers cannot initiate raw TCP or HTTP/2 gRPC connections to standard `lightwalletd` port 9067.
- **Rule:** The integration must target an endpoint with native gRPC-Web and CORS proxying enabled (or Zaino HTTP gateway). A verified list of fallback endpoints must be pinned in configuration.

### 3.4. Testnet Faucet & Dispenser Strategy
Because testnet faucets can be dry or rate-limited:
- **Rule:** The benchmarking and demo protocol must decouple **"Developer Integration Time"** from **"Block Confirmation Wait Time"**.
- A dedicated dispensing script/mnemonic will be provided in test fixtures for automated benchmarking runs.

---

# 4. Authority Boundaries & State Machine (Software Evolution)

### 4.1. Authority Boundary Matrix
Following the Software Evolution methodology: *UI handles presentation; deterministic code owns authority; the blockchain enforces finality.*

| Component | Responsibility | Deterministic? | Authority Level |
|---|---|---|---|
| **UI Layer** (`/ui`) | User interaction, status displays, error formatting | No (Presentation) | Display only — zero authority |
| **Zcash Client Layer** (`/zcash`) | Key derivation, sync coordination, tx building | Yes (Code) | High — enforces state transitions |
| **WASM / Worker Engine** | Cryptographic proof generation (Halo 2) | Yes (Code) | High — mathematical validity |
| **Light Server (gRPC-Web)** | Compact block streaming, raw tx broadcast | Yes (External) | Intermediate — transport only |
| **Zcash Testnet Consensus** | Note commitment verification, double-spend check | Yes (Consensus) | Absolute final authority |

### 4.2. Explicit Application State Machine
No state transition may be assumed or faked.

```text
[UNINITIALIZED] ──► [INITIALIZING_WASM] ──► [READY]
                                               │
                                 ┌─────────────┴─────────────┐
                                 ▼                           ▼
                        [CREATING_ACCOUNT]          [IMPORTING_ACCOUNT]
                                 │                           │
                                 └─────────────┬─────────────┘
                                               ▼
                                     [QUERYING_CHAIN_TIP]
                                               │
                                               ▼
                                      [SYNCING_BLOCKS]
                                               │
                                               ▼
                                            [SYNCED]
                                               │
                                               ▼
                                      [AWAITING_FUNDS]
                                               │ (Balance > 0)
                                               ▼
                                       [READY_TO_SEND]
                                               │
                                               ▼
                                      [BUILDING_PAYMENT]
                                               │
                                               ▼
                                      [GENERATING_PROOF] (ZK-WASM)
                                               │
                                               ▼
                                        [BROADCASTING]
                                               │
                                 ┌─────────────┴─────────────┐
                                 ▼                           ▼
                            [SUBMITTED]                   [FAILED]
                         (Verified TxID)               (Structured Err)
```

### 4.3. Real vs. Simulated Environment Labeling
Every log line, CLI output, and UI view must explicitly display environment tier:
* `TESTNET` — Real operations on the Zcash Testnet
* `MAINNET` — Forbidden by default in V1 demo/template
* `SIMULATED` / `DRY RUN` — Proving or balance mocks (used only in isolated unit tests; never in live demos)

---

# 5. Project Repository Architecture

To keep the template and the CLI perfectly in sync, the workspace uses a single clean monorepo:

```text
create-zcash-app/
├── packages/
│   └── create-zcash-app/          # The CLI scaffolder (Published to npm)
│       ├── bin/
│       │   └── index.ts           # npx entrypoint
│       ├── src/
│       │   ├── scaffolder.ts      # Template copier, dependency installer
│       │   └── validate.ts        # Project name & environment checks
│       └── package.json
├── templates/
│   └── vite-react-ts/             # The verified Stage 1 vertical slice
│       ├── public/                # WASM assets, ZK proving parameters
│       ├── src/
│       │   ├── zcash/             # Thin deterministic Zcash client layer
│       │   │   ├── client.ts      # Lifecycle coordinator
│       │   │   ├── account.ts     # Seed derivation & Unified Addresses
│       │   │   ├── sync.ts        # Tip-anchored compact block sync
│       │   │   ├── transaction.ts # Payment builder & broadcast
│       │   │   ├── errors.ts      # Structured error taxonomy
│       │   │   └── types.ts       # Strict TypeScript contracts
│       │   ├── ui/                # Guided onboarding experience
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── vite.config.ts         # Includes COOP/COEP & WASM worker headers
│       ├── vercel.json            # Deployment cross-origin headers
│       └── package.json
├── evidence/                      # Auditable proof artifacts & test records
├── package.json                   # Root workspace config
├── tsconfig.json
└── ZECATHON_create-zcash-app_BUILD_PLAN.md
```

---

# 6. Detailed Phase Execution & Manual Commit Protocol

> **Human-in-the-Loop Commit Protocol:**  
> The agent will develop **one phase at a time**. Upon completing a phase, the agent will run all verification checks, present the evidence, and **pause** for the user to manually review and commit before starting the next phase.

---

## === STAGE 1: The Wildcard Web Experience (Deadline: Oct 4) ===

### Phase 0: Repository Baseline & Environment Baseline
* **Goal:** Initialize reproducible workspace structure, root package scripts, TypeScript strict mode, linter, and `.gitignore`.
* **Deliverable:** Clean repo passing `npm run lint` and `npm run typecheck`.
* **Gate G0A:** Fresh clone installs without warnings or broken paths.  
*(User Manual Commit Checkpoint: `git commit -m "chore: phase 0 repository baseline"`)*

### Phase 1: The Browser Light-Client Kill Test (Spike)
* **Goal:** Verify that the modern Zcash browser SDK (WebZjs / Zcash Wasm) can initialize, connect via gRPC-Web, query the chain tip, and construct an account in Chromium without custom protocol hacks.
* **Deliverable:** Automated or scripted spike script logging successful tip query and address generation.
* **Gate G0:** PASS/PIVOT. If the browser stack fails fundamental initialization, stop and pivot immediately.  
*(User Manual Commit Checkpoint: `git commit -m "test: phase 1 browser light client kill test"`)*

### Phase 2: Lock the Technical Baseline
* **Goal:** Freeze exact pinned versions of the Zcash SDK, WASM binaries, light-server gRPC-web endpoint, Vite plugins, and Node target.
* **Deliverable:** Pinned dependency specification and baseline config recorded in docs/evidence.
* **Gate G1A:** All dependencies install with fixed lockfile.  
*(User Manual Commit Checkpoint: `git commit -m "chore: phase 2 lock technical baseline"`)*

### Phase 3: Smallest Working Vertical Slice (The Web Onboarding App)
* **Goal:** Build the complete browser web application in `templates/vite-react-ts`:
  1. Initialize WASM worker with COOP/COEP headers
  2. Create/import testnet account
  3. Tip-anchored compact block sync
  4. Display Unified Address (Orchard + Sapling + Transparent)
  5. Receive testnet funds
  6. Construct and prove shielded transaction (Halo 2)
  7. Broadcast and display verifiable testnet TxID.
* **Deliverable:** Working interactive web application.
* **Gate G1:** A real testnet shielded transaction is broadcast and verified on an explorer.  
*(User Manual Commit Checkpoint: `git commit -m "feat: phase 3 browser vertical slice"`)*

### Phase 3B: Wildcard Submission Asset Preparation
* **Goal:** Polish guided onboarding UI, record clean 2-minute walkthrough video, write submission text, and prepare the Oct 4 Wildcard submission to @zksnarks_.
* **Deliverable:** Submission-ready video and live demo link.  
*(User Manual Commit Checkpoint: `git commit -m "docs: phase 3b wildcard submission package"`)*

---

## === STAGE 2: Core & Tooling Track — Scaffolder CLI (Deadline: Oct 28) ===

### Phase 4: Thin Integration Layer & Typed Contracts
* **Goal:** Extract clean, reusable client abstractions (`src/zcash/*`) from the vertical slice with strict TypeScript interfaces.
* **Deliverable:** Modular, cleanly separated client and UI layers.
* **Gate G2A:** Zero protocol logic leaked into UI components.  
*(User Manual Commit Checkpoint)*

### Phase 5: Structured Error Taxonomy & Recovery UX
* **Goal:** Implement actionable error codes (`LIGHT_SERVER_UNAVAILABLE`, `SYNC_FAILED`, `INSUFFICIENT_FUNDS`, `NETWORK_MISMATCH`) with user-friendly retry guidance.
* **Deliverable:** Error boundary and diagnostic display in template.  
*(User Manual Commit Checkpoint)*

### Phase 6: Scaffolder CLI (`create-zcash-app`)
* **Goal:** Implement the CLI in `packages/create-zcash-app` that validates inputs, copies `templates/vite-react-ts`, customizes `package.json`, and installs dependencies.
* **Deliverable:** Runnable `npx create-zcash-app my-app` producing a functional project.
* **Gate G2:** Generated app runs from scratch without manual patching.  
*(User Manual Commit Checkpoint)*

### Phase 7: The 10-Minute Clean-Room Experiment & Evidence
* **Goal:** Run at least 3 clean-machine benchmark trials recording exact stopwatch times from `npx create-zcash-app` to verified testnet TxID.
* **Deliverable:** Auditable markdown evidence reports in `/evidence/clean-run-*.md`.
* **Gate G3:** Median time to verified shielded transaction < 10 minutes.  
*(User Manual Commit Checkpoint)*

### Phase 8: Failure Injection & Load-Bearing Tests
* **Goal:** Intentionally break network endpoints, recipient addresses, and funds to prove the app handles errors robustly. Perform ablation test removing Zcash client to prove it is load-bearing.
* **Deliverable:** `/evidence/failure-tests.md` and `/evidence/load-bearing-test.md`.  
*(User Manual Commit Checkpoint)*

### Phase 9: Independent Developer Trial & Final Polish
* **Goal:** Have an outside developer follow the generated README without assistance, fix friction points, finalize architectural README, and produce final 2-minute demo video.
* **Deliverable:** Final submission package for the $100k Core & Tooling track.
* **Gate G5:** Ready for submission before Oct 28, 2026 23:59 UTC.  
*(User Manual Commit Checkpoint)*

---

# 7. Current Project State & Tracking

```text
CURRENT STAGE: STAGE 1 (Target: Wildcard Track, Oct 4, 2026)
CURRENT PHASE: Phase 0 (Repository & Environment Baseline)
CURRENT GATE: G0A (PASSED)

WHAT WORKS:
- Two-stage engineering build plan finalized and aligned with ZECATHON announcement.
- Root monorepo initialized with workspaces (`packages/*`, `templates/*`).
- Pinned runtime: Node v24.19.0 in `.nvmrc`.
- TypeScript strict mode enabled (`tsconfig.json`).
- Environment safeguards and `.gitignore` configured.
- `npm run typecheck` and `npm run lint` passing cleanly (Exit Code 0).
- Git repository initialized.

WHAT DOES NOT WORK:
- Browser Zcash light client integration not yet verified (subject of Phase 1 Kill Test).

CURRENT BLOCKER:
- Awaiting user manual commit for Phase 0 before starting Phase 1.

NEXT SINGLE TASK:
- Phase 1: Browser Light-Client Kill Test (Spike gRPC-web connection, tip block height query, and account derivation in Chromium).

LAST VERIFIED:
- 2026-10-01 (Phase 0 Baseline verified)
```
