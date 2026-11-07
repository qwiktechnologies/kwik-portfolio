import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

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

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Services" },
  { href: "/work", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="bg-[#14161c] text-[#d7d3cb]">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <Link href="/" className="inline-flex items-center gap-3 text-white">
            <Image src="/brand/logo.png" alt="" width={48} height={56} className="h-12 w-auto" />
            <span className="font-serif text-2xl">{profile.companyName}</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#b7b3ab]">
            Technology needs to support human initiatives not substitute them. Only when you have the courage to lose sight of the shore, you will discover new oceans!
          </p>
          <div className="mt-6 flex items-center gap-4 text-lg">
            <a href="https://www.linkedin.com" aria-label="LinkedIn" className="text-[#0a66c2]"><FaLinkedinIn /></a>
            <a href="https://x.com" aria-label="X" className="text-white"><FaXTwitter /></a>
            <a href={profile.instagram || "https://www.instagram.com"} aria-label="Instagram" className="text-[#e1306c]"><FaInstagram /></a>
            <a href="https://www.facebook.com" aria-label="Facebook" className="text-[#1877f2]"><FaFacebookF /></a>
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
          <p className="text-base text-white">Socials</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={profile.instagram || "https://www.instagram.com"} className="hover:text-white">Instagram</a></li>
            <li><a href="https://www.linkedin.com" className="hover:text-white">Linkdein</a></li>
            <li><a href="https://x.com" className="hover:text-white">Twitter</a></li>
            <li><a href="https://www.facebook.com" className="hover:text-white">Facebook</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
