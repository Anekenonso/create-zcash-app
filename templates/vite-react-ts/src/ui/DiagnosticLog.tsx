import { useState } from "react";

interface DiagnosticLogProps {
  logs: string[];
  onClear: () => void;
}

export function DiagnosticLog({ logs, onClear }: DiagnosticLogProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ marginTop: 24, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-gold)" }}>
            DIAGNOSTIC TERMINAL LOGS
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>
            {logs.length} events
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" style={{ padding: "3px 8px", fontSize: 11 }} onClick={copyLogs}>
            {copied ? "✔ Copied" : "Copy Logs"}
          </button>
          <button className="btn-secondary" style={{ padding: "3px 8px", fontSize: 11 }} onClick={onClear}>
            Clear
          </button>
          <button className="btn-secondary" style={{ padding: "3px 8px", fontSize: 11 }} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div
          id="diagnostic-logs-container"
          className="mono"
          style={{
            maxHeight: 180,
            overflowY: "auto",
            background: "rgba(0, 0, 0, 0.45)",
            padding: 12,
            borderRadius: 6,
            fontSize: 12,
            lineHeight: 1.6,
            color: "#94a3b8",
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.3)" }}>No logs recorded yet.</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} style={{ wordBreak: "break-all" }}>
                {log}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
