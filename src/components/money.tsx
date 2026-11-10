"use client";

import { marketByCurrency, parsePrices, priceForMarket } from "@/lib/markets";
import { formatMoney } from "@/lib/money";
import { useCurrency } from "./currency-provider";

export function Money({
  prices,
  ngn,
  quantity = 1,
  className = "",
}: {
  prices?: string | null;
  ngn: number;
  quantity?: number;
  className?: string;
}) {
  const { currency } = useCurrency();
  const quote = priceForMarket(parsePrices(prices, ngn), marketByCurrency(currency).id);
  return <span className={className}>{formatMoney(quote.amount * quantity, quote.currency)}</span>;
}

export function RateLine({ className = "" }: { className?: string }) {
  const { currency } = useCurrency();
  const market = marketByCurrency(currency);
  return (
    <p className={className}>
      Price for {market.label}. If that price is not set yet, the US dollar price is used, then the Nigeria price.
    </p>
  );
}
