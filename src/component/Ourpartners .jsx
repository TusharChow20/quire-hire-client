"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const PARTNERS = [
  { id: "vodafone", name: "Vodafone", src: "/vodaphone.png", w: 1400, h: 404 },
  { id: "intel", name: "Intel", src: "/intel.png", w: 100, h: 44 },
  { id: "tesla", name: "Tesla", src: "/tesla.png", w: 120, h: 44 },
  { id: "amd", name: "AMD", src: "/amd.png", w: 110, h: 44 },
  { id: "talkit", name: "Talkit", src: "/talkit.png", w: 110, h: 44 },
];

const PARTNERS_MOBILE = [
  { id: "vodafone", name: "Vodafone", src: "/vodaphone.png", w: 1400, h: 44 },
  { id: "intel", name: "Intel", src: "/intel.png", w: 100, h: 44 },
  { id: "talkit", name: "Talkit", src: "/talkit.png", w: 110, h: 44 },
  { id: "amd", name: "AMD", src: "/amd.png", w: 110, h: 44 },
  { id: "tesla", name: "Tesla", src: "/tesla.png", w: 120, h: 44 },
];

function LogoButton({ partner, isTouchDevice, tappedId, onTap }) {
  const { id, name, src, w, h } = partner;
  const isTapped = tappedId === id;

  return (
    <button
      onClick={() => isTouchDevice && onTap(id)}
      aria-label={name}
      aria-pressed={isTapped}
      className="
        group relative focus:outline-none
        focus-visible:ring-2 focus-visible:ring-[#4640DE] focus-visible:ring-offset-2
        rounded-sm active:scale-95 transition-transform duration-200
      "
    >
      <span className="relative block mt-[-70px] ">
        <span
          className="block transition-opacity duration-300 ease-in-out group-hover:opacity-0"
          style={{ opacity: isTapped ? 0 : 1 }}
        >
          <Image
            src={src}
            alt={name}
            width={w}
            height={h}
            className="object-contain  w-auto"
            style={{ filter: "grayscale(1) brightness(1.05) contrast(0.8)" }}
            draggable={false}
          />
        </span>
        <span
          className="absolute inset-0 flex items-center transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
          style={{ opacity: isTapped ? 1 : undefined }}
          aria-hidden="true"
        >
          <Image
            src={src}
            alt=""
            width={w}
            height={h}
            className="object-contain w-auto"
            draggable={false}
          />
        </span>
      </span>
    </button>
  );
}

export default function OurPartners() {
  const [tappedId, setTappedId] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect true touch-only device (no hover capability)
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouchDevice(mq.matches);
  }, []);

  const handleTap = (id) => {
    setTappedId((prev) => (prev === id ? null : id));
  };

  const sharedProps = { isTouchDevice, tappedId, onTap: handleTap };

  return (
    <section className="bg-white border-t border-[#E7E7F5]">
      <div className="max-w-[1200px] mx-auto px-6 py-10 sm:py-14">
        {/* Label */}
        <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#A8ADB7] mb-8 sm:mb-10">
          Companies we helped grow
        </p>

        {/* ── Desktop: single horizontal row (sm+) ── */}
        <div className="hidden sm:flex flex-row flex-wrap items-center justify-between gap-x-16">
          {PARTNERS.map((p) => (
            <LogoButton key={p.id} partner={p} {...sharedProps} />
          ))}
        </div>

        {/* ── Mobile: 2-column grid matching screenshot ── */}
        <div className="sm:hidden grid grid-cols-2 gap-x-10 gap-y-9 items-center">
          {PARTNERS_MOBILE.map((p) => (
            <LogoButton key={p.id} partner={p} {...sharedProps} />
          ))}
        </div>
      </div>
    </section>
  );
}
