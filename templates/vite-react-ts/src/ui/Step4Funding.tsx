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
    onLog("Simulating instant testnet dispenser receipt (+0.50000000 ZEC)...");
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
    <div className="glass-card" style={{ padding: 24 }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--accent-gold)" }}>
        Step 4: Balance & Testnet Funding
      </h2>
      <p style={{ margin: "0 0 20px", color: "var(--text-muted)", fontSize: 14 }}>
        View note commitment balances and fund the account with testnet ZEC to prepare for shielded transactions.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 8, border: "1px solid var(--bg-card-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>TOTAL SHIELDED BALANCE</div>
          <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: hasBalance ? "var(--accent-emerald)" : "#94a3b8", marginTop: 4 }}>
            {balances.totalZec} <span style={{ fontSize: 14, color: "var(--accent-gold)" }}>ZEC</span>
          </div>
        </div>

        <div style={{ background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 8, border: "1px solid var(--bg-card-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>ORCHARD POOL</div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 600, color: "#e2e8f0", marginTop: 8 }}>
            {balances.orchardZat.toString()} zat
          </div>
        </div>

        <div style={{ background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 8, border: "1px solid var(--bg-card-border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>STANDARD TX FEE</div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 600, color: "var(--text-muted)", marginTop: 8 }}>
            0.00010000 ZEC (ZIP 317)
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <button
          id="request-faucet-btn"
          className="btn-primary"
          onClick={handleQuickFaucet}
          disabled={loading}
        >
          {loading ? "Receiving Funds..." : "Quick Dispenser (+0.50 ZEC)"}
        </button>

        <a
          href={ACTIVE_NETWORK.faucetUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          External Testnet Faucet ↗
        </a>
      </div>
    </div>
  );
}
