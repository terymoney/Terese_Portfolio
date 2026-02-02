import { useEffect, useMemo, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCcw, Image as ImageIcon, X } from "lucide-react";

// ✅ NEW enumerable TOFF contract (your redeploy)
const NFT_ADDRESS =
  "0x5eA535f15ad5B2F9B2dD2b1dDb3D69fC4165E531" as const;

// ✅ Minimal ABI for enumeration + tokenURI
const NFT_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenOfOwnerByIndex",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
] as const;

type NftItem = {
  tokenId: bigint;
  tokenURI: string;
};

type NftMeta = {
  name?: string;
  description?: string;
  image?: string;
};

type ViewItem = {
  tokenId: bigint;
  name: string;
  description: string;
  image: string; // resolved (http/ipfs/data:image)
};

function normalizeIpfs(u: string) {
  if (!u) return "";
  if (u.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${u.slice(7)}`;
  return u;
}

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

// data:application/json;base64,...
function decodeBase64JsonDataUri(uri: string): NftMeta | null {
  const prefix = "data:application/json;base64,";
  if (!uri.startsWith(prefix)) return null;

  const b64 = uri.slice(prefix.length);

  // Unicode-safe base64 decode
  const jsonText = decodeURIComponent(
    Array.prototype.map
      .call(atob(b64), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  try {
    return JSON.parse(jsonText) as NftMeta;
  } catch {
    return null;
  }
}

function resolveFromTokenURI(tokenURI: string) {
  const meta = decodeBase64JsonDataUri(tokenURI);

  const name = meta?.name?.trim() || "Untitled";
  const description = meta?.description?.trim() || "";
  const metaImage = meta?.image ? normalizeIpfs(meta.image) : "";

  // If tokenURI itself is a direct image URL, allow it (rare but possible)
  const direct = normalizeIpfs(tokenURI);

  const image =
    metaImage && (metaImage.startsWith("http") || metaImage.startsWith("data:image"))
      ? metaImage
      : direct && (direct.startsWith("http") || direct.startsWith("data:image"))
        ? direct
        : "";

  return { name, description, image };
}

async function chunked<T, R>(
  items: T[],
  chunkSize: number,
  fn: (chunk: T[]) => Promise<R[]>
) {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const part = items.slice(i, i + chunkSize);
    const res = await fn(part);
    out.push(...res);
  }
  return out;
}

export default function NFTGallery() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { toast } = useToast();

  const [owned, setOwned] = useState<NftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Optional knob
  const [maxToShow, setMaxToShow] = useState("30");

  // ✅ Modal state for full-view
  const [viewer, setViewer] = useState<{
    open: boolean;
    item: ViewItem | null;
  }>({ open: false, item: null });

  const maxToShowNum = useMemo(() => {
    const n = Number(maxToShow || "30");
    if (!isFinite(n) || n <= 0) return 30;
    return Math.min(Math.floor(n), 200);
  }, [maxToShow]);

  const openViewer = (item: ViewItem) => setViewer({ open: true, item });
  const closeViewer = () => setViewer({ open: false, item: null });

  // Close modal on ESC
  useEffect(() => {
    if (!viewer.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer.open]);

  const loadOwned = async () => {
    if (!publicClient || !address) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const bal = (await publicClient.readContract({
        address: NFT_ADDRESS,
        abi: NFT_ABI,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;

      const count = Number(bal);

      if (count === 0) {
        setOwned([]);
        toast({ title: "NFT Gallery Updated", description: "Owned: 0" });
        return;
      }

      const take = Math.min(count, maxToShowNum);
      const indices = Array.from({ length: take }, (_, i) => BigInt(i));

      const tokenIds = await chunked(indices, 10, async (chunk) => {
        const res = await Promise.all(
          chunk.map(
            (idx) =>
              publicClient.readContract({
                address: NFT_ADDRESS,
                abi: NFT_ABI,
                functionName: "tokenOfOwnerByIndex",
                args: [address, idx],
              }) as Promise<bigint>
          )
        );
        return res;
      });

      const items = await chunked(tokenIds, 10, async (chunk) => {
        const res = await Promise.all(
          chunk.map(async (tokenId) => {
            const uri = (await publicClient.readContract({
              address: NFT_ADDRESS,
              abi: NFT_ABI,
              functionName: "tokenURI",
              args: [tokenId],
            })) as string;

            return { tokenId, tokenURI: uri } as NftItem;
          })
        );
        return res;
      });

      items.sort((a, b) => (a.tokenId > b.tokenId ? -1 : 1));
      setOwned(items);

      toast({
        title: "NFT Gallery Updated",
        description: `Owned: ${items.length}${
          count > items.length ? ` (showing ${items.length}/${count})` : ""
        }`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected || !address) return;
    loadOwned();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <Card className="overflow-hidden border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            NFT Gallery
          </CardTitle>
          <CardDescription>Connect your wallet to view your NFTs.</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    );
  }

  return (
    <>
      {/* ✅ Full image viewer modal */}
      {viewer.open && viewer.item ? (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            // click outside content closes
            if (e.currentTarget === e.target) closeViewer();
          }}
        >
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  #{viewer.item.tokenId.toString()} • {viewer.item.name}
                </p>
                {viewer.item.description ? (
                  <p className="text-xs text-muted-foreground truncate">
                    {viewer.item.description}
                  </p>
                ) : null}
              </div>

              <Button variant="outline" size="icon" onClick={closeViewer} title="Close">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-black/40">
              <img
                src={viewer.item.image}
                alt={viewer.item.name}
                className="w-full max-h-[78vh] object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>
      ) : null}

      <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-primary/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ImageIcon className="w-6 h-6" />
                NFT Gallery
              </CardTitle>
              <CardDescription>
                Uses ERC721Enumerable (no log scanning, no RPC log limits).
              </CardDescription>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Max show</span>
                <Input
                  className="h-8 w-24"
                  value={maxToShow}
                  onChange={(e) => setMaxToShow(e.target.value)}
                  inputMode="numeric"
                />
                <Badge variant="secondary">Contract: {shortAddr(NFT_ADDRESS)}</Badge>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={loadOwned}
              disabled={loading}
              title="Refresh"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {errorMsg ? (
            <div className="rounded-lg border border-border/60 p-4 text-sm text-red-400">
              <div className="font-semibold mb-1">RPC error</div>
              <div className="text-muted-foreground break-words">{errorMsg}</div>
              <div className="text-muted-foreground mt-2">
                If this keeps happening, use a stronger RPC (Alchemy/Infura/Ankr) and restart Vite.
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : owned.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No NFTs currently owned by this wallet (on the NEW contract).
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {owned.map((n) => {
                const { name, description, image } = resolveFromTokenURI(n.tokenURI);

                return (
                  <div
                    key={`owned-${n.tokenId.toString()}`}
                    className="rounded-xl border border-border overflow-hidden bg-card"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        if (!image) return;
                        openViewer({
                          tokenId: n.tokenId,
                          name,
                          description,
                          image,
                        });
                      }}
                      title={image ? "Click to view full image" : "No image found in metadata"}
                    >
                      <div className="aspect-video bg-muted/20 flex items-center justify-center relative">
                        {image ? (
                          <>
                            <img
                              src={image}
                              alt={name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {/* subtle hover hint */}
                            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/30 flex items-center justify-center">
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/60 text-white">
                                View full
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground p-3">
                            No image found in metadata.
                          </div>
                        )}
                      </div>
                    </button>

                    <div className="p-3 space-y-1">
                      <p className="font-semibold">#{n.tokenId.toString()}</p>
                      <p className="text-sm font-medium">{name}</p>
                      {description ? (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {description}
                        </p>
                      ) : null}
                      {/* ✅ Removed the long base64/tokenURI completely */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
