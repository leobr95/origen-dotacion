// src/app/categoria/[slug]/page.tsx
import CategoryClient from "@/features/category/CategoryClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: slug === "todos" ? "Catálogo - Todos" : `Categoría - ${slug}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
