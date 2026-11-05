import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { cookies } from "next/headers";
import { CartProvider } from "@/components/cart-provider";
import { CurrencyProvider } from "@/components/currency-provider";
import { GeoSync } from "@/components/geo-sync";
import { detectVisitorCurrency, getNgnRates } from "@/lib/currency";
import { getProfile } from "@/lib/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const viewport: Viewport = {
  themeColor: "#f3efe6",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${profile.companyName} — Websites and brands you can buy`,
      template: `%s · ${profile.companyName}`,
    },
    description: profile.tagline,
    applicationName: profile.companyName,
    authors: [{ name: profile.companyName }],
    creator: profile.companyName,
    keywords: [
      "website catalog",
      "ecommerce website",
      "service website",
      "landing page",
      "logo design",
      "flyer design",
      "company portfolio",
      "Qwik Technologies",
      "web design",
    ],
    openGraph: {
      type: "website",
      siteName: profile.companyName,
      title: `${profile.companyName} — Websites and brands you can buy`,
      description: profile.tagline,
      locale: "en",
    },
    twitter: { card: "summary_large_image", title: profile.companyName, description: profile.tagline },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    alternates: { canonical: "/" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, fx, jar] = await Promise.all([getProfile(), getNgnRates(), cookies()]);
  const chosen = jar.get("qt_currency")?.value?.toUpperCase();
  let currency = "NGN";
  let persist = false;
  if (chosen && (chosen === "NGN" || fx.rates[chosen])) {
    currency = chosen;
  } else {
    const detected = await detectVisitorCurrency();
    if (detected && (detected === "NGN" || fx.rates[detected])) {
      currency = detected;
      persist = true;
    }
  }

  return (
    <html lang="en">
      <body className={`${outfit.variable} ${instrument.variable} font-sans antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2">
          Skip to content
        </a>
        <CurrencyProvider initialCurrency={currency} rates={fx.rates} source={fx.source}>
          <CartProvider>
            <GeoSync currency={currency} persist={persist} />
            {children}
          </CartProvider>
        </CurrencyProvider>
        <p className="sr-only">{profile.companyName}</p>
      </body>
    </html>
  );
}
