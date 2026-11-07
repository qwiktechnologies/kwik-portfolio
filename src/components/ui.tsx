import Link from "next/link";

export const buttonClass = {
  solid: "inline-flex items-center justify-center gap-2 rounded-full bg-night px-5 py-3 text-sm font-medium text-paper transition hover:bg-[#262b24] disabled:opacity-60",
  orange: "inline-flex items-center justify-center gap-2 rounded-md bg-[#f15a22] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#d94e1c] disabled:opacity-60",
  light: "inline-flex items-center justify-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-medium text-night transition hover:bg-white disabled:opacity-60",
  line: "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card px-5 py-3 text-sm font-medium text-ink transition hover:border-ink disabled:opacity-60",
  lineLight: "inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-paper transition hover:border-white/60 disabled:opacity-60",
  small: "inline-flex items-center justify-center rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-ink",
};

export function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  autoComplete,
  hint,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  autoComplete?: string;
  hint?: string;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input className="field" name={name} type={type} required={required} defaultValue={defaultValue} autoComplete={autoComplete} min={min} />
      {hint ? <span className="mt-1.5 block text-xs leading-5 text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  name,
  required,
  defaultValue,
  rows = 5,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <textarea className="field min-h-32" name={name} required={required} defaultValue={defaultValue} rows={rows} />
      {hint ? <span className="mt-1.5 block text-xs leading-5 text-muted">{hint}</span> : null}
    </label>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="rounded-2xl border border-ember/30 bg-[#fff1ec] px-4 py-3 text-sm text-ink">{children}</p>;
}

export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-card px-6 py-14 text-center">
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{body}</p>
      {href && action ? (
        <Link href={href} className={`${buttonClass.solid} mt-6`}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}
