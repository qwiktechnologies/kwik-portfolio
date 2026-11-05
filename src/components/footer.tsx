import Image from "next/image";
import Link from "next/link";
import { parseExtra } from "@/lib/site";

type Profile = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  hours: string;
  instagram: string;
  extraJson: string;
};

export function Footer({ profile }: { profile: Profile }) {
  const extra = parseExtra(profile.extraJson);
  return (
    <footer className="mt-16 border-t border-line bg-card text-ink sm:mt-20">
      <div className="mx-auto grid w-[90%] gap-8 px-4 py-12 sm:px-5 sm:py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex">
            <Image src="/brand/logo.png" alt={profile.companyName} width={70} height={80} className="h-12 w-auto sm:h-14" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{profile.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:contents">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Visit</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/work">Catalog</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Get in touch</Link></li>
              <li><Link href="/account">Your purchases</Link></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Studio</p>
            <address className="mt-4 space-y-2 text-sm not-italic leading-6">
              <p>{profile.address}</p>
              <p><a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>{profile.phone}</a></p>
              <p className="break-all"><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
              {profile.hours ? <p>{profile.hours}</p> : null}
              {profile.whatsapp ? <p>WhatsApp {profile.whatsapp}</p> : null}
              {profile.instagram ? (
                <p>
                  <a href={profile.instagram} rel="noreferrer">
                    Instagram
                  </a>
                </p>
              ) : null}
              {extra.map((row) => (
                <p key={row.label}>
                  {row.label}: {row.value}
                </p>
              ))}
            </address>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-[90%] flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-muted">
          <p>© {new Date().getFullYear()} {profile.companyName}. Catalog prices are set in naira.</p>
          <p>Card payments run through Stripe.</p>
        </div>
      </div>
    </footer>
  );
}
