# Evidence & Auditable Benchmark Artifacts

This directory houses verifiable test logs, stopwatch trial data, and blockchain transaction receipts supporting the claims of `create-zcash-app`.

## Completed Stage 1 Artifacts:
- `kill-test-spike.md`: Phase 1 browser light-client kill test report (gRPC-web connection, tip query, account creation) — **PASSED**.
- `technical-baseline.md`: Phase 2 pinned dependency specification & isolation headers — **PASSED**.
- `vertical-slice-report.md`: Phase 3 end-to-end browser vertical slice empirical test report (zero-to-shielded) — **PASSED**.

## Completed Stage 2 Artifacts:
- `clean-run-01.md`: First clean-room timer trial (119.49s to verified shielded transaction) — **PASSED**.
- `clean-run-02.md`: Second clean-room timer trial (53.74s to verified shielded transaction) — **PASSED**.
- `clean-run-03.md`: Third clean-room timer trial (53.39s to verified shielded transaction) — **PASSED**.
- `benchmark-summary.md`: Statistical summary of 3 clean-room trials (Median: 53.74s < 600s budget) — **GATE G3 PASSED**.
- `failure-tests.md`: Systematic 6-fault failure injection and diagnostic taxonomy report — **GATE G4A PASSED**.
- `load-bearing-test.md`: Ablation experiment proving cryptographic WASM, Tip-Sync, and COOP/COEP are load-bearing — **GATE G4B PASSED**.
