import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navigation from "@/components/Navigation";
import Reveal from "@/components/Reveal";

import { NFTMinter } from "@/components/web3/NFTMinter";
import NFTGallery from "@/components/web3/NFTGallery";
import { TokenDashboard } from "@/components/web3/TokenDashboard";
import { PositionManager } from "@/components/web3/PositionManager";

import { Code2, Wallet, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Web3 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Reveal variant="text" delayMs={0}>
              <div className="inline-flex items-center gap-2 mb-4">
                <Code2 className="w-8 h-8 text-primary" />
                <h1 className="text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  Web3 Portfolio
                </h1>
              </div>
            </Reveal>

            <Reveal variant="text" delayMs={80}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore decentralized applications built on Sepolia testnet
              </p>
            </Reveal>
          </div>

          {/* Wallet Connection Card */}
          <div className="mb-10">
            <Reveal delayMs={0}>
              <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full -mr-8 -mt-8" />

                <Wallet className="w-12 h-12 text-primary mb-4 relative z-10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">
                  Wallet Connection
                </h3>
                <p className="text-muted-foreground relative z-10">
                  Seamless integration with MetaMask, WalletConnect, and other Web3 wallets.
                </p>

                <div className="relative z-10 mt-6">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      mounted,
                    }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      if (!ready) {
                        return (
                          <Button className="w-full" disabled>
                            Loading…
                          </Button>
                        );
                      }

                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-elevation transition-all"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      return (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            variant="outline"
                            onClick={openChainModal}
                            className="w-full sm:w-auto"
                            title="Change network"
                          >
                            {chain?.name ?? "Network"}
                          </Button>

                          <Button
                            onClick={openAccountModal}
                            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-elevation transition-all"
                            title="Account"
                          >
                            {account?.displayName ?? "Account"}
                          </Button>
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </div>
            </Reveal>
          </div>
          {/* NFT Minting Studio (FULL WIDTH) */}
          <Reveal delayMs={0}>
            <div className="mb-16 w-full">
              <NFTMinter />
            </div>
          </Reveal>

          <Reveal delayMs={30}>
  <div className="mb-16 w-full">
    <NFTGallery />
  </div>
</Reveal>


          {/* Position Manager */}
          <Reveal delayMs={0}>
            <div className="mb-16">
              <PositionManager />
            </div>
          </Reveal>

          {/* Token Dashboard */}
          <Reveal delayMs={60}>
            <div>
              <TokenDashboard />
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
};

export default Web3;
