// src/state/catalog/CatalogContext.tsx
"use client";

import React from "react";
import type { Catalog, Category, Product, Banner } from "@/types/catalog";

type CatalogState = {
  catalog: Catalog;
  categories: Category[];
  products: Product[];
  banners: Banner[];
  refresh: () => Promise<void>;
};

const CatalogContext = React.createContext<CatalogState | null>(null);

function sortByOrder<T extends { order?: number }>(arr: T[]) {
  return [...arr].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
}

export function CatalogProvider({
  initialCatalog,
  children,
}: {
  initialCatalog: Catalog;
  children: React.ReactNode;
}) {
  const [catalog, setCatalog] = React.useState<Catalog>(initialCatalog);

  const refresh = React.useCallback(async () => {
    const url = process.env.NEXT_PUBLIC_CATALOG_URL?.trim();
    if (!url) return;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return;

    const data = (await res.json()) as Catalog;
    setCatalog({
      updatedAt: data.updatedAt ?? new Date().toISOString(),
      categories: Array.isArray(data.categories) ? data.categories : [],
      products: Array.isArray(data.products) ? data.products : [],
      banners: Array.isArray(data.banners) ? data.banners : [],
    });
  }, []);

  const value: CatalogState = React.useMemo(() => {
    const categories = sortByOrder(catalog.categories);
    const banners = sortByOrder(catalog.banners);
    const products = [...catalog.products];

    return {
      catalog,
      categories,
      products,
      banners,
      refresh,
    };
  }, [catalog, refresh]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = React.useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
