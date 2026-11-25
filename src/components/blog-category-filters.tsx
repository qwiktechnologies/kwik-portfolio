import Link from "next/link";
import {
  FiBookOpen,
  FiFileText,
  FiGrid,
  FiImage,
  FiLayers,
  FiMonitor,
  FiPenTool,
  FiShoppingBag,
} from "react-icons/fi";
import { BLOG_CATEGORIES, type BlogCategory } from "@/lib/constants";

const icons: Record<BlogCategory, typeof FiBookOpen> = {
  "Studio notes": FiPenTool,
  Ecommerce: FiShoppingBag,
  "Service websites": FiMonitor,
  "Landing pages": FiLayers,
  "Company portfolios": FiGrid,
  Logos: FiImage,
  Flyers: FiFileText,
  "How to buy": FiBookOpen,
};

export function BlogCategoryFilters({
  active,
  counts,
}: {
  active?: BlogCategory;
  counts: Map<string, number>;
}) {
  return (
    <div className="chip-row mt-6 lg:mt-8" aria-label="Blog categories">
      <FilterChip href="/blog" active={!active} label="All blogs" count={counts.get("__all")} />
      {BLOG_CATEGORIES.map((item) => (
        <FilterChip
          key={item}
          href={`/blog?category=${encodeURIComponent(item)}`}
          active={active === item}
          label={item}
          count={counts.get(item)}
          icon={icons[item]}
        />
      ))}
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
  count,
  icon: Icon,
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
  icon?: typeof FiBookOpen;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-[#16181d] bg-[#16181d] text-white"
          : "border-[#e3daca] bg-white text-[#3d3a33] hover:border-[#cfc9bf]"
      }`}
    >
      {Icon && !active ? <Icon className="text-base opacity-70" aria-hidden /> : null}
      {label}
      {typeof count === "number" ? (
        <span className={active ? "text-white/70" : "text-[#8a8478]"}>{count}</span>
      ) : null}
    </Link>
  );
}