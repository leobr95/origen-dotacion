// src/app/producto/[slug]/page.tsx
import ProductClient from "@/features/product/ProductClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: `Producto - ${slug}` };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
