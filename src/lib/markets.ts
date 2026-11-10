export const MARKETS = [
  { id: "NG", label: "Nigeria", currency: "NGN" },
  { id: "GH", label: "Ghana", currency: "GHS" },
  { id: "ZA", label: "South Africa", currency: "ZAR" },
  { id: "EU", label: "Europe", currency: "EUR" },
  { id: "US", label: "USA", currency: "USD" },
  { id: "CA", label: "Canada", currency: "CAD" },
  { id: "GB", label: "UK", currency: "GBP" },
  { id: "AU", label: "Australia", currency: "AUD" },
  { id: "AE", label: "Dubai", currency: "AED" },
] as const;

export type MarketId = (typeof MARKETS)[number]["id"];

const EUROPE = new Set([
  "DE", "FR", "ES", "IT", "NL", "BE", "AT", "PT", "IE", "FI", "GR", "SK", "SI",
  "LT", "LV", "EE", "LU", "MT", "CY", "HR", "EU",
]);

const BY_ID = new Map<string, (typeof MARKETS)[number]>(MARKETS.map((market) => [market.id, market]));
const BY_CURRENCY = new Map<string, (typeof MARKETS)[number]>(MARKETS.map((market) => [market.currency, market]));

export function isMarketCurrency(code: string) {
  return BY_CURRENCY.has(code.toUpperCase());
}

export function marketByCurrency(currency: string) {
  return BY_CURRENCY.get(currency.toUpperCase()) || BY_ID.get("US")!;
}

export function marketForCountry(country: string | null | undefined) {
  const code = (country || "").toUpperCase();
  if (BY_ID.has(code as MarketId)) return BY_ID.get(code as MarketId)!;
  if (EUROPE.has(code)) return BY_ID.get("EU")!;
  return BY_ID.get("US")!;
}

export function parsePrices(raw: string | null | undefined, priceNgn = 0) {
  const prices: Partial<Record<MarketId, number>> = {};
  try {
    const value = JSON.parse(raw || "{}") as Record<string, unknown>;
    for (const market of MARKETS) {
      const amount = Number(value?.[market.id]);
      if (Number.isFinite(amount) && amount > 0) prices[market.id] = Math.round(amount);
    }
  } catch {
    // A broken price list falls back to the Nigeria amount.
  }
  if (!prices.NG && priceNgn > 0) prices.NG = priceNgn;
  return prices;
}

export function priceForMarket(prices: Partial<Record<MarketId, number>>, marketId: string) {
  const market = BY_ID.get(marketId as MarketId) || BY_ID.get("US")!;
  if (prices[market.id]) return { amount: prices[market.id]!, currency: market.currency };
  if (prices.US) return { amount: prices.US, currency: "USD" };
  if (prices.NG) return { amount: prices.NG, currency: "NGN" };
  return { amount: 0, currency: market.currency };
}

export function sumQuotes(
  lines: { pricesJson?: string | null; priceNgn: number; quantity: number }[],
  currency: string,
) {
  const market = marketByCurrency(currency);
  const quotes = lines.map((line) => {
    const quote = priceForMarket(parsePrices(line.pricesJson, line.priceNgn), market.id);
    return { amount: quote.amount * line.quantity, currency: quote.currency };
  });
  const code = quotes.find((quote) => quote.currency === market.currency)?.currency || quotes[0]?.currency || market.currency;
  return {
    amount: quotes.reduce((sum, quote) => sum + (quote.currency === code ? quote.amount : 0), 0),
    currency: code,
  };
}
