"use client";

import { useState } from "react";
import { buttonClass } from "./ui";

export function ExtraFields({ initial }: { initial: { label: string; value: string }[] }) {
  const [rows, setRows] = useState(initial);
  return (
    <div className="space-y-3">
      <input type="hidden" name="extraJson" value={JSON.stringify(rows)} />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">More contact details</p>
        <button type="button" className={buttonClass.small} onClick={() => setRows((current) => [...current, { label: "", value: "" }])}>
          Add a detail
        </button>
      </div>
      {rows.map((row, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className="field"
            placeholder="Label"
            value={row.label}
            onChange={(event) => setRows((current) => current.map((item, i) => (i === index ? { ...item, label: event.target.value } : item)))}
          />
          <input
            className="field"
            placeholder="Value"
            value={row.value}
            onChange={(event) => setRows((current) => current.map((item, i) => (i === index ? { ...item, value: event.target.value } : item)))}
          />
          <button type="button" className={buttonClass.small} onClick={() => setRows((current) => current.filter((_, i) => i !== index))}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
