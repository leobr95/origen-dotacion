// src/features/home/FeaturedProducts.tsx
"use client";

import React from "react";
import { Box } from "@mui/material";
import { useCatalog } from "@/state/catalog/CatalogContext";
import ProductCard from "@/features/product/ProductCard";

export default function FeaturedProducts() {
  const { products } = useCatalog();

  const featured = React.useMemo(
    () => products.filter((p) => p.featured).slice(0, 12),
    [products]
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 1.6,
        alignItems: "stretch", // ✅ ayuda a estirar items
      }}
    >
      {featured.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </Box>
  );
}
