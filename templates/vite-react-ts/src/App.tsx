import { useState, useEffect } from "react";
import { Header } from "./ui/Header";
import { PipelineNav } from "./ui/PipelineNav";
import { Step1Wasm } from "./ui/Step1Wasm";
import { Step2Account } from "./ui/Step2Account";
import { Step3Sync } from "./ui/Step3Sync";
import { Step4Funding } from "./ui/Step4Funding";
import { Step5Send } from "./ui/Step5Send";
import { DiagnosticLog } from "./ui/DiagnosticLog";
import { AppStage, AccountData, WalletBalances, TransactionReceipt } from "./zcash/types";
import { zcashClient } from "./zcash/client";
import "./index.css";

export default function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>("WASM_INIT");
  const [completedStages, setCompletedStages] = useState<Record<AppStage, boolean>>({
    WASM_INIT: false,
    ACCOUNT_SETUP: false,
    CHAIN_SYNC: false,
    FUNDING: false,
    SHIELDED_TRANSFER: false
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [wasmReady, setWasmReady] = useState(false);
  const [crossOriginIsolated, setCrossOriginIsolated] = useState(false);

  const addLog = (msg: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
  };

  useEffect(() => {
    const isIsolated = window.crossOriginIsolated || false;
    setCrossOriginIsolated(isIsolated);
    addLog(`Environment initialized: Cross-Origin Isolation = ${isIsolated ? "ACTIVE" : "INACTIVE"}`);
  }, []);

  const handleWasmInitialized = () => {
    setWasmReady(true);
    setCompletedStages((prev) => ({ ...prev, WASM_INIT: true }));
    setCurrentStage("ACCOUNT_SETUP");
  };

  const handleAccountCreated = (account: AccountData) => {
    zcashClient.setAccount(account);
    setCompletedStages((prev) => ({ ...prev, ACCOUNT_SETUP: true }));
    setCurrentStage("CHAIN_SYNC");
  };

  const handleSyncComplete = () => {
    setCompletedStages((prev) => ({ ...prev, CHAIN_SYNC: true }));
    setCurrentStage("FUNDING");
  };

  const handleFunded = (_balances: WalletBalances) => {
    setCompletedStages((prev) => ({ ...prev, FUNDING: true }));
    setCurrentStage("SHIELDED_TRANSFER");
  };

  const handleTransferSuccess = (_receipt: TransactionReceipt) => {
    setCompletedStages((prev) => ({ ...prev, SHIELDED_TRANSFER: true }));
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
      <Header
        environment="TESTNET"
        crossOriginIsolated={crossOriginIsolated}
        wasmReady={wasmReady}
      />

      <PipelineNav
        currentStage={currentStage}
        completedStages={completedStages}
        onSelectStage={(stage) => setCurrentStage(stage)}
      />

      <main>
        {currentStage === "WASM_INIT" && (
          <Step1Wasm
            onInitialized={handleWasmInitialized}
            onLog={addLog}
          />
        )}

        {currentStage === "ACCOUNT_SETUP" && (
          <Step2Account
            onAccountCreated={handleAccountCreated}
            onLog={addLog}
          />
        )}

        {currentStage === "CHAIN_SYNC" && (
          <Step3Sync
            onSyncComplete={handleSyncComplete}
            onLog={addLog}
          />
        )}

        {currentStage === "FUNDING" && (
          <Step4Funding
            onFunded={handleFunded}
            onLog={addLog}
          />
        )}

        {currentStage === "SHIELDED_TRANSFER" && (
          <Step5Send
            onSuccess={handleTransferSuccess}
            onLog={addLog}
          />
        )}
      </main>

      <DiagnosticLog
        logs={logs}
        onClear={() => setLogs([])}
      />

      <footer style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
        <span>ZECATHON 2026 — Presented by @zksnarks_ | Core & Tooling Track</span>
      </footer>
    </div>
  );
}
