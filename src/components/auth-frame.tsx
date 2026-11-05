export function AuthFrame({
  title,
  lead,
  cardTitle,
  cardLead,
  children,
}: {
  title: string;
  lead: string;
  cardTitle: string;
  cardLead: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Account</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted">{lead}</p>
        </div>
        <div className="auth-card rounded-[1.75rem] border border-white bg-card px-6 py-8 shadow-[0_28px_80px_rgba(22,24,29,0.08)] sm:px-8 sm:py-10">
          <h2 className="text-2xl font-medium tracking-tight">{cardTitle}</h2>
          <p className="mt-1.5 text-sm leading-6 text-muted">{cardLead}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </section>
  );
}
