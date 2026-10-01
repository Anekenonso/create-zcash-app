import { useState } from "react";
import { zcashClient } from "../zcash/client";
import { TransactionReceipt } from "../zcash/types";

interface Step5SendProps {
  onSuccess: (receipt: TransactionReceipt) => void;
  onLog: (msg: string) => void;
}

export function Step5Send({ onSuccess, onLog }: Step5SendProps) {
  const [recipient, setRecipient] = useState(
    "utest1m98vkgnjyzcgcx430asplqw7kkgks9syp9sssaqfgmehlwdem36wf5nr9xrvpv2p86yc4qqgkt8awl6dr9q2r0kaq9fp8dusc9el55w"
  );
  const [amount, setAmount] = useState("0.05");
  const [memo, setMemo] = useState("Welcome to Zcash shielded web applications!");
  const [sending, setSending] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setReceipt(null);
    onLog(`Initiating shielded transfer: ${amount} ZEC to ${recipient.substring(0, 25)}...`);

    const res = await zcashClient.executeShieldedTransfer(
      { recipient, amountZec: amount, memo },
      (stepText) => {
        setCurrentStep(stepText);
        onLog(`Proving: ${stepText}`);
      }
    );

    setSending(false);
    if (res.ok) {
      setReceipt(res.value);
      onLog(`🎉 TRANSACTION BROADCAST SUCCESSFUL! TxID: ${res.value.txid}`);
      onSuccess(res.value);
    } else {
      onLog(`❌ Transfer failed: ${res.error.message}`);
    }
  };

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--accent-gold)" }}>
        Step 5: Shielded Transfer & Zero-Knowledge Proving
      </h2>
      <p style={{ margin: "0 0 20px", color: "var(--text-muted)", fontSize: 14 }}>
        Construct a PCZT (Partially Constructed Zcash Transaction), generate a Halo 2 ZK proof in the browser Web Worker, sign with USK, and broadcast.
      </p>

      {!receipt ? (
        <form onSubmit={handleSend}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>
              RECIPIENT UNIFIED ADDRESS (TESTNET):
            </label>
            <input
              id="recipient-input"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              className="mono"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid var(--bg-card-border)",
                borderRadius: 8,
                color: "#e2e8f0",
                fontSize: 12
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>
                AMOUNT (ZEC):
              </label>
              <input
                id="amount-input"
                type="number"
                step="0.001"
                min="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="mono"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid var(--bg-card-border)",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: 13
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>
                ENCRYPTED MEMO (OPTIONAL):
              </label>
              <input
                id="memo-input"
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid var(--bg-card-border)",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: 13
                }}
              />
            </div>
          </div>

          {sending && (
            <div style={{ background: "rgba(245, 166, 35, 0.1)", border: "1px solid rgba(245, 166, 35, 0.3)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-gold)", fontSize: 13 }}>
                <span className="pulse-dot"></span>
                <span>{currentStep || "Processing..."}</span>
              </div>
            </div>
          )}

          <button
            id="send-shielded-tx-btn"
            type="submit"
            className="btn-primary"
            disabled={sending}
          >
            {sending ? "Generating ZK Proof & Broadcasting..." : "Prove & Broadcast Shielded Transaction"}
          </button>
        </form>
      ) : (
        <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 10, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>🎉</span>
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--accent-emerald)" }}>
              Shielded Transaction Successfully Broadcast!
            </h3>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>TRANSACTION ID (TXID):</div>
            <div id="result-txid" className="mono" style={{ fontSize: 13, color: "#f8fafc", wordBreak: "break-all", background: "rgba(0,0,0,0.4)", padding: 10, borderRadius: 6 }}>
              {receipt.txid}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16, fontSize: 12 }}>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Amount: </span>
              <span className="mono" style={{ color: "#fff", fontWeight: 600 }}>{receipt.amountZec} ZEC</span>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Fee: </span>
              <span className="mono" style={{ color: "#fff" }}>0.00010000 ZEC</span>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Status: </span>
              <span style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>VERIFIED</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <a
              id="explorer-link"
              href={receipt.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none", fontSize: 13 }}
            >
              View on Testnet Explorer ↗
            </a>

            <button
              className="btn-secondary"
              onClick={() => setReceipt(null)}
            >
              Send Another Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
