import { useState } from "react";
import { generateNewSeed, deriveTestnetAccount } from "../zcash/keys";
import { AccountData } from "../zcash/types";
import { zcashClient } from "../zcash/client";

interface Step2AccountProps {
  onAccountCreated: (account: AccountData) => void;
  onLog: (msg: string) => void;
}

export function Step2Account({ onAccountCreated, onLog }: Step2AccountProps) {
  const [seed, setSeed] = useState<string>("");
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedUA, setCopiedUA] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [showSeed, setShowSeed] = useState(true);

  const handleGenerate = async () => {
    setLoading(true);
    onLog("Generating new BIP39 24-word cryptographic seed phrase...");
    const newSeed = generateNewSeed();
    setSeed(newSeed);

    onLog("Deriving testnet Unified Spending Key and Unified Address via ZIP 32...");
    const res = await deriveTestnetAccount(newSeed, 0, 0);
    setLoading(false);

    if (res.ok) {
      setAccount(res.value);
      zcashClient.setAccount(res.value);
      onLog(`✔ Account created. Unified Address derived: ${res.value.unifiedAddress.substring(0, 32)}...`);
    } else {
      onLog(`❌ ${res.error.message}`);
    }
  };

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account.unifiedAddress);
    setCopiedUA(true);
    setTimeout(() => setCopiedUA(false), 2000);
  };

  const copySeedPhrase = () => {
    if (!seed) return;
    navigator.clipboard.writeText(seed);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  return (
    <div className="glass-card" style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.5px" }}>
            STEP 02
          </span>
          <span style={{ color: "var(--text-dim)" }}>•</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>CRYPTOGRAPHIC IDENTITY</span>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#ffffff" }}>
          Account Derivation & Unified Address (ZIP 316 / ZIP 32)
        </h2>
        <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
          Generates a BIP39 24-word seed phrase and derives hierarchical deterministic Zcash keys. 
          The derived Unified Address contains Orchard (halo2) and Sapling shielded receivers in a single standard identifier.
        </p>
      </div>

      {!account ? (
        <div style={{ padding: "20px 0" }}>
          <button
            id="generate-account-btn"
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                <span>Deriving ZIP 32 Account...</span>
              </>
            ) : (
              <>
                <span>🔑</span>
                <span>Generate Testnet Account & Keys</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          {/* Recovery Phrase Card */}
          <div style={{
            background: "rgba(0, 0, 0, 0.4)",
            padding: 16,
            borderRadius: 12,
            border: "1px solid var(--bg-card-border)",
            marginBottom: 18
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--accent-gold)", fontWeight: 700, letterSpacing: "0.5px" }}>
                  24-WORD TESTNET SEED PHRASE (BIP39)
                </span>
                <span style={{
                  fontSize: 10,
                  background: "rgba(244, 63, 94, 0.15)",
                  color: "var(--accent-rose)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontWeight: 600
                }}>
                  CONFIDENTIAL
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn-secondary"
                  style={{ padding: "4px 10px", fontSize: 11 }}
                  onClick={() => setShowSeed(!showSeed)}
                >
                  {showSeed ? "🙈 Mask Seed" : "👁 Reveal Seed"}
                </button>
                <button
                  id="copy-seed-btn"
                  className="btn-secondary"
                  style={{ padding: "4px 10px", fontSize: 11 }}
                  onClick={copySeedPhrase}
                >
                  {copiedSeed ? "✓ Copied" : "Copy Seed"}
                </button>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(115px, 1fr))",
              gap: 8,
              transition: "filter 0.2s ease",
              filter: showSeed ? "none" : "blur(5px)",
              userSelect: showSeed ? "auto" : "none"
            }}>
              {seed.split(" ").map((word, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    padding: "6px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <span style={{ color: "var(--text-dim)", marginRight: 6, fontSize: 10, minWidth: 16 }}>
                    {idx + 1}.
                  </span>
                  <span className="mono" style={{ color: "#f1f5f9", fontWeight: 600 }}>
                    {showSeed ? word : "••••"}
                  </span>
                </div>
              ))}
            </div>
            {!showSeed && (
              <div style={{
                textAlign: "center",
                marginTop: 8,
                fontSize: 12,
                color: "var(--text-muted)"
              }}>
                Seed phrase is masked for screen privacy. Click "Reveal Seed" to view.
              </div>
            )}
          </div>

          {/* Unified Address Card */}
          <div style={{
            background: "rgba(0, 0, 0, 0.35)",
            padding: 18,
            borderRadius: 12,
            border: "1px solid rgba(245, 166, 35, 0.25)",
            marginBottom: 16,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--accent-gold)", fontWeight: 700, letterSpacing: "0.5px" }}>
                  TESTNET UNIFIED ADDRESS (UA)
                </span>
                <span style={{
                  fontSize: 10,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "var(--accent-emerald)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontWeight: 600
                }}>
                  SHIELDED
                </span>
              </div>
              <button
                id="copy-ua-btn"
                className="btn-primary"
                style={{ padding: "5px 12px", fontSize: 12 }}
                onClick={copyAddress}
              >
                {copiedUA ? "✓ Copied!" : "Copy UA"}
              </button>
            </div>

            <div
              className="mono"
              style={{
                fontSize: 12,
                color: "#f8fafc",
                background: "rgba(0, 0, 0, 0.4)",
                padding: "10px 12px",
                borderRadius: 8,
                wordBreak: "break-all",
                lineHeight: 1.5,
                border: "1px solid rgba(255, 255, 255, 0.06)"
              }}
            >
              {account.unifiedAddress}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: "var(--accent-cyan)", background: "rgba(6, 182, 212, 0.1)", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
                ✓ Orchard Receiver (Halo 2)
              </span>
              <span style={{ fontSize: 10, color: "var(--accent-emerald)", background: "rgba(16, 185, 129, 0.1)", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
                ✓ Sapling Receiver (Groth16)
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", background: "rgba(255, 255, 255, 0.05)", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
                ✓ Transparent Receiver
              </span>
            </div>
          </div>

          {/* UFVK Card */}
          <div style={{
            background: "rgba(0, 0, 0, 0.25)",
            padding: 14,
            borderRadius: 10,
            border: "1px solid var(--bg-card-border)",
            marginBottom: 20
          }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, marginBottom: 4, letterSpacing: "0.5px" }}>
              UNIFIED FULL VIEWING KEY (UFVK)
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent-cyan)", wordBreak: "break-all", opacity: 0.9 }}>
              {account.ufvk.substring(0, 75)}...
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              id="proceed-sync-btn"
              className="btn-primary"
              onClick={() => onAccountCreated(account)}
            >
              <span>Proceed to Step 3: Tip Sync</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
