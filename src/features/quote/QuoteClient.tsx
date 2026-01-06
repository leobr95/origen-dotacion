// src/features/quote/QuoteClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ImageSearchRoundedIcon from "@mui/icons-material/ImageSearchRounded";

import AppShell from "@/components/AppShell";
import { useCart } from "@/state/cart/CartContext";

function buildQuoteMessage(args: {
  company: string;
  contact: string;
  email: string;
  phone: string;
  notes: string;
  items: { name: string; ref: string; qty: number; size?: string; color?: string; note?: string }[];
}) {
  const lines: string[] = [];
  lines.push("Hola, Origen 👋");
  lines.push("Quiero solicitar una cotización con estos productos:");
  lines.push("");

  args.items.forEach((it, i) => {
    const meta = [
      `x${it.qty}`,
      it.size ? `Talla: ${it.size}` : null,
      it.color ? `Color: ${it.color}` : null,
      it.note ? `Nota: ${it.note}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    lines.push(`${i + 1}. ${it.name} (${it.ref}) — ${meta}`);
  });

  lines.push("");
  lines.push("Datos de contacto:");
  if (args.company) lines.push(`Empresa: ${args.company}`);
  if (args.contact) lines.push(`Contacto: ${args.contact}`);
  if (args.phone) lines.push(`Teléfono: ${args.phone}`);
  if (args.email) lines.push(`Email: ${args.email}`);
  if (args.notes) {
    lines.push("");
    lines.push(`Notas: ${args.notes}`);
  }

  return lines.join("\n");
}

export default function QuoteClient() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // ✅ Evita mismatch por carrito (localStorage) y por ids de MUI
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { items, clear } = useCart();

  const [company, setCompany] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const msg = React.useMemo(() => {
    return buildQuoteMessage({
      company,
      contact,
      email,
      phone,
      notes,
      items: items.map((x) => ({
        name: x.name,
        ref: x.ref,
        qty: x.qty,
        size: x.size,
        color: x.color,
        note: x.note,
      })),
    });
  }, [company, contact, email, phone, notes, items]);

  // ✅ IDs estables
  const ID_COMPANY = "quote-company";
  const ID_CONTACT = "quote-contact";
  const ID_EMAIL = "quote-email";
  const ID_PHONE = "quote-phone";
  const ID_NOTES = "quote-notes";

  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/[^\d]/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

  const mailTo = `mailto:${
    process.env.NEXT_PUBLIC_QUOTE_EMAIL ?? "ventas@origen.com"
  }?subject=${encodeURIComponent("Solicitud de cotización - Origen")}&body=${encodeURIComponent(msg)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg);
      window.alert("Mensaje copiado ✅");
    } catch {
      window.alert("No se pudo copiar. Selecciona el texto manualmente.");
    }
  };

  // ✅ Tokens por tema
  const border = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
  const cardBg = isDark ? "rgba(255,255,255,.03)" : "#FFFFFF";
  const subBg = isDark ? "rgba(255,255,255,.02)" : "#F7F9FC";
  const muted = alpha(theme.palette.text.primary, isDark ? 0.7 : 0.62);
  const body = alpha(theme.palette.text.primary, isDark ? 0.82 : 0.80);
  const fieldBg = isDark ? "rgba(255,255,255,.04)" : "#FFFFFF";
  const preBg = isDark ? "rgba(0,0,0,.28)" : "#F5F7FA";

  // ✅ Sombras pequeñas (cards)
  const cardShadow = isDark
    ? "0 10px 26px rgba(0,0,0,.32)"
    : "0 10px 26px rgba(15,23,42,.10)";
  const miniShadow = isDark
    ? "0 8px 18px rgba(0,0,0,.22)"
    : "0 8px 18px rgba(15,23,42,.08)";

  // ✅ WhatsApp verde importante
  const waGreen = "#25D366";
  const waGreenHover = "#1EBE5D";

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

  // ✅ Helpers de imagen (para resumen)
  const placeholderImg = "https://picsum.photos/seed/origen-placeholder/200/200";

  if (!mounted) {
    return (
      <AppShell>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.text.primary }}>
            Solicitud de cotización
          </Typography>
          <Typography sx={{ color: muted, mt: 0.5 }}>Cargando…</Typography>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Container maxWidth="lg">
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ borderRadius: 999, mb: 2, textTransform: "none" }}
        >
          Volver
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 900, color: theme.palette.text.primary }}>
          Solicitud de cotización
        </Typography>
        <Typography sx={{ color: muted, mt: 0.5 }}>
          Completa tus datos y envía la solicitud por WhatsApp o correo.
        </Typography>

        <Divider sx={{ my: 3, borderColor: border }} />

        {items.length === 0 ? (
          <Box sx={{ display: "grid", gap: 1.2 }}>
            <Alert
              severity="info"
              sx={{
                borderRadius: 4,
                border: `1px solid ${border}`,
                background: cardBg,
                color: theme.palette.text.primary,
                boxShadow: cardShadow,
                "& .MuiAlert-message": { py: 0.4 },
              }}
            >
              Tu carrito está vacío. Agrega productos para cotizar.
            </Alert>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                component={Link}
                href="/#destacados"
                variant="contained"
                startIcon={<ShoppingCartOutlinedIcon />}
                sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
              >
                Empezar de nuevo
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "start",
            }}
          >
            {/* FORM */}
            <Box
              sx={{
                borderRadius: 4,
                border: `1px solid ${border}`,
                background: cardBg,
                p: { xs: 2.4, sm: 3 },
                color: theme.palette.text.primary,
                boxShadow: cardShadow,
              }}
            >
              <Typography sx={{ fontWeight: 900, mb: 1.4 }}>Tus datos</Typography>

              <Box sx={{ display: "grid", gap: 1.2 }}>
                <TextField
                  id={ID_COMPANY}
                  name={ID_COMPANY}
                  inputProps={{ id: ID_COMPANY }}
                  autoComplete="organization"
                  label="Empresa"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
                <TextField
                  id={ID_CONTACT}
                  name={ID_CONTACT}
                  inputProps={{ id: ID_CONTACT }}
                  autoComplete="name"
                  label="Nombre de contacto"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
                <TextField
                  id={ID_EMAIL}
                  name={ID_EMAIL}
                  inputProps={{ id: ID_EMAIL }}
                  autoComplete="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
                <TextField
                  id={ID_PHONE}
                  name={ID_PHONE}
                  inputProps={{ id: ID_PHONE }}
                  autoComplete="tel"
                  label="Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
                <TextField
                  id={ID_NOTES}
                  name={ID_NOTES}
                  inputProps={{ id: ID_NOTES }}
                  autoComplete="off"
                  label="Notas / Requerimientos"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  size="small"
                  multiline
                  minRows={3}
                  sx={fieldSx}
                />
              </Box>

              <Divider sx={{ my: 2.2, borderColor: border }} />

              {/* Acciones */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 1,
                  flexWrap: { sm: "wrap" },
                }}
              >
                <Button
                  onClick={copy}
                  variant="outlined"
                  startIcon={<ContentCopyRoundedIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    borderRadius: 999,
                    fontWeight: 900,
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
                  Copiar mensaje
                </Button>

                <Button
                  component="a"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    borderRadius: 999,
                    fontWeight: 900,
                    textTransform: "none",
                    background: waGreen,
                    color: "#fff",
                    "&:hover": { background: waGreenHover },
                  }}
                >
                  Enviar WhatsApp
                </Button>

                <Button
                  component="a"
                  href={mailTo}
                  variant="outlined"
                  startIcon={<EmailOutlinedIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    borderRadius: 999,
                    fontWeight: 900,
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
                  Enviar Email
                </Button>

                <Button
                  onClick={clear}
                  variant="contained"
                  startIcon={<ShoppingCartOutlinedIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    ml: { xs: 0, sm: "auto" },
                    borderRadius: 999,
                    fontWeight: 900,
                    textTransform: "none",
                  }}
                >
                  Vaciar carrito
                </Button>
              </Box>
            </Box>

            {/* RESUMEN */}
            <Box
              sx={{
                borderRadius: 4,
                border: `1px solid ${border}`,
                background: cardBg,
                p: { xs: 2.4, sm: 3 },
                maxHeight: { xs: "auto", md: "70vh" },
                overflow: "auto",
                color: theme.palette.text.primary,
                boxShadow: cardShadow,
              }}
            >
              <Typography sx={{ fontWeight: 900, mb: 1.4 }}>Resumen del pedido</Typography>

              <Box sx={{ display: "grid", gap: 1.1 }}>
                {items.map((it) => {
                  const img = it.imageUrl?.trim() ? it.imageUrl : placeholderImg;

                  return (
                    <Box
                      key={it.lineId}
                      sx={{
                        borderRadius: 3,
                        border: `1px solid ${border}`,
                        background: subBg,
                        boxShadow: miniShadow,
                        // ✅ padding interno ajustado (más aire)
                        p: { xs: 1.2, sm: 1.4 },
                        display: "flex",
                        gap: 1.2,
                        alignItems: "flex-start",
                        minWidth: 0,
                      }}
                    >
                      {/* Imagen */}
                      <Box
                        sx={{
                          width: 62,
                          height: 62,
                          borderRadius: 2.2,
                          overflow: "hidden",
                          border: `1px solid ${border}`,
                          background: isDark ? "rgba(255,255,255,.04)" : "#FFFFFF",
                          flex: "0 0 auto",
                          boxShadow: isDark
                            ? "0 10px 20px rgba(0,0,0,.25)"
                            : "0 10px 20px rgba(15,23,42,.10)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {img ? (
                          <img
                            src={img}
                            alt={it.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        ) : (
                          <ImageSearchRoundedIcon fontSize="small" />
                        )}
                      </Box>

                      {/* Texto */}
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontWeight: 900, lineHeight: 1.15 }} noWrap>
                          {it.name}
                        </Typography>

                        <Typography variant="body2" sx={{ color: muted, mt: 0.35 }}>
                          {it.ref} • x{it.qty}
                          {it.size ? ` • Talla: ${it.size}` : ""}
                          {it.color ? ` • Color: ${it.color}` : ""}
                        </Typography>

                        {it.note && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: body,
                              mt: 0.6,
                              // ✅ evita que se “pegue” a los bordes
                              overflowWrap: "anywhere",
                              lineHeight: 1.35,
                            }}
                          >
                            Nota: {it.note}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Divider sx={{ my: 2.2, borderColor: border }} />

              <Typography variant="body2" sx={{ color: muted }}>
                Vista previa del mensaje:
              </Typography>

              <Box
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  mt: 1.1,
                  mb: 0,
                  p: { xs: 1.3, sm: 1.6 }, // ✅ padding interno ajustado
                  borderRadius: 3,
                  border: `1px solid ${border}`,
                  background: preBg,
                  color: theme.palette.text.primary,
                  boxShadow: miniShadow,
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace',
                  fontSize: 12,
                }}
              >
                {msg}
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </AppShell>
  );
}
