"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "design",
    label: "Design",
    count: 235,
    icon: (
      // Pen tool / design cross icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M28 6L34 12L14 32L6 34L8 26L28 6Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 10L30 16"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M16 6L24 14"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="0"
        />
        {/* X cross overlay */}
        <path
          d="M8 8L18 18M18 8L8 18"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "sales",
    label: "Sales",
    count: 756,
    icon: (
      // Chart/sales icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="2.2" />
        <line
          x1="14"
          y1="21"
          x2="14"
          y2="34"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="27"
          x2="8"
          y2="34"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="24"
          x2="20"
          y2="34"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="26"
          y1="30"
          x2="26"
          y2="34"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "marketing",
    label: "Marketing",
    count: 140,
    icon: (
      // Megaphone / marketing icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M32 8C32 8 22 14 10 16H8C6.343 16 5 17.343 5 19V21C5 22.657 6.343 24 8 24H10L13 32H17L15 24C22 25 32 32 32 32V8Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M35 14C36.5 16 36.5 24 35 26"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "finance",
    label: "Finance",
    count: 325,
    icon: (
      // Wallet / finance icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect
          x="4"
          y="10"
          width="32"
          height="22"
          rx="3"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path d="M4 17H36" stroke="currentColor" strokeWidth="2.2" />
        <rect
          x="26"
          y="21"
          width="7"
          height="5"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M4 10L8 6H32"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "technology",
    label: "Technology",
    count: 436,
    icon: (
      // Monitor / tech icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect
          x="4"
          y="6"
          width="32"
          height="22"
          rx="3"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M14 34H26"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M20 28V34"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M4 24H36"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
      </svg>
    ),
  },
  {
    id: "engineering",
    label: "Engineering",
    count: 542,
    icon: (
      // Code brackets </> icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M14 12L6 20L14 28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 12L34 20L26 28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="22"
          y1="10"
          x2="18"
          y2="30"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "business",
    label: "Business",
    count: 211,
    icon: (
      // Briefcase icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect
          x="4"
          y="14"
          width="32"
          height="22"
          rx="3"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M14 14V10C14 8.895 14.895 8 16 8H24C25.105 8 26 8.895 26 10V14"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <line
          x1="4"
          y1="24"
          x2="36"
          y2="24"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.4"
        />
        <line
          x1="18"
          y1="22"
          x2="22"
          y2="22"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="24"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "human-resource",
    label: "Human Resource",
    count: 346,
    icon: (
      // People / HR icon
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="12" r="5" stroke="currentColor" strokeWidth="2.2" />
        <path
          d="M8 34C8 27.373 13.373 22 20 22C26.627 22 32 27.373 32 34"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="16" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M2 30C2 25.582 5.134 22 9 22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="31" cy="16" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M38 30C38 25.582 34.866 22 31 22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function ExploreCategories() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* ── Header row ─────────────────────────────── */}
        <div className="flex items-center justify-between mb-5 sm:mb-12">
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[20px] sm:text-[28px] md:text-[32px] text-[#25324B]">
            Explore by <span className="text-[#26A4FF]">category</span>
          </h2>
          {/* Show all jobs — desktop only */}
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[15px] text-[#4640DE] hover:underline"
          >
            Show all jobs
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="hidden sm:grid grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/jobs?category=${cat.id}`}
              className="
                group
                flex flex-col
                border border-[#D6DDEB] rounded-lg
                p-6
                transition-all duration-250 ease-in-out
                hover:bg-[#4640DE] hover:border-[#4640DE]
                hover:shadow-[0_8px_30px_rgba(70,64,222,0.25)]
                hover:-translate-y-0.5
              "
            >
              {/* Icon — purple by default, white on hover */}
              <div className="text-[#4640DE] group-hover:text-white transition-colors duration-250 mb-6">
                {cat.icon}
              </div>

              {/* Label */}
              <p
                className="
                font-[family-name:var(--font-epilogue)] font-bold text-[18px]
                text-[#25324B] group-hover:text-white
                transition-colors duration-250 mb-2
              "
              >
                {cat.label}
              </p>

              {/* Count + arrow */}
              <div className="flex items-center gap-2 mt-auto">
                <span
                  className="
                  font-[family-name:var(--font-epilogue)] text-[14px]
                  text-[#7C8493] group-hover:text-[#E0DFFF]
                  transition-colors duration-250
                "
                >
                  {cat.count} jobs available
                </span>
                <ArrowRight
                  size={16}
                  className="text-[#25324B] group-hover:text-white transition-colors duration-250 flex-shrink-0"
                />
              </div>
            </Link>
          ))}
        </div>
        <div className="sm:hidden flex flex-col gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/jobs?category=${cat.id}`}
              className="
                group
                flex items-center gap-4
                border border-[#D6DDEB] rounded-lg
                px-4 py-4
                transition-all duration-250 ease-in-out
                active:bg-[#4640DE] active:border-[#4640DE]
              "
            >
              {/* Icon */}
              <div className="text-[#4640DE] group-active:text-white transition-colors duration-250 flex-shrink-0 w-10 h-10 flex items-center justify-center">
                {cat.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-[family-name:var(--font-epilogue)] font-bold text-[16px] text-[#25324B] group-active:text-white transition-colors duration-250">
                  {cat.label}
                </p>
                <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493] group-active:text-[#E0DFFF] transition-colors duration-250 mt-0.5">
                  {cat.count} jobs available
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight
                size={18}
                className="text-[#25324B] group-active:text-white transition-colors duration-250 flex-shrink-0"
              />
            </Link>
          ))}
        </div>

        {/* Show all jobs — mobile only */}
        <div className="sm:hidden mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[15px] text-[#4640DE]"
          >
            Show all jobs
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
