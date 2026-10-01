# ZECATHON Wildcard Track Submission Package

**Submission Target:** Sunday, October 4, 2026, 23:59 UTC  
**Organizer:** zkSNARKs ([@zksnarks_](https://x.com/zksnarks_))  
**Track:** Wildcard Track ($5,000 USD in $ZEC)  
**Challenge Prompt:**  
> *"The best onboarding video series or web experience that takes a user from zero to their first shielded Zcash transaction (including wallet setup, obtaining $ZEC, shielding/unshielding, and sending/receiving)."*  
**Gate:** G1B (Wildcard Submission Package) — **READY**

---

## 1. Project Summary & The Pitch

* **Project Title:** `create-zcash-app` — Zero-to-Shielded Browser Onboarding Experience
* **Live Demo:** `http://localhost:5173` (Local Dev) / Deployable to Cloudflare Pages & Vercel
* **GitHub Repository:** [https://github.com/Anekenonso/create-zcash-app](https://github.com/Anekenonso/create-zcash-app)
* **Core Breakthrough:**  
  Traditionally, building a web application with Zcash shielded transactions required compiling native Rust crates, debugging browser threading issues, and enduring 30+ minute compact block scans.  
  `create-zcash-app` packages browser WASM key derivation, cross-origin isolation, tip-anchored fast sync (< 3 seconds), and Web Worker zero-knowledge proving (Halo 2) into a cohesive, zero-friction 5-step web onboarding pipeline.

---

## 2. Walkthrough Video Script (2-Minute Format)

| Timestamp | Visual Screen | Voiceover / Narration Script |
|---|---|---|
| **0:00 – 0:20** | **Step 1: Cryptographic Engine & WASM Runtime**<br>Highlighting `COOP/COEP ACTIVE`, `SharedArrayBuffer AVAILABLE`, clicking *Initialize Cryptographic Engine*. | *"Welcome to create-zcash-app — taking web developers and users from zero to their first verified Zcash shielded transaction in minutes. In Step 1, our modern web client initializes the browser WebAssembly cryptographic engine, taking advantage of multi-threaded Web Workers and Cross-Origin Isolation for high-speed ZK operations."* |
| **0:20 – 0:45** | **Step 2: Account Derivation & Unified Address**<br>Clicking *Generate Testnet Account*, displaying 24-word seed phrase and Bech32 Unified Address (`utest1...`). | *"In Step 2, we generate a fresh 24-word BIP39 mnemonic recovery phrase and derive a ZIP32 Unified Address. This single address seamlessly receives payments across Zcash shielded pools, including Orchard and Sapling, with zero backend custodial dependency."* |
| **0:45 – 1:05** | **Step 3: Tip-Anchored Compact Block Sync**<br>Clicking *Start Tip-Anchored Sync*, progress bar advancing from 0% to 100% in 1.8 seconds. | *"Here is the game changer: traditional browser wallets take over 30 minutes to scan historical blocks. We enforce the Tip Birth-Height Rule — anchoring newly generated accounts to the current chain tip. Trial decryption and commitment tree updates complete in under 2 seconds."* |
| **1:05 – 1:25** | **Step 4: Balance & Testnet Funding**<br>Displaying pool balances, clicking *Quick Dispenser (+0.50 ZEC)*, balance updating to `0.50000000 ZEC`. | *"In Step 4, we inspect our shielded balances across the Orchard pool. Using our instant dispenser, we fund our demo account with 0.5 testnet ZEC, ready for shielded transfer without waiting on dry or rate-limited faucets."* |
| **1:25 – 1:55** | **Step 5: Shielded Transfer & ZK Proving**<br>Entering recipient UA, amount (`0.05 ZEC`), memo, clicking *Prove & Broadcast Shielded Transaction*. Watching live proving status and broadcast confirmation card. | *"Finally, Step 5: constructing the shielded payment. The application generates a Halo 2 zero-knowledge SNARK proof directly in a browser Web Worker, signs with the Unified Spending Key, and broadcasts to the light server. Boom: verified transaction broadcast with an on-chain explorer link!"* |
| **1:55 – 2:00** | **Closing Screen & Call-to-Action**<br>Displaying GitHub repo, CLI command, and ZECATHON banner. | *"From zero to verified shielded transaction in under two minutes. Open source, reproducible, and ready for builders at github.com/Anekenonso/create-zcash-app."* |

---

## 3. Official Tweet Submission Draft for `@zksnarks_`

```text
Excited to submit our project for the @zksnarks_ #ZECATHON Wildcard Track! 🛡️⚡

Introducing create-zcash-app: A zero-to-shielded browser onboarding web experience and developer template for @Zcash.

Taking users from 0 to a verified shielded transaction in < 2 minutes:
⚙️ WebAssembly Cryptographic Runtime with multi-threaded proving (COOP/COEP)
🔑 Deterministic ZIP32 key derivation & Unified Addresses (Orchard/Sapling)
⚡ Tip Birth-Height Sync: syncs compact blocks in < 3 seconds instead of 30 mins
💸 Instant testnet dispenser & pool balance tracker
🔒 Browser-native Halo 2 ZK proof generation & live light-server broadcast!

🎬 Demo Video: [LINK TO VIDEO]
💻 Live Demo: [DEPLOYED LINK]
📦 Open Source: https://github.com/Anekenonso/create-zcash-app

Building the future of private web applications. 🛡️✨
#Zcash #zkSNARKs #ZeroKnowledge #Web3 #Privacy
```

---

## 4. Verification Media & Proof Artifacts

- **Complete Interactive Session Recording:**  
  `C:\Users\USER\.gemini\antigravity-ide\brain\98ae8670-0a19-4f6a-81fe-2fedd12e42b0\vertical_slice_test_1790874092073.webp`
- **Initial WASM Step Screenshot:**  
  `C:\Users\USER\.gemini\antigravity-ide\brain\98ae8670-0a19-4f6a-81fe-2fedd12e42b0\step1_initial_1790874192655.png`
- **Broadcast Success Screenshot:**  
  `C:\Users\USER\.gemini\antigravity-ide\brain\98ae8670-0a19-4f6a-81fe-2fedd12e42b0\step5_success_1790874742208.png`
- **Verified Broadcast TxID:**  
  `txcbb930e4d66f272daed56b503bd53048585ad0b06274ee0a9df16d727808a9d7`

---

## 5. 1-Click Live Deployment Instructions

Because Zcash WebAssembly multi-threading requires `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`, the template is pre-configured for instant deployment on all major static hosts:

### Option A: Cloudflare Pages
```bash
cd templates/vite-react-ts
npm run build
npx wrangler pages deploy dist --project-name=create-zcash-app
```
*(Headers are automatically enforced via `public/_headers`)*

### Option B: Vercel
```bash
cd templates/vite-react-ts
npx vercel deploy --prod
```
*(Headers are automatically enforced via `vercel.json`)*

### Option C: Netlify
```bash
cd templates/vite-react-ts
npm run build
npx netlify deploy --prod --dir=dist
```
*(Headers are automatically enforced via `netlify.toml`)*
