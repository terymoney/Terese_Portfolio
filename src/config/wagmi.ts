// src/config/wagmi.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { http } from "wagmi";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim();
const rpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL?.trim();

const safeProjectId =
  projectId && projectId.length > 0 ? projectId : "MISSING_PROJECT_ID";

if (!rpcUrl) {
  console.warn("Missing VITE_SEPOLIA_RPC_URL. Add it to .env and restart Vite.");
}

export const config = getDefaultConfig({
  appName: "Web3 Portfolio",
  projectId: safeProjectId,
  chains: [sepolia],
  ssr: false,

  // ✅ force wagmi public client to use your RPC
  transports: {
    [sepolia.id]: http(rpcUrl || "https://rpc.sepolia.org"),
  },
});
