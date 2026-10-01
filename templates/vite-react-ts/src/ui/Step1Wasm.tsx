import { useState } from "react";
import { initWasmEngine } from "../zcash/keys";

interface Step1WasmProps {
  onInitialized: () => void;
  onLog: (msg: string) => void;
}

export function Step1Wasm({ onInitialized, onLog }: Step1WasmProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleInit = async () => {
    setLoading(true);
    onLog("Initializing WebZjs WebAssembly cryptographic engine...");
    const res = await initWasmEngine();
    setLoading(false);

    if (res.ok) {
      setDone(true);
      onLog("✔ WebAssembly cryptographic engine initialized successfully.");
      onInitialized();
    } else {
      onLog(`❌ ${res.error.message} (${res.error.developerMessage || ""})`);
    }
  };

  const isIsolated = window.crossOriginIsolated || false;
  const hasSab = typeof SharedArrayBuffer !== "undefined";
  const cores = navigator.hardwareConcurrency || 4;

  return (
    <div className="glass-card" style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.5px" }}>
            STEP 01
          </span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>CORE RUNTIME</span>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#ffffff" }}>
          Cryptographic Engine & WASM Initialization
        </h2>
        <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
          Zcash shielded transactions rely on Halo 2 zero-knowledge SNARK proving compiled to WebAssembly. 
          Generating proofs in seconds requires client-side multi-threading via Web Workers and <code className="mono" style={{ color: "var(--accent-gold)" }}>SharedArrayBuffer</code>.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 24 }}>
        <div style={{
          background: "rgba(0, 0, 0, 0.35)",
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${isIsolated ? "rgba(16, 185, 129, 0.25)" : "rgba(244, 63, 94, 0.3)"}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
              CROSS-ORIGIN ISOLATION
            </span>
            <span className={`pulse-dot`} style={{ color: isIsolated ? "var(--accent-emerald)" : "var(--accent-rose)" }} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: isIsolated ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
            {isIsolated ? "COOP / COEP ACTIVE" : "DISABLED"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
            Headers required for high-res timers and thread sharing
          </div>
        </div>

        <div style={{
          background: "rgba(0, 0, 0, 0.35)",
          padding: 16,
          borderRadius: 12,
          border: `1px solid ${hasSab ? "rgba(16, 185, 129, 0.25)" : "rgba(244, 63, 94, 0.3)"}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
              SHAREDARRAYBUFFER
            </span>
            <span className={`pulse-dot`} style={{ color: hasSab ? "var(--accent-emerald)" : "var(--accent-rose)" }} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: hasSab ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
            {hasSab ? "AVAILABLE" : "BLOCKED"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
            Permits zero-copy memory between prover workers
          </div>
        </div>

        <div style={{
          background: "rgba(0, 0, 0, 0.35)",
          padding: 16,
          borderRadius: 12,
          border: "1px solid rgba(6, 182, 212, 0.25)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
              HARDWARE CONCURRENCY
            </span>
            <span className={`pulse-dot`} style={{ color: "var(--accent-cyan)" }} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-cyan)" }}>
            {cores} VIRTUAL CORES
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
            Prover pool scales proof computation dynamically
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <button
          id="init-wasm-btn"
          className="btn-primary"
          onClick={handleInit}
          disabled={loading || done}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span>Compiling & Initializing WASM...</span>
            </>
          ) : done ? (
            <>
              <span>✓</span>
              <span>WASM Runtime Ready</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Initialize Cryptographic Engine</span>
            </>
          )}
        </button>

        {done && (
          <span style={{ fontSize: 13, color: "var(--accent-emerald)", fontWeight: 600 }}>
            Ready to derive ZIP 32 accounts and addresses
          </span>
        )}
      </div>
    </div>
  );
}
