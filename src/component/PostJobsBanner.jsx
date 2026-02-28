"use client";

import Image from "next/image";
import Link from "next/link";

export default function PostJobsBanner() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="md:max-w-[1200px] mx-auto md:px-6">
        <div
          className="
            relative bg-[#4640DE] 
            flex flex-col lg:flex-row
            lg:items-center lg:min-h-[320px]
            
          "
        >
          {/* ── Diagonal cut decoration top-left (desktop) ── */}
          <div
            className="absolute -top-[1px] -left-[1px] w-[72px] h-[62px] bg-white hidden lg:block"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          />

          {/* ── Diagonal cut decoration bottom-right (desktop) ── */}
          <div
            className="absolute -bottom-[1px] -right-[1px] w-[102px] h-[102px] bg-white hidden lg:block"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
          />

          {/* ── Mobile top-left diagonal ── */}
          <div
            className="lg:hidden absolute top-0 left-0 w-20 h-20 bg-white"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            aria-hidden="true"
          />

          {/* ── Mobile bottom-right diagonal ── */}
          <div
            className="lg:hidden absolute bottom-0 right-0 w-20 h-20 bg-white"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
            aria-hidden="true"
          />
          {/* ══ LEFT / TOP: Text + CTA ════════════════════ */}
          <div
            className="
            relative z-10
            flex-1
            px-8 sm:px-12 lg:px-14
            pt-14 lg:pt-12
            pb-8 lg:pb-12
            text-center lg:text-left
          "
          >
            <h2
              className="
              font-[family-name:var(--font-epilogue)]
              font-semibold md::font-extrabold text-white
              text-[28px] sm:text-[40px] lg:text-[40px]
              leading-[1.1]
              mb-4
            "
            >
              Start posting <br className="hidden sm:block" /> jobs today
            </h2>

            <p
              className="
              font-[family-name:var(--font-epilogue)]
              text-white/80 text-[14px] sm:text-[18px]
              mb-8
            "
            >
              Start posting jobs for only $10.
            </p>

            {/* CTA button — white bg, primary text */}
            <Link
              href="/signup"
              className="
                inline-block
                bg-white text-[#4640DE]
                font-[family-name:var(--font-epilogue)]
                font-bold text-[16px]
                px-8 sm:px-12 lg:px-10 py-4
                rounded
                w-full sm:w-auto lg:w-auto
                text-center
                hover:bg-[#F1F0FF] transition-colors duration-200
                max-w-[380px] sm:max-w-none
              "
            >
              Sign Up For Free
            </Link>
          </div>

          {/* Desktop: absolutely positioned, overflows right edge */}
          <div className="hidden lg:block relative flex-shrink-0 w-[560px] self-end">
            <Image
              src="/dashimage.png"
              alt="QuickHire employer dashboard"
              width={600}
              height={400}
              className="object-contain mt-10 pr-10 object-bottom w-full h-auto"
              priority
            />
          </div>

          {/* Mobile: sits below CTA inside the banner */}
          <div className="lg:hidden relative z-10 px-4 pb-0 pt-4 w-full">
            <Image
              src="/dashimgmobile.png"
              alt="QuickHire employer dashboard"
              width={680}
              height={500}
              className="object-contain w-full h-auto rounded-t-xl "
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
