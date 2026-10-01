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
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    onLog("Generating new BIP39 24-word seed phrase...");
    const newSeed = generateNewSeed();
    setSeed(newSeed);

    onLog("Deriving testnet Unified Spending Key and Unified Address...");
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--accent-gold)" }}>
        Step 2: Account Derivation & Unified Address
      </h2>
      <p style={{ margin: "0 0 20px", color: "var(--text-muted)", fontSize: 14 }}>
        Derives an account via ZIP32 hierarchical deterministic keys, generating a Unified Address containing Orchard and Sapling shielded receivers.
      </p>

      {!account ? (
        <button
          id="generate-account-btn"
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Deriving ZIP32 Account..." : "Generate Testnet Account"}
        </button>
      ) : (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>
              24-WORD TESTNET RECOVERY PHRASE (BIP39):
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: 6,
              background: "rgba(0,0,0,0.4)",
              padding: 12,
              borderRadius: 8,
              border: "1px solid var(--bg-card-border)"
            }}>
              {seed.split(" ").map((word, idx) => (
                <div key={idx} style={{ fontSize: 12, color: "#cbd5e1" }}>
                  <span style={{ color: "var(--text-muted)", marginRight: 4 }}>{idx + 1}.</span>
                  <span className="mono">{word}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: 14, borderRadius: 8, border: "1px solid var(--bg-card-border)", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "var(--accent-gold)", fontWeight: 600 }}>
                TESTNET UNIFIED ADDRESS (UA):
              </span>
              <button
                id="copy-ua-btn"
                className="btn-secondary"
                style={{ padding: "4px 10px", fontSize: 11 }}
                onClick={copyAddress}
              >
                {copied ? "✔ Copied" : "Copy UA"}
              </button>
            </div>
            <div className="mono" style={{ fontSize: 12, color: "#e2e8f0", wordBreak: "break-all" }}>
              {account.unifiedAddress}
            </div>
          </div>

          <div style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8, border: "1px solid var(--bg-card-border)", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
              UNIFIED FULL VIEWING KEY (UFVK):
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent-cyan)", wordBreak: "break-all" }}>
              {account.ufvk.substring(0, 80)}...
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              id="proceed-sync-btn"
              className="btn-primary"
              onClick={() => onAccountCreated(account)}
            >
              Proceed to Step 3: Tip Sync →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
