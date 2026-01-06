// src/app/layout.tsx
import type { Metadata } from "next";
import ThemeRegistry from "@/app/theme/ThemeRegistry";
import Providers from "@/app/providers";
import { getCatalog } from "@/lib/catalog/getCatalog";

export const metadata: Metadata = {
  title: "Origen • Dotación empresarial",
  description: "Catálogo de dotación para empresas con carrito y solicitud de cotización.",
  icons: {
    icon: "/favicon.ico", // ✅ apunta al favicon servido desde /app o /public
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialCatalog = await getCatalog();

  return (
    <html lang="es">
      <body style={{ margin: 0 }}>
        <ThemeRegistry>
          <Providers initialCatalog={initialCatalog}>{children}</Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
