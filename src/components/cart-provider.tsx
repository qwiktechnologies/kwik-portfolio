"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { id: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const KEY = "qt_cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]") as CartLine[];
      if (Array.isArray(saved)) setLines(saved.filter((line) => line?.id && line.quantity > 0));
    } catch {
      setLines([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== KEY || !event.newValue) return;
      try {
        setLines(JSON.parse(event.newValue) as CartLine[]);
      } catch {
        setLines([]);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.length,
      ready,
      add: (id) =>
        setLines((current) => {
          const found = current.find((line) => line.id === id);
          if (!found) return [...current, { id, quantity: 1 }];
          return current.map((line) => (line.id === id ? { ...line, quantity: Math.min(5, line.quantity + 1) } : line));
        }),
      setQuantity: (id, quantity) =>
        setLines((current) =>
          quantity <= 0 ? current.filter((line) => line.id !== id) : current.map((line) => (line.id === id ? { ...line, quantity: Math.min(5, quantity) } : line)),
        ),
      remove: (id) => setLines((current) => current.filter((line) => line.id !== id)),
      clear: () => setLines([]),
    }),
    [lines, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
