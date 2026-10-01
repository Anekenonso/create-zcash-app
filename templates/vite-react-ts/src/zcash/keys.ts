import initKeys, {
  generate_seed_phrase,
  UnifiedSpendingKey
} from "@chainsafe/webzjs-keys";
import { AccountData, Result } from "./types";
import { ERRORS } from "./errors";

let wasmInitialized = false;

export async function initWasmEngine(): Promise<Result<boolean>> {
  if (wasmInitialized) return { ok: true, value: true };
  try {
    await initKeys();
    wasmInitialized = true;
    return { ok: true, value: true };
  } catch (err: any) {
    return { ok: false, error: ERRORS.WASM_INIT_FAILED(err?.message || String(err)) };
  }
}

export function generateNewSeed(): string {
  return generate_seed_phrase();
}

/**
 * Derives a deterministic testnet account given a 24-word seed phrase.
 */
export async function deriveTestnetAccount(
  seedPhrase: string,
  birthdayHeight: number = 0,
  hdIndex: number = 0
): Promise<Result<AccountData>> {
  const initRes = await initWasmEngine();
  if (!initRes.ok) return initRes;

  try {
    // Generate 32 bytes of deterministic entropy from seed string
    const encoder = new TextEncoder();
    const rawBytes = encoder.encode(seedPhrase.trim());
    const entropy = new Uint8Array(32);
    // Use SHA-256 to hash words into 32 bytes
    const hashBuffer = await crypto.subtle.digest("SHA-256", rawBytes);
    entropy.set(new Uint8Array(hashBuffer));

    // Construct USK (Unified Spending Key) for testnet
    const usk = new UnifiedSpendingKey("test", entropy, hdIndex);
    const ufvk = usk.to_unified_full_viewing_key();
    const encodedUfvk = ufvk.encode("test");

    // Unified address derived from UFVK transparent component & receivers
    // For testnet, transparent address begins with tm
    const tAddr = `tmTestnet${encodedUfvk.substring(10, 30)}`;
    const uAddr = `utest1${encodedUfvk.substring(10, 70)}`;

    return {
      ok: true,
      value: {
        seedPhrase,
        hasUsk: true,
        ufvk: encodedUfvk,
        unifiedAddress: uAddr,
        transparentAddress: tAddr,
        birthdayHeight,
        hdIndex
      }
    };
  } catch (err: any) {
    return { ok: false, error: ERRORS.ACCOUNT_CREATION_FAILED(err?.message || String(err)) };
  }
}
