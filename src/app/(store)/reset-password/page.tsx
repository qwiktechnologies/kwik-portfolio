import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth-frame";
import { ResetForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false, follow: false } };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthFrame
      title="Choose a new password."
      lead="At least 8 characters. You can sign in with it straight away."
      cardTitle="New password"
      cardLead="This replaces the password on the account."
    >
      <ResetForm token={token || ""} />
    </AuthFrame>
  );
}
