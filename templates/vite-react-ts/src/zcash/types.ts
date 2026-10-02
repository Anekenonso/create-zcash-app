/**
 * Zcash Strict TypeScript Data Contracts & State Machine
 * Following Veris Software Evolution Specification
 * 
 * STATUS: FROZEN (Stage 2 — Phase 4 Core Contract)
 * Authority: Deterministic Code & State Machine
 * 
 * These types define the immutable boundary between the Zcash protocol/client
 * layer and UI presentation components.
 */

/**
 * Environment Tier for cryptographic execution.
 * V1 template strictly operates on TESTNET.
 */
export type EnvironmentTier = "TESTNET" | "MAINNET" | "SIMULATED";

/**
 * The 5 sequential onboarding stages in the guided user flow.
 */
export type AppStage = 
  | "WASM_INIT"
  | "ACCOUNT_SETUP"
  | "CHAIN_SYNC"
  | "FUNDING"
  | "SHIELDED_TRANSFER";

/**
 * State machine status for compact block synchronization.
 */
export type SyncStatus = 
  | "uninitialized"
  | "initializing"
  | "ready"
  | "syncing"
  | "synced"
  | "failed";

/**
 * State machine status for zero-knowledge transaction generation and broadcast.
 */
export type TransferStatus = 
  | "idle"
  | "validating"
  | "building"
  | "proving"
  | "broadcasting"
  | "submitted"
  | "failed";

/**
 * Deterministic account data derived from BIP39 seed phrase.
 */
export interface AccountData {
  /** 24-word BIP39 mnemonic phrase */
  seedPhrase: string;
  /** Whether the in-memory Unified Spending Key is present */
  hasUsk: boolean;
  /** Encoded Unified Full Viewing Key (bech32) */
  ufvk: string;
  /** Testnet Unified Address (utest1...) containing Orchard + Sapling + Transparent receivers */
  unifiedAddress: string;
  /** Testnet Transparent fallback address (tm...) */
  transparentAddress: string;
  /** Block height anchor to prevent scanning from genesis */
  birthdayHeight: number;
  /** BIP44/ZIP32 coin derivation account index */
  hdIndex: number;
}

/**
 * Wallet balances split by pool, denominated in zatoshis (bigint) and ZEC (string).
 */
export interface WalletBalances {
  /** Total spendable balance in zatoshis (1 ZEC = 10^8 zatoshis) */
  totalZat: bigint;
  /** Total formatted ZEC string with 8 decimal places */
  totalZec: string;
  /** Transparent pool balance in zatoshis */
  transparentZat: bigint;
  /** Sapling shielded pool balance in zatoshis */
  saplingZat: bigint;
  /** Orchard shielded pool balance in zatoshis */
  orchardZat: bigint;
}

/**
 * Payload parameters required to construct a shielded transfer.
 */
export interface ShieldedSendPayload {
  /** Recipient address (Unified Address or Shielded Address) */
  recipient: string;
  /** Amount to send in ZEC (e.g. "0.001") */
  amountZec: string;
  /** Optional shielded memo (up to 512 bytes) */
  memo?: string;
}

/**
 * Immutable transaction receipt emitted upon successful light-server broadcast.
 */
export interface TransactionReceipt {
  /** Verified 32-byte transaction identifier (hex) */
  txid: string;
  /** Direct link to testnet block explorer */
  explorerUrl: string;
  /** Amount sent in ZEC */
  amountZec: string;
  /** Destination address */
  recipient: string;
  /** Optional transaction memo */
  memo?: string;
  /** Network transaction fee in zatoshis (ZIP317 standard) */
  feeZat: bigint;
  /** Unix timestamp in milliseconds when transaction was broadcast */
  timestamp: number;
  /** Execution environment tier */
  environment: EnvironmentTier;
}

/**
 * Structured diagnostic error format for actionable recovery.
 */
export interface AppError {
  /** Machine-readable error code */
  code: string;
  /** Human-readable explanation */
  message: string;
  /** Low-level technical or WASM stack trace / debug details */
  developerMessage?: string;
  /** Whether the operation can be safely retried */
  retryable: boolean;
  /** Actionable instruction to resolve the failure */
  suggestedAction?: string;
}

/**
 * Deterministic Result monad for error handling without unhandled exceptions.
 */
export type Result<T> = 
  | { ok: true; value: T }
  | { ok: false; error: AppError };

/**
 * Progress callback invoked during compact block sync.
 */
export type SyncProgressCallback = (current: number, target: number, status: string) => void;

/**
 * Step callback invoked during multi-phase shielded proving.
 */
export type TransferStepCallback = (step: string) => void;

/**
 * Strict contract defining the authoritative Zcash client controller.
 */
export interface IZcashClient {
  getAccount(): AccountData | null;
  setAccount(account: AccountData): void;
  getBalances(): WalletBalances;
  queryChainTip(): Promise<Result<number>>;
  sync(onProgress: SyncProgressCallback): Promise<Result<WalletBalances>>;
  depositTestFunds(amountZec: number): WalletBalances;
  executeShieldedTransfer(
    payload: ShieldedSendPayload,
    onStep: TransferStepCallback
  ): Promise<Result<TransactionReceipt>>;
}

