import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [session, profile] = await Promise.all([getSession(), getProfile()]);
  return (
    <>
      <Header companyName={profile.companyName} session={session ? { name: session.name, role: session.role } : null} />
      <main id="main">{children}</main>
      <Footer profile={profile} />
    </>
  );
}
