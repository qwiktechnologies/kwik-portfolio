const ZERO_DECIMAL = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export function isRealCurrency(code: string) {
  try {
    new Intl.NumberFormat("en", { style: "currency", currency: code }).format(0);
    return true;
  } catch {
    return false;
  }
}

export function currencyName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "currency" }).of(code) || code;
  } catch {
    return code;
  }
}

export function formatMoney(amount: number, currency: string) {
  const digits = currency === "NGN" || ZERO_DECIMAL.has(currency) ? 0 : 2;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(digits)}`;
  }
}

export function convertFromNgn(amountNgn: number, currency: string, rate: number | null) {
  if (currency === "NGN" || !rate) return amountNgn;
  return amountNgn * rate;
}

export function formatFromNgn(amountNgn: number, currency: string, rate: number | null) {
  return formatMoney(convertFromNgn(amountNgn, currency, rate), currency === "NGN" || !rate ? "NGN" : currency);
}
