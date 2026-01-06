// src/types/catalog.ts
export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string; // nombre de icono (ej: "Engineering", "HealthAndSafety")
  parentSlug?: string | null; // para subcategorías
  order?: number;
};

export type ProductImage = {
  url: string;
  alt?: string;
};

export type Product = {
  id: string;
  slug: string;
  ref: string;
  name: string;
  description: string;
  categorySlugs: string[]; // [industrial, antifluido, ...]
  images: ProductImage[];
  sizes?: string[];
  colors?: string[];
  showPrice?: boolean;
  price?: number; // si showPrice=true
  currency?: "COP" | "USD";
  featured?: boolean; // destacado home
  tags?: string[];
};

export type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaHref?: string;
  order?: number;
};

export type Catalog = {
  updatedAt: string; // ISO
  categories: Category[];
  products: Product[];
  banners: Banner[];
};
