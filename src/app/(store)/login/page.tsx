import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/auth-frame";
import { LoginForm } from "@/components/auth-forms";
import { getSession } from "@/lib/auth";
import { canManageStudio } from "@/lib/constants";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const session = await getSession();
  const { next } = await searchParams;
  const requested = next && next.startsWith("/") && !next.startsWith("//") ? next : "";
  const dest = session && canManageStudio(session.role) ? (requested.startsWith("/admin") ? requested : "/admin") : requested || "/account";
  if (session) redirect(dest);
  return (
    <AuthFrame title="Welcome back" lead="Sign in to pay, keep the receipt, and send the brief for your purchase.">
      <LoginForm next={dest} devHint={process.env.NODE_ENV !== "production"} />
    </AuthFrame>
  );
}
