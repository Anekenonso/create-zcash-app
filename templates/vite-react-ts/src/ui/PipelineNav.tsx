import { AppStage } from "../zcash/types";

interface PipelineNavProps {
  currentStage: AppStage;
  completedStages: Record<AppStage, boolean>;
  onSelectStage: (stage: AppStage) => void;
}

const STAGES: { id: AppStage; label: string; stepNumber: number; sublabel: string }[] = [
  { id: "WASM_INIT", label: "WASM Init", stepNumber: 1, sublabel: "COOP/COEP Runtime" },
  { id: "ACCOUNT_SETUP", label: "Account Setup", stepNumber: 2, sublabel: "ZIP 32 Derivation" },
  { id: "CHAIN_SYNC", label: "Tip Sync", stepNumber: 3, sublabel: "< 3s Block Sync" },
  { id: "FUNDING", label: "Funding", stepNumber: 4, sublabel: "Balance & Dispenser" },
  { id: "SHIELDED_TRANSFER", label: "Shielded Send", stepNumber: 5, sublabel: "Halo 2 ZK Proving" }
];

export function PipelineNav({ currentStage, completedStages, onSelectStage }: PipelineNavProps) {
  const completedCount = Object.values(completedStages).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / STAGES.length) * 100);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 12 }}>
        <span style={{ color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px" }}>
          ONBOARDING PIPELINE PROGRESS
        </span>
        <span className="mono" style={{ color: "var(--accent-gold)", fontWeight: 700 }}>
          {completedCount} of 5 Completed ({progressPercent}%)
        </span>
      </div>

      <div style={{ height: 4, background: "rgba(255, 255, 255, 0.06)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
        <div style={{
          height: "100%",
          width: `${progressPercent}%`,
          background: "linear-gradient(90deg, #f5a623 0%, #10b981 100%)",
          transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 0 8px rgba(245, 166, 35, 0.5)"
        }} />
      </div>

      <nav style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 8,
        background: "rgba(10, 14, 22, 0.6)",
        padding: 6,
        borderRadius: 12,
        border: "1px solid var(--bg-card-border)"
      }}>
        {STAGES.map((stage) => {
          const isActive = currentStage === stage.id;
          const isDone = completedStages[stage.id];

          return (
            <button
              key={stage.id}
              id={`step-${stage.stepNumber}-btn`}
              onClick={() => onSelectStage(stage.id)}
              style={{
                background: isActive
                  ? "rgba(245, 166, 35, 0.14)"
                  : isDone
                  ? "rgba(16, 185, 129, 0.08)"
                  : "transparent",
                color: isActive
                  ? "var(--accent-gold)"
                  : isDone
                  ? "var(--accent-emerald)"
                  : "var(--text-muted)",
                border: isActive
                  ? "1px solid rgba(245, 166, 35, 0.45)"
                  : isDone
                  ? "1px solid rgba(16, 185, 129, 0.25)"
                  : "1px solid transparent",
                borderRadius: 8,
                padding: "8px 10px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 0 14px rgba(245, 166, 35, 0.15)" : "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13 }}>
                <span style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: isDone
                    ? "var(--accent-emerald)"
                    : isActive
                    ? "var(--accent-gold)"
                    : "rgba(255, 255, 255, 0.1)",
                  color: isDone || isActive ? "#000" : "var(--text-muted)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  {isDone ? "✓" : stage.stepNumber}
                </span>
                <span>{stage.label}</span>
              </div>
              <div style={{ fontSize: 10, color: isActive ? "rgba(245, 166, 35, 0.8)" : "var(--text-dim)", marginTop: 2, marginLeft: 24 }}>
                {stage.sublabel}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
