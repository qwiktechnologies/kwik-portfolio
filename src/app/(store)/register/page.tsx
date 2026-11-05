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
    <AuthFrame
      title="Open an account in a minute."
      lead="Checkout, the project brief, and every purchase you come back to live on one account."
      cardTitle="Create account"
      cardLead="Use the email you want receipts sent to."
      points={["Free to open", "One account for every purchase", "The brief stays with the order"]}
    >
      <RegisterForm />
    </AuthFrame>
  );
}
