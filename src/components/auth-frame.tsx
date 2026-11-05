export function AuthFrame({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col px-4 py-10 sm:py-16">
      <div className="rounded-[1.75rem] border border-line bg-card px-6 py-8 shadow-[0_24px_70px_rgba(22,24,29,0.06)] sm:px-8">
        <h1 className="font-serif text-4xl leading-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{lead}</p>
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}
