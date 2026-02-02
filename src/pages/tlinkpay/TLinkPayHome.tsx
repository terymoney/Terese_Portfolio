import Navigation from "@/components/Navigation";
import { AuthGate } from "@/components/tlinkpay/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { TLINKPAY } from "@/lib/tlinkpay/constants";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PayLinkCard } from "@/components/tlinkpay/PayLinkCard";
import { payUrl } from "@/lib/tlinkpay/utils";

export default function TLinkPayHome() {
  const { toast } = useToast();
  const { address } = useAccount();

  const [amount, setAmount] = useState("200");
  const [desc, setDesc] = useState("Service payment");
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const createInvoice = async () => {
    if (!address) {
      toast({
        title: "Connect wallet",
        description: "Your wallet address becomes the receiver address.",
      });
      return;
    }

    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid USDT amount." });
      return;
    }

    setCreating(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) {
        toast({ title: "Login required", description: "Please login above." });
        return;
      }

      const amountUnits = parseUnits(amount, TLINKPAY.usdt.decimals);

      const { data, error } = await supabase
        .from("tlinkpay_invoices")
        .insert({
          user_id: userId,
          receiver_address: address,
          receiver_name: "Terese",
          chain_id: TLINKPAY.chainId,
          token_address: TLINKPAY.usdt.address,
          token_symbol: TLINKPAY.usdt.symbol,
          token_decimals: TLINKPAY.usdt.decimals,
          amount,
          amount_units: amountUnits.toString(),
          description: desc,
          status: "UNPAID",
        })
        .select("id")
        .single();

      if (error || !data?.id) {
        toast({ title: "Failed", description: error?.message ?? "Could not create invoice." });
        return;
      }

      const url = payUrl(data.id);
      setInvoiceUrl(url);
      toast({ title: "Invoice created ✅", description: "Share the link or QR." });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h1 className="text-3xl font-bold">T-Link Pay</h1>
            <p className="mt-1 text-muted-foreground">
              Pay links for global clients — safer USDT checkout with on-chain proof.
            </p>

            <div className="mt-4">
              <Link to="/t-link-pay/invoices" className="text-sm underline text-muted-foreground hover:text-foreground">
                View invoices
              </Link>
            </div>
          </div>

          <AuthGate>
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Create invoice</h2>
                <ConnectButton />
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="text-sm font-medium">Amount (USDT)</div>
                  <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>

                <div>
                  <div className="text-sm font-medium">Description</div>
                  <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>

                <Button onClick={createInvoice} disabled={creating}>
                  {creating ? "Creating..." : "Create invoice"}
                </Button>
              </div>
            </div>

            {invoiceUrl ? <PayLinkCard invoiceUrl={invoiceUrl} /> : null}
          </AuthGate>
        </div>
      </main>
    </div>
  );
}
