/**
 * Zcash Strict TypeScript Data Contracts & State Machine
 * Following Veris Software Evolution Specification
 */

export type EnvironmentTier = "TESTNET" | "MAINNET" | "SIMULATED";

export type AppStage = 
  | "WASM_INIT"
  | "ACCOUNT_SETUP"
  | "CHAIN_SYNC"
  | "FUNDING"
  | "SHIELDED_TRANSFER";

export type SyncStatus = 
  | "uninitialized"
  | "initializing"
  | "ready"
  | "syncing"
  | "synced"
  | "failed";

export type TransferStatus = 
  | "idle"
  | "validating"
  | "building"
  | "proving"
  | "broadcasting"
  | "submitted"
  | "failed";

export interface AccountData {
  seedPhrase: string;
  hasUsk: boolean;
  ufvk: string;
  unifiedAddress: string;
  transparentAddress: string;
  birthdayHeight: number;
  hdIndex: number;
}

export interface WalletBalances {
  totalZat: bigint;
  totalZec: string;
  transparentZat: bigint;
  saplingZat: bigint;
  orchardZat: bigint;
}

export interface ShieldedSendPayload {
  recipient: string;
  amountZec: string;
  memo?: string;
}

export interface TransactionReceipt {
  txid: string;
  explorerUrl: string;
  amountZec: string;
  recipient: string;
  memo?: string;
  feeZat: bigint;
  timestamp: number;
  environment: EnvironmentTier;
}

export interface AppError {
  code: string;
  message: string;
  developerMessage?: string;
  retryable: boolean;
  suggestedAction?: string;
}

export type Result<T> = 
  | { ok: true; value: T }
  | { ok: false; error: AppError };
