"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiChevronDown, FiMenu, FiMessageCircle, FiSearch, FiShoppingBag, FiX } from "react-icons/fi";
import { logoutAction } from "@/lib/actions/auth";
import { BLOG_CATEGORIES, CATEGORIES, canManageStudio } from "@/lib/constants";
import { currencyName } from "@/lib/money";
import { useCart } from "./cart-provider";
import { useCurrency } from "./currency-provider";

export function Header({
  companyName,
  email,
  instagram,
  session,
}: {
  companyName: string;
  email: string;
  instagram: string;
  session: { name: string; role: string } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<"template" | "course" | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  function search(event: FormEvent) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/work?q=${encodeURIComponent(next)}` : "/work");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-[#0c1220] text-white">
        <div className="mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between px-4 text-xs sm:px-6">
          <Link href="/#faq" className="inline-flex items-center gap-1.5 hover:text-white/80">
            <FiMessageCircle aria-hidden />
            FAQ
          </Link>
          <div className="flex items-center gap-4">
            <a href={`mailto:${email}`} className="hidden items-center gap-1.5 sm:inline-flex hover:text-white/80">
              <FiMessageCircle aria-hidden />
              @Qwiktechnologies.com
            </a>
            <div className="flex items-center gap-3 text-sm">
              <Social href="https://www.linkedin.com" label="LinkedIn"><FaLinkedinIn /></Social>
              <Social href="https://x.com" label="X"><FaXTwitter /></Social>
              <Social href={instagram || "https://www.instagram.com"} label="Instagram"><FaInstagram /></Social>
              <Social href="https://www.facebook.com" label="Facebook"><FaFacebookF /></Social>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-[#ece8df] bg-white">
        <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center gap-3 px-4 sm:gap-5 sm:px-6">
          <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
            <Image src="/brand/logo.png" alt={companyName} width={70} height={80} className="h-11 w-auto" priority />
          </Link>
          <form onSubmit={search} className="hidden min-w-0 flex-1 items-center md:flex lg:max-w-xs">
            <label className="relative block w-full">
              <span className="sr-only">Search category</span>
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8478]" aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search category"
                className="h-10 w-full rounded-md border border-[#e4dfd4] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#1d4e9e]"
              />
            </label>
          </form>
          <nav className="ml-auto hidden items-center gap-6 text-sm text-[#3d3a33] lg:flex" aria-label="Primary">
            <Link href="/" className={pathname === "/" ? "text-[#1d4e9e]" : "hover:text-[#1d4e9e]"}>Home</Link>
            <div className="relative" onMouseEnter={() => setMenu("template")} onMouseLeave={() => setMenu(null)}>
              <Link href="/work" className="inline-flex items-center gap-1 hover:text-[#1d4e9e]">
                Template <FiChevronDown className="text-xs" aria-hidden />
              </Link>
              {menu === "template" ? <Drop links={CATEGORIES.map((item) => ({ href: `/work?category=${encodeURIComponent(item)}`, label: item }))} /> : null}
            </div>
            <div className="relative" onMouseEnter={() => setMenu("course")} onMouseLeave={() => setMenu(null)}>
              <Link href="/blog" className="inline-flex items-center gap-1 hover:text-[#1d4e9e]">
                Course <FiChevronDown className="text-xs" aria-hidden />
              </Link>
              {menu === "course" ? <Drop links={BLOG_CATEGORIES.map((item) => ({ href: `/blog?category=${encodeURIComponent(item)}`, label: item }))} /> : null}
            </div>
            <Link href="/about" className={pathname.startsWith("/about") ? "text-[#1d4e9e]" : "hover:text-[#1d4e9e]"}>Who we are</Link>
          </nav>
          <Link href="/contact" className="hidden rounded-md border border-[#2b2926] px-4 py-2 text-sm text-[#2b2926] hover:bg-[#2b2926] hover:text-white lg:inline-flex">
            Get in touch
          </Link>
          <div className="flex items-center gap-1">
            <CurrencySwitcher />
            <Link href="/cart" className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-[#f6f3ec]" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
              <FiShoppingBag />
              {count > 0 ? <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#f15a22] px-1 text-[10px] text-white">{count}</span> : null}
            </Link>
            {session ? <AccountMenu session={session} /> : (
              <Link href="/login" className="hidden text-sm hover:text-[#1d4e9e] lg:inline">Sign in</Link>
            )}
            <button className="grid h-10 w-10 place-items-center rounded-md hover:bg-[#f6f3ec] lg:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-[#ece8df] bg-white px-4 py-4 lg:hidden">
            <form onSubmit={search} className="mb-3">
              <label className="relative block">
                <span className="sr-only">Search category</span>
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8478]" aria-hidden />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search category" className="h-11 w-full rounded-md border border-[#e4dfd4] pl-9 pr-3 text-sm outline-none" />
              </label>
            </form>
            <div className="flex flex-col gap-1 text-sm">
              <Link href="/" className="rounded-md px-2 py-2.5" onClick={() => setOpen(false)}>Home</Link>
              <Link href="/work" className="rounded-md px-2 py-2.5" onClick={() => setOpen(false)}>Template</Link>
              <Link href="/blog" className="rounded-md px-2 py-2.5" onClick={() => setOpen(false)}>Course</Link>
              <Link href="/about" className="rounded-md px-2 py-2.5" onClick={() => setOpen(false)}>Who we are</Link>
              <Link href="/contact" className="mt-1 rounded-md border border-[#2b2926] px-3 py-2.5 text-center" onClick={() => setOpen(false)}>Get in touch</Link>
              {session ? null : <Link href="/login" className="rounded-md px-2 py-2.5" onClick={() => setOpen(false)}>Sign in</Link>}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a href={href} aria-label={label} target="_blank" rel="noreferrer" className="hover:text-white/70">
      {children}
    </a>
  );
}

function Drop({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="absolute left-0 top-full z-50 w-56 pt-2">
      <div className="rounded-md border border-[#ece8df] bg-white p-2 shadow-lg">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block rounded px-3 py-2 text-sm hover:bg-[#f6f3ec]">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function AccountMenu({ session }: { session: { name: string; role: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const studio = canManageStudio(session.role);
  const initials = session.name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "U";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative">
      <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-[#0c1220] text-xs font-medium text-white" aria-label="Account menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {initials}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-[#ece8df] bg-white p-2 text-left text-[#1c1915] shadow-xl">
          <p className="px-3 py-2 text-sm font-medium">{session.name}</p>
          {studio ? <Link href="/admin" className="block rounded px-3 py-2 text-sm hover:bg-[#f6f3ec]" onClick={() => setOpen(false)}>Dashboard</Link> : null}
          <Link href="/account" className="block rounded px-3 py-2 text-sm hover:bg-[#f6f3ec]" onClick={() => setOpen(false)}>Purchases</Link>
          <form action={logoutAction}>
            <button type="submit" className="w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f6f3ec]">Sign out</button>
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
      <button type="button" className="rounded-md border border-[#e4dfd4] px-2.5 py-2 text-xs tracking-wide" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((value) => !value)}>
        {currency}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border border-[#ece8df] bg-white p-3 text-[#1c1915] shadow-xl">
          <label className="sr-only" htmlFor="currency-search">Search currencies</label>
          <input id="currency-search" className="field !rounded-md !py-2 text-sm" placeholder="Search currency" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
          <ul className="mt-2 max-h-64 overflow-auto" role="listbox">
            {filtered.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm hover:bg-[#f6f3ec]"
                  onClick={() => {
                    setCurrency(code);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span>{currencyName(code)}</span>
                  <span className="text-xs text-[#6b655c]">{code}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 ? <li className="px-2 py-3 text-sm text-[#6b655c]">No currency matches.</li> : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
