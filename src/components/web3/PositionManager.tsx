import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseUnits, formatEther, parseEther } from "viem";
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
import { Loader2, CheckCircle, RefreshCcw, Coins } from "lucide-react";

const ENGINE_ADDRESS = "0x0F9000849a0C9A4A0716eC98b7E7A23Ba4195584" as const;
const TSCV2_ADDRESS = "0x15eA6cF28c03086098159c658Fb7cc2a0c2a85de" as const;
const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9" as const;

// --- ABIs (minimal) ---
const ENGINE_ABI = [
  {
    type: "function",
    name: "getAccountInformation",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "totalMinted", type: "uint256" },
      { name: "collateralValueUsd", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getHealthFactor",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },

  // write fns you already use
  {
    type: "function",
    name: "depositCollateral",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenCollateralAddress", type: "address" },
      { name: "amountCollateral", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "depositCollateralAndMintTsc",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenCollateralAddress", type: "address" },
      { name: "amountCollateral", type: "uint256" },
      { name: "amountTscToMint", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "mintTsc",
    stateMutability: "nonpayable",
    inputs: [{ name: "amountTscToMint", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "repayTsc",
    stateMutability: "nonpayable",
    inputs: [{ name: "amountTscToRepay", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "redeemCollateral",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenCollateralAddress", type: "address" },
      { name: "amountCollateral", type: "uint256" },
    ],
    outputs: [],
  },

  // ✅ include custom errors so viem can decode revert properly
  { type: "error", name: "EngineV2__NeedsMoreThanZero", inputs: [] },
  { type: "error", name: "EngineV2__TokenNotAllowed", inputs: [] },
  { type: "error", name: "EngineV2__TransferFailed", inputs: [] },
  {
    type: "error",
    name: "EngineV2__BreaksHealthFactor",
    inputs: [{ name: "healthFactor", type: "uint256" }],
  },
  { type: "error", name: "EngineV2__MintFailed", inputs: [] },
  { type: "error", name: "EngineV2__TokenAndPriceFeedLengthMismatch", inputs: [] },
  { type: "error", name: "EngineV2__NotZeroAddress", inputs: [] },
  { type: "error", name: "EngineV2__MintPaused", inputs: [] },
  { type: "error", name: "EngineV2__BadBps", inputs: [] },
  { type: "error", name: "EngineV2__BadHealthFactor", inputs: [] },
  { type: "error", name: "EngineV2__BadPrice", inputs: [] },
] as const;


const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
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
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

// WETH9 style
const WETH_ABI = [
  ...ERC20_ABI,
  {
    name: "deposit",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "wad", type: "uint256" }],
    outputs: [],
  },
] as const;

function shortHash(v?: string) {
  if (!v) return "";
  return `${v.slice(0, 6)}...${v.slice(-4)}`;
}

function sanitizeDecimalInput(value: string, maxDecimals: number) {
  let v = (value ?? "").replace(/,/g, "").trim();
  if (v === "") return "";

  v = v.replace(/[^\d.]/g, "");

  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    const before = v.slice(0, firstDot);
    const after = v.slice(firstDot + 1).replace(/\./g, "");
    v = `${before}.${after}`;
  }

  if (v.startsWith(".")) v = `0${v}`;

  const [iRaw, dRaw] = v.split(".");
  const i = (iRaw || "0").replace(/^0+(?=\d)/, "") || "0";

  if (typeof dRaw === "string") {
    const d = dRaw.slice(0, Math.max(0, maxDecimals));
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
  if (raw === undefined) return "—";
  const s = formatUnits(raw, decimals);
  const n = Number(s);
  if (!isFinite(n)) return s;
  if (n === 0) return "0";

  const abs = Math.abs(n);
  if (abs >= 1) return n.toFixed(2);

  if (abs >= 1e-6) {
    const fixed = n.toFixed(6);
    return fixed.replace(/0+$/, "").replace(/\.$/, "");
  }

  return n.toExponential(2);
}

function prettyErr(e: unknown) {
  if (!e) return "";
  if (typeof e === "string") return e;
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

export const PositionManager = () => {
  const { address, isConnected, chain } = useAccount();
  const { toast } = useToast();

  // --- Inputs ---
  const [wrapEth, setWrapEth] = useState("");
  const [depositWeth, setDepositWeth] = useState("");
  const [mintTsc, setMintTsc] = useState("");
  const [repayTsc, setRepayTsc] = useState("");
  const [redeemWeth, setRedeemWeth] = useState("");

  // --- Balances ---
  const { data: ethBalance, refetch: refetchEth } = useBalance({ address });

  const { data: wethDecimalsData } = useReadContract({
    address: WETH_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
  });
  const wethDecimals = Number(wethDecimalsData ?? 18);

  const { data: tscDecimalsData } = useReadContract({
    address: TSCV2_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
  });
  const tscDecimals = Number(tscDecimalsData ?? 18);

  const { data: wethSymbol } = useReadContract({
    address: WETH_ADDRESS,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  const { data: tscSymbol } = useReadContract({
    address: TSCV2_ADDRESS,
    abi: ERC20_ABI,
    functionName: "symbol",
  });

  const { data: wethBalRaw, refetch: refetchWeth } = useReadContract({
    address: WETH_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: tscBalRaw, refetch: refetchTsc } = useReadContract({
    address: TSCV2_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const wethBalance = useMemo(() => {
    return formatSmartUnits(wethBalRaw as bigint | undefined, wethDecimals);
  }, [wethBalRaw, wethDecimals]);

  const tscBalance = useMemo(() => {
    return formatSmartUnits(tscBalRaw as bigint | undefined, tscDecimals);
  }, [tscBalRaw, tscDecimals]);

  // --- Allowances (WETH + TSC to Engine) ---
  const { data: wethAllowanceRaw, refetch: refetchWethAllowance } =
    useReadContract({
      address: WETH_ADDRESS,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: address ? [address, ENGINE_ADDRESS] : undefined,
    });

  const { data: tscAllowanceRaw, refetch: refetchTscAllowance } =
    useReadContract({
      address: TSCV2_ADDRESS,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: address ? [address, ENGINE_ADDRESS] : undefined,
    });

  const wethAllowance = useMemo(() => {
    return formatSmartUnits(
      wethAllowanceRaw as bigint | undefined,
      wethDecimals,
    );
  }, [wethAllowanceRaw, wethDecimals]);

  const tscAllowance = useMemo(() => {
    return formatSmartUnits(tscAllowanceRaw as bigint | undefined, tscDecimals);
  }, [tscAllowanceRaw, tscDecimals]);

  // --- Position reads (these were blank) ---
  const acct = useReadContract({
    address: ENGINE_ADDRESS,
    abi: ENGINE_ABI,
    functionName: "getAccountInformation",
    args: address ? [address] : undefined,
  });

  const hf = useReadContract({
    address: ENGINE_ADDRESS,
    abi: ENGINE_ABI,
    functionName: "getHealthFactor",
    args: address ? [address] : undefined,
  });

  const accountInfo = acct.data as readonly [bigint, bigint] | undefined;
  const hfRaw = hf.data as bigint | undefined;

  // ✅ IMPORTANT: don’t do `if (!hfRaw)` because 0n is falsy
  const healthFactor = useMemo(() => {
    if (hfRaw === undefined) return "—";
    try {
      const n = Number(formatUnits(hfRaw, 18));
      if (!isFinite(n)) return "—";
      return n.toFixed(3);
    } catch {
      return "—";
    }
  }, [hfRaw]);

  const totalMinted = useMemo(() => {
    if (!accountInfo) return "—";
    return formatSmartUnits(accountInfo[0], tscDecimals);
  }, [accountInfo, tscDecimals]);

  const collateralUsd = useMemo(() => {
    if (!accountInfo) return "—";
    const s = formatSmartUnits(accountInfo[1], 18);
    const n = Number(s);
    if (!isFinite(n)) return s;
    return n >= 1 ? n.toFixed(2) : s;
  }, [accountInfo]);

  // --- Writers ---
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  const isMining = receipt.isLoading;
  const isSuccess = receipt.isSuccess;

  const refreshAll = () => {
    refetchEth();
    refetchWeth();
    refetchTsc();
    refetchWethAllowance();
    refetchTscAllowance();
    acct.refetch();
    hf.refetch();
    toast({ title: "Refreshed", description: "Updated balances & position" });
  };

  useEffect(() => {
    if (isSuccess) {
      acct.refetch();
      hf.refetch();
      refetchWeth();
      refetchTsc();
      refetchWethAllowance();
      refetchTscAllowance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const requireWallet = () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const canWrap = useMemo(() => canParsePositiveAmount(wrapEth, 18), [wrapEth]);
  const canDeposit = useMemo(
    () => canParsePositiveAmount(depositWeth, wethDecimals),
    [depositWeth, wethDecimals],
  );
  const canMint = useMemo(
    () => canParsePositiveAmount(mintTsc, tscDecimals),
    [mintTsc, tscDecimals],
  );
  const canRepay = useMemo(
    () => canParsePositiveAmount(repayTsc, tscDecimals),
    [repayTsc, tscDecimals],
  );
  const canRedeem = useMemo(
    () => canParsePositiveAmount(redeemWeth, wethDecimals),
    [redeemWeth, wethDecimals],
  );

  // --- Actions ---
  const onWrap = () => {
    if (!requireWallet()) return;
    if (!canWrap) {
      toast({
        title: "Invalid amount",
        description: "Enter an ETH amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    writeContract({
      address: WETH_ADDRESS,
      abi: WETH_ABI,
      functionName: "deposit",
      args: [],
      value: parseEther(wrapEth),
    });
  };

  const onApproveWeth = () => {
    if (!requireWallet()) return;
    if (!canDeposit) {
      toast({
        title: "Invalid amount",
        description: "Enter a WETH amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const amt = parseUnits(depositWeth, wethDecimals);
    writeContract({
      address: WETH_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [ENGINE_ADDRESS, amt],
    });
  };

  const onDepositOnly = () => {
    if (!requireWallet()) return;
    if (!canDeposit) {
      toast({
        title: "Invalid amount",
        description: "Enter a WETH amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const collateralAmt = parseUnits(depositWeth, wethDecimals);
    writeContract({
      address: ENGINE_ADDRESS,
      abi: ENGINE_ABI,
      functionName: "depositCollateral",
      args: [WETH_ADDRESS, collateralAmt],
    });
  };

  const onDepositAndMint = () => {
    if (!requireWallet()) return;
    if (!canDeposit || !canMint) {
      toast({
        title: "Invalid amount",
        description: "Enter WETH deposit amount > 0 and TSC mint amount > 0",
        variant: "destructive",
      });
      return;
    }

    const collateralAmt = parseUnits(depositWeth, wethDecimals);
    const mintAmt = parseUnits(mintTsc, tscDecimals);

    writeContract({
      address: ENGINE_ADDRESS,
      abi: ENGINE_ABI,
      functionName: "depositCollateralAndMintTsc",
      args: [WETH_ADDRESS, collateralAmt, mintAmt],
    });
  };

  const onMintOnly = () => {
    if (!requireWallet()) return;
    if (!canMint) {
      toast({
        title: "Invalid amount",
        description: "Enter a TSC amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const mintAmt = parseUnits(mintTsc, tscDecimals);
    writeContract({
      address: ENGINE_ADDRESS,
      abi: ENGINE_ABI,
      functionName: "mintTsc",
      args: [mintAmt],
    });
  };

  const onApproveTsc = () => {
    if (!requireWallet()) return;
    if (!canRepay) {
      toast({
        title: "Invalid amount",
        description: "Enter a TSC amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const amt = parseUnits(repayTsc, tscDecimals);
    writeContract({
      address: TSCV2_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [ENGINE_ADDRESS, amt],
    });
  };

  const onRepay = () => {
    if (!requireWallet()) return;
    if (!canRepay) {
      toast({
        title: "Invalid amount",
        description: "Enter a TSC amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const amt = parseUnits(repayTsc, tscDecimals);
    writeContract({
      address: ENGINE_ADDRESS,
      abi: ENGINE_ABI,
      functionName: "repayTsc",
      args: [amt],
    });
  };

  const onRedeem = () => {
    if (!requireWallet()) return;
    if (!canRedeem) {
      toast({
        title: "Invalid amount",
        description: "Enter a WETH amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const amt = parseUnits(redeemWeth, wethDecimals);
    writeContract({
      address: ENGINE_ADDRESS,
      abi: ENGINE_ABI,
      functionName: "redeemCollateral",
      args: [WETH_ADDRESS, amt],
    });
  };

  if (!isConnected || !address) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Coins className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Connect your wallet to manage your TSC position
          </p>
        </CardContent>
      </Card>
    );
  }

  const statsError = acct.error || hf.error;

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Position Manager</CardTitle>
            <CardDescription>
              WETH collateral → Mint/Repay {String(tscSymbol ?? "TSC")}
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={refreshAll}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Debug line (so we see WHY blank happens) */}
        <div className="rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
          <div>
            Network: <b>{chain?.name ?? "Unknown"}</b> • chainId:{" "}
            <b>{chain?.id ?? "?"}</b>
          </div>
          {statsError ? (
            <div className="mt-1 text-red-400">
              Engine read error: {prettyErr(statsError)}
            </div>
          ) : null}
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Health Factor</p>
            <p className="text-3xl font-bold">{healthFactor}</p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
            <p className="text-sm text-muted-foreground mb-1">
              Collateral Value (USD)
            </p>
            <p className="text-3xl font-bold">
              {collateralUsd === "—" ? "—" : `$${collateralUsd}`}
            </p>
          </div>

          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
            <p className="text-sm text-muted-foreground mb-1">
              Total Minted (Debt)
            </p>
            <p className="text-3xl font-bold">
              {totalMinted}{" "}
              <span className="text-base text-muted-foreground">
                {String(tscSymbol ?? "TSC")}
              </span>
            </p>
          </div>
        </div>

        {/* Wallet balances */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-border/60">
            <p className="text-xs text-muted-foreground">ETH Balance</p>
            <p className="text-lg font-semibold">
              {ethBalance
                ? Number(formatEther(ethBalance.value)).toFixed(4)
                : "0.0000"}{" "}
              ETH
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border/60">
            <p className="text-xs text-muted-foreground">WETH Balance</p>
            <p className="text-lg font-semibold">
              {wethBalance} {String(wethSymbol ?? "WETH")}
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border/60">
            <p className="text-xs text-muted-foreground">TSC Balance</p>
            <p className="text-lg font-semibold">
              {tscBalance} {String(tscSymbol ?? "TSC")}
            </p>
          </div>
        </div>

        {/* Global tx feedback */}
        {(isPending || isMining || isSuccess) && (
          <div className="rounded-lg border border-border/60 p-4 text-sm">
            <div className="flex items-center gap-2">
              {isPending || isMining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-muted-foreground">
                    {isPending
                      ? "Waiting for approval..."
                      : "Transaction mining..."}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-muted-foreground">
                    Success • Tx {shortHash(String(txHash))}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="wrap" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wrap">Wrap</TabsTrigger>
            <TabsTrigger value="depositMint">Deposit+Mint</TabsTrigger>
            <TabsTrigger value="mint">Mint</TabsTrigger>
            <TabsTrigger value="repayRedeem">Repay/Redeem</TabsTrigger>
          </TabsList>

          {/* Wrap */}
          <TabsContent value="wrap" className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wrapEth">Wrap ETH → WETH (optional)</Label>
              <Input
                id="wrapEth"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={wrapEth}
                onChange={(e) =>
                  setWrapEth(sanitizeDecimalInput(e.target.value, 18))
                }
                autoComplete="off"
                spellCheck={false}
              />
              <p className="text-xs text-muted-foreground">
                This calls WETH.deposit() and gives you WETH to use as
                collateral.
              </p>
            </div>

            <Button
              onClick={onWrap}
              disabled={!canWrap || isPending || isMining}
              className="w-full"
            >
              {isPending || isMining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Wrap ETH"
              )}
            </Button>
          </TabsContent>

          {/* Deposit + Mint */}
          <TabsContent value="depositMint" className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="depositWeth">WETH to Deposit</Label>
              <Input
                id="depositWeth"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={depositWeth}
                onChange={(e) =>
                  setDepositWeth(
                    sanitizeDecimalInput(e.target.value, wethDecimals),
                  )
                }
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mintTsc">TSC to Mint</Label>
              <Input
                id="mintTsc"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={mintTsc}
                onChange={(e) =>
                  setMintTsc(sanitizeDecimalInput(e.target.value, tscDecimals))
                }
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Button
                onClick={onApproveWeth}
                disabled={!canDeposit || isPending || isMining}
                variant="secondary"
              >
                Approve WETH (to Engine)
              </Button>

              <Button
                onClick={onDepositOnly}
                disabled={!canDeposit || isPending || isMining}
                variant="outline"
              >
                Deposit Only
              </Button>
            </div>

            <Button
              onClick={onDepositAndMint}
              disabled={!canDeposit || !canMint || isPending || isMining}
              className="w-full"
            >
              Deposit + Mint
            </Button>

            <p className="text-xs text-muted-foreground">
              Current WETH allowance → Engine: <b>{wethAllowance}</b>
            </p>
          </TabsContent>

          {/* Mint only */}
          <TabsContent value="mint" className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mintOnly">TSC to Mint</Label>
              <Input
                id="mintOnly"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={mintTsc}
                onChange={(e) =>
                  setMintTsc(sanitizeDecimalInput(e.target.value, tscDecimals))
                }
                autoComplete="off"
                spellCheck={false}
              />
              <p className="text-xs text-muted-foreground">
                This mints more TSC using your existing collateral (health
                factor must stay safe).
              </p>
            </div>

            <Button
              onClick={onMintOnly}
              disabled={!canMint || isPending || isMining}
              className="w-full"
            >
              Mint TSC
            </Button>
          </TabsContent>

          {/* Repay + Redeem */}
          <TabsContent value="repayRedeem" className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="repayTsc">TSC to Repay</Label>
              <Input
                id="repayTsc"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={repayTsc}
                onChange={(e) =>
                  setRepayTsc(sanitizeDecimalInput(e.target.value, tscDecimals))
                }
                autoComplete="off"
                spellCheck={false}
              />
              <div className="grid md:grid-cols-2 gap-3">
                <Button
                  onClick={onApproveTsc}
                  disabled={!canRepay || isPending || isMining}
                  variant="secondary"
                >
                  Approve TSC (to Engine)
                </Button>
                <Button
                  onClick={onRepay}
                  disabled={!canRepay || isPending || isMining}
                  className="w-full"
                >
                  Repay TSC
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Current TSC allowance → Engine: <b>{tscAllowance}</b>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="redeemWeth">WETH to Redeem</Label>
              <Input
                id="redeemWeth"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={redeemWeth}
                onChange={(e) =>
                  setRedeemWeth(
                    sanitizeDecimalInput(e.target.value, wethDecimals),
                  )
                }
                autoComplete="off"
                spellCheck={false}
              />
              <p className="text-xs text-muted-foreground">
                You can only redeem if your health factor stays above the
                minimum.
              </p>
            </div>

            <Button
              onClick={onRedeem}
              disabled={!canRedeem || isPending || isMining}
              variant="outline"
              className="w-full"
            >
              Redeem WETH
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
