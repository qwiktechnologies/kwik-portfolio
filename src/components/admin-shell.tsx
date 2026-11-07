"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiBookOpen, FiCreditCard, FiGrid, FiImage, FiKey, FiMail, FiMapPin, FiMenu, FiShoppingBag, FiUsers, FiX } from "react-icons/fi";

const links = [
  { href: "/admin", label: "Overview", icon: FiGrid, exact: true },
  { href: "/admin/portfolio", label: "Portfolio", icon: FiImage },
  { href: "/admin/purchases", label: "Purchases", icon: FiShoppingBag },
  { href: "/admin/payments", label: "Payments", icon: FiCreditCard },
  { href: "/admin/messages", label: "Messages", icon: FiMail },
  { href: "/admin/blog", label: "Blog", icon: FiBookOpen },
  { href: "/admin/people", label: "People", icon: FiUsers, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/admin/contact", label: "Contact", icon: FiMapPin, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/admin/stripe", label: "Paystack", icon: FiKey, roles: ["SUPER_ADMIN"] },
];

export function AdminShell({
  role,
  name,
  unread,
  children,
}: {
  role: string;
  name: string;
  unread: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visible = links.filter((link) => !link.roles || link.roles.includes(role));

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-card text-ink md:min-h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Studio desk</p>
            <p className="mt-1 text-sm">{name}</p>
          </div>
          <button className="grid h-10 w-10 place-items-center md:hidden" aria-label="Desk menu" onClick={() => setOpen((value) => !value)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
        <nav className={`${open ? "block" : "hidden"} space-y-1 px-3 pb-6 md:block`} aria-label="Studio">
          {visible.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${active ? "bg-paper text-ink" : "text-muted hover:bg-paper hover:text-ink"}`}
              >
                <span className="flex items-center gap-2">
                  <Icon aria-hidden />
                  {link.label}
                </span>
                {link.href === "/admin/messages" && unread > 0 ? <span className="rounded-full bg-ember px-2 text-[10px] text-white">{unread}</span> : null}
              </Link>
            );
          })}
          <Link href="/" className="mt-4 block px-3 py-2 text-sm text-muted hover:text-ink">
            View the site
          </Link>
        </nav>
      </aside>
      <div id="main" className="px-5 py-8 md:px-10">
        {children}
      </div>
    </div>
  );
}
