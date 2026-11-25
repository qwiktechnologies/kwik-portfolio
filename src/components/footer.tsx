import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

type Profile = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  hours: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  twitter: string;
  extraJson: string;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Who We Are" },
  { href: "/contact", label: "Get In Touch" },
];

export function Footer({ profile }: { profile: Profile }) {
  const socials = [
    { href: profile.facebook || "https://www.facebook.com", label: "Facebook", icon: <FaFacebookF />, className: "text-[#1877f2]" },
    { href: profile.instagram || "https://www.instagram.com", label: "Instagram", icon: <FaInstagram />, className: "text-[#e1306c]" },
    { href: profile.tiktok || "https://www.tiktok.com", label: "TikTok", icon: <FaTiktok />, className: "text-white" },
    { href: profile.twitter || "https://x.com", label: "Twitter", icon: <FaXTwitter />, className: "text-white" },
  ];

  return (
    <footer className="hero-surface text-[#e8edf5]">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <Link href="/" className="inline-flex max-w-full">
            <Image src="/brand/logo.png" alt={profile.companyName} width={909} height={271} className="h-16 w-auto sm:h-[4.5rem]" />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
            Technology needs to support human initiatives not substitute them. Only when you have the courage to lose sight of the shore, you will discover new oceans!
          </p>
          <div className="mt-6 flex items-center gap-4 text-lg">
            {socials.map((item) => (
              <a key={item.label} href={item.href} aria-label={item.label} target="_blank" rel="noreferrer" className={item.className}>{item.icon}</a>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-base text-white">links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.label}><Link href={link.href} className="hover:text-white">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="text-base text-white">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>{profile.address}</li>
            <li>
              <a className="hover:text-white" href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>
                {profile.phone}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
            {profile.hours ? <li>{profile.hours}</li> : null}
          </ul>
        </div>
      </div>
    </footer>
  );
}
