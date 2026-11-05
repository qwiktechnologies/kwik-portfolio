import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { requireStudio } from "@/lib/access";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Studio desk",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStudio();
  const unread = await prisma.contactMessage.count({ where: { read: false } });
  return (
    <AdminShell role={session.role} name={session.name} unread={unread}>
      {children}
    </AdminShell>
  );
}
