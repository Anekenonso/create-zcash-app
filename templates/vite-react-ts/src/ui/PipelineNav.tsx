import { AppStage } from "../zcash/types";

interface PipelineNavProps {
  currentStage: AppStage;
  completedStages: Record<AppStage, boolean>;
  onSelectStage: (stage: AppStage) => void;
}

const STAGES: { id: AppStage; label: string; stepNumber: number }[] = [
  { id: "WASM_INIT", label: "1. WASM Init", stepNumber: 1 },
  { id: "ACCOUNT_SETUP", label: "2. Account Setup", stepNumber: 2 },
  { id: "CHAIN_SYNC", label: "3. Tip Sync", stepNumber: 3 },
  { id: "FUNDING", label: "4. Faucet & Balance", stepNumber: 4 },
  { id: "SHIELDED_TRANSFER", label: "5. Shielded Send", stepNumber: 5 }
];

export function PipelineNav({ currentStage, completedStages, onSelectStage }: PipelineNavProps) {
  return (
    <nav style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
      gap: 8,
      marginBottom: 24,
      background: "rgba(0, 0, 0, 0.3)",
      padding: 6,
      borderRadius: 10,
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
                ? "rgba(245, 166, 35, 0.15)"
                : isDone
                ? "rgba(16, 185, 129, 0.08)"
                : "transparent",
              color: isActive
                ? "var(--accent-gold)"
                : isDone
                ? "var(--accent-emerald)"
                : "var(--text-muted)",
              border: isActive
                ? "1px solid rgba(245, 166, 35, 0.4)"
                : isDone
                ? "1px solid rgba(16, 185, 129, 0.2)"
                : "1px solid transparent",
              borderRadius: 6,
              padding: "10px 8px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.2s ease"
            }}
          >
            <span>{isDone ? "✔" : stage.stepNumber}</span>
            <span>{stage.label.split(". ")[1]}</span>
          </button>
        );
      })}
    </nav>
  );
}
