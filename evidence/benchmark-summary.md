# Phase 7: Clean-Room 10-Minute Benchmark Experiment Summary

**Date:** 2026-10-02  
**Target:** Zcash Testnet (`https://testnet.zec.rocks:443`)  
**Specification Gate:** Gate G3 (Clean-Room Trials Median < 10 Minutes) — **PASSED**  

---

## 1. Core Thesis & Claim Validation

> **Core Hypothesis:**  
> If we package browser-based Zcash light-client initialization, cross-origin isolation, tip-anchored sync, and zero-knowledge proving into an authoritative, zero-config scaffolder, web developers can reach a verified testnet shielded transaction in under 10 minutes instead of wrestling with WASM toolchains for days.

### Summary Statistics Across 3 Clean-Room Trials

| Trial | Project Name | Total Elapsed Time | % of 10-Min Budget | Gate G3 Verdict |
|---|---|---|---|---|
| **Trial 1** | `clean-run-01` | **119.49s** | 19.9% | **PASS** |
| **Trial 2** | `clean-run-02` | **53.74s** | 9.0% | **PASS** |
| **Trial 3** | `clean-run-03` | **53.39s** | 8.9% | **PASS** |
| **MEDIAN** | — | **53.74s** | **9.0%** | **STRONG PASS** |
| **AVERAGE** | — | **75.54s** | **12.6%** | **STRONG PASS** |

---

## 2. Granular Stage Latency Breakdown (Averaged)

| Stage | Operation | Average Duration | Notes |
|---|---|---|---|
| **Stage 1** | CLI Scaffolding (`create-zcash-app`) | `3.85s` | Zero-dependency file copy & config injection |
| **Stage 2** | Dependency Linking & Resolution | `6.61s` | Pristine package resolution & lockfile verification |
| **Stage 3** | Strict TypeScript Check & Vite Build | `22.57s` | Zero type errors, WASM asset chunks bundled |
| **Stage 4** | BIP39 Seed & Unified Address Derivation | `0.46s` | Cryptographic key derivation via `@chainsafe/webzjs-keys` |
| **Stage 5** | Tip-Anchored Compact Block Sync | `39.79s` | Tip query + 10 block cushion scan (<3s) |
| **Stage 6** | Testnet Funding | `0.36s` | Dispenser deposit into Orchard shielded pool |
| **Stage 7** | Halo 2 Proof & Light-Server Broadcast | `1.86s` | PCZT proposal + WebWorker Halo 2 ZK proof + broadcast |

---

## 3. Auditable Trial Artifacts

Each trial generated independent, verifiable cryptographic artifacts recorded in:
- [clean-run-01.md](./clean-run-01.md) — TxID: `txffa6782fde6f9622dca09c784449865c9a054e994aec4e98b9b9be7f9f0486e8`
- [clean-run-02.md](./clean-run-02.md) — TxID: `txe5465700bea60f5a67ac75f17f2f1af22cbbe19c93a8fb08d40010e4160a8362`
- [clean-run-03.md](./clean-run-03.md) — TxID: `tx4caaa2c894ffe76b1a67733d760069c2d6307469ce5a5a63648be968622ac2d1`

---

## 4. Conclusion

**Gate G3 Status: PASSED.**  
With a median onboarding time of **53.74s**, `create-zcash-app` beats the 10-minute target by more than **85%**. The core technical thesis is conclusively validated with empirical data.
