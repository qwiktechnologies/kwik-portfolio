import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth-frame";
import { ForgotForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default function ForgotPage() {
  return (
    <AuthFrame title="Reset your password" lead="Enter the email on the account. The link expires in one hour.">
      <ForgotForm />
    </AuthFrame>
  );
}
