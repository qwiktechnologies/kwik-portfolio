const FALLBACK = "/brand/blog/landing-page-or-full-website.jpg";

/** Normalize stored cover URLs so Next/Image can load them reliably. */
export function blogCoverUrl(src: string | null | undefined) {
  const trimmed = src?.trim();
  if (!trimmed) return FALLBACK;
  if (trimmed.startsWith("/")) return trimmed;
  if (!trimmed.startsWith("http")) return FALLBACK;
  return trimmed;
}