// src/state/cart/CartContext.tsx
"use client";

import React from "react";
import type { Product } from "@/types/catalog";

export type CartLine = {
  lineId: string;
  productId: string;
  productSlug: string;
  ref: string;
  name: string;
  imageUrl?: string;
  qty: number;
  size?: string;
  color?: string;
  note?: string; // nota por item (opcional)
};

type AddOpts = {
  size?: string;
  color?: string;
  qty?: number;
  note?: string;
};

type CartState = {
  items: CartLine[];
  totalItems: number;
  add: (p: Product, opts?: AddOpts) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  setNote: (lineId: string, note: string) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartState | null>(null);

const STORAGE_KEY = "origen_cart_v1";

function safeParse(json: string | null): CartLine[] {
  try {
    const v = json ? (JSON.parse(json) as CartLine[]) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function clampQty(v: unknown) {
  const n = typeof v === "number" ? v : parseInt(String(v ?? "1"), 10);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.floor(n));
}

function norm(v?: string) {
  return (v ?? "").trim();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartLine[]>([]);

  React.useEffect(() => {
    setItems(safeParse(localStorage.getItem(STORAGE_KEY)));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = React.useMemo(
    () => items.reduce((acc, it) => acc + it.qty, 0),
    [items]
  );

  const add: CartState["add"] = React.useCallback((p, opts) => {
    const qtyToAdd = clampQty(opts?.qty ?? 1);
    const note = norm(opts?.note) || undefined;

    setItems((prev) => {
      // ✅ Misma línea = mismo producto + talla + color + nota
      const matchIdx = prev.findIndex(
        (x) =>
          x.productId === p.id &&
          norm(x.size) === norm(opts?.size) &&
          norm(x.color) === norm(opts?.color) &&
          norm(x.note) === norm(note)
      );

      if (matchIdx >= 0) {
        const copy = [...prev];
        copy[matchIdx] = { ...copy[matchIdx], qty: copy[matchIdx].qty + qtyToAdd };
        return copy;
      }

      const line: CartLine = {
        lineId: uid(),
        productId: p.id,
        productSlug: p.slug,
        ref: p.ref,
        name: p.name,
        imageUrl: p.images?.[0]?.url,
        qty: qtyToAdd,
        size: norm(opts?.size) || undefined,
        color: norm(opts?.color) || undefined,
        note,
      };

      return [line, ...prev];
    });
  }, []);

  const remove: CartState["remove"] = React.useCallback((lineId) => {
    setItems((prev) => prev.filter((x) => x.lineId !== lineId));
  }, []);

  const setQty: CartState["setQty"] = React.useCallback((lineId, qty) => {
    setItems((prev) =>
      prev
        .map((x) => (x.lineId === lineId ? { ...x, qty: clampQty(qty) } : x))
        .filter((x) => x.qty > 0)
    );
  }, []);

  const setNote: CartState["setNote"] = React.useCallback((lineId, note) => {
    setItems((prev) =>
      prev.map((x) =>
        x.lineId === lineId ? { ...x, note: norm(note) || undefined } : x
      )
    );
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const value: CartState = React.useMemo(
    () => ({ items, totalItems, add, remove, setQty, setNote, clear }),
    [items, totalItems, add, remove, setQty, setNote, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
