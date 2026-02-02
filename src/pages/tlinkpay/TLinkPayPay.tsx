import Navigation from "@/components/Navigation";
import { AddressRow } from "@/components/tlinkpay/AddressRow";
import { TLINKPAY } from "@/lib/tlinkpay/constants";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useSwitchChain, useChainId, useWriteContract } from "wagmi";
import { erc20Abi } from "viem";

type Invoice = {
  id: string;
  status: "UNPAID" | "PAID";
  receiver_address: `0x${string}`;
  receiver_name?: string | null;

  chain_id: number;
  token_address: `0x${string}`;
  token_symbol: string;
  token_decimals: number;

  amount: string; // human (e.g. "20")
  amount_units: string; // stringified integer units
  description?: string | null;

  tx_hash?: `0x${string}` | null;
};

export default function TLinkPayPay() {
  const { invoiceId } = useParams();
  const { toast } = useToast();

  const { address: payer } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [inv, setInv] = useState<Invoice | null>(null);
  const [confirmReceiver, setConfirmReceiver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    if (!invoiceId) return;
    setLoadError(null);

    const { data, error } = await supabase.functions.invoke("tlinkpay-public-invoice", {
      body: { invoiceId },
    });

    if (error) {
      setInv(null);
      setLoadError(error.message);
      toast({ title: "Invoice not found", description: error.message });
      return;
    }

    if (!data?.invoice) {
      setInv(null);
      setLoadError("Invoice not found.");
      toast({ title: "Invoice not found", description: "No invoice returned." });
      return;
    }

    setInv(data.invoice as Invoice);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const ensureChain = async () => {
    if (chainId === TLINKPAY.chainId) return;
    if (!switchChainAsync) {
      throw new Error("Your wallet does not support programmatic chain switching.");
    }
    await switchChainAsync({ chainId: TLINKPAY.chainId });
  };

  const pay = async () => {
    if (!inv) return;

    if (!payer) {
      toast({ title: "Connect wallet", description: "Connect a wallet to pay this invoice." });
      return;
    }

    if (!confirmReceiver) {
      toast({ title: "Confirm receiver", description: "Tick the confirmation checkbox first." });
      return;
    }

    setLoading(true);
    try {
      await ensureChain();

      const amountUnits = BigInt(inv.amount_units);

      const txHash = await writeContractAsync({
        abi: erc20Abi,
        address: inv.token_address,
        functionName: "transfer",
        args: [inv.receiver_address, amountUnits],
      });

      toast({ title: "Transaction sent", description: txHash });

      // Server verifies receipt/logs and marks invoice PAID
      const { data, error } = await supabase.functions.invoke("tlinkpay-verify-payment", {
        body: { invoiceId: inv.id, txHash },
      });

      if (error || !data?.ok) {
        toast({
          title: "Verification failed",
          description: error?.message ?? data?.reason ?? "Could not verify.",
        });
        return;
      }

      toast({ title: "Payment verified ✅", description: "Invoice marked PAID with on-chain proof." });
      await load();
    } catch (e: any) {
      toast({ title: "Payment error", description: e?.shortMessage || e?.message || "Error" });
    } finally {
      setLoading(false);
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <div className="pt-24 px-6 max-w-2xl mx-auto">
          <div className="rounded-xl border bg-card p-6 space-y-2">
            <div className="text-lg font-semibold">Could not load invoice</div>
            <div className="text-sm text-muted-foreground">{loadError}</div>
            <button
              onClick={load}
              className="mt-3 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!inv) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <div className="pt-24 px-6 text-sm text-muted-foreground">Loading invoice…</div>
      </div>
    );
  }

  const isPaid = inv.status === "PAID";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h1 className="text-2xl font-bold">
              Pay {inv.amount} {inv.token_symbol}
            </h1>

            <p className="text-sm text-muted-foreground">Network: {TLINKPAY.chainName}</p>

            <AddressRow label="Receiver" address={inv.receiver_address} verified />

            <div className="rounded-lg border p-4">
              <div className="font-medium">Description</div>
              <div className="text-sm text-muted-foreground">{inv.description ?? "—"}</div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={confirmReceiver}
                onChange={(e) => setConfirmReceiver(e.target.checked)}
              />
              I confirm I’m paying the verified receiver above.
            </label>

            <button
              disabled={loading || isPaid}
              onClick={pay}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {isPaid ? "Paid ✅" : loading ? "Processing…" : "Pay now"}
            </button>

            {inv.tx_hash ? (
              <a
                className="block text-center text-sm text-muted-foreground underline"
                href={`${TLINKPAY.explorerTx}${inv.tx_hash}`}
                target="_blank"
                rel="noreferrer"
              >
                View transaction proof
              </a>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
