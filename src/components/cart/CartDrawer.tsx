// src/components/cart/CartDrawer.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import { useCart } from "@/state/cart/CartContext";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, totalItems, remove, setQty, setNote, clear } = useCart();

  const handleDec = (lineId: string, currentQty: number) => {
    const next = Math.max(1, currentQty - 1);
    setQty(lineId, next);
  };

  const handleInc = (lineId: string, currentQty: number) => {
    setQty(lineId, currentQty + 1);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 360, sm: 420 }, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
            Carrito para cotización
          </Typography>

          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "rgba(255,255,255,.7)", fontWeight: 800 }}>
              {totalItems} item(s)
            </Typography>
            <IconButton onClick={onClose} aria-label="Cerrar">
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,.10)" }} />

        {items.length === 0 ? (
          <Typography sx={{ color: "rgba(255,255,255,.65)" }}>
            Tu carrito está vacío. Agrega productos para solicitar una cotización.
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 1.2 }}>
            {items.map((it) => {
              // ✅ IDs estables para evitar hydration mismatch en MUI
              const noteId = `cart-note-${it.lineId}`;
              const noteName = `cart_note_${it.lineId}`;

              return (
                <Box
                  key={it.lineId}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: 1.2,
                    p: 1,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,.10)",
                    background: "rgba(255,255,255,.03)",
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,.12)",
                      background: "rgba(255,255,255,.04)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.imageUrl ?? "https://picsum.photos/seed/placeholder/200/200"}
                      alt={it.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 900, lineHeight: 1.15 }} noWrap>
                          {it.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,.65)" }}
                          noWrap
                        >
                          {it.ref}
                          {it.size ? ` • Talla: ${it.size}` : ""}
                          {it.color ? ` • Color: ${it.color}` : ""}
                        </Typography>
                      </Box>

                      <IconButton onClick={() => remove(it.lineId)} aria-label="Eliminar">
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.8 }}>
                      <IconButton
                        onClick={() => handleDec(it.lineId, it.qty)}
                        aria-label="Disminuir"
                        size="small"
                        disabled={it.qty <= 1}
                      >
                        <RemoveRoundedIcon fontSize="small" />
                      </IconButton>

                      <Typography sx={{ fontWeight: 900, minWidth: 28, textAlign: "center" }}>
                        {it.qty}
                      </Typography>

                      <IconButton
                        onClick={() => handleInc(it.lineId, it.qty)}
                        aria-label="Aumentar"
                        size="small"
                      >
                        <AddRoundedIcon fontSize="small" />
                      </IconButton>

                      <Box sx={{ ml: "auto" }}>
                        <Button
                          component={Link}
                          href={`/producto/${it.productSlug}`}
                          onClick={onClose}
                          size="small"
                          sx={{ borderRadius: 999 }}
                        >
                          Ver
                        </Button>
                      </Box>
                    </Box>

                    {/* ✅ TextField con id/name estables para SSR/CSR */}
                    <TextField
                      id={noteId}
                      name={noteName}
                      value={it.note ?? ""}
                      onChange={(e) => setNote(it.lineId, e.target.value)}
                      placeholder="Nota (opcional): bordado, logo, requerimientos…"
                      size="small"
                      fullWidth
                      autoComplete="off"
                      sx={{
                        mt: 1,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      }}
                      inputProps={{
                        "data-testid": noteId,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,.10)" }} />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={clear}
            disabled={items.length === 0}
            variant="outlined"
            sx={{ borderRadius: 999 }}
            fullWidth
          >
            Vaciar
          </Button>

          <Button
            component={Link}
            href="/cotizacion"
            onClick={onClose}
            disabled={items.length === 0}
            variant="contained"
            sx={{ borderRadius: 999, fontWeight: 900 }}
            fullWidth
          >
            Enviar a cotizar
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
