// src/component/Hero.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";

const POPULAR_TAGS = ["UI Designer", "UX Researcher", "Android", "Admin"];

function GeometricBackground() {
  const STROKE = "rgba(176, 168, 228, 1)";
  const ROT = -64;
  const rects = [
    { x: -36, y: 317, w: 283, h: 716, opacity: 0.7 },
    { x: 187, y: 20, w: 320, h: 779, opacity: 0.7 },
    { x: 145, y: 220, w: 328, h: 796, opacity: 0.7 },
    { x: 440, y: 47, w: 192, h: 416, opacity: 0.6 },
  ];

  return (
    <svg
      className="absolute inset-0 pointer-events-none select-none"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      viewBox="0 0 600 700"
      aria-hidden="true"
    >
      {rects.map((r, i) => {
        const cx = r.x + r.w / 2;
        const cy = r.y + r.h / 2;
        return (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill="none"
            stroke={STROKE}
            strokeWidth="4"
            opacity={r.opacity}
            transform={`rotate(${ROT}, ${cx}, ${cy})`}
          />
        );
      })}
    </svg>
  );
}

export default function Hero() {
  const router = useRouter();
  const [jobQuery, setJobQuery] = useState("");
  const [location, setLocation] = useState("Florence, Italy");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobQuery.trim()) params.set("q", jobQuery.trim());
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="bg-[#F8F8FD] xl:max-h-[calc(100vh-46px)] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-22">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 py-20 ">
          <div className="relative z-20 order-1 overflow-visible">
            <h1
              className="font-[family-name:var(--font-epilogue)] font-extrabold leading-[1.08] text-[#25324B] mb-1"
              style={{ fontSize: "clamp(38px, 5vw, 62px)" }}
            >
              Discover
              <br />
              more than
            </h1>
            <div className="mb-6">
              <h1
                className="font-[family-name:var(--font-epilogue)] font-extrabold leading-[1.08] text-[#26A4FF]"
                style={{ fontSize: "clamp(38px, 5vw, 62px)" }}
              >
                5000+ Jobs
              </h1>
              <div className="mt-1.5">
                <Image
                  src="/Vector.png"
                  alt=""
                  width={380}
                  height={18}
                  className="w-full max-w-[clamp(200px,36vw,380px)]"
                  aria-hidden="true"
                  priority
                />
              </div>
            </div>

            {/* Subtitle */}
            <p className="font-[family-name:var(--font-epilogue)] text-[16px] text-[#515B6F] leading-[1.75] max-w-[430px] mb-9">
              Great platform for the job seeker that searching for new career
              heights and passionate about startups.
            </p>
            <form
              onSubmit={handleSearch}
              className="bg-white shadow-[0_4px_28px_rgba(0,0,0,0.09)] relative z-20
                         w-full lg:w-[130%]"
            >
              {/* Desktop */}
              <div className="hidden sm:flex items-center p-2.5 pl-4 gap-0">
                {/* Job keyword */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Search size={18} className="text-[#A8ADB7] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={jobQuery}
                    onChange={(e) => setJobQuery(e.target.value)}
                    className="border-none outline-none bg-transparent font-[family-name:var(--font-epilogue)] text-[14px] text-[#25324B] placeholder-[#A8ADB7] w-full"
                  />
                </div>

                {/* Divider */}
                <div className="w-px h-7 bg-[#D6DDEB] mx-3 flex-shrink-0" />

                {/* Location */}
                <div className="flex items-center gap-1.5 flex-shrink-0 relative pr-5">
                  <MapPin size={18} className="text-[#A8ADB7] flex-shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-none outline-none bg-transparent font-[family-name:var(--font-epilogue)] text-[14px] text-[#25324B] cursor-pointer appearance-none"
                  >
                    <option>Florence, Italy</option>
                    <option>New York, USA</option>
                    <option>London, UK</option>
                    <option>Berlin, Germany</option>
                    <option>Remote</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="text-[#A8ADB7] absolute right-0 pointer-events-none"
                  />
                </div>

                {/* Search button — this visually sits over the person */}
                <button
                  type="submit"
                  className="ml-2.5 bg-[#4640DE] text-white font-[family-name:var(--font-epilogue)] font-bold text-[15px] px-5 py-3.5 rounded flex-shrink-0 hover:bg-[#3730C4] active:scale-[.98] transition-all duration-200 whitespace-nowrap"
                >
                  Search my job
                </button>
              </div>

              {/* Mobile — full width, no overflow bleed on small screens */}
              <div className="sm:hidden flex flex-col p-4 gap-0">
                <div className="flex items-center gap-3 py-3 border-b border-[#D6DDEB]">
                  <Search size={20} className="text-[#515B6F] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={jobQuery}
                    onChange={(e) => setJobQuery(e.target.value)}
                    className="outline-none bg-transparent font-[family-name:var(--font-epilogue)] text-[15px] text-[#25324B] placeholder-[#A8ADB7] w-full"
                  />
                </div>
                <div className="flex items-center gap-3 py-3 border-b border-[#D6DDEB]">
                  <MapPin size={20} className="text-[#515B6F] flex-shrink-0" />
                  <div className="flex-1 relative flex items-center">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full outline-none bg-transparent font-[family-name:var(--font-epilogue)] text-[15px] text-[#25324B] cursor-pointer appearance-none pr-6"
                    >
                      <option>Florence, Italy</option>
                      <option>New York, USA</option>
                      <option>London, UK</option>
                      <option>Berlin, Germany</option>
                      <option>Remote</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="text-[#515B6F] absolute right-0 pointer-events-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-3 w-full bg-[#4640DE] text-white font-[family-name:var(--font-epilogue)] font-bold text-[16px] py-4 rounded hover:bg-[#3730C4] active:scale-[.98] transition-all duration-200"
                >
                  Search my job
                </button>
              </div>
            </form>

            {/* Popular — desktop pills */}
            <div className="hidden sm:flex items-center gap-2 mt-4 flex-wrap">
              <span className="font-[family-name:var(--font-epilogue)] font-medium text-[14px] text-[#25324B]">
                Popular :
              </span>
              {POPULAR_TAGS.map((tag) => (
                <a
                  key={tag}
                  href={`/jobs?q=${encodeURIComponent(tag)}`}
                  className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F] px-3 py-1 border border-[#D6DDEB] rounded-full bg-white hover:border-[#4640DE] hover:text-[#4640DE] transition-colors duration-200"
                >
                  {tag}
                </a>
              ))}
            </div>

            {/* Popular — mobile plain text */}
            <div className="sm:hidden mt-4">
              <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#515B6F]">
                <span className="text-[#25324B] font-medium">Popular : </span>
                {POPULAR_TAGS.join(", ")}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex relative order-2 justify-end items-end h-[620px] overflow-visible z-10 ">
            <GeometricBackground />

            <Image
              src="/peronhero.png"
              alt="Happy job seeker"
              width={480}
              height={620}
              className="relative z-10 object-contain h-full w-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom-right white diagonal cut */}
      <div
        className="hidden lg:block absolute bottom-0 right-0 w-[320px] h-[220px] bg-white z-20"
        style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
      />
    </section>
  );
}
