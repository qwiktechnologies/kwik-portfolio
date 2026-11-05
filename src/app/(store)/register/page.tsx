import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/auth-frame";
import { RegisterForm } from "@/components/auth-forms";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/account");
  return (
    <AuthFrame title="Create your account" lead="One account covers checkout, the project brief, and every purchase you come back to.">
      <RegisterForm />
    </AuthFrame>
  );
}
