// src/features/home/HeroCarousel.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { useCatalog } from "@/state/catalog/CatalogContext";

export default function HeroCarousel({ integrated = false }: { integrated?: boolean }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { banners } = useCatalog();
  const sorted = React.useMemo(
    () => [...banners].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)),
    [banners]
  );

  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (sorted.length <= 1) return;
    const t = window.setInterval(() => setIdx((p) => (p + 1) % sorted.length), 5000);
    return () => window.clearInterval(t);
  }, [sorted.length]);

  const current = sorted[idx] ?? sorted[0];
  if (!current) return null;

  const hasMany = sorted.length > 1;

  const goPrev = () => setIdx((p) => (p - 1 + sorted.length) % sorted.length);
  const goNext = () => setIdx((p) => (p + 1) % sorted.length);

  // ✅ Tokens por tema
  const border = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
  const cardBg = isDark ? "rgba(255,255,255,.03)" : "#FFFFFF";
  const shadow = isDark ? "0 16px 46px rgba(0,0,0,.45)" : "0 16px 46px rgba(15,23,42,.18)";

  // ✅ Overlay: NO blanco (evita brillo). En claro usamos un dark overlay MUY suave.
  const overlay = isDark
    ? "linear-gradient(90deg, rgba(10,12,18,.78) 0%, rgba(10,12,18,.50) 45%, rgba(10,12,18,.18) 100%)"
    : "linear-gradient(90deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,.16) 45%, rgba(0,0,0,.06) 100%)";

  // ✅ Más alto (para que llegue más abajo)
  const heroHeight = integrated
    ? { xs: 380, md: 520, lg: 600 }
    : { xs: 340, md: 480, lg: 540 };

  // ✅ Texto sobre imagen: siempre blanco + sombra (se ve bien en claro/oscuro)
  const titleColor = "rgba(255,255,255,.98)";
  const subColor = "rgba(255,255,255,.82)";

  const titleShadow = "0 14px 34px rgba(0,0,0,.55), 0 2px 10px rgba(0,0,0,.35)";
  const subShadow = "0 10px 22px rgba(0,0,0,.45), 0 2px 8px rgba(0,0,0,.28)";

  // ✅ Flechas estilo (glass)
  const arrowBg = isDark ? "rgba(0,0,0,.28)" : "rgba(255,255,255,.22)";
  const arrowHover = isDark ? "rgba(0,0,0,.40)" : "rgba(255,255,255,.34)";
  const arrowBorder = isDark ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.30)";

  return (
    <Box
      sx={{
        overflow: "hidden",
        border: `1px solid ${border}`,
        borderTop: integrated ? 0 : `1px solid ${border}`,
        background: cardBg,
        boxShadow: shadow,
        borderRadius: integrated ? "0px 0px 24px 24px" : "24px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: heroHeight,
          display: "grid",
          alignItems: "end",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.imageUrl}
          alt={current.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Overlay sutil oscuro */}
        <Box sx={{ position: "absolute", inset: 0, background: overlay }} />

        {/* ✅ Flechas (solo si hay más de 1 banner) */}
        {hasMany && (
          <>
            <Tooltip title="Anterior">
              <IconButton
                onClick={goPrev}
                aria-label="Banner anterior"
                sx={{
                  position: "absolute",
                  left: { xs: 10, md: 16 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: { xs: 40, md: 46 },
                  height: { xs: 40, md: 46 },
                  borderRadius: 999,
                  border: `1px solid ${arrowBorder}`,
                  background: arrowBg,
                  color: "rgba(255,255,255,.95)",
                  backdropFilter: "blur(10px) saturate(160%)",
                  "&:hover": { background: arrowHover },
                }}
              >
                <ChevronLeftRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Siguiente">
              <IconButton
                onClick={goNext}
                aria-label="Siguiente banner"
                sx={{
                  position: "absolute",
                  right: { xs: 10, md: 16 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: { xs: 40, md: 46 },
                  height: { xs: 40, md: 46 },
                  borderRadius: 999,
                  border: `1px solid ${arrowBorder}`,
                  background: arrowBg,
                  color: "rgba(255,255,255,.95)",
                  backdropFilter: "blur(10px) saturate(160%)",
                  "&:hover": { background: arrowHover },
                }}
              >
                <ChevronRightRoundedIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Box sx={{ position: "relative", p: { xs: 2, md: 4 }, maxWidth: 760 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              lineHeight: 1.05,
              color: titleColor,
              textShadow: titleShadow,
            }}
          >
            {current.title}
          </Typography>

          {current.subtitle && (
            <Typography
              sx={{
                mt: 1,
                color: subColor,
                fontSize: 16,
                textShadow: subShadow,
              }}
            >
              {current.subtitle}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 1.2, mt: 2, flexWrap: "wrap" }}>
            {current.ctaHref && current.ctaLabel && (
              <Button
                component={Link}
                href={current.ctaHref}
                variant="contained"
                sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
              >
                {current.ctaLabel}
              </Button>
            )}

            <Button
              component={Link}
              href="/cotizacion"
              variant="outlined"
              sx={{
                borderRadius: 999,
                fontWeight: 900,
                textTransform: "none",
                borderColor: "rgba(255,255,255,.55)",
                color: "rgba(255,255,255,.95)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,.75)",
                  background: "rgba(255,255,255,.08)",
                },
              }}
            >
              Cotizar ahora
            </Button>
          </Box>

          {hasMany && (
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              {sorted.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setIdx(i)}
                  sx={{
                    width: i === idx ? 26 : 10,
                    height: 10,
                    borderRadius: 999,
                    cursor: "pointer",
                    background:
                      i === idx
                        ? alpha(theme.palette.primary.main, 0.95)
                        : "rgba(255,255,255,.38)",
                    transition: "width .18s ease",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
