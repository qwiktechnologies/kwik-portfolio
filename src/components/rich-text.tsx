import Link from "next/link";
import { looksLikeHtml, sanitizeRichHtml } from "@/lib/rich-html";

export function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/);
  return (
    <div className="prose-quick space-y-4 text-[17px] leading-8 text-ink/90">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-4 font-serif text-3xl text-ink">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {block.split("\n").map((line) => (
                <li key={line}>{inline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{inline(block)}</p>;
      })}
    </div>
  );
}

function inline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return <span key={index}>{part}</span>;
    const href = match[2];
    if (href.startsWith("/")) {
      return (
        <Link key={index} href={href}>
          {match[1]}
        </Link>
      );
    }
    if (href.startsWith("https://")) {
      return (
        <a key={index} href={href} rel="noreferrer">
          {match[1]}
        </a>
      );
    }
    return <span key={index}>{match[1]}</span>;
  });
}

export function ArticleBody({ text }: { text: string }) {
  if (looksLikeHtml(text)) {
    return <div className="rich-body text-[17px] leading-8 text-ink/90" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(text) }} />;
  }
  return <RichText text={text} />;
}
