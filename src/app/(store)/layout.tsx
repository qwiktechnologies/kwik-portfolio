import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [session, profile] = await Promise.all([getSession(), getProfile()]);
  return (
    <div className="min-h-screen bg-white text-[#1c1915]">
      <Header
        companyName={profile.companyName}
        email={profile.email}
        facebook={profile.facebook}
        instagram={profile.instagram}
        tiktok={profile.tiktok}
        twitter={profile.twitter}
        session={session ? { name: session.name, role: session.role } : null}
      />
      <main id="main">{children}</main>
      <Footer profile={profile} />
    </div>
  );
}
