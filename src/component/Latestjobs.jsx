"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ── Tag styles ───────────────────────────────────────────
const TAG_STYLES = {
  "Full-Time": { bg: "#E8F9F0", text: "#56CDAD" },
  Marketing: { bg: "#FFF0E6", text: "#FFB836" },
  Design: { bg: "#F0EFFE", text: "#7B61FF" },
  Developer: { bg: "#F0EFFE", text: "#7B61FF" },
  Management: { bg: "#F0EFFE", text: "#7B61FF" },
  Business: { bg: "#F0EFFE", text: "#7B61FF" },
};

// ── Job data ─────────────────────────────────────────────
const LATEST_JOBS = [
  {
    id: 1,
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    tags: ["Full-Time", "Marketing", "Design"],
    logo: (
      // Nomad green hexagon
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 4L42 14.5V33.5L24 44L6 33.5V14.5L24 4Z"
          fill="#2BCE8C"
          opacity="0.9"
        />
        <path
          d="M18 20L24 17L30 20V28L24 31L18 28V20Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M24 17V31M18 20L30 28M30 20L18 28"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Social Media Assistant",
    company: "Netlify",
    location: "Paris, France",
    tags: ["Full-Time", "Marketing", "Design"],
    logo: (
      // Netlify teal diamond
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 6L42 24L24 42L6 24Z"
          fill="none"
          stroke="#2BCE8C"
          strokeWidth="2"
        />
        <path d="M24 6L42 24L24 42L6 24Z" fill="#2BCE8C" opacity="0.12" />
        <line
          x1="6"
          y1="24"
          x2="42"
          y2="24"
          stroke="#2BCE8C"
          strokeWidth="1.5"
        />
        <line
          x1="24"
          y1="6"
          x2="24"
          y2="42"
          stroke="#2BCE8C"
          strokeWidth="1.5"
        />
        <line
          x1="10"
          y1="14"
          x2="38"
          y2="34"
          stroke="#2BCE8C"
          strokeWidth="1"
        />
        <line
          x1="38"
          y1="14"
          x2="10"
          y2="34"
          stroke="#2BCE8C"
          strokeWidth="1"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Fransisco, USA",
    tags: ["Full-Time", "Marketing", "Design"],
    logo: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 8L12 15.5L24 23L12 30.5L0 23L12 15.5Z"
          fill="#0061FF"
          transform="translate(0,0)"
        />
        <path
          d="M24 8L36 15.5L24 23L36 30.5L48 23L36 15.5Z"
          fill="#0061FF"
          transform="translate(0,0)"
        />
        <path
          d="M12 32.5L24 25L36 32.5L24 40Z"
          fill="#0061FF"
          transform="translate(0,0)"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Brand Designer",
    company: "Maze",
    location: "San Fransisco, USA",
    tags: ["Full-Time", "Marketing", "Design"],
    logo: (
      // Maze blue circle with wave
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="#1D6CE8" />
        <path
          d="M14 24C14 24 18 18 24 24C30 30 34 24 34 24"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 30C14 30 18 24 24 30C30 36 34 30 34 30"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Interactive Developer",
    company: "Terraform",
    location: "Hamburg, Germany",
    tags: ["Full-Time", "Marketing", "Design"],
    logo: (
      // Terraform teal T-shape
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M20 8L20 22L10 28L10 14Z" fill="#5C4EE5" />
        <path d="M22 8L38 17L38 31L22 22Z" fill="#4040B2" />
        <path d="M10 30L26 39L26 25L10 16Z" fill="#5C4EE5" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: 6,
    title: "Interactive Developer",
    company: "Udacity",
    location: "Hamburg, Germany",
    tags: ["Full-Time", "Marketing", "Design"],
    logo: (
      // Udacity teal circle with U
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="#02B3E4" />
        <path
          d="M18 16V26C18 29.314 20.686 32 24 32C27.314 32 30 29.314 30 26V16"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: 7,
    title: "HR Manager",
    company: "Packer",
    location: "Lucern, Switzerland",
    tags: ["Full-Time", "Marketing", "Management"],
    logo: (
      // Packer red bookmark shape
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M16 6H24V36L20 32L16 36V6Z" fill="#FF5733" />
        <path d="M24 6H32V36L28 32L24 36V6Z" fill="#FF8C69" />
      </svg>
    ),
  },
  {
    id: 8,
    title: "HR Manager",
    company: "Webflow",
    location: "Lucern, Switzerland",
    tags: ["Full-Time", "Marketing", "Design"],
    logo: (
      // Webflow W on blue square
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="8" fill="#4353FF" />
        <path
          d="M10 16L17 32L21 22L25 32L32 16"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
];

function LatestJobRow({ job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="
        group flex items-center gap-5
        bg-white border-b border-[#D6DDEB] last:border-b-0
        px-6 py-5
        hover:bg-[#F8F8FD]
        transition-colors duration-200
      "
    >
      {/* Logo */}
      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
        {job.logo}
      </div>

      {/* Text block */}
      <div className="flex-1 min-w-0">
        <h3
          className="
          font-[family-name:var(--font-epilogue)] font-bold text-[17px]
          text-[#25324B] mb-0.5
          group-hover:text-[#4640DE] transition-colors duration-200
        "
        >
          {job.title}
        </h3>
        <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#515B6F] flex items-center gap-1.5 mb-3">
          <span>{job.company}</span>
          <span className="w-1 h-1 rounded-full bg-[#D6DDEB] inline-block" />
          <span>{job.location}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag) => {
            const s = TAG_STYLES[tag] || { bg: "#F0F0F0", text: "#666" };
            return (
              <span
                key={tag}
                className="font-[family-name:var(--font-epilogue)] font-semibold text-[12px] px-3 py-1 rounded-full border"
                style={{
                  background: s.bg,
                  color: s.text,
                  borderColor: s.text,
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* Arrow — visible on hover */}
      <ArrowRight
        size={18}
        className="text-[#D6DDEB] group-hover:text-[#4640DE] transition-colors duration-200 flex-shrink-0"
      />
    </Link>
  );
}

function LatestJobCard({ job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="
        group block
        bg-white border border-[#D6DDEB] rounded-xl
        px-5 py-5
        hover:border-[#4640DE]
        hover:shadow-[0_4px_20px_rgba(70,64,222,0.1)]
        transition-all duration-200
      "
    >
      <div className="mb-3">{job.logo}</div>
      <h3
        className="
        font-[family-name:var(--font-epilogue)] font-bold text-[17px]
        text-[#25324B] mb-1
        group-hover:text-[#4640DE] transition-colors duration-200
      "
      >
        {job.title}
      </h3>
      <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F] flex items-center gap-1.5 mb-3">
        <span>{job.company}</span>
        <span className="w-1 h-1 rounded-full bg-[#D6DDEB] inline-block" />
        <span>{job.location}</span>
      </p>
      <div className="flex flex-wrap gap-1">
        {job.tags.map((tag) => {
          const s = TAG_STYLES[tag] || { bg: "#F0F0F0", text: "#666" };
          return (
            <span
              key={tag}
              className="font-[family-name:var(--font-epilogue)] font-semibold text-[10px] sm:text-[12px] px-2 py-1 rounded-full border"
              style={{ background: s.bg, color: s.text, borderColor: s.text }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

// ── Main section ───────────────────────────────────────────
export default function LatestJobs() {
  const leftJobs = LATEST_JOBS.filter((_, i) => i % 2 === 0);
  const rightJobs = LATEST_JOBS.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative bg-[#F8F8FD] sm:py-10 overflow-hidden">
      {/* ── Top-right white diagonal corner cut ── */}
      <div
        className="absolute -top-[1px] -left-[1px] w-[72px] h-[62px] bg-white hidden lg:block"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {/* ── Header ────────────────────────────────── */}
        <div className="flex items-center justify-between mb-10 sm:mb-12">
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[28px] sm:text-[32px] text-[#25324B]">
            Latest <span className="text-[#26A4FF]">jobs open</span>
          </h2>
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[15px] text-[#4640DE] hover:underline"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>

        <div className="hidden sm:grid grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-3 overflow-hidden">
            {leftJobs.map((job) => (
              <LatestJobRow key={job.id} job={job} />
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-3 overflow-hidden">
            {rightJobs.map((job) => (
              <LatestJobRow key={job.id} job={job} />
            ))}
          </div>
        </div>

        <div className="sm:hidden flex flex-col gap-4">
          {LATEST_JOBS.map((job) => (
            <LatestJobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Show all — mobile */}
        <div className="sm:hidden mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[15px] text-[#4640DE]"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
