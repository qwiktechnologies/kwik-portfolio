"use client";

import { formatFromNgn, formatMoney } from "@/lib/money";
import { useCurrency } from "./currency-provider";

export function Money({ ngn, className = "", base = false }: { ngn: number; className?: string; base?: boolean }) {
  const { currency, rate, source } = useCurrency();
  const amount = formatFromNgn(ngn, currency, rate);
  return (
    <span className={className}>
      <span>{amount}</span>
      {base && currency !== "NGN" ? (
        <span className="mt-1 block text-xs font-normal tracking-normal text-muted">
          {formatMoney(ngn, "NGN")} catalog{source === "fallback" ? " · saved rate" : ""}
        </span>
      ) : null}
    </span>
  );
}

export function RateLine({ className = "" }: { className?: string }) {
  const { currency, source } = useCurrency();
  if (currency === "NGN") {
    return <p className={className}>Prices are in Nigerian naira.</p>;
  }
  let name = currency;
  try {
    name = new Intl.DisplayNames(["en"], { type: "currency" }).of(currency) || currency;
  } catch {
    name = currency;
  }
  return (
    <p className={className}>
      Prices in {name}, converted from Nigerian naira {source === "fallback" ? "using a saved rate" : "at today's rate"}.
    </p>
  );
}
