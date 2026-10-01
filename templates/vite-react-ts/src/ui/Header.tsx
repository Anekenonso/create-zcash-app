import { EnvironmentTier } from "../zcash/types";

interface HeaderProps {
  environment: EnvironmentTier;
  crossOriginIsolated: boolean;
  wasmReady: boolean;
}

export function Header({ environment, crossOriginIsolated, wasmReady }: HeaderProps) {
  return (
    <header style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f5a623 0%, #d98207 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 22,
              color: "#000",
              boxShadow: "0 0 24px rgba(245, 166, 35, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
              flexShrink: 0
            }}>
              ⓩ
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.6px", color: "#ffffff" }}>
                  create-zcash-app
                </h1>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--accent-gold)",
                  background: "rgba(245, 166, 35, 0.12)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  border: "1px solid rgba(245, 166, 35, 0.25)"
                }}>
                  v0.1.0-alpha
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>
                Instant Zero-to-Shielded Browser Client • ZECATHON 2026
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="badge badge-gold">
            <span className="pulse-dot"></span>
            {environment}
          </span>

          <span className={`badge ${crossOriginIsolated ? "badge-green" : "badge-gold"}`}>
            {crossOriginIsolated ? "COOP/COEP: ACTIVE" : "COOP/COEP: PENDING"}
          </span>

          <span className={`badge ${wasmReady ? "badge-green" : "badge-blue"}`}>
            {wasmReady ? "WASM: READY" : "WASM: IDLE"}
          </span>

          <a
            href="https://github.com/Anekenonso/create-zcash-app"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12, textDecoration: "none" }}
            title="View Source on GitHub"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </header>
  );
}
