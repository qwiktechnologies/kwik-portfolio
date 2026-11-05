"use client";

import { createContext, useContext, useMemo, useState } from "react";

type CurrencyContextValue = {
  currency: string;
  setCurrency: (code: string) => void;
  rate: number | null;
  rates: Record<string, number>;
  source: "live" | "fallback";
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  initialCurrency,
  rates,
  source,
  children,
}: {
  initialCurrency: string;
  rates: Record<string, number>;
  source: "live" | "fallback";
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState(initialCurrency);

  const value = useMemo<CurrencyContextValue>(() => {
    const known = currency === "NGN" || Boolean(rates[currency]);
    const active = known ? currency : "NGN";
    return {
      currency: active,
      rates,
      source,
      rate: active === "NGN" ? 1 : rates[active] ?? null,
      setCurrency: (code: string) => {
        setCurrencyState(code);
        void fetch("/api/currency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency: code }),
        });
      },
    };
  }, [currency, rates, source]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const value = useContext(CurrencyContext);
  if (!value) throw new Error("useCurrency must be used inside CurrencyProvider");
  return value;
}
