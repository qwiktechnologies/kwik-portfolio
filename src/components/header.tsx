"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiShoppingBag, FiX } from "react-icons/fi";
import { logoutAction } from "@/lib/actions/auth";
import { canManageStudio } from "@/lib/constants";
import { currencyName } from "@/lib/money";
import { useCart } from "./cart-provider";
import { useCurrency } from "./currency-provider";

const links = [
  { href: "/work", label: "Catalog" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  companyName,
  session,
}: {
  companyName: string;
  session: { name: string; role: string } | null;
}) {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 text-ink backdrop-blur">
      <div className="mx-auto flex h-14 w-[90%] items-center justify-between gap-4 px-4 sm:h-16 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image src="/brand/logo.png" alt={companyName} width={70} height={80} className="h-10 w-auto sm:h-11" priority />
        </Link>
        <div className="flex items-center gap-1 md:gap-6">
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? "text-ink" : "hover:text-ink"}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <CurrencySwitcher />
            <Link href="/cart" className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
              <FiShoppingBag />
              {count > 0 ? <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ember px-1 text-[10px] text-white">{count}</span> : null}
            </Link>
            {session ? <AccountMenu session={session} /> : (
              <Link href="/login" className="hidden text-sm hover:text-ink md:inline">
                Sign in
              </Link>
            )}
            <button className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-line bg-paper px-3 py-2 md:hidden" aria-label="Mobile">
          <div className="flex flex-col items-end text-right">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-3 py-3 text-base">
                {link.label}
              </Link>
            ))}
            {session ? null : (
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl px-3 py-3 text-base">
                Sign in
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function AccountMenu({ session }: { session: { name: string; role: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const studio = canManageStudio(session.role);
  const initials = session.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full bg-ink text-xs font-medium text-paper"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {initials}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-line bg-card p-2 text-left text-ink shadow-xl">
          <p className="px-3 py-2 text-sm font-medium">{session.name}</p>
          {studio ? (
            <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm hover:bg-paper" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          ) : null}
          <Link href="/account" className="block rounded-xl px-3 py-2 text-sm hover:bg-paper" onClick={() => setOpen(false)}>
            Purchases
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-paper">
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function CurrencySwitcher() {
  const { currency, setCurrency, rates } = useCurrency();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const preferred = ["NGN", "USD", "GHS", "GBP", "EUR", "CAD", "AUD", "ZAR", "KES", "XOF", "INR", "AED"];
  const codes = Object.keys(rates);
  const filtered = query.trim()
    ? codes.filter((code) => {
        const needle = query.trim().toLowerCase();
        return code.toLowerCase().includes(needle) || currencyName(code).toLowerCase().includes(needle);
      }).slice(0, 12)
    : preferred.filter((code) => code === "NGN" || rates[code]);

  return (
    <div className="relative">
      <button
        type="button"
        className="rounded-full border border-line px-3 py-2 text-xs tracking-wide"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        {currency}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-card p-3 text-ink shadow-xl">
          <label className="sr-only" htmlFor="currency-search">
            Search currencies
          </label>
          <input
            id="currency-search"
            className="field !py-2 text-sm"
            placeholder="Search currency"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />
          <ul className="mt-2 max-h-64 overflow-auto" role="listbox">
            {filtered.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-sm hover:bg-paper"
                  onClick={() => {
                    setCurrency(code);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span>{currencyName(code)}</span>
                  <span className="text-xs text-muted">{code}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 ? <li className="px-2 py-3 text-sm text-muted">No currency matches.</li> : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
