export const ROLES = ["SUPER_ADMIN", "ADMIN", "STAFF", "CUSTOMER"] as const;
export type Role = (typeof ROLES)[number];

export const CATEGORIES = [
  "Ecommerce",
  "Service website",
  "Landing page",
  "Company portfolio",
  "Logo",
  "Flyer",
] as const;

export const BLOG_CATEGORIES = [
  "Studio notes",
  "Ecommerce",
  "Service websites",
  "Landing pages",
  "Company portfolios",
  "Logos",
  "Flyers",
  "How to buy",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export function isBlogCategory(value: string): value is BlogCategory {
  return (BLOG_CATEGORIES as readonly string[]).includes(value);
}

export const CHARGE_CURRENCIES = ["usd", "eur", "gbp", "cad", "aud"] as const;

export const ORDER_STATUS = ["PENDING", "PAID", "FAILED", "CANCELLED"] as const;

export function canManageStudio(role: string) {
  return role === "SUPER_ADMIN" || role === "ADMIN" || role === "STAFF";
}

export function canManagePeople(role: string) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canEditContact(role: string) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canManageStripe(role: string) {
  return role === "SUPER_ADMIN";
}

export function roleLabel(role: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Owner";
    case "ADMIN":
      return "Admin";
    case "STAFF":
      return "Staff";
    default:
      return "Customer";
  }
}
