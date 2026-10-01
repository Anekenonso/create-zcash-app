import { AppError } from "./types";

export const ERRORS = {
  WASM_INIT_FAILED: (detail?: string): AppError => ({
    code: "WASM_INIT_FAILED",
    message: "Failed to initialize the Zcash WebAssembly cryptographic runtime.",
    developerMessage: detail,
    retryable: true,
    suggestedAction: "Check browser WebAssembly support and reload the page."
  }),
  ACCOUNT_CREATION_FAILED: (detail?: string): AppError => ({
    code: "ACCOUNT_CREATION_FAILED",
    message: "Failed to derive Zcash keys and account structure from seed.",
    developerMessage: detail,
    retryable: false,
    suggestedAction: "Ensure the seed phrase has 24 valid BIP39 words."
  }),
  LIGHT_SERVER_UNAVAILABLE: (endpoint: string, detail?: string): AppError => ({
    code: "LIGHT_SERVER_UNAVAILABLE",
    message: `Could not reach Zcash testnet light server at ${endpoint}.`,
    developerMessage: detail,
    retryable: true,
    suggestedAction: "Check your internet connection or switch to the fallback endpoint."
  }),
  SYNC_FAILED: (detail?: string): AppError => ({
    code: "SYNC_FAILED",
    message: "Failed to synchronize compact blocks with the chain tip.",
    developerMessage: detail,
    retryable: true,
    suggestedAction: "Verify your light-server connection and retry sync."
  }),
  INVALID_RECIPIENT: (address: string): AppError => ({
    code: "INVALID_RECIPIENT",
    message: `The provided address "${address}" is not a valid Zcash testnet address.`,
    retryable: false,
    suggestedAction: "Provide a valid testnet Unified Address (utest1...) or Transparent address (tm...)."
  }),
  INSUFFICIENT_FUNDS: (requested: string, available: string): AppError => ({
    code: "INSUFFICIENT_FUNDS",
    message: `Insufficient balance. Requested: ${requested} ZEC, Available: ${available} ZEC (including network fee).`,
    retryable: false,
    suggestedAction: "Request additional testnet ZEC from the testnet faucet."
  }),
  PROVING_FAILED: (detail?: string): AppError => ({
    code: "PROVING_FAILED",
    message: "Failed to generate Zero-Knowledge proof in browser WebWorker.",
    developerMessage: detail,
    retryable: true,
    suggestedAction: "Ensure Cross-Origin Isolation (COOP/COEP) is active and retry."
  }),
  BROADCAST_FAILED: (detail?: string): AppError => ({
    code: "BROADCAST_FAILED",
    message: "Light server rejected transaction broadcast.",
    developerMessage: detail,
    retryable: true,
    suggestedAction: "Verify note commitments have confirmed and retry broadcast."
  })
};
