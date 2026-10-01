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

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: "var(--accent-gold)" }}>
            Step 1: Cryptographic Engine & WASM Runtime
          </h2>
          <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: 14 }}>
            Zcash shielded transactions require zero-knowledge SNARK proving (Halo 2 / Groth16) compiled to browser WebAssembly.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 8, border: "1px solid var(--bg-card-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>ISOLATION HEADERS</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: window.crossOriginIsolated ? "var(--accent-emerald)" : "var(--accent-rose)", marginTop: 4 }}>
            {window.crossOriginIsolated ? "COOP/COEP ACTIVE" : "DISABLED"}
          </div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 8, border: "1px solid var(--bg-card-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>SHAREDARRAYBUFFER</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: typeof SharedArrayBuffer !== "undefined" ? "var(--accent-emerald)" : "var(--accent-rose)", marginTop: 4 }}>
            {typeof SharedArrayBuffer !== "undefined" ? "AVAILABLE" : "UNAVAILABLE"}
          </div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 8, border: "1px solid var(--bg-card-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>HARDWARE THREADS</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent-cyan)", marginTop: 4 }}>
            {navigator.hardwareConcurrency || 4} VIRTUAL CORES
          </div>
        </div>
      </div>

      <button
        id="init-wasm-btn"
        className="btn-primary"
        onClick={handleInit}
        disabled={loading || done}
      >
        {loading ? "Compiling & Loading WASM..." : done ? "✔ WASM Runtime Ready" : "Initialize Cryptographic Engine"}
      </button>
    </div>
  );
}
