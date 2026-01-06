// src/features/product/ProductCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Chip, IconButton } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ImageSearchRoundedIcon from "@mui/icons-material/ImageSearchRounded";

import type { Product } from "@/types/catalog";
import { useCart } from "@/state/cart/CartContext";
import { useCatalog } from "@/state/catalog/CatalogContext";

function formatPrice(p: Product) {
  if (!p.showPrice || typeof p.price !== "number") return null;
  const currency = p.currency ?? "COP";
  try {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency }).format(p.price);
  } catch {
    return `${p.price} ${currency}`;
  }
}

export default function ProductCard({ product }: { product: Product }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const router = useRouter();
  const { add } = useCart();
  const { categories } = useCatalog();

  const price = formatPrice(product);
  const hasPrice = Boolean(price);

  const hasRef = Boolean((product.ref ?? "").trim());
  const hasDesc = Boolean((product.description ?? "").trim());

  const categoryNameBySlug = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const c of categories) m.set(c.slug, c.name);
    return m;
  }, [categories]);

  const categorySlugs = (product.categorySlugs ?? []).filter(Boolean);
  const shown = categorySlugs.slice(0, 3);
  const remaining = Math.max(0, categorySlugs.length - shown.length);

  const goDetail = () => router.push(`/producto/${product.slug}`);

  // ===== Tokens =====
  const border = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
  const cardBg = isDark ? "rgba(255,255,255,.03)" : "#FFFFFF";
  const cardHoverBg = alpha(theme.palette.primary.main, isDark ? 0.08 : 0.05);
  const cardHoverBorder = alpha(theme.palette.primary.main, 0.22);

  const imageBg = isDark ? "rgba(255,255,255,.04)" : "#F3F5F7";

  const refColor = alpha(theme.palette.text.primary, isDark ? 0.65 : 0.62);
  const descColor = alpha(theme.palette.text.primary, isDark ? 0.7 : 0.68);

  const chipBg = isDark ? "rgba(255,255,255,.06)" : "#EEF2F6";
  const chipBorder = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";

  const featuredBg = alpha(theme.palette.primary.main, isDark ? 0.22 : 0.16);
  const featuredBorder = alpha(theme.palette.primary.main, isDark ? 0.38 : 0.28);

  const priceColor = alpha(theme.palette.text.primary, isDark ? 0.92 : 0.90);

  // ✅ slots para alinear alturas (cuando falte algo)
  const SLOT = {
    title: 38, // 2 líneas aprox
    ref: 18,
    desc: 40, // ya tienes clamp 2 y minHeight 40
    chips: 34,
    price: 26,
  };

  // ===== Galería =====
  const imgs = product.images ?? [];
  const hasGallery = imgs.length > 1;

  const [imgIdx, setImgIdx] = React.useState(0);
  React.useEffect(() => setImgIdx(0), [product.slug]);

  const safeIdx = Math.min(imgIdx, Math.max(0, imgs.length - 1));
  const currentImg = imgs[safeIdx]?.url;

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((p) => (p - 1 + imgs.length) % imgs.length);
  };

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((p) => (p + 1) % imgs.length);
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
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${border}`,
        background: cardBg,
        cursor: "pointer",
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

        // ✅ estructura fija para que el contenido estire igual
        display: "grid",
        gridTemplateRows: "auto 1fr",
        height: "100%",
      }}
    >
      {/* ===== Imagen 1:1 ===== */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: "1 / 1",
          background: imageBg,
          overflow: "hidden",
        }}
      >
        {currentImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImg}
            alt={imgs[safeIdx]?.alt ?? product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <ImageSearchRoundedIcon />
          </Box>
        )}

        {product.featured && (
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <Chip
              label="Destacado"
              size="small"
              sx={{
                borderRadius: 999,
                fontWeight: 900,
                background: featuredBg,
                border: `1px solid ${featuredBorder}`,
              }}
            />
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
                width: 38,
                height: 38,
                borderRadius: 999,
                background: isDark ? "rgba(0,0,0,.35)" : "rgba(255,255,255,.70)",
                border: `1px solid ${border}`,
                backdropFilter: "blur(8px)",
                "&:hover": {
                  background: isDark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.85)",
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
                width: 38,
                height: 38,
                borderRadius: 999,
                background: isDark ? "rgba(0,0,0,.35)" : "rgba(255,255,255,.70)",
                border: `1px solid ${border}`,
                backdropFilter: "blur(8px)",
                "&:hover": {
                  background: isDark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.85)",
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
                background: isDark ? "rgba(0,0,0,.28)" : "rgba(255,255,255,.70)",
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

      {/* ===== Contenido (alto alineado) ===== */}
      <Box
        sx={{
          p: 1.6,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* ✅ Título siempre con el mismo alto (2 líneas máx) */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 16,
            lineHeight: 1.15,
            minHeight: SLOT.title,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            overflowWrap: "anywhere",
          }}
        >
          {product.name}
        </Typography>

        {/* ✅ Ref: reserva espacio aunque no exista */}
        <Typography
          variant="body2"
          aria-hidden={!hasRef}
          sx={{
            color: refColor,
            mt: 0.3,
            minHeight: SLOT.ref,
            opacity: hasRef ? 1 : 0, // 👈 reserva alto sin mostrar
          }}
        >
          {hasRef ? product.ref : "—"}
        </Typography>

        {/* ✅ Descripción: reserva espacio aunque no exista */}
        <Typography
          variant="body2"
          aria-hidden={!hasDesc}
          sx={{
            color: descColor,
            mt: 1,
            minHeight: SLOT.desc,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            opacity: hasDesc ? 1 : 0, // 👈 reserva alto
          }}
        >
          {hasDesc ? product.description : "—"}
        </Typography>

        {/* ✅ Chips: reserva una fila */}
        <Box sx={{ minHeight: SLOT.chips, mt: 1, display: "flex", flexWrap: "wrap", gap: 0.8 }}>
          {categorySlugs.length > 0 ? (
            <>
              {shown.map((slug) => (
                <Chip
                  key={slug}
                  component={Link}
                  clickable
                  href={`/categoria/${slug}`}
                  label={categoryNameBySlug.get(slug) ?? slug}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 800,
                    background: chipBg,
                    border: `1px solid ${chipBorder}`,
                    "&:hover": { background: isDark ? "rgba(255,255,255,.09)" : "#E6EBF2" },
                  }}
                />
              ))}

              {remaining > 0 ? (
                <Chip
                  label={`+${remaining}`}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 900,
                    background: isDark ? "rgba(255,255,255,.04)" : "#F1F5F9",
                    border: `1px solid ${chipBorder}`,
                  }}
                />
              ) : null}
            </>
          ) : null}
        </Box>

        {/* ✅ Precio: SIEMPRE reserva el mismo alto */}
        <Typography
          aria-hidden={!hasPrice}
          sx={{
            mt: 1.2,
            fontWeight: 900,
            color: priceColor,
            minHeight: SLOT.price,
            opacity: hasPrice ? 1 : 0, // 👈 clave para alinear
          }}
        >
          {hasPrice ? price : "—"}
        </Typography>

        {/* ✅ Botones siempre abajo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto", pt: 1.2 }}>
          <Button
            component={Link}
            href={`/producto/${product.slug}`}
            variant="outlined"
            sx={{
              borderRadius: 999,
              fontWeight: 900,
              textTransform: "none",
              borderColor: border,
              color: theme.palette.text.primary,
              "&:hover": {
                borderColor: alpha(theme.palette.text.primary, 0.25),
                background: alpha(theme.palette.text.primary, 0.04),
              },
            }}
            fullWidth
            onClick={(e) => e.stopPropagation()}
          >
            Ver
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              add(product);
            }}
            variant="contained"
            startIcon={<AddShoppingCartOutlinedIcon />}
            sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
            fullWidth
          >
            Agregar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
