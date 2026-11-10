"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { isMarketCurrency } from "@/lib/markets";

type CurrencyContextValue = {
  currency: string;
  setCurrency: (code: string) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  initialCurrency,
  children,
}: {
  initialCurrency: string;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState(initialCurrency);

  const value = useMemo<CurrencyContextValue>(() => {
    const active = isMarketCurrency(currency) ? currency.toUpperCase() : "USD";
    return {
      currency: active,
      setCurrency: (code: string) => {
        const next = code.toUpperCase();
        if (!isMarketCurrency(next)) return;
        setCurrencyState(next);
        void fetch("/api/currency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency: next }),
        });
      },
    };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const value = useContext(CurrencyContext);
  if (!value) throw new Error("useCurrency must be used inside CurrencyProvider");
  return value;
}
