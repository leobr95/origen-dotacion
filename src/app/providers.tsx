// src/app/providers.tsx
"use client";

import React from "react";
import { CssBaseline } from "@mui/material";
import { CatalogProvider } from "@/state/catalog/CatalogContext";
import { CartProvider } from "@/state/cart/CartContext";
import type { Catalog } from "@/types/catalog";

export default function Providers({
  initialCatalog,
  children,
}: {
  initialCatalog: Catalog;
  children: React.ReactNode;
}) {
  return (
    <CatalogProvider initialCatalog={initialCatalog}>
      <CartProvider>
        <CssBaseline />
        {children}
      </CartProvider>
    </CatalogProvider>
  );
}
