import { useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseUnits, formatEther } from "viem";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, Send, CheckCircle, RefreshCcw } from "lucide-react";

const TOKEN_CONTRACT_ADDRESS =
  "0x15eA6cF28c03086098159c658Fb7cc2a0c2a85de" as const; // TSCv2

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

function sanitizeDecimalInput(value: string, maxDecimals: number) {
  let v = (value ?? "").replace(/,/g, "").trim();
  if (v === "") return "";

  // remove everything except digits and dot
  v = v.replace(/[^\d.]/g, "");

  // keep only first dot
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    const before = v.slice(0, firstDot);
    const after = v.slice(firstDot + 1).replace(/\./g, "");
    v = `${before}.${after}`;
  }

  // normalize leading dot: ".5" => "0.5"
  if (v.startsWith(".")) v = `0${v}`;

  // trim leading zeros (but keep one zero if needed)
  const [iRaw, dRaw] = v.split(".");
  const i = (iRaw || "0").replace(/^0+(?=\d)/, "") || "0";

  if (typeof dRaw === "string") {
    const d = dRaw.slice(0, Math.max(0, maxDecimals));
    // keep "0." if user is typing decimals
    return d.length > 0 ? `${i}.${d}` : `${i}.`;
  }

  return i;
}

function canParsePositiveAmount(v: string, decimals: number) {
  if (!v) return false;
  try {
    const bi = parseUnits(v, decimals);
    return bi > 0n;
  } catch {
    return false;
  }
}

function formatSmartUnits(raw?: bigint, decimals = 18) {
  if (!raw) return "0";
  const s = formatUnits(raw, decimals);
  const n = Number(s);
  if (!isFinite(n) || n === 0) return n === 0 ? "0" : s;

  const abs = Math.abs(n);
  if (abs >= 1) return n.toFixed(2);

  // show up to 6 dp for small values, otherwise scientific for ultra-small
  if (abs >= 1e-6) {
    const fixed = n.toFixed(6);
    return fixed.replace(/0+$/, "").replace(/\.$/, "");
  }
  return n.toExponential(2);
}

export const TokenDashboard = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [approveSpender, setApproveSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");

  const { data: ethBalance, refetch: refetchEth } = useBalance({ address });

  const { data: tokenName } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "name",
  });

  const { data: tokenSymbol } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  const { data: decimalsData } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const decimals = Number(decimalsData ?? 18);

  const { data: tokenBalance, refetch: refetchToken } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const formattedTokenBalance = useMemo(() => {
    return formatSmartUnits(tokenBalance as bigint | undefined, decimals);
  }, [tokenBalance, decimals]);

  // Transfer
  const {
    writeContract: transfer,
    data: transferHash,
    isPending: isTransferPending,
  } = useWriteContract();

  const transferReceipt = useWaitForTransactionReceipt({
    hash: transferHash as `0x${string}` | undefined,
    query: { enabled: Boolean(transferHash) },
  });

  const isTransferring = transferReceipt.isLoading;
  const isTransferSuccess = transferReceipt.isSuccess;

  // Approve
  const {
    writeContract: approve,
    data: approveHash,
    isPending: isApprovePending,
  } = useWriteContract();

  const approveReceipt = useWaitForTransactionReceipt({
    hash: approveHash as `0x${string}` | undefined,
    query: { enabled: Boolean(approveHash) },
  });

  const isApproving = approveReceipt.isLoading;
  const isApproveSuccess = approveReceipt.isSuccess;

  const transferEnabled = useMemo(() => {
    return Boolean(recipient) && canParsePositiveAmount(amount, decimals);
  }, [recipient, amount, decimals]);

  const approveEnabled = useMemo(() => {
    return (
      Boolean(approveSpender) && canParsePositiveAmount(approveAmount, decimals)
    );
  }, [approveSpender, approveAmount, decimals]);

  const handleTransfer = () => {
    if (!address) return;

    if (!recipient || !amount) {
      toast({
        title: "Missing information",
        description: "Please fill in recipient and amount",
        variant: "destructive",
      });
      return;
    }

    let value: bigint;
    try {
      value = parseUnits(amount, decimals);
    } catch (error) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (value <= 0n) {
      toast({
        title: "Invalid amount",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      transfer({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [recipient as `0x${string}`, value],
      });
    } catch (error) {
      toast({
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleApprove = () => {
    if (!address) return;

    if (!approveSpender || !approveAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in spender and amount",
        variant: "destructive",
      });
      return;
    }

    let value: bigint;
    try {
      value = parseUnits(approveAmount, decimals);
    } catch {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (value <= 0n) {
      toast({
        title: "Invalid amount",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      approve({
        address: TOKEN_CONTRACT_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [approveSpender as `0x${string}`, value],
      });
    } catch (error) {
      toast({
        title: "Approval failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetchEth();
    refetchToken();
    toast({ title: "Refreshed", description: "Balances updated" });
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Coins className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Connect your wallet to view token dashboard
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Coins className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Token Dashboard</CardTitle>
              <CardDescription>
                Manage your ERC20 tokens on Sepolia
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Balances */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">ETH Balance</p>
            <p className="text-3xl font-bold">
              {ethBalance
                ? Number(formatEther(ethBalance.value)).toFixed(4)
                : "0.0000"}{" "}
              <span className="text-lg text-muted-foreground">ETH</span>
            </p>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
            <p className="text-sm text-muted-foreground mb-1">
              {(tokenName as string) || "Token"} Balance
            </p>
            <p className="text-3xl font-bold">
              {formattedTokenBalance}{" "}
              <span className="text-lg text-muted-foreground">
                {(tokenSymbol as string) || "TKN"}
              </span>
            </p>
          </div>
        </div>

        {/* Actions Tabs */}
        <Tabs defaultValue="transfer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="approve">Approve</TabsTrigger>
          </TabsList>

          <TabsContent value="transfer" className="space-y-4 mt-6">
            {isTransferSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-16 h-16 text-primary mx-auto animate-scale-in" />
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Transfer Successful!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tx:{" "}
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {transferHash}
                    </code>
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Make Another Transfer
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) =>
                      setAmount(sanitizeDecimalInput(e.target.value, decimals))
                    }
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <Button
                  onClick={handleTransfer}
                  disabled={
                    !transferEnabled || isTransferPending || isTransferring
                  }
                  className="w-full"
                >
                  {isTransferPending || isTransferring ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isTransferPending ? "Waiting..." : "Transferring..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Transfer Tokens
                    </>
                  )}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="approve" className="space-y-4 mt-6">
            {isApproveSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-16 h-16 text-primary mx-auto animate-scale-in" />
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Approval Successful!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tx:{" "}
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {approveHash}
                    </code>
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Make Another Approval
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm mb-4">
                  <p className="text-muted-foreground">
                    Approve another address to spend your tokens (useful for
                    DEXs and DeFi protocols)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spender">Spender Address</Label>
                  <Input
                    id="spender"
                    placeholder="0x..."
                    value={approveSpender}
                    onChange={(e) => setApproveSpender(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approve-amount">Amount to Approve</Label>
                  <Input
                    id="approve-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={approveAmount}
                    onChange={(e) =>
                      setApproveAmount(
                        sanitizeDecimalInput(e.target.value, decimals),
                      )
                    }
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <Button
                  onClick={handleApprove}
                  disabled={!approveEnabled || isApprovePending || isApproving}
                  className="w-full"
                  variant="secondary"
                >
                  {isApprovePending || isApproving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isApprovePending ? "Waiting..." : "Approving..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Tokens
                    </>
                  )}
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
