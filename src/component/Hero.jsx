"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, ChevronDown } from "lucide-react";

const POPULAR_TAGS = ["UI Designer", "UX Researcher", "Android", "Admin"];

export default function Hero() {
  const [jobQuery, setJobQuery] = useState("");
  const [location, setLocation] = useState("Florence, Italy");

  const handleSearch = (e) => {
    e.preventDefault();
    if (jobQuery.trim()) {
      // router.push(`/jobs?q=${encodeURIComponent(jobQuery)}&loc=${encodeURIComponent(location)}`);
      console.log("Search:", jobQuery, location);
    }
  };

  return (
    <>
      <section className="bg-[#F8F8FD] pt-16 overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 lg:gap-10 min-h-[calc(100vh-64px)] py-12 lg:py-0">
            {/* ── Left: Copy + Search ────────────────────── */}
            <div className="relative z-10 order-1">
              {/* Headline: dark */}
              <h1
                className="font-[family-name:var(--font-epilogue)] font-extrabold leading-[1.08] text-[#25324B] mb-1"
                style={{ fontSize: "clamp(38px, 5vw, 62px)" }}
              >
                Discover
                <br />
                more than
              </h1>

              {/* Headline: blue + Vector underline */}
              <div className="mb-6">
                <h1
                  className="font-[family-name:var(--font-epilogue)] font-extrabold leading-[1.08] text-[#26A4FF]"
                  style={{ fontSize: "clamp(38px, 5vw, 62px)" }}
                >
                  5000+ Jobs
                </h1>
                {/* Vector.png — the handdrawn underline arrow image */}
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
                className="bg-white rounded-lg shadow-[0_4px_28px_rgba(0,0,0,0.09)] max-w-[530px]"
              >
                {/* ── Desktop: single horizontal row (sm+) ── */}
                <div className="hidden sm:flex items-center p-2.5 pl-4 gap-0">
                  {/* Job keyword field */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Search
                      size={18}
                      className="text-[#A8ADB7] flex-shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      value={jobQuery}
                      onChange={(e) => setJobQuery(e.target.value)}
                      className="border-none outline-none bg-transparent font-[family-name:var(--font-epilogue)] text-[14px] text-[#25324B] placeholder-[#A8ADB7] w-full"
                    />
                  </div>

                  {/* Vertical divider */}
                  <div className="w-px h-7 bg-[#D6DDEB] mx-3 flex-shrink-0" />

                  {/* Location field */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 relative pr-5">
                    <MapPin
                      size={18}
                      className="text-[#A8ADB7] flex-shrink-0"
                    />
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

                  {/* Search button */}
                  <button
                    type="submit"
                    className="ml-2.5 bg-[#4640DE] text-white font-[family-name:var(--font-epilogue)] font-bold text-[15px] px-5 py-3.5 rounded flex-shrink-0 hover:bg-[#3730C4] active:scale-[.98] transition-all duration-200 whitespace-nowrap"
                  >
                    Search my job
                  </button>
                </div>
                <div className="sm:hidden flex flex-col p-4 gap-0">
                  {/* Row 1: Job keyword */}
                  <div className="flex items-center gap-3 py-3 border-b border-[#D6DDEB]">
                    <Search
                      size={20}
                      className="text-[#515B6F] flex-shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      value={jobQuery}
                      onChange={(e) => setJobQuery(e.target.value)}
                      className="outline-none bg-transparent font-[family-name:var(--font-epilogue)] text-[15px] text-[#25324B] placeholder-[#A8ADB7] w-full"
                    />
                  </div>

                  {/* Row 2: Location with chevron */}
                  <div className="flex items-center gap-3 py-3 border-b border-[#D6DDEB]">
                    <MapPin
                      size={20}
                      className="text-[#515B6F] flex-shrink-0"
                    />
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

                  {/* Row 3: Button */}
                  <button
                    type="submit"
                    className="mt-3 w-full bg-[#4640DE] text-white font-[family-name:var(--font-epilogue)] font-bold text-[16px] py-4 rounded hover:bg-[#3730C4] active:scale-[.98] transition-all duration-200"
                  >
                    Search my job
                  </button>
                </div>
              </form>

              {/* ── Popular ───────────────────────────────── */}

              {/* Desktop: pill tag links */}
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

              {/* Mobile: plain comma-separated text (matches screenshot) */}
              <div className="sm:hidden mt-4">
                <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#515B6F]">
                  <span className="text-[#25324B] font-medium">Popular : </span>
                  {POPULAR_TAGS.join(", ")}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex relative order-2 justify-center items-end h-[540px]">
              {/* Rectangle_1 — outermost, fullest coverage */}
              <Image
                src="/Rectangle_1.png"
                alt=""
                width={500}
                height={420}
                className="absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none select-none"
                style={{ opacity: 0.55 }}
                aria-hidden="true"
                priority
              />
              {/* Rectangle_2 */}
              <Image
                src="/Rectangle_2.png"
                alt=""
                width={460}
                height={380}
                className="absolute bottom-0 pointer-events-none select-none"
                style={{
                  left: "4%",
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                  objectPosition: "bottom",
                  opacity: 0.4,
                }}
                aria-hidden="true"
              />
              {/* Rectangle_3 */}
              <Image
                src="/Rectangle_3.png"
                alt=""
                width={420}
                height={340}
                className="absolute bottom-0 pointer-events-none select-none"
                style={{
                  left: "8%",
                  width: "78%",
                  height: "78%",
                  objectFit: "contain",
                  objectPosition: "bottom",
                  opacity: 0.27,
                }}
                aria-hidden="true"
              />
              {/* Rectangle_4 — innermost */}
              <Image
                src="/Rectangle_4.png"
                alt=""
                width={380}
                height={300}
                className="absolute bottom-0 pointer-events-none select-none"
                style={{
                  left: "12%",
                  width: "66%",
                  height: "66%",
                  objectFit: "contain",
                  objectPosition: "bottom",
                  opacity: 0.17,
                }}
                aria-hidden="true"
              />

              {/* Person — in front of all rectangles */}
              <Image
                src="/peronhero.png"
                alt="Happy job seeker pointing at the search bar"
                width={440}
                height={540}
                className="relative z-10 object-contain object-bottom h-full w-auto max-w-[88%]"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
