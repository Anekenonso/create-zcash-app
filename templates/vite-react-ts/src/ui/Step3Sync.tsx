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
    <div className="glass-card" style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.5px" }}>
            STEP 03
          </span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>CONSENSUS SYNCHRONIZATION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#ffffff" }}>
          Tip-Anchored Compact Block Sync
        </h2>
        <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
          Connects via gRPC-Web to query the current blockchain height. By enforcing the 
          <strong style={{ color: "var(--accent-gold)" }}> Tip Birth-Height Rule</strong> (<code className="mono">birthdayHeight = tip - 5</code>), 
          the wallet scans only recent blocks to trial-decrypt shielded note commitments in under 3 seconds.
        </p>
      </div>

      <div style={{
        background: "rgba(0, 0, 0, 0.4)",
        padding: 20,
        borderRadius: 12,
        border: "1px solid var(--bg-card-border)",
        marginBottom: 24
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="pulse-dot" style={{ color: synced ? "var(--accent-emerald)" : syncing ? "var(--accent-gold)" : "var(--text-muted)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
              {progress.statusText}
            </span>
          </div>
          <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: synced ? "var(--accent-emerald)" : "var(--accent-gold)" }}>
            {percentage}%
          </span>
        </div>

        <div style={{ height: 10, background: "rgba(255, 255, 255, 0.06)", borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
          <div style={{
            height: "100%",
            width: `${percentage}%`,
            background: synced
              ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
              : "linear-gradient(90deg, #f5a623 0%, #10b981 100%)",
            transition: "width 0.3s ease",
            boxShadow: "0 0 10px rgba(245, 166, 35, 0.4)"
          }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
          <span>
            Light Server: <strong style={{ color: "#f1f5f9" }}>{ACTIVE_NETWORK.lightdUrl.replace("https://", "")}</strong>
          </span>
          {progress.target > 0 ? (
            <span>
              Height: <strong className="mono" style={{ color: "var(--accent-cyan)" }}>{progress.current.toLocaleString()}</strong> / <span className="mono">{progress.target.toLocaleString()}</span>
            </span>
          ) : (
            <span>Testnet Chain Tip (~3.15M)</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <button
          id="sync-blocks-btn"
          className="btn-primary"
          onClick={handleSync}
          disabled={syncing || synced}
        >
          {syncing ? (
            <>
              <div className="spinner" />
              <span>Streaming Compact Blocks...</span>
            </>
          ) : synced ? (
            <>
              <span>✓</span>
              <span>Synced to Testnet Tip</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Start Tip-Anchored Sync</span>
            </>
          )}
        </button>

        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          ⚡ Scans &lt; 10 blocks instead of scanning from genesis (prevents 30-minute freeze).
        </span>
      </div>
    </div>
  );
}
