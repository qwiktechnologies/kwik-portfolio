"use client";

import { buttonClass } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="font-serif text-5xl">Something went wrong.</h1>
      <p className="mt-3 text-muted">The page could not finish loading. Try it again.</p>
      <button className={`${buttonClass.solid} mt-6`} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
