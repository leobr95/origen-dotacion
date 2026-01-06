// src/features/home/HomeClient.tsx
"use client";

import React from "react";
import { Container, Box, Typography, Divider } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import AppShell from "@/components/AppShell";
import HeroCarousel from "@/features/home/HeroCarousel";
import FeaturedProducts from "@/features/home/FeaturedProducts";
import CategorySection from "@/features/home/CategorySection";

export default function HomeClient() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const muted = alpha(theme.palette.text.primary, isDark ? 0.7 : 0.65);
  const divider = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";

  return (
    <AppShell>
      {/* ✅ HERO FULL WIDTH (100vw) + integrado con el nav */}
      <Box
        sx={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          ml: "-50vw",
          mr: "-50vw",
          mt: -9, // integra con navbar fijo
        }}
      >
        <HeroCarousel integrated />
      </Box>

      {/* ✅ El resto del contenido sí queda dentro del Container */}
      <Container maxWidth="lg">
        <Box id="categorias" sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            Categorías
          </Typography>
          <Typography sx={{ color: muted, mb: 2 }}>
            Industrial, antifluido, seguridad y más. Entra por categoría o busca directamente.
          </Typography>
          <CategorySection />
        </Box>

        <Divider sx={{ my: 4, borderColor: divider }} />

        <Box id="destacados">
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
            Productos destacados
          </Typography>
          <Typography sx={{ color: muted, mb: 2 }}>
            Selección rápida de los productos más solicitados.
          </Typography>
          <FeaturedProducts />
        </Box>
      </Container>
    </AppShell>
  );
}
