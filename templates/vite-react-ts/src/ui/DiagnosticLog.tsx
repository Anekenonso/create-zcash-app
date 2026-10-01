import { useState, useEffect, useRef } from "react";

interface DiagnosticLogProps {
  logs: string[];
  onClear: () => void;
}

export function DiagnosticLog({ logs, onClear }: DiagnosticLogProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsed) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, collapsed]);

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ marginTop: 24, padding: 18, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          </div>

          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.5px" }}>
            DIAGNOSTIC TERMINAL LOGS
          </span>
          <span style={{
            fontSize: 11,
            color: "var(--text-muted)",
            background: "rgba(255, 255, 255, 0.06)",
            padding: "2px 8px",
            borderRadius: 9999,
            fontWeight: 600
          }}>
            {logs.length} events
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: 11 }} onClick={copyLogs}>
            {copied ? "✓ Copied" : "Copy Logs"}
          </button>
          <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: 11 }} onClick={onClear}>
            Clear
          </button>
          <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => setCollapsed(!collapsed)}>
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
            background: "rgba(0, 0, 0, 0.6)",
            padding: 14,
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.6,
            color: "#cbd5e1",
            border: "1px solid rgba(255, 255, 255, 0.06)"
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: "var(--text-dim)", fontStyle: "italic" }}>
              No diagnostic events recorded yet. Perform an action to stream events.
            </div>
          ) : (
            logs.map((log, i) => {
              const isSuccess = log.includes("✔") || log.includes("SUCCESSFUL");
              const isError = log.includes("❌") || log.includes("failed");
              const isProving = log.includes("Proving:") || log.includes("Sync:");

              return (
                <div
                  key={i}
                  style={{
                    wordBreak: "break-all",
                    color: isError
                      ? "var(--accent-rose)"
                      : isSuccess
                      ? "var(--accent-emerald)"
                      : isProving
                      ? "var(--accent-cyan)"
                      : "#cbd5e1",
                    padding: "1px 0"
                  }}
                >
                  {log}
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
