import { QRCodeCanvas } from "qrcode.react";

export function PayQr({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-xl border bg-background p-3">
        <QRCodeCanvas value={url} size={160} />
      </div>
      <p className="text-xs text-muted-foreground">Scan to open pay page</p>
    </div>
  );
}
