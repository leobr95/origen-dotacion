// src/components/AppShell.tsx
"use client";

import React from "react";
import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import Footer from "@/components/Footer"; // ✅
import WhatsAppFab from "@/components/WhatsAppFab"; // ✅

export default function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [cartOpen, setCartOpen] = React.useState(false);

  const bg = isDark
    ? `radial-gradient(1200px 600px at 10% -20%, rgba(98,0,234,.22), transparent 50%),
       radial-gradient(1200px 600px at 110% 120%, rgba(0,140,255,.18), transparent 50%),
       linear-gradient(180deg, #0b0c11, #0e0f15 60%, #0b0c11)`
    : `radial-gradient(900px 520px at 10% -10%, ${alpha(theme.palette.primary.main, 0.10)} 0%, transparent 55%),
       radial-gradient(900px 520px at 110% 120%, ${alpha(theme.palette.primary.main, 0.06)} 0%, transparent 55%),
       linear-gradient(180deg, #ffffff 0%, #fbfcfe 55%, #ffffff 100%)`;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background: bg,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar onOpenCart={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Padding top por AppBar fijo */}
      <Box sx={{ pt: 9, pb: 6, flex: "1 1 auto" }}>{children}</Box>

      <Footer />

      {/* ✅ Botón flotante WhatsApp */}
      <WhatsAppFab />
    </Box>
  );
}
