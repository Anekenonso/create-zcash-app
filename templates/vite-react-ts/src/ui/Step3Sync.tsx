import { useState } from "react";
import { zcashClient } from "../zcash/client";
import { ACTIVE_NETWORK } from "../config/network";

interface Step3SyncProps {
  onSyncComplete: () => void;
  onLog: (msg: string) => void;
}

export function Step3Sync({ onSyncComplete, onLog }: Step3SyncProps) {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; target: number; statusText: string }>({
    current: 0,
    target: 0,
    statusText: "Ready to synchronize"
  });
  const [synced, setSynced] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    onLog(`Connecting to light server (${ACTIVE_NETWORK.lightdUrl})...`);

    const res = await zcashClient.sync((current, target, statusText) => {
      setProgress({ current, target, statusText });
      onLog(`Sync: ${statusText} [${current}/${target}]`);
    });

    setSyncing(false);
    if (res.ok) {
      setSynced(true);
      onLog("✔ Tip-anchored compact block synchronization complete.");
      onSyncComplete();
    } else {
      onLog(`❌ ${res.error.message}`);
    }
  };

  const percentage = progress.target > 0
    ? Math.min(100, Math.round((progress.current / progress.target) * 100))
    : synced ? 100 : 0;

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--accent-gold)" }}>
        Step 3: Tip-Anchored Compact Block Sync
      </h2>
      <p style={{ margin: "0 0 20px", color: "var(--text-muted)", fontSize: 14 }}>
        Synchronizes note commitments and trial-decrypts compact blocks from the Zcash testnet light server.
      </p>

      <div style={{ background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 8, border: "1px solid var(--bg-card-border)", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
          <span style={{ color: "var(--text-muted)" }}>STATUS: {progress.statusText}</span>
          <span className="mono" style={{ color: "var(--accent-cyan)" }}>{percentage}%</span>
        </div>

        <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #f5a623 0%, #10b981 100%)",
            transition: "width 0.3s ease"
          }}></div>
        </div>

        {progress.target > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
            <span>Block: {progress.current.toLocaleString()}</span>
            <span>Target Tip: {progress.target.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          id="sync-blocks-btn"
          className="btn-primary"
          onClick={handleSync}
          disabled={syncing || synced}
        >
          {syncing ? "Synchronizing Chain Tip..." : synced ? "✔ Synced to Tip" : "Start Tip-Anchored Sync"}
        </button>

        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          💡 Tip Birth-Height Rule: Demo sync starts from recent tip, finishing in &lt; 3 seconds.
        </span>
      </div>
    </div>
  );
}
