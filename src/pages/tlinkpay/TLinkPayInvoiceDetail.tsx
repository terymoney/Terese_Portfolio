import Navigation from "@/components/Navigation";
import { AuthGate } from "@/components/tlinkpay/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { TLINKPAY } from "@/lib/tlinkpay/constants";
import { AddressRow } from "@/components/tlinkpay/AddressRow";
import { PayQr } from "@/components/tlinkpay/PayQr";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TLinkPayInvoiceDetail() {
  const { invoiceId } = useParams();
  const [inv, setInv] = useState<any>(null);

  const load = async () => {
    if (!invoiceId) return;
    const { data } = await supabase.from("tlinkpay_invoices").select("*").eq("id", invoiceId).single();
    setInv(data);
  };

  useEffect(() => { load(); }, [invoiceId]);

  if (!inv) return <div className="min-h-screen"><Navigation /><div className="pt-24 px-6">Loading…</div></div>;

  const payUrl = `${window.location.origin}/t-link-pay/pay/${inv.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <AuthGate>
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Invoice receipt</h1>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => window.print()}>Print</Button>
                  <Link to="/t-link-pay/invoices">
                    <Button variant="outline">Back</Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Invoice ID</div>
                <div className="font-mono text-sm break-all">{inv.id}</div>
              </div>

              <div className="grid gap-3">
                <AddressRow label="Receiver" address={inv.receiver_address} verified />
                {inv.payer_address ? <AddressRow label="Payer" address={inv.payer_address} /> : null}
              </div>

              <div className="rounded-lg border p-4">
                <div className="font-semibold">{inv.amount} {inv.token_symbol}</div>
                <div className="text-sm text-muted-foreground">{inv.description ?? "—"}</div>
                <div className="text-sm text-muted-foreground mt-1">Network: {TLINKPAY.chainName}</div>
              </div>

              {inv.tx_hash ? (
                <a
                  href={`${TLINKPAY.explorerTx}${inv.tx_hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline text-muted-foreground hover:text-foreground"
                >
                  View transaction proof
                </a>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Not paid yet</div>
                    <div className="text-sm text-muted-foreground">Share the pay link or QR below.</div>
                  </div>
                  <PayQr url={payUrl} />
                </div>
              )}
            </div>
          </AuthGate>
        </div>
      </main>
    </div>
  );
}
