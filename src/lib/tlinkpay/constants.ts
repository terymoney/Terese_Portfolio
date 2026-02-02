export const TLINKPAY = {
  chainId: 11155111, // Sepolia
  chainName: "Sepolia",
  explorerTx: "https://sepolia.etherscan.io/tx/",
  explorerAddr: "https://sepolia.etherscan.io/address/",
  usdt: {
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    address: import.meta.env.VITE_TLINKPAY_USDT_ADDRESS as `0x${string}`,
  },
} as const;

export function shortAddr(addr?: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
