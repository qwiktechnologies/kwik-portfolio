"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { FiChevronDown, FiMenu, FiMessageCircle, FiSearch, FiShoppingBag, FiX } from "react-icons/fi";
import { logoutAction } from "@/lib/actions/auth";
import { BLOG_CATEGORIES, CATEGORIES, canManageStudio } from "@/lib/constants";
import { MARKETS, marketByCurrency } from "@/lib/markets";
import { useCart } from "./cart-provider";
import { useCurrency } from "./currency-provider";

export function Header({
  companyName,
  email,
  facebook,
  instagram,
  tiktok,
  twitter,
  session,
}: {
  companyName: string;
  email: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  session: { name: string; role: string } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<"template" | "course" | null>(null);
  const [section, setSection] = useState<"template" | "course" | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOpen(false);
    setMenu(null);
    setSection(null);
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
        <div className="mx-auto flex h-10 w-full max-w-[1200px] items-center justify-between gap-3 px-4 text-xs sm:px-6">
          <Link href="/#faq" className="inline-flex shrink-0 items-center gap-1.5 hover:text-white/80">
            <FiMessageCircle aria-hidden />
            FAQ
          </Link>
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <a href={`mailto:${email}`} className="hidden items-center gap-1.5 truncate hover:text-white/80 lg:inline-flex">
              <FiMessageCircle aria-hidden />
              @Qwiktechnologies.com
            </a>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Social href={facebook || "https://www.facebook.com"} label="Facebook"><FaFacebookF /></Social>
              <Social href={instagram || "https://www.instagram.com"} label="Instagram"><FaInstagram /></Social>
              <Social href={tiktok || "https://www.tiktok.com"} label="TikTok"><FaTiktok /></Social>
              <Social href={twitter || "https://x.com"} label="Twitter"><FaXTwitter /></Social>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-[#1d4e9e] bg-[#0c1220] text-white">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-2 px-4 sm:h-[72px] sm:gap-4 sm:px-6">
          <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
            <Image src="/brand/logo.png" alt={companyName} width={70} height={80} className="h-10 w-auto sm:h-11" priority />
          </Link>
          <form onSubmit={search} className="hidden min-w-0 flex-1 items-center sm:flex xl:max-w-xs">
            <label className="relative block w-full">
              <span className="sr-only">Search category</span>
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8478]" aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search category"
                className="h-10 w-full rounded-md border border-[#1d4e9e] bg-[#122033] pl-9 pr-3 text-sm text-white outline-none placeholder:text-[#9aa8c0] focus:border-[#f15a22]"
              />
            </label>
          </form>
          <nav className="ml-auto hidden items-center gap-5 text-sm text-white xl:flex" aria-label="Primary">
            <Link href="/" className={pathname === "/" ? "text-[#f15a22]" : "hover:text-[#f15a22]"}>Home</Link>
            <div className="relative" onMouseEnter={() => setMenu("template")} onMouseLeave={() => setMenu(null)}>
              <Link href="/work" className="inline-flex items-center gap-1 hover:text-[#f15a22]">
                Our Work <FiChevronDown className="text-xs" aria-hidden />
              </Link>
              {menu === "template" ? <Drop links={CATEGORIES.map((item) => ({ href: `/work?category=${encodeURIComponent(item)}`, label: item }))} /> : null}
            </div>
            <div className="relative" onMouseEnter={() => setMenu("course")} onMouseLeave={() => setMenu(null)}>
              <Link href="/blog" className="inline-flex items-center gap-1 hover:text-[#f15a22]">
                Blog <FiChevronDown className="text-xs" aria-hidden />
              </Link>
              {menu === "course" ? <Drop links={BLOG_CATEGORIES.map((item) => ({ href: `/blog?category=${encodeURIComponent(item)}`, label: item }))} /> : null}
            </div>
            <Link href="/about" className={pathname.startsWith("/about") ? "text-[#f15a22]" : "hover:text-[#f15a22]"}>Who We Are</Link>
          </nav>
          <Link href="/contact" className="hidden shrink-0 rounded-md bg-[#f15a22] px-4 py-2 text-sm font-medium text-[#0c1220] hover:bg-[#ff7a45] xl:inline-flex">
            Get In Touch
          </Link>
          <div className="ml-auto flex shrink-0 items-center gap-1 xl:ml-0">
            <CurrencySwitcher />
            <Link href="/cart" className="relative grid h-10 w-10 place-items-center rounded-md hover:bg-white/10" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
              <FiShoppingBag />
              {count > 0 ? <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#f15a22] px-1 text-[10px] text-white">{count}</span> : null}
            </Link>
            {session ? <AccountMenu session={session} /> : (
              <Link href="/login" className="hidden px-2 text-sm hover:text-[#f15a22] xl:inline">Sign in</Link>
            )}
            <button type="button" className="grid h-10 w-10 place-items-center rounded-md hover:bg-white/10 xl:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-[#1d4e9e] bg-[#0c1220] px-4 py-4 text-white xl:hidden">
            <form onSubmit={search} className="mb-3 sm:hidden">
              <label className="relative block">
                <span className="sr-only">Search category</span>
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8478]" aria-hidden />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search category" className="h-11 w-full rounded-md border border-[#1d4e9e] bg-[#122033] pl-9 pr-3 text-sm text-white outline-none placeholder:text-[#9aa8c0]" />
              </label>
            </form>
            <div className="flex flex-col gap-1 text-sm">
              <Link href="/" className="rounded-md px-2 py-2.5 hover:bg-white/10" onClick={() => setOpen(false)}>Home</Link>
              <button type="button" className="flex items-center justify-between rounded-md px-2 py-2.5 text-left hover:bg-white/10" aria-expanded={section === "template"} onClick={() => setSection((value) => (value === "template" ? null : "template"))}>
                Our Work <FiChevronDown className={`text-xs transition ${section === "template" ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {section === "template" ? (
                <div className="mb-1 ml-2 flex flex-col border-l border-[#1d4e9e] pl-2">
                  <Link href="/work" className="rounded-md px-2 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>All work</Link>
                  {CATEGORIES.map((item) => (
                    <Link key={item} href={`/work?category=${encodeURIComponent(item)}`} className="rounded-md px-2 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>{item}</Link>
                  ))}
                </div>
              ) : null}
              <button type="button" className="flex items-center justify-between rounded-md px-2 py-2.5 text-left hover:bg-white/10" aria-expanded={section === "course"} onClick={() => setSection((value) => (value === "course" ? null : "course"))}>
                Blog <FiChevronDown className={`text-xs transition ${section === "course" ? "rotate-180" : ""}`} aria-hidden />
              </button>
              {section === "course" ? (
                <div className="mb-1 ml-2 flex flex-col border-l border-[#1d4e9e] pl-2">
                  <Link href="/blog" className="rounded-md px-2 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>All posts</Link>
                  {BLOG_CATEGORIES.map((item) => (
                    <Link key={item} href={`/blog?category=${encodeURIComponent(item)}`} className="rounded-md px-2 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>{item}</Link>
                  ))}
                </div>
              ) : null}
              <Link href="/about" className="rounded-md px-2 py-2.5 hover:bg-white/10" onClick={() => setOpen(false)}>Who We Are</Link>
              <Link href="/contact" className="mt-1 rounded-md bg-[#f15a22] px-3 py-2.5 text-center font-medium text-[#0c1220]" onClick={() => setOpen(false)}>Get In Touch</Link>
              {session ? null : <Link href="/login" className="rounded-md px-2 py-2.5 hover:bg-white/10" onClick={() => setOpen(false)}>Sign in</Link>}
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
      <div className="rounded-md border border-[#1d4e9e] bg-[#0c1220] p-2 text-white shadow-lg">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block rounded px-3 py-2 text-sm hover:bg-white/10">
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
      <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-[#f15a22] text-xs font-medium text-[#0c1220]" aria-label="Account menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {initials}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-[#1d4e9e] bg-[#0c1220] p-2 text-left text-white shadow-xl">
          <p className="px-3 py-2 text-sm font-medium">{session.name}</p>
          {studio ? <Link href="/admin" className="block rounded px-3 py-2 text-sm hover:bg-white/10" onClick={() => setOpen(false)}>Dashboard</Link> : null}
          <Link href="/account" className="block rounded px-3 py-2 text-sm hover:bg-white/10" onClick={() => setOpen(false)}>Purchases</Link>
          <form action={logoutAction}>
            <button type="submit" className="w-full rounded px-3 py-2 text-left text-sm hover:bg-white/10">Sign out</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const active = marketByCurrency(currency);

  return (
    <div className="relative">
      <button type="button" className="max-w-28 truncate rounded-md border border-[#1d4e9e] px-2.5 py-2 text-xs tracking-wide text-white" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((value) => !value)}>
        {active.label}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-md border border-[#1d4e9e] bg-[#0c1220] p-2 text-white shadow-xl">
          <ul role="listbox">
            {MARKETS.map((market) => (
              <li key={market.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm hover:bg-white/10"
                  onClick={() => {
                    setCurrency(market.currency);
                    setOpen(false);
                  }}
                >
                  <span>{market.label}</span>
                  <span className="text-xs text-[#9ec0ff]">{market.currency}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
