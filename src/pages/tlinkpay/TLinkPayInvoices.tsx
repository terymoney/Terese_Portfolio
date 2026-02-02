import Navigation from "@/components/Navigation";
import { AuthGate } from "@/components/tlinkpay/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useMemo, useState } from "react";
import { payUrl } from "@/lib/tlinkpay/utils";
import { PayLinkCard } from "@/components/tlinkpay/PayLinkCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type InvoiceRow = {
  id: string;
  created_at: string;
  receiver_address: string;
  amount: string;
  description: string;
  status: "UNPAID" | "PAID";
};

export default function TLinkPayInvoices() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;

      if (!userId) {
        setRows([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("tlinkpay_invoices")
        .select("id, created_at, receiver_address, amount, description, status")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setRows([]);
      } else {
        setRows((data ?? []) as InvoiceRow[]);
      }
      setLoading(false);
    })();
  }, []);

  const selectedUrl = useMemo(() => {
    if (!selectedId) return null;
    return payUrl(selectedId);
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border bg-card p-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Invoices</h1>
              <p className="text-sm text-muted-foreground">Your created pay links.</p>
            </div>

            <Link to="/t-link-pay">
              <Button variant="outline">Back</Button>
            </Link>
          </div>

          <AuthGate>
            <div className="rounded-xl border bg-card p-6">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading…</div>
              ) : rows.length === 0 ? (
                <div className="text-sm text-muted-foreground">No invoices yet.</div>
              ) : (
                <div className="space-y-3">
                  {rows.map((r) => (
                    <button
                      key={r.id}
                      className="w-full text-left rounded-lg border bg-background/40 p-4 hover:bg-background/60"
                      onClick={() => setSelectedId(r.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {r.amount} USDT — {r.status}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{r.description}</div>
                      <div className="text-xs text-muted-foreground break-all">{r.id}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedUrl ? <PayLinkCard invoiceUrl={selectedUrl} /> : null}
          </AuthGate>
        </div>
      </main>
    </div>
  );
}
