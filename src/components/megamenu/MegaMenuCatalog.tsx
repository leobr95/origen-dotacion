// src/components/megamenu/MegaMenuCatalog.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Grow,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ImageSearchRoundedIcon from "@mui/icons-material/ImageSearchRounded";

import { useCatalog } from "@/state/catalog/CatalogContext";
import { iconFromName } from "@/components/utils/iconFromName";
import type { Category, Product } from "@/types/catalog";
import { withAllCategory, ALL_CATEGORY_SLUG } from "@/state/catalog/WithAllCategory";

type Props = {
  open: boolean;
  mode: "categories" | "search";
  initialQuery?: string;
  onQueryChange?: (q: string) => void;
  onClose: () => void;
};

function normalizeText(value: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function categoryTree(categories: Category[]) {
  const parents = categories.filter((c) => !c.parentSlug);
  const childrenByParent = new Map<string, Category[]>();

  for (const c of categories) {
    if (!c.parentSlug) continue;
    const arr = childrenByParent.get(c.parentSlug) ?? [];
    arr.push(c);
    childrenByParent.set(c.parentSlug, arr);
  }

  for (const [k, arr] of childrenByParent.entries()) {
    childrenByParent.set(
      k,
      [...arr].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    );
  }

  return {
    parents: [...parents].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)),
    childrenByParent,
  };
}

function productMatches(p: Product, q: string, categories: Category[]) {
  const hay = normalizeText(
    [
      p.name,
      p.ref,
      p.description,
      ...(p.tags ?? []),
      ...(p.categorySlugs ?? []),
      ...(p.categorySlugs ?? [])
        .map((s) => categories.find((c) => c.slug === s)?.name ?? "")
        .filter(Boolean),
    ].join(" ")
  );
  return hay.includes(q);
}

export default function MegaMenuCatalog({
  open,
  mode,
  initialQuery,
  onQueryChange,
  onClose,
}: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ Offset para que el panel no quede debajo del Navbar en mobile/iPad
  // (tu Navbar en mdDown puede tener 2 filas y ocupar ~110-130px)
  const topOffsetPx = isMdDown ? 124 : 72;

  const catalog = useCatalog();

  // ✅ Inyecta "Todos" siempre
  const categories = React.useMemo(
    () => withAllCategory(catalog.categories),
    [catalog.categories]
  );
  const products = catalog.products;

  const { parents, childrenByParent } = React.useMemo(
    () => categoryTree(categories),
    [categories]
  );

  // ✅ "Todos" por defecto
  const [activeParent, setActiveParent] = React.useState<string>(ALL_CATEGORY_SLUG);
  const [activeChild, setActiveChild] = React.useState<string>("");
  const [query, setQuery] = React.useState(initialQuery ?? "");

  React.useEffect(() => {
    if (open) setQuery(initialQuery ?? "");
  }, [open, initialQuery]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  React.useEffect(() => {
    onQueryChange?.(query);
  }, [query, onQueryChange]);

  React.useEffect(() => {
    if (!activeParent && parents.length) setActiveParent(parents[0].slug);
  }, [parents, activeParent]);

  const isSearching = mode === "search" || Boolean(query.trim());
  const qNorm = normalizeText(query);
  const isAll = activeParent === ALL_CATEGORY_SLUG;

  const activeParentObj = React.useMemo(
    () => parents.find((p) => p.slug === activeParent),
    [parents, activeParent]
  );
  const activeParentLabel = activeParentObj?.name ?? activeParent;

  // ✅ subcategorías
  const subcats = React.useMemo(() => {
    if (isAll) return parents.filter((p) => p.slug !== ALL_CATEGORY_SLUG);
    return childrenByParent.get(activeParent) ?? [];
  }, [childrenByParent, activeParent, parents, isAll]);

  // ✅ Mantener child válido
  React.useEffect(() => {
    if (!open) return;
    const slugs = new Set(subcats.map((s) => s.slug));
    if (activeChild && slugs.has(activeChild)) return;
    setActiveChild(subcats[0]?.slug ?? "");
  }, [open, subcats, activeChild]);

  const selectionSlug = activeChild || activeParent;

  const selectionCategory = React.useMemo(
    () => categories.find((c) => c.slug === selectionSlug),
    [categories, selectionSlug]
  );

  const selectionLabel =
    selectionCategory?.name ?? (isAll ? "Catálogo" : activeParentLabel);

const productsInSelection = React.useMemo(() => {
  const slug = selectionSlug;

  const list =
    slug === ALL_CATEGORY_SLUG
      ? [...products]
      : products.filter((p) => (p.categorySlugs ?? []).includes(slug));

  list.sort((a, b) => {
    const fa = a.featured ? 0 : 1;
    const fb = b.featured ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return (a.name ?? "").localeCompare(b.name ?? "");
  });

  return list.slice(0, 10);
}, [products, selectionSlug]);


  const featuredInSelection = React.useMemo(() => {
    const featured = products.filter((p) => p.featured);
    if (selectionSlug === ALL_CATEGORY_SLUG) return featured.slice(0, 8);
    return featured
      .filter((p) => (p.categorySlugs ?? []).includes(selectionSlug))
      .slice(0, 8);
  }, [products, selectionSlug]);

  const searchResults = React.useMemo(() => {
    if (!qNorm) return { categories: [] as Category[], products: [] as Product[] };

    const catRes = categories
      .filter((c) =>
        normalizeText([c.name, c.description ?? "", c.slug].join(" ")).includes(qNorm)
      )
      .slice(0, 10);

    const prodRes = products.filter((p) => productMatches(p, qNorm, categories)).slice(0, 16);

    return { categories: catRes, products: prodRes };
  }, [qNorm, categories, products]);

  if (!open) return null;

  // ✅ Tokens estilo
  const overlayBg = isDark ? "rgba(10,12,18,.55)" : "rgba(15,23,42,.18)";
  const panelBg = isDark ? "rgba(18,19,32,.92)" : "#FFFFFF";
  const panelBorder = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
  const panelShadow = isDark
    ? "0 18px 50px rgba(0,0,0,.55)"
    : "0 18px 50px rgba(15,23,42,.16)";

  const softBorder = isDark ? "rgba(255,255,255,.08)" : "rgba(15,23,42,.08)";
  const softBg = isDark ? "rgba(255,255,255,.03)" : "#FFFFFF";
  const softBg2 = isDark ? "rgba(255,255,255,.02)" : "#F8FAFC";

  const muted = alpha(theme.palette.text.primary, isDark ? 0.7 : 0.68);
  const muted2 = alpha(theme.palette.text.primary, isDark ? 0.6 : 0.55);

  const inputBg = isDark ? "rgba(255,255,255,.04)" : "#F5F7FA";
  const inputBorder = isDark ? "rgba(255,255,255,.12)" : "rgba(15,23,42,.12)";
  const inputFocus = alpha(theme.palette.primary.main, 0.7);

  const hoverBg = isDark ? "rgba(255,255,255,.04)" : "#F2F4F7";
  const primaryHover = alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08);
  const primaryBorder = alpha(theme.palette.primary.main, 0.22);

  const chipBg = isDark ? "rgba(255,255,255,.06)" : "#EEF2F6";
  const chipBorder = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";

  // ✅ clamps + anti overflow
  const clamp2 = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" as const,
    WebkitLineClamp: 2,
    overflow: "hidden",
    overflowWrap: "anywhere" as const,
    wordBreak: "break-word" as const,
    maxWidth: "100%",
  };

  const rowLinkBase = {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    gap: 1.1,
    alignItems: "center",
    p: 1,
    borderRadius: 2,
    border: `1px solid ${softBorder}`,
    background: softBg,
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
    "&:hover": {
      background: primaryHover,
      borderColor: primaryBorder,
    },
  } as const;

  return (
    <Fade in={open} timeout={220}>
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          pt: `${topOffsetPx}px`, // ✅ ahora abre más abajo y no lo tapa el navbar en mdDown
          pb: 2,
          background: overlayBg,
          backdropFilter: "blur(2px)",
          zIndex: (t) => t.zIndex.appBar - 1,
        }}
      >
        <Box onClick={(e) => e.stopPropagation()} sx={{ maxWidth: 1280, mx: "auto", px: 2 }}>
          <Grow in={open} timeout={280} style={{ transformOrigin: "top center" }}>
            <Box
              sx={{
                borderRadius: 3,
                border: `1px solid ${panelBorder}`,
                background: panelBg,
                backdropFilter: isDark ? "blur(16px) saturate(140%)" : "none",
                boxShadow: panelShadow,
                p: 2,
                color: theme.palette.text.primary,

                // ✅ evita que el panel se esconda por debajo en mobile/iPad (iOS friendly)
                maxHeight: `calc(100dvh - ${topOffsetPx}px - 16px)`,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <TextField
                  id="megamenu-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus={mode === "search"}
                  placeholder="Buscar categorías o productos…"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 999,
                      background: inputBg,
                      "& fieldset": { borderColor: inputBorder },
                      "&:hover fieldset": {
                        borderColor: isDark ? "rgba(255,255,255,.18)" : "rgba(15,23,42,.18)",
                      },
                      "&.Mui-focused fieldset": { borderColor: inputFocus },
                    },
                  }}
                />

                <IconButton
                  onClick={onClose}
                  aria-label="Cerrar"
                  sx={{
                    border: `1px solid ${softBorder}`,
                    borderRadius: 999,
                    width: 40,
                    height: 40,
                    background: isDark ? "rgba(255,255,255,.04)" : "#FFFFFF",
                    "&:hover": { background: hoverBg },
                  }}
                >
                  <CloseOutlinedIcon />
                </IconButton>
              </Box>

              {isSearching ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      border: `1px solid ${softBorder}`,
                      borderRadius: 2,
                      p: 1.5,
                      background: softBg2,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="overline" sx={{ color: muted }}>
                      Categorías
                    </Typography>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                      {searchResults.categories.length === 0 ? (
                        <Typography variant="body2" sx={{ color: muted2 }}>
                          Sin coincidencias.
                        </Typography>
                      ) : (
                        searchResults.categories.map((c) => (
                          <Chip
                            key={c.slug}
                            component={Link}
                            href={`/categoria/${c.slug}`}
                            clickable
                            label={c.name}
                            onClick={onClose}
                            sx={{
                              borderRadius: 999,
                              fontWeight: 800,
                              background: chipBg,
                              border: `1px solid ${chipBorder}`,
                              "&:hover": { background: hoverBg },
                            }}
                          />
                        ))
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      border: `1px solid ${softBorder}`,
                      borderRadius: 2,
                      p: 1.5,
                      background: softBg2,
                      maxHeight: { xs: "60vh", md: "62vh" },
                      overflowY: "auto",
                      overflowX: "hidden",
                      pr: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography variant="overline" sx={{ color: muted }}>
                      Productos
                    </Typography>

                    {searchResults.products.length === 0 ? (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: muted2 }}>
                          No hay productos para “{query}”.
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "grid", gap: 1.2, mt: 1, minWidth: 0 }}>
                        {searchResults.products.map((p) => (
                          <Box
                            key={p.slug}
                            component={Link}
                            href={`/producto/${p.slug}`}
                            onClick={onClose}
                            sx={rowLinkBase}
                          >
                            <Box
                              sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 2,
                                overflow: "hidden",
                                border: `1px solid ${softBorder}`,
                                background: isDark ? "rgba(255,255,255,.04)" : "#F2F4F7",
                                display: "grid",
                                placeItems: "center",
                                flex: "0 0 auto",
                              }}
                            >
                              {p.images?.[0]?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={p.images[0].url}
                                  alt={p.images[0].alt ?? p.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <ImageSearchRoundedIcon fontSize="small" />
                              )}
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                              <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }} noWrap>
                                {p.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: muted2 }} noWrap>
                                {p.ref}
                              </Typography>
                            </Box>

                            <ChevronRightRoundedIcon sx={{ color: muted2, flex: "0 0 auto" }} />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "260px 320px minmax(0, 1.35fr) minmax(0, 0.85fr)",
                    },
                    gap: 2,
                    alignItems: "start",
                    minWidth: 0,
                  }}
                >
                  {/* Col 1: padres */}
                  <Box
                    sx={{
                      minWidth: 0,
                      borderRight: { xs: "none", md: `1px solid ${softBorder}` },
                      pr: { xs: 0, md: 2 },
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.8,
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="overline" sx={{ color: muted }}>
                      Categorías
                    </Typography>

                    {parents.map((c) => {
                      const isActive = c.slug === activeParent;
                      const Icon = iconFromName(c.icon);

                      return (
                        <Box
                          key={c.slug}
                          onMouseEnter={() => setActiveParent(c.slug)}
                          onClick={() => setActiveParent(c.slug)}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.2,
                            py: 0.9,
                            borderRadius: 2,
                            border: `1px solid ${isActive ? primaryBorder : "transparent"}`,
                            background: isActive ? primaryHover : "transparent",
                            "&:hover": { background: hoverBg },
                            minWidth: 0,
                            overflow: "hidden",
                          }}
                        >
                          <Icon fontSize="small" />
                          <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                            <Typography sx={{ fontWeight: isActive ? 900 : 700 }} noWrap>
                              {c.name}
                            </Typography>
                            {c.description && (
                              <Typography variant="caption" sx={{ color: muted2, ...clamp2 }}>
                                {c.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Col 2: subcats */}
                  <Box
                    sx={{
                      minWidth: 0,
                      borderRight: { xs: "none", md: `1px solid ${softBorder}` },
                      pr: { xs: 0, md: 2 },
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="overline" sx={{ color: muted }}>
                      {isAll ? "Categorías" : "Subcategorías"}
                    </Typography>

                    <Box sx={{ display: "grid", gap: 1, mt: 1, minWidth: 0 }}>
                      {subcats.length === 0 ? (
                        <Typography variant="body2" sx={{ color: muted2 }}>
                          No hay opciones.
                        </Typography>
                      ) : (
                        subcats.map((s) => {
                          const Icon = iconFromName(s.icon);
                          const isActiveChild = s.slug === activeChild;

                          return (
                            <Box
                              key={s.slug}
                              component={Link}
                              href={`/categoria/${s.slug}`}
                              onClick={onClose}
                              onMouseEnter={() => setActiveChild(s.slug)}
                              sx={{
                                textDecoration: "none",
                                color: "inherit",
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                                p: 1,
                                borderRadius: 2,
                                border: `1px solid ${isActiveChild ? primaryBorder : softBorder}`,
                                background: isActiveChild ? primaryHover : softBg,
                                "&:hover": { background: primaryHover, borderColor: primaryBorder },
                                minWidth: 0,
                                maxWidth: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <Icon fontSize="small" />
                              <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                                <Typography sx={{ fontWeight: 900 }} noWrap>
                                  {s.name}
                                </Typography>
                                {s.description && (
                                  <Typography variant="caption" sx={{ color: muted2, ...clamp2 }}>
                                    {s.description}
                                  </Typography>
                                )}
                              </Box>
                              <ChevronRightRoundedIcon sx={{ ml: "auto", color: muted2 }} />
                            </Box>
                          );
                        })
                      )}

                      <Divider sx={{ borderColor: softBorder, my: 1 }} />

                      <Box
                        component={Link}
                        href={`/categoria/${activeParent}`}
                        onClick={onClose}
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 1,
                          py: 1,
                          borderRadius: 2,
                          border: `1px dashed ${
                            isDark ? "rgba(255,255,255,.22)" : "rgba(15,23,42,.18)"
                          }`,
                          background: softBg,
                          "&:hover": { background: hoverBg },
                          minWidth: 0,
                          overflow: "hidden",
                        }}
                      >
                        <Typography sx={{ fontWeight: 900 }} noWrap>
                          {isAll ? "Ver todo el catálogo" : `Ver todo en ${activeParentLabel}`}
                        </Typography>
                        <ChevronRightRoundedIcon />
                      </Box>
                    </Box>
                  </Box>

                  {/* Col 3: productos */}
                  <Box
                    sx={{
                      minWidth: 0,
                      borderRight: { xs: "none", md: `1px solid ${softBorder}` },
                      pr: { xs: 0, md: 2 },
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="overline" sx={{ color: muted }} noWrap>
                      Productos • {selectionLabel}
                    </Typography>

                    <Box
                      sx={{
                        mt: 1,
                        border: `1px solid ${softBorder}`,
                        borderRadius: 2,
                        background: softBg2,
                        p: 1.2,
                        maxHeight: { xs: "auto", md: "62vh" },
                        overflowY: "auto",
                        overflowX: "hidden",
                        pr: 1,
                        minWidth: 0,
                      }}
                    >
                      {productsInSelection.length === 0 ? (
                        <Typography variant="body2" sx={{ color: muted2 }}>
                          No hay productos en esta categoría.
                        </Typography>
                      ) : (
                        <Box sx={{ display: "grid", gap: 1, minWidth: 0 }}>
                          {productsInSelection.map((p) => (
                            <Box
                              key={p.slug}
                              component={Link}
                              href={`/producto/${p.slug}`}
                              onClick={onClose}
                              sx={rowLinkBase}
                            >
                              <Box
                                sx={{
                                  width: 52,
                                  height: 52,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  border: `1px solid ${softBorder}`,
                                  background: isDark ? "rgba(255,255,255,.04)" : "#F2F4F7",
                                  flex: "0 0 auto",
                                  display: "grid",
                                  placeItems: "center",
                                }}
                              >
                                {p.images?.[0]?.url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={p.images[0].url}
                                    alt={p.images[0].alt ?? p.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                ) : (
                                  <ImageSearchRoundedIcon fontSize="small" />
                                )}
                              </Box>

                              <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                                <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }} noWrap>
                                  {p.name}
                                </Typography>

                                {(p.ref ?? "").trim() ? (
                                  <Typography variant="body2" sx={{ color: muted2 }} noWrap>
                                    {p.ref}
                                  </Typography>
                                ) : null}

                                {(p.description ?? "").trim() ? (
                                  <Typography variant="caption" sx={{ color: muted2, ...clamp2 }}>
                                    {p.description}
                                  </Typography>
                                ) : null}
                              </Box>

                              <ChevronRightRoundedIcon sx={{ color: muted2, flex: "0 0 auto" }} />
                            </Box>
                          ))}

                          <Divider sx={{ borderColor: softBorder, my: 0.5 }} />

                          <Box
                            component={Link}
                            href={`/categoria/${selectionSlug || ALL_CATEGORY_SLUG}`}
                            onClick={onClose}
                            sx={{
                              textDecoration: "none",
                              color: "inherit",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              px: 1,
                              py: 1,
                              borderRadius: 2,
                              border: `1px dashed ${
                                isDark ? "rgba(255,255,255,.22)" : "rgba(15,23,42,.18)"
                              }`,
                              background: softBg,
                              "&:hover": { background: hoverBg },
                              minWidth: 0,
                              overflow: "hidden",
                            }}
                          >
                            <Typography sx={{ fontWeight: 900 }} noWrap>
                              Ver todos los productos
                            </Typography>
                            <ChevronRightRoundedIcon />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Col 4: destacados */}
                  <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                    <Typography variant="overline" sx={{ color: muted }} noWrap>
                      Destacados
                    </Typography>

                    <Box
                      sx={{
                        mt: 1,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr" },
                        gap: 1.1,
                        minWidth: 0,
                      }}
                    >
                      {featuredInSelection.length === 0 ? (
                        <Typography variant="body2" sx={{ color: muted2 }}>
                          Marca productos como <b>featured</b> para mostrarlos aquí.
                        </Typography>
                      ) : (
                        featuredInSelection.map((p) => (
                          <Box
                            key={p.slug}
                            component={Link}
                            href={`/producto/${p.slug}`}
                            onClick={onClose}
                            sx={rowLinkBase}
                          >
                            <Box
                              sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 2,
                                overflow: "hidden",
                                border: `1px solid ${softBorder}`,
                                background: isDark ? "rgba(255,255,255,.04)" : "#F2F4F7",
                                flex: "0 0 auto",
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.images?.[0]?.url ?? "https://picsum.photos/seed/placeholder/300/300"}
                                alt={p.images?.[0]?.alt ?? p.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                              <Typography sx={{ fontWeight: 900 }} noWrap>
                                {p.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: muted2 }} noWrap>
                                {p.ref}
                              </Typography>

                              {(p.description ?? "").trim() ? (
                                <Typography variant="caption" sx={{ color: muted2, ...clamp2 }}>
                                  {p.description}
                                </Typography>
                              ) : null}
                            </Box>

                            <ChevronRightRoundedIcon sx={{ color: muted2, flex: "0 0 auto" }} />
                          </Box>
                        ))
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Grow>
        </Box>
      </Box>
    </Fade>
  );
}
