import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PayQr } from "@/components/tlinkpay/PayQr";

export function PayLinkCard({ invoiceUrl }: { invoiceUrl: string }) {
  const { toast } = useToast();

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Share this pay link</h3>

          <a
            href={invoiceUrl}
            target="_blank"
            rel="noreferrer"
            className="break-all text-sm underline text-muted-foreground hover:text-foreground"
          >
            {invoiceUrl}
          </a>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(invoiceUrl);
                toast({ title: "Copied ✅", description: "Pay link copied." });
              }}
            >
              Copy link
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: "T-Link Pay invoice",
                      text: "Pay this invoice",
                      url: invoiceUrl,
                    });
                  } else {
                    await navigator.clipboard.writeText(invoiceUrl);
                    toast({
                      title: "Copied ✅",
                      description: "Share not supported here — link copied.",
                    });
                  }
                } catch {
                  // user cancelled share
                }
              }}
            >
              Share
            </Button>
          </div>
        </div>

        <PayQr url={invoiceUrl} />
      </div>
    </div>
  );
}
