// src/lib/catalog/getCatalog.ts
import type { Catalog } from "@/types/catalog";
import { defaultCatalog } from "@/lib/catalog/defaultCatalog";

export async function getCatalog(): Promise<Catalog> {
  const url = process.env.NEXT_PUBLIC_CATALOG_URL?.trim();

  // Si no hay URL, usa default local
  if (!url) return defaultCatalog;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return defaultCatalog;

    const data = (await res.json()) as Catalog;

    // Fallback mínimo por si faltan campos
    return {
      updatedAt: data.updatedAt ?? new Date().toISOString(),
      categories: Array.isArray(data.categories) ? data.categories : [],
      products: Array.isArray(data.products) ? data.products : [],
      banners: Array.isArray(data.banners) ? data.banners : [],
    };
  } catch {
    return defaultCatalog;
  }
}
