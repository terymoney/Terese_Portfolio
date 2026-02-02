// src/components/web3/NFTMinter.tsx
import { useMemo, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Image, Upload } from "lucide-react";

// ✅ NEW deployed TOFF contract on Sepolia (Enumerable version)
const NFT_CONTRACT_ADDRESS =
  "0x5eA535f15ad5B2F9B2dD2b1dDb3D69fC4165E531" as const;

// ✅ ABI: mint + mintPrice (read from chain so UI always matches)
const NFT_ABI = [
  {
    name: "mint",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI_", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    name: "mintPrice",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

// Safer base64 (works in browser + TS)
function toBase64(str: string) {
  return btoa(unescape(encodeURIComponent(str)));
}

function normalizeIpfsToHttp(v: string) {
  const s = (v ?? "").trim();
  if (!s) return "";

  // accept a raw CID
  const looksLikeCid = /^[a-zA-Z0-9]{46,}$/.test(s) && !s.includes("://");
  if (looksLikeCid) return `https://ipfs.io/ipfs/${s}`;

  if (s.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${s.slice(7)}`;

  return s;
}

export const NFTMinter = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrlRaw, setImageUrlRaw] = useState("");

  const imageUrl = useMemo(
    () => normalizeIpfsToHttp(imageUrlRaw),
    [imageUrlRaw],
  );

  // ✅ read mint price from chain (no hardcoding)
  const mintPriceRead = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "mintPrice",
    query: { enabled: true },
  });

  const mintPriceWei = (mintPriceRead.data as bigint | undefined) ?? 0n;
  const mintPriceEth = mintPriceWei > 0n ? formatEther(mintPriceWei) : "0.00005";

  const { writeContract, data: hash, isPending } = useWriteContract();

  const receipt = useWaitForTransactionReceipt({
    hash: hash as `0x${string}` | undefined,
    query: { enabled: Boolean(hash) },
  });

  const isConfirming = receipt.isLoading;
  const isSuccess = receipt.isSuccess;

  const tokenURI = useMemo(() => {
    if (!name || !description || !imageUrl) return "";
    const metadata = { name, description, image: imageUrl };
    const json = JSON.stringify(metadata);
    return `data:application/json;base64,${toBase64(json)}`;
  }, [name, description, imageUrl]);

  const handleMint = () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!name || !description || !imageUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (mintPriceWei === 0n) {
      toast({
        title: "Mint price not loaded",
        description: "Please wait a moment, then try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      writeContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: "mint",
        args: [address, tokenURI],
        value: mintPriceWei, // ✅ exact required payment from chain
      });
    } catch (error) {
      toast({
        title: "Minting failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4 animate-scale-in" />
          <h3 className="text-2xl font-bold mb-2">NFT Minted Successfully!</h3>
          <p className="text-muted-foreground mb-4">
            Transaction Hash:{" "}
            <code className="text-xs bg-muted px-2 py-1 rounded">{hash}</code>
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Mint Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Image className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">NFT Minting Studio</CardTitle>
            <CardDescription>Create and mint your unique NFT on Sepolia</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
          <p className="font-medium mb-1">Mint price</p>
          <p className="text-muted-foreground">
            This contract requires an exact payment of{" "}
            <code className="bg-muted px-1 rounded">{mintPriceEth} ETH</code>.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nft-name">NFT Name</Label>
          <Input
            id="nft-name"
            placeholder="My Awesome NFT"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nft-description">Description</Label>
          <Textarea
            id="nft-description"
            placeholder="Describe your NFT..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL (or IPFS hash)</Label>
          <div className="flex gap-2">
            <Input
              id="image-url"
              placeholder="https://... or ipfs://... or CID"
              value={imageUrlRaw}
              onChange={(e) => setImageUrlRaw(e.target.value)}
            />
            <Button variant="outline" size="icon" title="Upload to IPFS">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: Upload images to IPFS using Pinata or NFT.Storage
          </p>
        </div>

        {imageUrl && (
          <div className="rounded-lg border border-border overflow-hidden">
            <img
              src={imageUrl}
              alt="NFT Preview"
              className="w-full h-64 object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/400x400?text=Invalid+Image+URL";
              }}
            />
          </div>
        )}

        <Button
          onClick={handleMint}
          disabled={!isConnected || isPending || isConfirming || mintPriceWei === 0n}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {isPending ? "Waiting for approval..." : "Minting..."}
            </>
          ) : (
            <>
              <Image className="w-5 h-5 mr-2" />
              Mint NFT
            </>
          )}
        </Button>

        {!isConnected && (
          <p className="text-center text-sm text-muted-foreground">
            Connect your wallet to start minting
          </p>
        )}

        {mintPriceRead.isError ? (
          <p className="text-center text-xs text-red-400">
            Couldn’t read mintPrice (RPC issue). Try refresh.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
};
