export function getBaseUrl() {
  const configured = import.meta.env.VITE_PUBLIC_BASE_URL as string | undefined;
  if (configured && configured.trim().length > 0) return configured.replace(/\/$/, "");
  return window.location.origin;
}

export function payUrl(invoiceId: string) {
  const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;
  return `${baseUrl}/t-link-pay/pay/${invoiceId}`;
}
