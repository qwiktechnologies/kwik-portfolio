import { headers } from "next/headers";
import { isRealCurrency } from "./money";
import { marketForCountry } from "./markets";

const FALLBACK: Record<string, number> = {
  ngn: 1,
  usd: 0.00074567037,
  ghs: 0.0086836261,
  gbp: 0.00055598653,
  eur: 0.00066621041,
  cad: 0.0010417358,
  aud: 0.0010681435,
  nzd: 0.0013249782,
  zar: 0.012390241,
  kes: 0.096894919,
  ugx: 3.18975989,
  tzs: 1.97174699,
  rwf: 1.10192188,
  egp: 0.041340691,
  mad: 0.0073245951,
  aed: 0.0027384744,
  sar: 0.0027962639,
  inr: 0.070739075,
  cny: 0.0049746688,
  jpy: 0.1176942,
  krw: 0.9997237,
  sgd: 0.00095454796,
  chf: 0.00061000662,
  sek: 0.0072950029,
  nok: 0.0069244791,
  dkk: 0.0049790659,
  brl: 0.0040568885,
  mxn: 0.013856343,
  xof: 0.43700538,
  xaf: 0.43700538,
  php: 0.04733558,
  thb: 0.025153889,
  idr: 13.53679541,
  myr: 0.0030383571,
  hkd: 0.0058509548,
  try: 0.037277903,
  pln: 0.002943505,
  czk: 0.016206201,
  huf: 0.24283061,
  ron: 0.0035557879,
  bwp: 0.010295945,
  zmw: 0.015152915,
  mzn: 0.047634944,
  etb: 0.12114953,
  pkr: 0.20622146,
  bdt: 0.092733834,
  qar: 0.0027142401,
  kwd: 0.00023237045,
  bhd: 0.00028037206,
  omr: 0.00028702479,
  ils: 0.0023498509,
  uah: 0.034086309,
  jmd: 0.11842967,
  ttd: 0.0050432457,
  mur: 0.035261376,
  scr: 0.010526291,
  clp: 0.72899723,
  cop: 2.40172886,
  pen: 0.0025839457,
  ars: 1.15234235,
  vnd: 19.19241094,
  npr: 0.11323557,
  lkr: 0.24791112,
};

type Cache = { at: number; rates: Record<string, number>; source: "live" | "fallback" };

const globalForFx = globalThis as unknown as { fx?: Cache };

function normalize(raw: Record<string, number>) {
  const rates: Record<string, number> = {};
  for (const [code, value] of Object.entries(raw)) {
    const upper = code.toUpperCase();
    if (upper.length !== 3 || typeof value !== "number" || !Number.isFinite(value) || value <= 0) continue;
    if (!isRealCurrency(upper)) continue;
    rates[upper] = value;
  }
  rates.NGN = 1;
  return rates;
}

export async function getNgnRates() {
  const cached = globalForFx.fx;
  if (cached && Date.now() - cached.at < 1000 * 60 * 60 * 6) {
    return { rates: cached.rates, source: cached.source };
  }

  try {
    const response = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ngn.min.json",
      { signal: AbortSignal.timeout(4000), next: { revalidate: 21600 } },
    );
    const data = (await response.json()) as { ngn?: Record<string, number> };
    if (data.ngn && typeof data.ngn === "object") {
      const rates = normalize(data.ngn);
      globalForFx.fx = { at: Date.now(), rates, source: "live" };
      return { rates, source: "live" as const };
    }
  } catch {
    // The saved table below keeps prices convertible if the rate service is down.
  }

  const rates = normalize(FALLBACK);
  globalForFx.fx = { at: Date.now(), rates, source: "fallback" };
  return { rates, source: "fallback" as const };
}

export async function detectVisitorCurrency() {
  const h = await headers();
  const headerCountry = h.get("x-vercel-ip-country") || h.get("cf-ipcountry");
  if (headerCountry) return marketForCountry(headerCountry).currency;

  const forwarded = (h.get("x-forwarded-for") || "").split(",")[0]?.trim() || "";
  const realIp = h.get("x-real-ip") || "";
  const ip = forwarded || realIp;
  const local = !ip || ip === "::1" || ip.startsWith("127.") || ip === "::ffff:127.0.0.1";
  const endpoint = local ? "https://ipwho.is/" : `https://ipwho.is/${encodeURIComponent(ip)}`;

  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(2500), cache: "no-store" });
    const data = (await response.json()) as { success?: boolean; country_code?: string };
    if (!data.success || !data.country_code) return "USD";
    return marketForCountry(data.country_code).currency;
  } catch {
    return "USD";
  }
}
