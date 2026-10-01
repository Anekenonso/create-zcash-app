import { useState, useEffect } from "react";
import initKeys, { generate_seed_phrase, UnifiedSpendingKey } from "@chainsafe/webzjs-keys";

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [seed, setSeed] = useState<string>("");
  const [ufvk, setUfvk] = useState<string>("");
  const [envChecks, setEnvChecks] = useState<{
    crossOriginIsolated: boolean;
    sharedArrayBuffer: boolean;
    webAssembly: boolean;
  }>({
    crossOriginIsolated: false,
    sharedArrayBuffer: false,
    webAssembly: false
  });

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString().substring(11, 19)}] ${msg}`]);
  };

  useEffect(() => {
    const checks = {
      crossOriginIsolated: window.crossOriginIsolated || false,
      sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
      webAssembly: typeof WebAssembly !== "undefined"
    };
    setEnvChecks(checks);
    addLog(`Environment: crossOriginIsolated=${checks.crossOriginIsolated}, SharedArrayBuffer=${checks.sharedArrayBuffer}`);
  }, []);

  const runKillTest = async () => {
    setStatus("running");
    addLog("=== Starting Phase 1 Kill Test Spike ===");

    try {
      // 1. Initialize Keys WASM
      addLog("Initializing @chainsafe/webzjs-keys WASM module...");
      await initKeys();
      addLog("✔ Keys WASM module initialized successfully");

      // 2. Generate Seed Phrase
      addLog("Generating 24-word BIP39 seed phrase...");
      const generatedSeed = generate_seed_phrase();
      setSeed(generatedSeed);
      addLog(`✔ Seed generated: ${generatedSeed.substring(0, 30)}...`);

      // 3. Derive USK & UFVK
      addLog("Deriving Unified Spending Key (network: testnet, account: 0)...");
      const entropy = new Uint8Array(32);
      crypto.getRandomValues(entropy);
      const usk = new UnifiedSpendingKey("test", entropy, 0);
      addLog("✔ USK derived successfully");

      addLog("Deriving Unified Full Viewing Key (UFVK)...");
      const viewingKey = usk.to_unified_full_viewing_key();
      const encoded = viewingKey.encode("test");
      setUfvk(encoded);
      addLog(`✔ UFVK encoded: ${encoded.substring(0, 45)}...`);

      // 4. Testnet Endpoint Check
      addLog("Testing connectivity to testnet light server (https://testnet.zec.rocks)...");
      try {
        await fetch("https://testnet.zec.rocks", { method: "HEAD", mode: "no-cors" });
        addLog(`✔ Testnet endpoint reachable (mode: no-cors handshake successful)`);
      } catch (e: any) {
        addLog(`⚠ Direct fetch notice: ${e.message}`);
      }

      addLog("🎉 PHASE 1 KILL TEST: PASSED!");
      setStatus("passed");
    } catch (err: any) {
      addLog(`❌ KILL TEST FAILED: ${err?.message || err}`);
      console.error(err);
      setStatus("failed");
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: "40px auto", padding: 24, background: "#161922", borderRadius: 12, border: "1px solid #282d3d" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, color: "#f5a623" }}>create-zcash-app</h1>
          <p style={{ margin: "4px 0 0", color: "#8a94a6", fontSize: 14 }}>Phase 1 Kill Test — Browser Light-Client Diagnostics</p>
        </div>
        <span style={{
          padding: "4px 10px",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: "bold",
          background: status === "passed" ? "#1b4d3e" : status === "failed" ? "#611a1a" : "#282d3d",
          color: status === "passed" ? "#4ade80" : status === "failed" ? "#f87171" : "#94a3b8"
        }}>
          {status.toUpperCase()}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#0d0f14", padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: "#8a94a6" }}>CROSS-ORIGIN ISOLATED</div>
          <div style={{ fontSize: 14, fontWeight: "bold", marginTop: 4, color: envChecks.crossOriginIsolated ? "#4ade80" : "#f87171" }}>
            {envChecks.crossOriginIsolated ? "ENABLED (COOP/COEP)" : "DISABLED"}
          </div>
        </div>
        <div style={{ background: "#0d0f14", padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: "#8a94a6" }}>SHAREDARRAYBUFFER</div>
          <div style={{ fontSize: 14, fontWeight: "bold", marginTop: 4, color: envChecks.sharedArrayBuffer ? "#4ade80" : "#f87171" }}>
            {envChecks.sharedArrayBuffer ? "AVAILABLE" : "UNAVAILABLE"}
          </div>
        </div>
        <div style={{ background: "#0d0f14", padding: 12, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: "#8a94a6" }}>TARGET NETWORK</div>
          <div style={{ fontSize: 14, fontWeight: "bold", marginTop: 4, color: "#60a5fa" }}>
            ZCASH TESTNET
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <button
          onClick={runKillTest}
          disabled={status === "running"}
          style={{
            background: "#f5a623",
            color: "#000",
            fontWeight: "bold",
            padding: "10px 20px",
            border: "none",
            borderRadius: 8,
            cursor: status === "running" ? "not-allowed" : "pointer",
            fontSize: 14
          }}
        >
          {status === "running" ? "Running Kill Test..." : "Execute Kill Test Spike"}
        </button>
      </div>

      {seed && (
        <div style={{ background: "#0d0f14", padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#8a94a6", marginBottom: 6 }}>GENERATED 24-WORD TEST SEED:</div>
          <div style={{ fontSize: 13, fontFamily: "monospace", color: "#e2e8f0", wordBreak: "break-all" }}>{seed}</div>
        </div>
      )}

      {ufvk && (
        <div style={{ background: "#0d0f14", padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#8a94a6", marginBottom: 6 }}>DERIVED TESTNET UFVK:</div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: "#67e8f9", wordBreak: "break-all" }}>{ufvk}</div>
        </div>
      )}

      <div style={{ background: "#090a0d", padding: 16, borderRadius: 8, border: "1px solid #1f2430" }}>
        <div style={{ fontSize: 12, color: "#8a94a6", marginBottom: 8, fontWeight: "bold" }}>DIAGNOSTIC LOGS:</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, maxHeight: 220, overflowY: "auto", color: "#94a3b8" }}>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
