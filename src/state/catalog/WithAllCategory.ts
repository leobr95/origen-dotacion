// src/state/catalog/withAllCategory.ts
import type { Category } from "@/types/catalog";

export const ALL_CATEGORY_SLUG = "todos";

export const ALL_CATEGORY: Category = {
  id: "virtual-todos",
  slug: ALL_CATEGORY_SLUG,
  name: "Todos",
  description: "Ver todo el catálogo",
  icon: "CategoryOutlined",
  order: -9999,
  parentSlug: undefined,
};

export function withAllCategory(categories: Category[]) {
  if (categories.some((c) => c.slug === ALL_CATEGORY_SLUG)) return categories;
  return [ALL_CATEGORY, ...categories];
}
