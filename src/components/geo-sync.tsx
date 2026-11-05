"use client";

import { useEffect, useRef } from "react";

export function GeoSync({ currency, persist }: { currency: string; persist: boolean }) {
  const started = useRef(false);

  useEffect(() => {
    if (!persist || started.current) return;
    started.current = true;
    void fetch("/api/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency }),
    });
  }, [currency, persist]);

  return null;
}
