// src/features/product/ProductClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  MenuItem,
  TextField,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import AppShell from "@/components/AppShell";
import { useCatalog } from "@/state/catalog/CatalogContext";
import { useCart } from "@/state/cart/CartContext";
import type { Product } from "@/types/catalog";

function formatPrice(p: Product) {
  if (!p.showPrice || typeof p.price !== "number") return null;
  const currency = p.currency ?? "COP";
  try {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency }).format(p.price);
  } catch {
    return `${p.price} ${currency}`;
  }
}

function clampQty(v: unknown) {
  const n = typeof v === "number" ? v : parseInt(String(v ?? "1"), 10);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.floor(n));
}

export default function ProductClient({ slug }: { slug: string }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { products } = useCatalog();
  const { add } = useCart();

  const isCatalogLoading = products.length === 0;
  const product = React.useMemo(() => products.find((p) => p.slug === slug), [products, slug]);

  const [size, setSize] = React.useState<string>("");
  const [color, setColor] = React.useState<string>("");

  // ✅ NUEVO: cantidad + nota
  const [qty, setQty] = React.useState<number>(1);
  const [note, setNote] = React.useState<string>("");

  // ✅ Galería
  const [imgIdx, setImgIdx] = React.useState(0);

  React.useEffect(() => {
    if (!product) return;
    setSize(product.sizes?.[0] ?? "");
    setColor(product.colors?.[0] ?? "");
    setImgIdx(0);

    // reset al cambiar de producto
    setQty(1);
    setNote("");
  }, [product]);

  const border = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
  const cardBg = isDark ? "rgba(255,255,255,.03)" : "#FFFFFF";
  const muted = alpha(theme.palette.text.primary, isDark ? 0.65 : 0.62);
  const body = alpha(theme.palette.text.primary, isDark ? 0.82 : 0.80);

  const chipBg = isDark ? "rgba(255,255,255,.06)" : "#F3F5F7";
  const chipHover = isDark ? alpha(theme.palette.primary.main, 0.10) : alpha(theme.palette.primary.main, 0.08);
  const chipBorder = isDark ? "rgba(255,255,255,.12)" : "rgba(15,23,42,.10)";

  const fieldBg = isDark ? "rgba(255,255,255,.04)" : "#FFFFFF";

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      background: fieldBg,
      "& fieldset": { borderColor: border },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.text.primary, isDark ? 0.22 : 0.16),
      },
      "&.Mui-focused fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.65),
      },
    },
    "& .MuiInputLabel-root": { color: muted },
    "& .MuiInputLabel-root.Mui-focused": { color: alpha(theme.palette.primary.main, 0.9) },
  } as const;

  if (isCatalogLoading) {
    return (
      <AppShell>
        <Container maxWidth="lg">
          <Typography sx={{ fontWeight: 900, fontSize: 22, color: theme.palette.text.primary }}>
            Cargando producto…
          </Typography>
          <Typography sx={{ color: muted, mt: 1 }}>Estamos preparando el catálogo.</Typography>
          <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />} sx={{ mt: 2, borderRadius: 999, textTransform: "none" }}>
            Volver
          </Button>
        </Container>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell>
        <Container maxWidth="lg">
          <Typography sx={{ fontWeight: 900, fontSize: 22, color: theme.palette.text.primary }}>
            Producto no encontrado
          </Typography>
          <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />} sx={{ mt: 2, borderRadius: 999, textTransform: "none" }}>
            Volver
          </Button>
        </Container>
      </AppShell>
    );
  }

  const images = (product.images ?? []).filter((x) => x?.url);
  const fallback = "https://picsum.photos/seed/placeholder/1200/1200";
  const currentImg = images[imgIdx]?.url ?? images[0]?.url ?? fallback;
  const currentAlt = images[imgIdx]?.alt ?? images[0]?.alt ?? product.name;

  const canNav = images.length > 1;
  const goPrev = () => setImgIdx((p) => (p - 1 + images.length) % images.length);
  const goNext = () => setImgIdx((p) => (p + 1) % images.length);

  const price = formatPrice(product);
  const categorySlugs = product.categorySlugs ?? [];

  const SIZE_ID = `origen-product-${slug}-size`;
  const COLOR_ID = `origen-product-${slug}-color`;
  const QTY_ID = `origen-product-${slug}-qty`;
  const NOTE_ID = `origen-product-${slug}-note`;

  return (
    <AppShell>
      <Container maxWidth="lg">
        <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />} sx={{ borderRadius: 999, mb: 2, textTransform: "none" }}>
          Inicio
        </Button>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr .9fr" },
            gap: 2,
          }}
        >
          {/* ✅ Galería */}
          <Box
            sx={{
              borderRadius: 4,
              border: `1px solid ${border}`,
              background: cardBg,
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: isDark ? "rgba(255,255,255,.02)" : "#F3F5F7" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImg}
                alt={currentAlt}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {canNav && (
                <>
                  <Tooltip title="Anterior">
                    <IconButton
                      onClick={goPrev}
                      sx={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        borderRadius: 999,
                        border: `1px solid ${border}`,
                        background: isDark ? "rgba(0,0,0,.28)" : "rgba(255,255,255,.72)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { background: isDark ? "rgba(0,0,0,.40)" : "rgba(255,255,255,.86)" },
                      }}
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeftRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Siguiente">
                    <IconButton
                      onClick={goNext}
                      sx={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        borderRadius: 999,
                        border: `1px solid ${border}`,
                        background: isDark ? "rgba(0,0,0,.28)" : "rgba(255,255,255,.72)",
                        backdropFilter: "blur(10px)",
                        "&:hover": { background: isDark ? "rgba(0,0,0,.40)" : "rgba(255,255,255,.86)" },
                      }}
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRightRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {canNav && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    px: 1.2,
                    py: 0.5,
                    borderRadius: 999,
                    border: `1px solid ${border}`,
                    background: isDark ? "rgba(0,0,0,.32)" : "rgba(255,255,255,.70)",
                    backdropFilter: "blur(10px)",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {imgIdx + 1}/{images.length}
                </Box>
              )}
            </Box>

            {images.length > 1 && (
              <Box
                sx={{
                  p: 1.2,
                  display: "flex",
                  gap: 1,
                  overflowX: "auto",
                  borderTop: `1px solid ${border}`,
                  background: isDark ? "rgba(255,255,255,.02)" : "#FAFBFC",
                }}
              >
                {images.map((im, i) => {
                  const active = i === imgIdx;
                  return (
                    <Box
                      key={`${im.url}-${i}`}
                      onClick={() => setImgIdx(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setImgIdx(i);
                        }
                      }}
                      sx={{
                        flex: "0 0 auto",
                        width: 64,
                        aspectRatio: "1 / 1",
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: `2px solid ${active ? alpha(theme.palette.primary.main, 0.85) : border}`,
                        boxShadow: active
                          ? (isDark ? "0 8px 22px rgba(0,0,0,.35)" : "0 8px 22px rgba(15,23,42,.12)")
                          : "none",
                        background: isDark ? "rgba(255,255,255,.03)" : "#FFFFFF",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={im.url}
                        alt={im.alt ?? product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Info */}
          <Box
            sx={{
              borderRadius: 4,
              border: `1px solid ${border}`,
              background: cardBg,
              p: 2,
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.05 }}>
              {product.name}
            </Typography>

            {(product.ref ?? "").trim() ? (
              <Typography sx={{ color: muted, mt: 0.5 }}>{product.ref}</Typography>
            ) : null}

            {categorySlugs.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {categorySlugs.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    component={Link}
                    href={`/categoria/${c}`}
                    clickable
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 800,
                      background: chipBg,
                      border: `1px solid ${chipBorder}`,
                      color: theme.palette.text.primary,
                      "&:hover": { background: chipHover },
                    }}
                  />
                ))}
              </Box>
            ) : null}

            <Divider sx={{ my: 2, borderColor: border }} />

            {(product.description ?? "").trim() ? (
              <Typography sx={{ color: body, whiteSpace: "pre-line" }}>
                {product.description}
              </Typography>
            ) : (
              <Typography sx={{ color: muted }}>Sin descripción.</Typography>
            )}

            {/* Selectores */}
            <Box sx={{ display: "grid", gap: 1.2, mt: 2 }}>
              {product.sizes?.length ? (
                <TextField
                  id={SIZE_ID}
                  name={SIZE_ID}
                  select
                  label="Talla"
                  value={size}
                  onChange={(e) => setSize(String(e.target.value))}
                  size="small"
                  autoComplete="off"
                  inputProps={{ id: SIZE_ID }}
                  sx={fieldSx}
                >
                  {product.sizes.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              {product.colors?.length ? (
                <TextField
                  id={COLOR_ID}
                  name={COLOR_ID}
                  select
                  label="Color"
                  value={color}
                  onChange={(e) => setColor(String(e.target.value))}
                  size="small"
                  autoComplete="off"
                  inputProps={{ id: COLOR_ID }}
                  sx={fieldSx}
                >
                  {product.colors.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              {/* ✅ NUEVO: Cantidad */}
              <TextField
                id={QTY_ID}
                name={QTY_ID}
                label="Cantidad"
                type="number"
                size="small"
                value={qty}
                onChange={(e) => setQty(clampQty(e.target.value))}
                inputProps={{ min: 1, step: 1 }}
                sx={fieldSx}
              />

              {/* ✅ NUEVO: Nota */}
              <TextField
                id={NOTE_ID}
                name={NOTE_ID}
                label="Nota (opcional)"
                size="small"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                multiline
                minRows={2}
                placeholder="Ej: Bordado con nombre, talla especial, entrega urgente…"
                sx={fieldSx}
              />

              {/* ✅ Precio arriba de los botones */}
              {price ? (
                <Box
                  sx={{
                    mt: 0.3,
                    p: 1.2,
                    borderRadius: 3,
                    border: `1px solid ${border}`,
                    background: isDark ? "rgba(255,255,255,.03)" : "#F8FAFC",
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: 18, lineHeight: 1 }}>
                    {price}
                  </Typography>
                  <Typography variant="body2" sx={{ color: muted, mt: 0.4 }}>
                    Precio de referencia. Confirmamos al cotizar.
                  </Typography>
                </Box>
              ) : null}

              <Button
                onClick={() =>
                  add(product, {
                    size: size || undefined,
                    color: color || undefined,
                    qty,
                    note: note.trim() || undefined,
                  })
                }
                variant="contained"
                startIcon={<AddShoppingCartOutlinedIcon />}
                sx={{ borderRadius: 999, fontWeight: 900, py: 1.2, textTransform: "none" }}
              >
                Agregar al carrito (cotización)
              </Button>

              <Button
                component={Link}
                href="/cotizacion"
                variant="outlined"
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  py: 1.2,
                  textTransform: "none",
                  borderColor: border,
                  color: theme.palette.text.primary,
                  background: isDark ? "transparent" : "#FFFFFF",
                  "&:hover": {
                    background: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04),
                    borderColor: alpha(theme.palette.text.primary, isDark ? 0.22 : 0.16),
                  },
                }}
              >
                Ir a cotizar
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </AppShell>
  );
}
