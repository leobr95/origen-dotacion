// src/components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogContent,
  Typography,
  Divider,
  Card,
  CardContent,
  Stack,
  Collapse,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useCart } from "@/state/cart/CartContext";
import MegaMenuCatalog from "@/components/megamenu/MegaMenuCatalog";
import { ColorModeContext } from "@/app/theme/colorModeContext";

// ✅ Logos por tema
import origenLogoDark from "@/logo/origenlogot.png";
import origenLogoLight from "@/logo/origenc.png";
// ✅ Logos por tema (modal)
import origenLogoDark2 from "@/logo/origen_logo_transparent.png";
import origenLogoLight2 from "@/logo/origen_logo_transparentc.png";

type NavbarProps = { onOpenCart: () => void };

type TrustedCompany = {
  name: string;
  initials: string;
};

export default function Navbar({ onOpenCart }: NavbarProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const pathname = usePathname();

  const isMdDown = useMediaQuery(theme.breakpoints.down("md")); // ✅ mobile + iPad
  const { totalItems } = useCart();
  const { toggleColorMode } = React.useContext(ColorModeContext);

  const [megaOpen, setMegaOpen] = React.useState(false);
  const [megaMode, setMegaMode] = React.useState<"categories" | "search">("categories");
  const [query, setQuery] = React.useState("");

  const [aboutOpen, setAboutOpen] = React.useState(false);

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const openCategories = React.useCallback(() => {
    setMegaMode("categories");
    setMegaOpen(true);
  }, []);

  const openSearch = React.useCallback(() => {
    if (!hydrated) return;
    setMegaMode("search");
    setMegaOpen(true);
  }, [hydrated]);

  const isHome = pathname === "/";
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroIntegrated = isHome && !scrolled;

  const borderColor = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.08)";

  const solidBg = isDark ? "rgba(12,14,20,.68)" : "rgba(255,255,255,.92)";
  const solidBlur = isDark ? "blur(12px) saturate(140%)" : "blur(10px)";

  const integratedBg = isDark ? "rgba(12,14,20,.28)" : "rgba(255,255,255,.40)";
  const integratedBlur = "blur(14px) saturate(160%)";

  const chipBg = isDark ? "rgba(255,255,255,.06)" : "#FFFFFF";
  const chipHover = isDark ? "rgba(255,255,255,.09)" : "#F2F4F7";
  const inputBg = isDark ? "rgba(255,255,255,.06)" : "#F5F7FA";

  const hasItems = totalItems > 0;

  const logoSrc = isDark ? origenLogoDark : origenLogoLight;
  const logoSrc2 = isDark ? origenLogoDark2 : origenLogoLight2;

  const trustedCompanies: TrustedCompany[] = [
    { name: "Empresa Alfa", initials: "EA" },
    { name: "Logística Beta", initials: "LB" },
    { name: "Clínica Gamma", initials: "CG" },
    { name: "Servicios Delta", initials: "SD" },
    { name: "Industria Épsilon", initials: "IE" },
    { name: "Comercial Zeta", initials: "CZ" },
  ];

  const dialogPaperBg = isDark ? "rgba(16,18,26,.92)" : "rgba(255,255,255,.96)";
  const dialogBorder = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
  const dialogShadow = isDark
    ? "0 30px 80px rgba(0,0,0,.55)"
    : "0 30px 80px rgba(15,23,42,.18)";

  const cardBg = isDark ? "rgba(255,255,255,.04)" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";

  // ✅ En mobile/iPad ocultamos la fila inferior al hacer scroll
  const showMobileExtras = isMdDown && !scrolled;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: heroIntegrated ? "1px solid transparent" : `1px solid ${borderColor}`,
          background: heroIntegrated ? integratedBg : solidBg,
          backdropFilter: heroIntegrated ? integratedBlur : solidBlur,
          color: theme.palette.text.primary,
        }}
      >
        {/* ===================== MOBILE + iPad ===================== */}
        {isMdDown ? (
          <Box sx={{ width: "100%" }}>
            {/* TOP ROW: buscar (icon), logo centrado, carrito arriba, tema */}
            <Toolbar
              disableGutters
              sx={{
                px: 1.2,
                minHeight: { xs: 58, sm: 64 },
                position: "relative",
                gap: 1,
              }}
            >
              {/* izquierda: SOLO botón buscar */}
              <Tooltip title="Buscar">
                <IconButton
                  onClick={openSearch}
                  aria-label="Buscar"
                  sx={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: 999,
                    width: 40,
                    height: 40,
                    background: chipBg,
                    "&:hover": { background: chipHover },
                    flex: "0 0 auto",
                  }}
                >
                  <SearchOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* logo centrado */}
              <Box
                component={Link}
                href="/"
                aria-label="Inicio"
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 40,
                    width: { xs: 150, sm: 180 },
                    borderRadius: 0,
                    overflow: "visible",
                    display: "block",
                  }}
                >
                  <Image
                    src={logoSrc}
                    alt="Origen"
                    fill
                    priority
                    sizes="(max-width: 600px) 150px, 180px"
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </Box>

              {/* derecha: carrito SOLO arriba + tema */}
              <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
                <Tooltip title="Carrito">
                  <IconButton
                    onClick={onOpenCart}
                    aria-label="Ver carrito"
                    sx={{
                      border: `1px solid ${borderColor}`,
                      borderRadius: 999,
                      width: 40,
                      height: 40,
                      background: chipBg,
                      "&:hover": { background: chipHover },
                    }}
                  >
                    <Badge
                      color="primary"
                      badgeContent={totalItems}
                      invisible={!hasItems}
                      sx={{ "& .MuiBadge-badge": { fontWeight: 800 } }}
                    >
                      <ShoppingCartOutlinedIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Tooltip title={isDark ? "Tema claro" : "Tema oscuro"}>
                  <IconButton
                    onClick={toggleColorMode}
                    aria-label="toggle theme"
                    sx={{
                      border: `1px solid ${borderColor}`,
                      borderRadius: 999,
                      width: 40,
                      height: 40,
                      background: chipBg,
                      "&:hover": { background: chipHover },
                    }}
                  >
                    {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>

            {/* BOTTOM ROW: SOLO Categorías + Acerca de nosotros (se oculta al scroll) */}
            <Collapse in={showMobileExtras} timeout={200} unmountOnExit>
              <Box sx={{ px: 1.2, pb: 1.2 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: "auto",
                    pb: 0.3,
                    "&::-webkit-scrollbar": { height: 6 },
                  }}
                >
                  <Button
                    onClick={openCategories}
                    startIcon={<CategoryOutlinedIcon />}
                    sx={{
                      flex: "0 0 auto",
                      borderRadius: 999,
                      border: `1px solid ${borderColor}`,
                      background: chipBg,
                      color: theme.palette.text.primary,
                      textTransform: "none",
                      fontWeight: 800,
                      px: 1.6,
                      "&:hover": { background: chipHover },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Categorías
                  </Button>

                  <Button
                    onClick={() => setAboutOpen(true)}
                    startIcon={<InfoOutlinedIcon />}
                    sx={{
                      flex: "0 0 auto",
                      borderRadius: 999,
                      border: `1px solid ${borderColor}`,
                      background: chipBg,
                      color: theme.palette.text.primary,
                      textTransform: "none",
                      fontWeight: 800,
                      px: 1.6,
                      "&:hover": { background: chipHover },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Acerca de nosotros
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Box>
        ) : (
          /* ===================== DESKTOP (md+) ===================== */
          <Toolbar sx={{ gap: 2 }}>
            {/* ✅ SOLO LOGO */}
            <Box
              component={Link}
              href="/"
              aria-label="Inicio"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                minWidth: { xs: 130, sm: 160 },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: 38,
                  width: { xs: 120, sm: 150 },
                  borderRadius: 0,
                  overflow: "visible",
                  display: "block",
                }}
              >
                <Image
                  src={logoSrc}
                  alt="Origen"
                  fill
                  priority
                  sizes="(max-width: 600px) 120px, 150px"
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Box>

            {/* ✅ Acerca de nosotros */}
            <Button
              onClick={() => setAboutOpen(true)}
              startIcon={<InfoOutlinedIcon />}
              sx={{
                borderRadius: 999,
                border: `1px solid ${borderColor}`,
                background: chipBg,
                color: theme.palette.text.primary,
                textTransform: "none",
                fontWeight: 800,
                px: 1.8,
                "&:hover": { background: chipHover },
                display: { xs: "none", md: "inline-flex" },
                whiteSpace: "nowrap",
              }}
            >
              Acerca de nosotros
            </Button>

            {/* Buscador (solo desktop) */}
            <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
              <TextField
                id="nav-search"
                name="nav-search"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={openSearch}
                placeholder="Buscar productos, categorías…"
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
                    "& fieldset": { borderColor },
                    "&:hover fieldset": {
                      borderColor: isDark ? "rgba(255,255,255,.18)" : "rgba(15,23,42,.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: alpha(theme.palette.primary.main, 0.7),
                    },
                  },
                }}
              />
            </Box>

            {/* Categorías */}
            <Button
              onClick={openCategories}
              startIcon={<CategoryOutlinedIcon />}
              sx={{
                borderRadius: 999,
                border: `1px solid ${borderColor}`,
                background: chipBg,
                color: theme.palette.text.primary,
                textTransform: "none",
                "&:hover": { background: chipHover },
              }}
            >
              Categorías
            </Button>

            {/* Toggle tema */}
            <Tooltip title={isDark ? "Tema claro" : "Tema oscuro"}>
              <IconButton
                onClick={toggleColorMode}
                aria-label="toggle theme"
                sx={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: 999,
                  width: 40,
                  height: 40,
                  background: chipBg,
                  "&:hover": { background: chipHover },
                }}
              >
                {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
              </IconButton>
            </Tooltip>

            {/* Ver carrito */}
            <Button
              onClick={onOpenCart}
              variant="outlined"
              startIcon={
                <Badge
                  color="primary"
                  badgeContent={totalItems}
                  invisible={!hasItems}
                  sx={{ "& .MuiBadge-badge": { fontWeight: 800 } }}
                >
                  <ShoppingCartOutlinedIcon />
                </Badge>
              }
              sx={{
                borderRadius: 999,
                borderColor: borderColor,
                background: chipBg,
                color: theme.palette.text.primary,
                textTransform: "none",
                "&:hover": {
                  background: chipHover,
                  borderColor: isDark ? "rgba(255,255,255,.18)" : "rgba(15,23,42,.12)",
                },
              }}
            >
              Ver carrito
            </Button>

            {hasItems && (
              <Button
                component={Link}
                href="/cotizacion"
                variant="contained"
                sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none", px: 2 }}
              >
                Enviar a cotizar
              </Button>
            )}
          </Toolbar>
        )}
      </AppBar>

      <MegaMenuCatalog
        open={megaOpen}
        mode={megaMode}
        initialQuery={query}
        onQueryChange={(q) => setQuery(q)}
        onClose={() => setMegaOpen(false)}
      />

      {/* ================= MODAL "ACERCA DE" ================= */}
      <Dialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            border: `1px solid ${dialogBorder}`,
            background: dialogPaperBg,
            backdropFilter: "blur(14px) saturate(160%)",
            boxShadow: dialogShadow,
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                position: "relative",
                width: { xs: 140, md: 180 },
                height: { xs: 44, md: 54 },
                flex: "0 0 auto",
              }}
            >
              <Image
                src={logoSrc2}
                alt="Origen"
                fill
                sizes="180px"
                style={{ objectFit: "contain" }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: 18, md: 22 }, lineHeight: 1.1 }}>
                Origen dotaciones y confecciones B&amp;R
              </Typography>
              <Typography sx={{ color: alpha(theme.palette.text.primary, isDark ? 0.7 : 0.72), mt: 0.5 }}>
                Empresa colombiana • Cali, Valle del Cauca
              </Typography>
            </Box>

            <IconButton
              onClick={() => setAboutOpen(false)}
              aria-label="Cerrar"
              sx={{
                borderRadius: 2,
                border: `1px solid ${dialogBorder}`,
                background: isDark ? "rgba(255,255,255,.04)" : "rgba(15,23,42,.03)",
                "&:hover": { background: isDark ? "rgba(255,255,255,.07)" : "rgba(15,23,42,.06)" },
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2.5, borderColor: dialogBorder }} />

          {/* Cuerpo */}
          <Box
            sx={{
              borderRadius: 4,
              border: `1px solid ${dialogBorder}`,
              background: isDark ? "rgba(255,255,255,.03)" : "rgba(15,23,42,.02)",
              p: { xs: 1.8, md: 2.2 },
              boxShadow: isDark ? "0 18px 55px rgba(0,0,0,.35)" : "0 18px 55px rgba(15,23,42,.10)",
            }}
          >
            <Typography sx={{ fontWeight: 900, mb: 1 }}>¿Quiénes somos?</Typography>

            <Typography sx={{ color: alpha(theme.palette.text.primary, isDark ? 0.8 : 0.82), lineHeight: 1.6 }}>
              Somos Origen dotaciones y confecciones B&amp;R, empresa colombiana ubicada en la ciudad de Cali
              dedicada hace más de 5 años a la confección de dotación para empresas. Nos enfocamos en la
              calidad y la satisfacción de nuestros clientes, los cuales nos avalan. Realizamos envíos a nivel Cali
              y nacional. No dudes en preguntar sobre los productos exhibidos o contarnos sobre servicios personalizados.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
                component={Link}
                href="/#categorias"
                onClick={() => setAboutOpen(false)}
              >
                Ver categorías
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 999,
                  fontWeight: 900,
                  textTransform: "none",
                  borderColor: dialogBorder,
                  color: theme.palette.text.primary,
                }}
                component={Link}
                href="/cotizacion"
                onClick={() => setAboutOpen(false)}
              >
                Cotizar ahora
              </Button>
            </Stack>
          </Box>

          {/* Empresas */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontWeight: 900, mb: 1.2 }}>Empresas que confiaron en nosotros</Typography>

            {/* ✅ Reemplazo de Grid por CSS Grid (evita el error de tipos de MUI Grid) */}
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
              {trustedCompanies.map((c) => (
                <Card
                  key={c.name}
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: `1px solid ${cardBorder}`,
                    background: cardBg,
                    boxShadow: isDark
                      ? "0 14px 36px rgba(0,0,0,.28)"
                      : "0 14px 36px rgba(15,23,42,.10)",
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 3,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 900,
                        border: `1px solid ${cardBorder}`,
                        background: isDark
                          ? alpha(theme.palette.primary.main, 0.10)
                          : alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.text.primary,
                        flex: "0 0 auto",
                      }}
                    >
                      {c.initials}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 900 }} noWrap>
                        {c.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha(theme.palette.text.primary, isDark ? 0.65 : 0.68) }}
                        noWrap
                      >
                        Cliente corporativo
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
