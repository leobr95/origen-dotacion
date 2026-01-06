// src/components/WhatsAppFab.tsx
"use client";

import React from "react";
import { Fab, Tooltip, useMediaQuery } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

type WhatsAppFabProps = {
  message?: string;
  phone?: string; // opcional: si no lo pasas usa NEXT_PUBLIC_WHATSAPP_NUMBER
  tooltip?: string;
};

export default function WhatsAppFab({
  message = "Hola 👋 Vengo desde Origen. Quiero más información sobre sus productos y cotización.",
  phone,
  tooltip = "Escríbenos por WhatsApp",
}: WhatsAppFabProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const whatsappNumber = (phone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/[^\d]/g, "");

  const href = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  const bg = isDark ? "rgba(34,197,94,.92)" : "#22c55e";
  const hoverBg = isDark ? "rgba(34,197,94,1)" : "#16a34a";
  const shadow = isDark
    ? "0 18px 50px rgba(0,0,0,.45)"
    : "0 18px 45px rgba(15,23,42,.20)";

  return (
    <Tooltip title={tooltip} placement="left">
      <Fab
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        variant={isMdUp ? "extended" : "circular"}
        aria-label="WhatsApp"
        sx={{
          position: "fixed",
          right: { xs: 16, md: 22 },
          bottom: { xs: 16, md: 22 },
          zIndex: (t) => t.zIndex.modal + 1,
          background: bg,
          color: "#fff",
          boxShadow: shadow,
          textTransform: "none",
          fontWeight: 900,
          letterSpacing: 0,
          "&:hover": {
            background: hoverBg,
            boxShadow: `0 20px 55px ${alpha("#000", 0.35)}`,
            transform: "translateY(-1px)",
          },
          transition: "transform .15s ease, box-shadow .15s ease, background .15s ease",
        }}
      >
        <WhatsAppIcon sx={{ mr: isMdUp ? 1 : 0 }} />
        {isMdUp ? "WhatsApp" : null}
      </Fab>
    </Tooltip>
  );
}
