import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/profile";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [session, profile] = await Promise.all([getSession(), getProfile()]);
  return (
    <div className="store-theme min-h-screen bg-[#071018] text-[#f4f7fb]">
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
