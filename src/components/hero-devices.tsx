function ScreenSite({ tone }: { tone: "orange" | "teal" }) {
  return (
    <div className="h-full overflow-hidden bg-white text-[7px] leading-none text-[#1c1915]">
      <div className={`flex h-5 items-center gap-1 px-1.5 ${tone === "orange" ? "bg-[#f15a22]" : "bg-[#14919b]"}`}>
        <span className="h-1.5 w-6 rounded-sm bg-white/80" />
        <span className="ml-auto h-1.5 w-3 rounded-sm bg-white/70" />
        <span className="h-1.5 w-3 rounded-sm bg-white/70" />
      </div>
      <div className="grid grid-cols-5 gap-1 p-1.5">
        <div className={`col-span-3 h-10 ${tone === "orange" ? "bg-[#1d4e9e]" : "bg-[#0f766e]"}`} />
        <div className="col-span-2 space-y-1">
          <div className="h-2 w-full bg-[#ece8df]" />
          <div className="h-2 w-4/5 bg-[#ece8df]" />
          <div className="h-2 w-3/5 bg-[#ece8df]" />
        </div>
        <div className="col-span-2 h-7 bg-[#dbe4f5]" />
        <div className="col-span-3 h-7 bg-[#f3f0e8]" />
      </div>
    </div>
  );
}

export function HeroDevices() {
  return (
    <div className="relative mx-auto h-[280px] w-full max-w-[520px] sm:h-[340px]" aria-hidden>
      <div className="absolute right-0 top-2 w-[78%] origin-bottom-right -rotate-6">
        <div className="rounded-t-[18px] bg-[#e7edf4] p-2.5 pb-0 shadow-[0_24px_40px_rgba(18,40,90,0.28)]">
          <div className="aspect-[16/10] overflow-hidden rounded-t-md bg-white">
            <ScreenSite tone="orange" />
          </div>
          <div className="mx-auto h-3 w-16 bg-[#d5dde8]" />
        </div>
        <div className="mx-auto h-2.5 w-[46%] rounded-b-md bg-[#c5d0de]" />
        <div className="mx-auto h-1.5 w-[62%] rounded-b-md bg-[#b7c4d4]" />
      </div>
      <div className="absolute bottom-6 left-[6%] w-[58%] -rotate-3 overflow-hidden rounded-md bg-white shadow-[0_16px_30px_rgba(16,32,74,0.28)]">
        <div className="aspect-[16/9]">
          <ScreenSite tone="teal" />
        </div>
      </div>
      <div className="absolute bottom-1 left-[18%] w-[52%] rotate-2 overflow-hidden rounded-md bg-white shadow-[0_18px_32px_rgba(16,32,74,0.32)]">
        <div className="aspect-[16/8]">
          <ScreenSite tone="orange" />
        </div>
      </div>
    </div>
  );
}
