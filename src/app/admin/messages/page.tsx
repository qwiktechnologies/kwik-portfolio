import { markMessage } from "@/lib/actions/admin";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/site";

export default async function MessagesPage() {
  await requireStudio();
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-serif text-5xl">Messages</h1>
      <div className="mt-8 space-y-4">
        {messages.length === 0 ? <p className="text-sm text-muted">No messages yet.</p> : null}
        {messages.map((message) => (
          <article key={message.id} className="rounded-3xl border border-line bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{message.subject}</h2>
                <p className="text-sm text-muted">{message.name} · {message.email}{message.phone ? ` · ${message.phone}` : ""} · {formatDate(message.createdAt)}</p>
              </div>
              {message.read ? <span className="text-xs text-muted">Read</span> : (
                <form action={markMessage}>
                  <input type="hidden" name="id" value={message.id} />
                  <button className="text-xs underline">Mark read</button>
                </form>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{message.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
