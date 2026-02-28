"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TAG_STYLES = {
  Marketing: { bg: "#FFF0E6", text: "#FFB836" },
  Design: { bg: "#E8F9F0", text: "#56CDAD" },
  Business: { bg: "#EEF0FF", text: "#7B61FF" },
  Technology: { bg: "#FFE9E9", text: "#FF6550" },
  Developer: { bg: "#EEF0FF", text: "#7B61FF" },
};

const FEATURED_JOBS = [
  {
    id: 1,
    type: "Full Time",
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    description: "Revolut is looking for Email Marketing to help team ma ...",
    tags: ["Marketing", "Design"],
    logo: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <text
          x="2"
          y="32"
          fontFamily="Arial Black, sans-serif"
          fontWeight="900"
          fontSize="34"
          fill="#1A1A1A"
        >
          R
        </text>
      </svg>
    ),
  },
  {
    id: 2,
    type: "Full Time",
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Fransisco, US",
    description: "Dropbox is looking for Brand Designer to help the team t ...",
    tags: ["Design", "Business"],
    logo: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M11 8L22 15L11 22L0 15Z" fill="#0061FF" />
        <path d="M33 8L44 15L33 22L22 15Z" fill="#0061FF" />
        <path d="M0 15L11 22L22 29L11 36Z" fill="#0061FF" />
        <path d="M44 15L33 22L22 29L33 36Z" fill="#0061FF" />
        <path d="M22 30.5L33 23.5L44 30.5L33 37.5Z" fill="#0061FF" />
      </svg>
    ),
  },
  {
    id: 3,
    type: "Full Time",
    title: "Email Marketing",
    company: "Pitch",
    location: "Berlin, Germany",
    description:
      "Pitch is looking for Customer Manager to join marketing t ...",
    tags: ["Marketing"],
    logo: (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Pitch
        </span>
      </div>
    ),
  },
  {
    id: 4,
    type: "Full Time",
    title: "Visual Designer",
    company: "Blinklist",
    location: "Granada, Spain",
    description:
      "Blinkist is looking for Visual Designer to help team desi ...",
    tags: ["Design"],
    logo: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" fill="#2BCE8C" opacity="0.15" />
        <ellipse cx="18" cy="20" rx="6" ry="8" fill="#2BCE8C" />
        <ellipse cx="26" cy="24" rx="5" ry="6" fill="#1A9E6A" />
        <circle cx="20" cy="18" r="3" fill="#fff" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 5,
    type: "Full Time",
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    description: "ClassPass is looking for Product Designer to help us...",
    tags: ["Marketing", "Design"],
    logo: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" fill="#3B82F6" />
        <path
          d="M14 22C14 22 18 14 22 22C26 30 30 22 30 22"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M14 22C22 22 30 22 30 22"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 6,
    type: "Full Time",
    title: "Lead Designer",
    company: "Canva",
    location: "Ontario, Canada",
    description: "Canva is looking for Lead Engineer to help develop n ...",
    tags: ["Design", "Business"],
    logo: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" fill="#7AC9A3" />
        <text
          x="8"
          y="28"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fontSize="13"
          fill="#fff"
        >
          Canva
        </text>
      </svg>
    ),
  },
  {
    id: 7,
    type: "Full Time",
    title: "Brand Strategist",
    company: "GoDaddy",
    location: "Marseille, France",
    description: "GoDaddy is looking for Brand Strategist to join the team...",
    tags: ["Marketing"],
    logo: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" fill="#1BDBDB" opacity="0.1" />
        <text
          x="6"
          y="28"
          fontFamily="Arial Black, sans-serif"
          fontWeight="900"
          fontSize="11"
          fill="#1A1A1A"
        >
          GoDaddy
        </text>
      </svg>
    ),
  },
  {
    id: 8,
    type: "Full Time",
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    description: "Twitter is looking for Data Analyst to help team desi ...",
    tags: ["Technology"],
    logo: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="20" fill="#1DA1F2" />
        <path
          d="M32 15.5C31.2 15.9 30.3 16.1 29.4 16.2C30.3 15.6 31 14.7 31.3 13.6C30.4 14.1 29.5 14.5 28.5 14.7C27.7 13.8 26.5 13.2 25.2 13.2C22.7 13.2 20.7 15.2 20.7 17.7C20.7 18.1 20.7 18.4 20.8 18.7C17.2 18.5 14 16.7 11.8 14C11.4 14.7 11.2 15.6 11.2 16.4C11.2 18.1 12.1 19.6 13.4 20.5C12.7 20.5 12 20.3 11.4 20V20C11.4 22.2 13 24.1 15 24.5C14.6 24.6 14.2 24.6 13.7 24.6C13.4 24.6 13.1 24.6 12.8 24.5C13.4 26.3 15.1 27.7 17.1 27.7C15.5 29 13.5 29.7 11.3 29.7C10.9 29.7 10.5 29.7 10.2 29.6C12.2 31 14.6 31.8 17.2 31.8C25.2 31.8 29.6 24.7 29.6 18.5V18C30.5 17.3 31.3 16.5 32 15.5Z"
          fill="white"
        />
      </svg>
    ),
  },
];

function JobCard({ job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block bg-white border border-[#D6DDEB] rounded-xl p-6 hover:border-[#4640DE] hover:shadow-[0_8px_30px_rgba(70,64,222,0.12)] transition-all duration-200 ease-in-out hover:-translate-y-0.5  "
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 flex items-center justify-center flex-shrink-0">
          {job.logo}
        </div>
        <span className="text-[#4640DE] border border-[#4640DE] rounded px-3 py-1 text-[13px] font-semibold flex-shrink-0">
          {job.type}
        </span>
      </div>
      <h3 className="font-bold text-[18px] text-[#25324B] mb-1.5 group-hover:text-[#4640DE] transition-colors duration-200">
        {job.title}
      </h3>
      <p className="text-[14px] text-[#515B6F] mb-4 flex items-center gap-1.5">
        <span>{job.company}</span>
        <span className="w-1 h-1 rounded-full bg-[#D6DDEB] inline-block flex-shrink-0" />
        <span>{job.location}</span>
      </p>
      <p className="text-[14px] text-[#7C8493] leading-[1.65] mb-5 line-clamp-2">
        {job.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => {
          const style = TAG_STYLES[tag] || { bg: "#F0F0F0", text: "#666" };
          return (
            <span
              key={tag}
              className="font-semibold text-[13px] px-3 py-1 rounded-full"
              style={{ background: style.bg, color: style.text }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

export default function FeaturedJobs() {
  const swiperElRef = useRef(null);

  useEffect(() => {
    // Only register + init Swiper on mobile
    if (typeof window === "undefined") return;

    const initMobileSwiper = async () => {
      if (window.innerWidth >= 640) return;

      // Import and register Swiper custom elements
      const { register } = await import("swiper/element/bundle");
      register();

      // Wait for element to be defined then set params
      const swiperEl = swiperElRef.current;
      if (!swiperEl) return;

      // Assign params directly
      Object.assign(swiperEl, {
        slidesPerView: 1.12,
        spaceBetween: 14,
        grabCursor: true,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
      });

      swiperEl.initialize();
    };

    initMobileSwiper();
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 sm:mb-12">
          <h2 className="font-extrabold text-[28px] sm:text-[32px] text-[#25324B]">
            Featured <span className="text-[#26A4FF]">jobs</span>
          </h2>
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-[15px] text-[#4640DE] hover:underline"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>

        {/* ── DESKTOP: 4-col grid — hidden on mobile ── */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* ── MOBILE: Swiper slider — hidden on sm+ ── */}
        <div className="sm:hidden -mx-6 px-6">
          <swiper-container
            ref={swiperElRef}
            init="false"
            slides-per-view="1.22"
            space-between="14"
            grab-cursor="true"
            pagination="true"
            pagination-clickable="true"
          >
            {FEATURED_JOBS.map((job) => (
              <swiper-slide key={job.id}>
                <div className="pb-10">
                  <JobCard job={job} />
                </div>
              </swiper-slide>
            ))}
          </swiper-container>
        </div>

        {/* Show all — mobile only */}
        <div className="sm:hidden mt-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 font-semibold text-[15px] text-[#4640DE]"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
