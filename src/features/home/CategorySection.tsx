// src/features/home/CategorySection.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { useCatalog } from "@/state/catalog/CatalogContext";
import { iconFromName } from "@/components/utils/iconFromName";
import { withAllCategory } from "@/state/catalog/WithAllCategory";

export default function CategorySection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { categories } = useCatalog();

  // ✅ Inyecta "Todos / Ver todo" como categoría padre
  const categoriesWithAll = React.useMemo(() => withAllCategory(categories), [categories]);

  const parents = React.useMemo(
    () =>
      categoriesWithAll
        .filter((c) => !c.parentSlug)
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)),
    [categoriesWithAll]
  );

  // ✅ Tokens (claro más blanco/plano)
  const border = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
  const cardBg = isDark ? "rgba(255,255,255,.03)" : "#FFFFFF";
  const hoverBg = alpha(theme.palette.primary.main, isDark ? 0.10 : 0.06);
  const hoverBorder = alpha(theme.palette.primary.main, 0.22);

  const iconBg = isDark ? "rgba(255,255,255,.04)" : "#F3F5F7";
  const descColor = alpha(theme.palette.text.primary, isDark ? 0.65 : 0.62);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(3,1fr)",
        },
        gap: 1.5,
      }}
    >
      {parents.map((c) => {
        const Icon = iconFromName(c.icon);
        return (
          <Box
            key={c.slug}
            component={Link}
            href={`/categoria/${c.slug}`}
            sx={{
              textDecoration: "none",
              color: "inherit",
              p: 2,
              borderRadius: 3,
              border: `1px solid ${border}`,
              background: cardBg,
              transition: "background .15s ease, border-color .15s ease, transform .15s ease",
              "&:hover": {
                background: hoverBg,
                borderColor: hoverBorder,
                transform: "translateY(-1px)",
              },
              "&:focus-visible": {
                outline: `2px solid ${alpha(theme.palette.primary.main, 0.55)}`,
                outlineOffset: 2,
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  border: `1px solid ${border}`,
                  background: iconBg,
                }}
              >
                <Icon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900 }} noWrap>
                  {c.name}
                </Typography>

                {c.description && (
                  <Typography variant="body2" sx={{ color: descColor }} noWrap>
                    {c.description}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
