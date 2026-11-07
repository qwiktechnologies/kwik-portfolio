import Image from "next/image";

export function HeroDevices() {
  return (
    <Image
      src="/brand/hero-devices.png"
      alt="Desktop monitor and website layouts for tailored digital work"
      width={450}
      height={403}
      priority
      className="ml-auto h-auto w-full max-w-[480px]"
    />
  );
}
