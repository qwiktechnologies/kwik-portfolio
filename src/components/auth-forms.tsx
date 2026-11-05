"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotAction, loginAction, registerAction, resetAction } from "@/lib/actions/auth";
import { buttonClass, Field, Notice } from "./ui";

export function LoginForm({ next, devHint }: { next: string; devHint: boolean }) {
  const [state, action, pending] = useActionState(loginAction, { error: "" });
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {state.error ? <Notice>{state.error}</Notice> : null}
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      <button className={`${buttonClass.solid} w-full`} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <div className="flex justify-between text-sm">
        <Link href="/forgot-password" className="underline underline-offset-4">
          Reset password
        </Link>
        <Link href="/register" className="underline underline-offset-4">
          Create an account
        </Link>
      </div>
      {devHint ? (
        <p className="rounded-2xl bg-paper px-4 py-3 text-xs leading-5 text-muted">
          Local owner account: superadmin@quicktech.studio / QuickTech#Super1
        </p>
      ) : null}
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, { error: "" });
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Notice>{state.error}</Notice> : null}
      <Field label="Name" name="name" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="new-password" required hint="At least 8 characters." />
      <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" required />
      <button className={`${buttonClass.solid} w-full`} disabled={pending}>
        {pending ? "Creating…" : "Create account"}
      </button>
      <p className="text-sm">
        Already registered?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function ForgotForm() {
  const [state, action, pending] = useActionState(forgotAction, { error: "", devLink: "", ok: false });
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Notice>{state.error}</Notice> : null}
      {state.ok ? <p className="rounded-2xl bg-[#e8f5ee] px-4 py-3 text-sm text-pine">If that email has an account, a reset link is ready.</p> : null}
      {state.devLink ? (
        <p className="rounded-2xl bg-paper px-4 py-3 text-sm">
          Development reset link:{" "}
          <Link href={state.devLink.replace(/^https?:\/\/[^/]+/, "")} className="underline">
            set a new password
          </Link>
        </p>
      ) : null}
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <button className={`${buttonClass.solid} w-full`} disabled={pending}>
        {pending ? "Preparing…" : "Send reset link"}
      </button>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetAction, { error: "", ok: false });
  if (!token) return <Notice>This reset link is missing its token.</Notice>;
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      {state.error ? <Notice>{state.error}</Notice> : null}
      <Field label="New password" name="password" type="password" autoComplete="new-password" required />
      <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" required />
      <button className={`${buttonClass.solid} w-full`} disabled={pending}>
        {pending ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
