import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth-frame";
import { ForgotForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default function ForgotPage() {
  return (
    <AuthFrame
      title="Set a new password."
      lead="One link goes to the email on the account. It expires in an hour."
      cardTitle="Reset password"
      cardLead="Enter the email you signed up with."
    >
      <ForgotForm />
    </AuthFrame>
  );
}
