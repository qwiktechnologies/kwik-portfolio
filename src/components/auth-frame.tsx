export function AuthFrame({
  title,
  lead,
  cardTitle,
  cardLead,
  points,
  children,
}: {
  title: string;
  lead: string;
  cardTitle: string;
  cardLead: string;
  points?: string[];
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-[90%] py-8 sm:py-12">
      <div className="grid overflow-hidden rounded-[2rem] border border-line bg-card shadow-[0_30px_80px_rgba(22,24,29,0.07)] lg:min-h-[560px] lg:grid-cols-2">
        <div className="flex flex-col justify-between bg-paper px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ember">Account</p>
          <div className="mt-10 lg:mt-0">
            <h1 className="max-w-lg font-serif text-5xl leading-[1.02] sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted">{lead}</p>
          </div>
          {points?.length ? (
            <ul className="mt-10 space-y-3 text-sm text-ink">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                  {point}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
        </div>
        <div className="auth-card flex items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-medium tracking-tight">{cardTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{cardLead}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
