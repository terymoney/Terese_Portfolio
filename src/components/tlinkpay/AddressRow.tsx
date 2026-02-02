import { Copy, BadgeCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shortAddr } from "@/lib/tlinkpay/constants";

export function AddressRow({
  label,
  address,
  verified,
}: {
  label: string;
  address: string;
  verified?: boolean;
}) {
  const { toast } = useToast();

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    toast({ title: "Copied ✅", description: `${label} copied` });
  };

  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-sm font-medium">
          {label}
          {verified ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-500">
              <BadgeCheck className="h-4 w-4" /> Verified
            </span>
          ) : null}
        </div>
        <div className="text-xs text-muted-foreground">{shortAddr(address)}</div>
      </div>

      <button
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm hover:bg-accent"
        type="button"
      >
        <Copy className="h-4 w-4" />
        Copy
      </button>
    </div>
  );
}
