/**
 * Zcash Network & Infrastructure Configuration
 * Locked technical baseline for create-zcash-app
 */

export type NetworkType = "testnet" | "mainnet";

export interface NetworkConfig {
  network: NetworkType;
  lightdUrl: string;
  fallbackLightdUrl: string;
  explorerUrl: string;
  faucetUrl: string;
  defaultBirthdayBuffer: number;
}

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  testnet: {
    network: "testnet",
    lightdUrl: "https://testnet.zec.rocks:443",
    fallbackLightdUrl: "https://zcash-testnet.chainsafe.dev",
    explorerUrl: "https://blockexplorer.one/zcash/testnet",
    faucetUrl: "https://faucet.zec.rocks",
    defaultBirthdayBuffer: 10
  },
  mainnet: {
    network: "mainnet",
    lightdUrl: "https://zec.rocks:443",
    fallbackLightdUrl: "https://zcash-mainnet.chainsafe.dev",
    explorerUrl: "https://blockexplorer.one/zcash/mainnet",
    faucetUrl: "",
    defaultBirthdayBuffer: 10
  }
};

/**
 * Default active network for template V1 is strictly TESTNET
 */
export const ACTIVE_NETWORK: NetworkConfig = NETWORKS.testnet;
