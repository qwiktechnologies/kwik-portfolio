import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiGlobe, FiPlay, FiShield, FiStar, FiUsers } from "react-icons/fi";

const HERO_IMAGE = "/brand/hero-woman.png";

const pills = ["Web Development", "UI/UX Design", "Branding", "Digital Marketing"] as const;

const stats = [
  { value: "13k+", label: "Happy clients", icon: FiUsers },
  { value: "4.9/5", label: "Client rating", icon: FiStar },
  { value: "50+", label: "Countries", icon: FiGlobe },
] as const;

function HeroActions({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/work" className="btn-hero-gradient">
          Explore Our Services
          <FiArrowRight aria-hidden />
        </Link>
        <Link href="/work" className="btn-hero-ghost">
          <FiPlay aria-hidden className="opacity-90" />
          Portfolio
        </Link>
        <a
          href={phoneHref}
          className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white/90 hover:bg-white/10"
        >
          {phone}
        </a>
      </div>
      <ul className="mt-8 hidden flex-wrap gap-6 text-sm text-white/75 sm:flex">
        <li className="flex items-center gap-2">
          <FiShield className="text-sky-300" aria-hidden />
          Innovative solutions
        </li>
        <li className="flex items-center gap-2">
          <FiUsers className="text-sky-300" aria-hidden />
          Trusted partner
        </li>
        <li className="flex items-center gap-2">
          <FiStar className="text-sky-300" aria-hidden />
          Dedicated support
        </li>
      </ul>
    </>
  );
}

export function HomeHero({
  headline,
  subline,
  phone,
  phoneHref,
}: {
  headline: string[];
  subline: string;
  phone: string;
  phoneHref: string;
}) {
  return (
    <section className="hero-surface relative overflow-hidden text-white">
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl lg:right-0" />
      <div className="relative mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-8 lg:grid lg:min-h-[min(88vh,820px)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-8 lg:py-14 xl:gap-12">
        <div className="flex flex-col justify-center lg:col-start-1 lg:row-start-1 lg:py-6">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
            Qwik Technologies
          </p>
          <h1 className="mt-6 text-[2rem] font-semibold leading-[1.08] tracking-tight sm:text-[2.65rem] lg:text-[3.05rem] xl:text-[3.35rem]">
            {headline.map((line, index) => (
              <span key={line} className="block">
                {index === headline.length - 1 ? (
                  <span className="text-gradient-accent">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg lg:max-w-lg xl:max-w-xl">
            {subline}
          </p>
          <div className="mt-8">
            <HeroActions phone={phone} phoneHref={phoneHref} />
          </div>
        </div>

        <div className="relative hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:items-end lg:justify-center">
          <div className="pointer-events-none absolute bottom-[8%] left-1/2 h-[75%] w-[95%] -translate-x-1/2 rounded-full bg-sky-400/18 blur-3xl" />
          <div className="relative flex h-full w-full min-h-[560px] items-end justify-center overflow-visible pb-2 xl:min-h-[620px]">
            <Image
              src={HERO_IMAGE}
              alt="Smiling professional holding a laptop"
              width={864}
              height={1152}
              priority
              className="relative z-10 h-[min(82vh,720px)] w-auto max-w-[118%] translate-x-2 object-contain object-bottom drop-shadow-[0_28px_56px_rgba(0,0,0,0.4)] xl:h-[min(86vh,780px)] xl:max-w-[125%]"
              sizes="(min-width: 1024px) 48vw, 0px"
            />
            <div className="absolute inset-x-0 bottom-6 z-20 flex flex-wrap justify-center gap-2 px-2 xl:bottom-8">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/30 bg-[#0c1220]/90 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-lg backdrop-blur-md"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:col-start-1 lg:row-start-2 lg:mt-0">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
              <p className="flex items-center gap-2 text-2xl font-bold text-white">
                <Icon className="text-sky-300" aria-hidden />
                {value}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/65">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}