import Image from "next/image";

export function HeroDevices() {
  return (
    <Image
      src="/brand/hero-devices.png"
      alt="Desktop monitor and website layouts for tailored digital work"
      width={450}
      height={403}
      priority
      className="mx-auto h-auto w-full max-w-[300px] drop-shadow-[0_28px_40px_rgba(0,0,0,0.45)] md:ml-auto md:max-w-[560px]"
    />
  );
}
