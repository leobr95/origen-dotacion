// src/app/cotizacion/page.tsx
import QuoteClient from "@/features/quote/QuoteClient";

export const metadata = {
  title: "Cotización",
};

export default function QuotePage() {
  return <QuoteClient />;
}
