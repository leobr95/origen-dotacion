// src/features/category/CategoryClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ImageSearchRoundedIcon from "@mui/icons-material/ImageSearchRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import AppShell from "@/components/AppShell";
import { useCatalog } from "@/state/catalog/CatalogContext";
import { useCart } from "@/state/cart/CartContext";
import type { Category, Product } from "@/types/catalog";
import { withAllCategory, ALL_CATEGORY_SLUG } from "@/state/catalog/WithAllCategory";

function normalizeText(v: string) {
  return (v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function sortByOrder<T extends { order?: number }>(a: T, b: T) {
  return (a.order ?? 9999) - (b.order ?? 9999);
}

function buildChildrenMap(categories: Category[]) {
  const map = new Map<string, Category[]>();
  for (const c of categories) {
    if (!c.parentSlug) continue;
    const arr = map.get(c.parentSlug) ?? [];
    arr.push(c);
    map.set(c.parentSlug, arr);
  }
  for (const [k, arr] of map.entries()) {
    map.set(k, [...arr].sort(sortByOrder));
  }
  return map;
}

function productInAnySlug(p: Product, slugs: string[]) {
  const set = new Set(slugs);
  return (p.categorySlugs ?? []).some((s) => set.has(s));
}

function firstOptionOrUndefined(arr?: string[]) {
  return arr && arr.length ? arr[0] : undefined;
}

function ProductCard({
  p,
  onAdd,
  categoryNameBySlug,
}: {
  p: Product;
  onAdd: (p: Product) => void;
  categoryNameBySlug: Map<string, string>;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const goDetail = () => router.push(`/producto/${p.slug}`);

  const categorySlugs = (p.categorySlugs ?? []).filter(Boolean);
  const shown = categorySlugs.slice(0, 2);
  const remaining = Math.max(0, categorySlugs.length - shown.length);

  // ===== Tokens =====
  const border = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
  const cardBg = isDark ? "rgba(255,255,255,.03)" : "#FFFFFF";
  const cardHoverBg = alpha(theme.palette.primary.main, isDark ? 0.08 : 0.05);
  const cardHoverBorder = alpha(theme.palette.primary.main, 0.22);
  const imageBg = isDark ? "rgba(255,255,255,.04)" : "#F3F5F7";

  const refColor = alpha(theme.palette.text.primary, isDark ? 0.7 : 0.65);
  const descColor = alpha(theme.palette.text.primary, isDark ? 0.68 : 0.66);

  const chipBg = isDark ? "rgba(255,255,255,.06)" : "#EEF2F6";
  const chipBorder = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";

  // ===== Galería =====
  const imgs = p.images ?? [];
  const hasGallery = imgs.length > 1;

  const [imgIdx, setImgIdx] = React.useState(0);
  React.useEffect(() => setImgIdx(0), [p.slug]);

  const safeIdx = Math.min(imgIdx, Math.max(0, imgs.length - 1));
  const currentImg = imgs[safeIdx]?.url;

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((x) => (x - 1 + imgs.length) % imgs.length);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((x) => (x + 1) % imgs.length);
  };

  return (
    <Box
      role="link"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goDetail();
        }
      }}
      sx={{
        textDecoration: "none",
        color: "inherit",
        borderRadius: 3,
        border: `1px solid ${border}`,
        background: cardBg,
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        transition: "background .15s ease, border-color .15s ease, transform .15s ease",
        "&:hover": {
          background: cardHoverBg,
          borderColor: cardHoverBorder,
          transform: "translateY(-1px)",
        },
        "&:focus-visible": {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.55)}`,
          outlineOffset: 2,
        },
      }}
    >
      {/* ✅ Imagen cuadrada 1:1 (NO se estira) */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "1 / 1",
          background: imageBg,
          borderBottom: `1px solid ${border}`,
          overflow: "hidden",
        }}
      >
        {currentImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImg}
            alt={imgs[safeIdx]?.alt ?? p.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // ✅ recorta centrado, NO estira
              display: "block",
            }}
          />
        ) : (
          <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <ImageSearchRoundedIcon />
          </Box>
        )}

        {hasGallery && (
          <>
            <IconButton
              onClick={prevImg}
              aria-label="Foto anterior"
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: 999,
                background: isDark ? "rgba(0,0,0,.35)" : "rgba(255,255,255,.75)",
                border: `1px solid ${border}`,
                backdropFilter: "blur(8px)",
                "&:hover": {
                  background: isDark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.88)",
                },
              }}
            >
              <ChevronLeftRoundedIcon />
            </IconButton>

            <IconButton
              onClick={nextImg}
              aria-label="Foto siguiente"
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: 999,
                background: isDark ? "rgba(0,0,0,.35)" : "rgba(255,255,255,.75)",
                border: `1px solid ${border}`,
                backdropFilter: "blur(8px)",
                "&:hover": {
                  background: isDark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.88)",
                },
              }}
            >
              <ChevronRightRoundedIcon />
            </IconButton>

            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              sx={{
                position: "absolute",
                left: "50%",
                bottom: 10,
                transform: "translateX(-50%)",
                display: "flex",
                gap: 0.8,
                px: 1,
                py: 0.6,
                borderRadius: 999,
                background: isDark ? "rgba(0,0,0,.28)" : "rgba(255,255,255,.75)",
                border: `1px solid ${border}`,
                backdropFilter: "blur(10px)",
              }}
            >
              {imgs.slice(0, 6).map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setImgIdx(i)}
                  sx={{
                    width: i === safeIdx ? 18 : 8,
                    height: 8,
                    borderRadius: 999,
                    cursor: "pointer",
                    background:
                      i === safeIdx
                        ? alpha(theme.palette.primary.main, isDark ? 0.95 : 0.85)
                        : isDark
                          ? "rgba(255,255,255,.35)"
                          : "rgba(15,23,42,.22)",
                    transition: "width .16s ease",
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Contenido */}
      <Box sx={{ p: 1.4, display: "grid", gap: 0.8, flex: "1 1 auto", minHeight: 0 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, lineHeight: 1.15 }} noWrap>
            {p.name}
          </Typography>

          {(p.ref ?? "").trim() ? (
            <Typography variant="body2" sx={{ color: refColor }} noWrap>
              Ref: {p.ref}
            </Typography>
          ) : null}

          {(p.description ?? "").trim() ? (
            <Typography
              variant="body2"
              sx={{
                color: descColor,
                mt: 0.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: 40,
              }}
            >
              {p.description}
            </Typography>
          ) : null}
        </Box>

        {/* Categorías */}
        {categorySlugs.length > 0 ? (
          <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
            {shown.map((slug) => (
              <Chip
                key={slug}
                component={Link}
                clickable
                href={`/categoria/${slug}`}
                label={categoryNameBySlug.get(slug) ?? slug}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  borderRadius: 999,
                  fontWeight: 800,
                  height: 28,
                  background: chipBg,
                  border: `1px solid ${chipBorder}`,
                }}
              />
            ))}

            {remaining > 0 ? (
              <Chip
                label={`+${remaining}`}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  height: 28,
                  background: isDark ? "rgba(255,255,255,.04)" : "#F1F5F9",
                  border: `1px solid ${chipBorder}`,
                }}
              />
            ) : null}
          </Box>
        ) : null}

        {/* Acciones */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddShoppingCartOutlinedIcon />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd(p);
            }}
            sx={{ borderRadius: 999, fontWeight: 900, flex: 1, textTransform: "none" }}
          >
            Agregar
          </Button>

          <Button
            size="small"
            variant="outlined"
            component={Link}
            href={`/producto/${p.slug}`}
            onClick={(e) => e.stopPropagation()}
            sx={{
              borderRadius: 999,
              fontWeight: 900,
              textTransform: "none",
              borderColor: border,
              color: theme.palette.text.primary,
              "&:hover": {
                background: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04),
                borderColor: alpha(theme.palette.text.primary, isDark ? 0.22 : 0.16),
              },
            }}
          >
            Ver
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function CategoryClient({ slug }: { slug: string }) {
  const catalog = useCatalog();
  const { add } = useCart();

  const categories = React.useMemo(
    () => withAllCategory(catalog.categories),
    [catalog.categories]
  );
  const products = catalog.products;

  const categoryNameBySlug = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const c of categories) m.set(c.slug, c.name);
    return m;
  }, [categories]);

  const childrenByParent = React.useMemo(() => buildChildrenMap(categories), [categories]);

  const parents = React.useMemo(
    () => categories.filter((c) => !c.parentSlug).sort(sortByOrder),
    [categories]
  );

  const onAdd = (p: Product) => {
    add(p, {
      size: firstOptionOrUndefined(p.sizes),
      color: firstOptionOrUndefined(p.colors),
    });
  };

  const isTodos = normalizeText(slug) === ALL_CATEGORY_SLUG;

  // ========= /TODOS =========
  const sections = React.useMemo(() => {
    if (!isTodos) return [];

    const realParents = parents.filter((p) => p.slug !== ALL_CATEGORY_SLUG);

    return realParents.map((parent) => {
      const children = childrenByParent.get(parent.slug) ?? [];
      const includeSlugs = [parent.slug, ...children.map((c) => c.slug)];
      const list = products.filter((p) => productInAnySlug(p, includeSlugs));

      return {
        parent,
        children,
        products: list,
        anchorId: `cat-${parent.slug}`,
      };
    });
  }, [isTodos, parents, childrenByParent, products]);

  // ========= categoría normal =========
  const currentCategory = React.useMemo(() => {
    if (isTodos) return null;
    return categories.find((c) => c.slug === slug) ?? null;
  }, [isTodos, categories, slug]);

  const currentChildren = React.useMemo(() => {
    if (!currentCategory) return [];
    return childrenByParent.get(currentCategory.slug) ?? [];
  }, [currentCategory, childrenByParent]);

  const currentProducts = React.useMemo(() => {
    if (!currentCategory) return [];
    const includeSlugs =
      currentChildren.length > 0
        ? [currentCategory.slug, ...currentChildren.map((c) => c.slug)]
        : [currentCategory.slug];

    return products.filter((p) => productInAnySlug(p, includeSlugs));
  }, [currentCategory, currentChildren, products]);

  return (
    <AppShell>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center", mb: 2 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ borderRadius: 999, textTransform: "none" }}
          >
            Inicio
          </Button>

          <Button
            component={Link}
            href={`/categoria/${ALL_CATEGORY_SLUG}`}
            variant={isTodos ? "contained" : "outlined"}
            sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
          >
            Ver todo
          </Button>

          <Box sx={{ ml: "auto", display: "flex", gap: 1, flexWrap: "wrap" }}>
            {parents
              .filter((p) => p.slug !== ALL_CATEGORY_SLUG)
              .slice(0, 8)
              .map((p) => (
                <Chip
                  key={p.slug}
                  component={Link}
                  clickable
                  href={isTodos ? `#cat-${p.slug}` : `/categoria/${p.slug}`}
                  label={p.name}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 800,
                    background: "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.10)",
                  }}
                />
              ))}
          </Box>
        </Box>

        {isTodos ? (
          <>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Todo el catálogo
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,.7)", mt: 0.5 }}>
              Secciones por categoría. Puedes agregar al carrito o ver detalle.
            </Typography>

            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,.10)" }} />

            {sections.map((sec) => (
              <Box key={sec.parent.slug} id={sec.anchorId} sx={{ scrollMarginTop: 110, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "end", gap: 1, flexWrap: "wrap" }}>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    {sec.parent.name}
                  </Typography>

                  <Button
                    component={Link}
                    href={`/categoria/${sec.parent.slug}`}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 999, fontWeight: 900, ml: "auto", textTransform: "none" }}
                  >
                    Ver categoría
                  </Button>
                </Box>

                {sec.parent.description ? (
                  <Typography sx={{ color: "rgba(255,255,255,.65)", mt: 0.5 }}>
                    {sec.parent.description}
                  </Typography>
                ) : null}

                {sec.children.length > 0 ? (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.2 }}>
                    {sec.children.map((ch) => (
                      <Chip
                        key={ch.slug}
                        component={Link}
                        clickable
                        href={`/categoria/${ch.slug}`}
                        label={ch.name}
                        sx={{
                          borderRadius: 999,
                          fontWeight: 800,
                          background: "rgba(255,255,255,.06)",
                          border: "1px solid rgba(255,255,255,.10)",
                        }}
                      />
                    ))}
                  </Box>
                ) : null}

                <Box
                  sx={{
                    mt: 1.8,
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      md: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  {sec.products.length === 0 ? (
                    <Typography sx={{ color: "rgba(255,255,255,.65)" }}>
                      Sin productos en esta categoría aún.
                    </Typography>
                  ) : (
                    sec.products.map((p) => (
                      <ProductCard
                        key={p.slug}
                        p={p}
                        onAdd={onAdd}
                        categoryNameBySlug={categoryNameBySlug}
                      />
                    ))
                  )}
                </Box>
              </Box>
            ))}
          </>
        ) : (
          <>
            {!currentCategory ? (
              <>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  Categoría no encontrada
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,.65)", mt: 1 }}>
                  Revisa el slug o vuelve al catálogo.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {currentCategory.name}
                </Typography>
                {currentCategory.description ? (
                  <Typography sx={{ color: "rgba(255,255,255,.7)", mt: 0.5 }}>
                    {currentCategory.description}
                  </Typography>
                ) : null}

                {currentChildren.length > 0 ? (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                    {currentChildren.map((ch) => (
                      <Chip
                        key={ch.slug}
                        component={Link}
                        clickable
                        href={`/categoria/${ch.slug}`}
                        label={ch.name}
                        sx={{
                          borderRadius: 999,
                          fontWeight: 800,
                          background: "rgba(255,255,255,.06)",
                          border: "1px solid rgba(255,255,255,.10)",
                        }}
                      />
                    ))}
                  </Box>
                ) : null}

                <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,.10)" }} />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      md: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  {currentProducts.length === 0 ? (
                    <Typography sx={{ color: "rgba(255,255,255,.65)" }}>
                      No hay productos para esta categoría aún.
                    </Typography>
                  ) : (
                    currentProducts.map((p) => (
                      <ProductCard
                        key={p.slug}
                        p={p}
                        onAdd={onAdd}
                        categoryNameBySlug={categoryNameBySlug}
                      />
                    ))
                  )}
                </Box>
              </>
            )}
          </>
        )}
      </Container>
    </AppShell>
  );
}
