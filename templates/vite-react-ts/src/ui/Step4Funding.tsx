import { useState } from "react";
import { zcashClient } from "../zcash/client";
import { WalletBalances } from "../zcash/types";
import { ACTIVE_NETWORK } from "../config/network";

interface Step4FundingProps {
  onFunded: (balances: WalletBalances) => void;
  onLog: (msg: string) => void;
}

export function Step4Funding({ onFunded, onLog }: Step4FundingProps) {
  const [balances, setBalances] = useState<WalletBalances>(zcashClient.getBalances());
  const [loading, setLoading] = useState(false);

  const handleQuickFaucet = () => {
    setLoading(true);
    onLog("Simulating instant testnet dispenser receipt (+0.50000000 ZEC into Orchard pool)...");
    setTimeout(() => {
      const updated = zcashClient.depositTestFunds(0.5);
      setBalances(updated);
      setLoading(false);
      onLog("✔ Received 0.50000000 testnet ZEC into Orchard shielded balance.");
      onFunded(updated);
    }, 600);
  };

  const hasBalance = balances.totalZat > 0n;

  return (
    <div className="glass-card" style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.5px" }}>
            STEP 04
          </span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>BALANCE & LIQUIDITY</span>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#ffffff" }}>
          Shielded Note Balances & Testnet Funding
        </h2>
        <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
          Zcash accounts track shielded notes independently across the Orchard and Sapling pools. 
          Fund your account with testnet ZEC using the instant dispenser or the public testnet faucet.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 24 }}>
        <div style={{
          background: hasBalance ? "rgba(16, 185, 129, 0.08)" : "rgba(0, 0, 0, 0.35)",
          padding: 18,
          borderRadius: 12,
          border: `1px solid ${hasBalance ? "rgba(16, 185, 129, 0.3)" : "var(--bg-card-border)"}`
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
            TOTAL SHIELDED BALANCE
          </div>
          <div className="mono" style={{ fontSize: 26, fontWeight: 800, color: hasBalance ? "var(--accent-emerald)" : "#94a3b8", marginTop: 6 }}>
            {balances.totalZec} <span style={{ fontSize: 15, color: "var(--accent-gold)", fontWeight: 700 }}>ZEC</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
            {balances.totalZat.toLocaleString()} zatoshi available
          </div>
        </div>

        <div style={{
          background: "rgba(0, 0, 0, 0.35)",
          padding: 18,
          borderRadius: 12,
          border: "1px solid var(--bg-card-border)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
              ORCHARD POOL (HALO 2)
            </span>
            <span style={{ fontSize: 10, color: "var(--accent-gold)", background: "rgba(245, 166, 35, 0.12)", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
              ACTIVE
            </span>
          </div>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginTop: 8 }}>
            {balances.orchardZat.toLocaleString()} zat
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
            Zero-knowledge recursive SNARK notes
          </div>
        </div>

        <div style={{
          background: "rgba(0, 0, 0, 0.35)",
          padding: 18,
          borderRadius: 12,
          border: "1px solid var(--bg-card-border)"
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
            STANDARD NETWORK FEE
          </div>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: "#94a3b8", marginTop: 8 }}>
            0.00010000 ZEC
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
            ZIP 317 proportional fee policy
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <button
          id="request-faucet-btn"
          className="btn-primary"
          onClick={handleQuickFaucet}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span>Receiving Testnet Funds...</span>
            </>
          ) : (
            <>
              <span>💧</span>
              <span>Instant Dispenser (+0.50 ZEC)</span>
            </>
          )}
        </button>

        <a
          href={ACTIVE_NETWORK.faucetUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
          style={{ textDecoration: "none" }}
        >
          <span>External Public Faucet</span>
          <span>↗</span>
        </a>

        {hasBalance && (
          <span style={{ fontSize: 13, color: "var(--accent-emerald)", fontWeight: 600, marginLeft: "auto" }}>
            ✓ Account funded and ready for shielded send
          </span>
        )}
      </div>
    </div>
  );
}
