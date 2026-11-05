const ALLOWED = new Set(["p", "h2", "h3", "strong", "em", "ul", "ol", "li", "a", "br", "blockquote"]);

export function looksLikeHtml(value: string) {
  return /^\s*</.test(value);
}

export function plainText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeRichHtml(input: string) {
  let html = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*\/?\s*>/gi, "");

  html = html.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const name = tag === "b" ? "strong" : tag === "i" ? "em" : tag === "div" ? "p" : tag;
    if (!ALLOWED.has(name)) return "";
    const closing = match.startsWith("</");
    if (closing) return `</${name}>`;
    if (name === "br") return "<br>";
    if (name === "a") {
      const hrefMatch = /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(rawAttrs);
      const href = (hrefMatch?.[1] || hrefMatch?.[2] || hrefMatch?.[3] || "").trim();
      if (!href.startsWith("/") && !href.startsWith("https://")) return "";
      return `<a href="${escapeAttr(href)}" rel="noreferrer">`;
    }
    return `<${name}>`;
  });

  return html.replace(/<(p|h2|h3|blockquote)>\s*<\/\1>/g, "").trim();
}

export function toEditorHtml(value: string) {
  const source = value.trim();
  if (!source) return "";
  if (looksLikeHtml(source)) return sanitizeRichHtml(source);

  const blocks = source.split(/\n\n+/);
  return blocks
    .map((block) => {
      if (block.startsWith("## ")) return `<h2>${inline(escapeText(block.slice(3)))}</h2>`;
      if (block.startsWith("### ")) return `<h3>${inline(escapeText(block.slice(4)))}</h3>`;
      const lines = block.split("\n");
      if (lines.every((line) => line.startsWith("- "))) {
        return `<ul>${lines.map((line) => `<li>${inline(escapeText(line.slice(2)))}</li>`).join("")}</ul>`;
      }
      return `<p>${inline(escapeText(block).replace(/\n/g, "<br>"))}</p>`;
    })
    .join("");
}

function inline(text: string) {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    if (!href.startsWith("/") && !href.startsWith("https://")) return label;
    return `<a href="${escapeAttr(href)}" rel="noreferrer">${label}</a>`;
  });
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
