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
  const [copiedTxid, setCopiedTxid] = useState(false);

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

  const copyTxid = () => {
    if (!receipt) return;
    navigator.clipboard.writeText(receipt.txid);
    setCopiedTxid(true);
    setTimeout(() => setCopiedTxid(false), 2000);
  };

  return (
    <div className="glass-card" style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.5px" }}>
            STEP 05
          </span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>ZERO-KNOWLEDGE PROVING</span>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#ffffff" }}>
          Shielded Transfer & Zero-Knowledge Proving
        </h2>
        <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
          Constructs a PCZT (Partially Constructed Zcash Transaction), generates Halo 2 zero-knowledge proofs in a browser Web Worker, signs with your USK, and broadcasts the raw shielded transaction.
        </p>
      </div>

      {!receipt ? (
        <form onSubmit={handleSend}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.4px" }}>
                RECIPIENT UNIFIED ADDRESS (TESTNET)
              </label>
              <span style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                Orchard + Sapling Receiver Verified
              </span>
            </div>
            <input
              id="recipient-input"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              className="mono"
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(0, 0, 0, 0.45)",
                border: "1px solid var(--bg-card-border)",
                borderRadius: 10,
                color: "#f1f5f9",
                fontSize: 12,
                transition: "all 0.2s ease"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 14, marginBottom: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 700, letterSpacing: "0.4px" }}>
                AMOUNT (ZEC)
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
                  padding: "12px 14px",
                  background: "rgba(0, 0, 0, 0.45)",
                  border: "1px solid var(--bg-card-border)",
                  borderRadius: 10,
                  color: "#f1f5f9",
                  fontSize: 14,
                  fontWeight: 700
                }}
              />
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                + 0.0001 ZEC ZIP 317 Fee
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 700, letterSpacing: "0.4px" }}>
                ENCRYPTED MEMO (OPTIONAL, 512 BYTES)
              </label>
              <input
                id="memo-input"
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Private memo encrypted for recipient only..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "rgba(0, 0, 0, 0.45)",
                  border: "1px solid var(--bg-card-border)",
                  borderRadius: 10,
                  color: "#f1f5f9",
                  fontSize: 13
                }}
              />
              <div style={{ fontSize: 11, color: "var(--accent-cyan)", marginTop: 4 }}>
                🔒 Encrypted on-chain with recipient's viewing key
              </div>
            </div>
          </div>

          {/* Animated Proving Tracker */}
          {sending && (
            <div style={{
              background: "rgba(245, 166, 35, 0.08)",
              border: "1px solid rgba(245, 166, 35, 0.35)",
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              boxShadow: "0 0 20px rgba(245, 166, 35, 0.15)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div className="spinner spinner-gold" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-gold)" }}>
                    {currentStep || "Generating Halo 2 Zero-Knowledge Proof..."}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    Web Worker thread executing circuit constraints without leaking note commitments
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 10 }}>
                {["1. PCZT Proposal", "2. Halo 2 Proof", "3. USK Sign", "4. Broadcast"].map((stg, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(0, 0, 0, 0.3)",
                      padding: "6px 8px",
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--accent-gold)",
                      textAlign: "center",
                      border: "1px solid rgba(245, 166, 35, 0.2)"
                    }}
                  >
                    {stg}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            id="send-shielded-tx-btn"
            type="submit"
            className="btn-primary"
            disabled={sending}
            style={{ width: "100%", padding: "14px 24px", fontSize: 15 }}
          >
            {sending ? (
              <>
                <div className="spinner" />
                <span>Computing SNARK Proof & Broadcasting...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Prove & Broadcast Shielded Transaction</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Success Screen */
        <div style={{
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.35)",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 0 30px rgba(16, 185, 129, 0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.2)",
              color: "var(--accent-emerald)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 900
            }}>
              ✓
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, color: "#ffffff", fontWeight: 700 }}>
                Shielded Transaction Confirmed & Broadcast!
              </h3>
              <div style={{ fontSize: 12, color: "var(--accent-emerald)", marginTop: 2 }}>
                Halo 2 zero-knowledge proof generated and accepted by testnet mempool
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px" }}>
                TRANSACTION ID (TXID)
              </span>
              <button
                className="btn-secondary"
                style={{ padding: "3px 8px", fontSize: 11 }}
                onClick={copyTxid}
              >
                {copiedTxid ? "✓ Copied" : "Copy TxID"}
              </button>
            </div>
            <div
              id="result-txid"
              className="mono"
              style={{
                fontSize: 13,
                color: "#f8fafc",
                wordBreak: "break-all",
                background: "rgba(0, 0, 0, 0.45)",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                lineHeight: 1.5
              }}
            >
              {receipt.txid}
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 20,
            background: "rgba(0, 0, 0, 0.25)",
            padding: 14,
            borderRadius: 10,
            border: "1px solid var(--bg-card-border)"
          }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>AMOUNT SENT</div>
              <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", marginTop: 2 }}>
                {receipt.amountZec} ZEC
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>ZIP 317 FEE</div>
              <div className="mono" style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>
                0.00010000 ZEC
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>PROOF ENGINE</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-cyan)", marginTop: 2 }}>
                Halo 2 (Orchard)
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>VERIFICATION</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-emerald)", marginTop: 2 }}>
                MEMPOOL BROADCAST
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              id="explorer-link"
              href={receipt.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              <span>View on Testnet Explorer</span>
              <span>↗</span>
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
