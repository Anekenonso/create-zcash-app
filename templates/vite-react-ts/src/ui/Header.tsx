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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f5a623 0%, #e09112 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 18,
              color: "#000",
              boxShadow: "0 0 16px rgba(245, 166, 35, 0.4)"
            }}>
              ⓩ
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>
                create-zcash-app
              </h1>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                Zero-to-Shielded Browser Onboarding Experience
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
        </div>
      </div>
    </header>
  );
}
