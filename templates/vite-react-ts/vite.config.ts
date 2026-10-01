import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [
    react(),
    wasm()
  ],
  server: {
    port: 5173,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  },
  build: {
    target: "esnext"
  },
  optimizeDeps: {
    exclude: ["@bytezhang/webzjs-wallet", "@chainsafe/webzjs-keys"]
  }
});
