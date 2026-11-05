import { redirect } from "next/navigation";
import { getSession } from "./auth";
import { canEditContact, canManagePeople, canManageStripe, canManageStudio } from "./constants";

export async function requireStudio() {
  const session = await getSession();
  if (!session || !canManageStudio(session.role)) redirect("/login?next=/admin");
  return session;
}

export async function requirePeopleAccess() {
  const session = await requireStudio();
  if (!canManagePeople(session.role)) redirect("/admin");
  return session;
}

export async function requireContactAccess() {
  const session = await requireStudio();
  if (!canEditContact(session.role)) redirect("/admin");
  return session;
}

export async function requireStripeAccess() {
  const session = await requireStudio();
  if (!canManageStripe(session.role)) redirect("/admin");
  return session;
}

export async function requireCustomer() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");
  return session;
}
