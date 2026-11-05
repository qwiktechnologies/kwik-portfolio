import Link from "next/link";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-3 font-serif text-5xl">That page is not on the shelf.</h1>
      <p className="mt-4 text-muted">The catalog, the journal, and the studio contact page are still here.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className={buttonClass.solid}>Home</Link>
        <Link href="/work" className={buttonClass.line}>Catalog</Link>
      </div>
    </div>
  );
}
