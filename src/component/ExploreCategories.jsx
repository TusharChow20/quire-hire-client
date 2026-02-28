"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

const CATEGORY_ICONS = {
  Design: (
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
    </svg>
  ),
  Sales: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <polyline
        points="6,32 14,22 20,26 28,14 34,18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="34" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Marketing: (
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
  Finance: (
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
  Technology: (
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
      <path d="M4 24H36" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    </svg>
  ),
  Engineering: (
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
  Business: (
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
  "Human Resource": (
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
};

// Fallback icon for any unknown category
function FallbackIcon({ initial }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center">
      <span
        className="font-bold text-[18px]"
        style={{ fontFamily: "var(--font-epilogue)" }}
      >
        {initial}
      </span>
    </div>
  );
}

function CategoryCard({ category, count }) {
  const icon = CATEGORY_ICONS[category] || (
    <FallbackIcon initial={category?.[0]?.toUpperCase()} />
  );

  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      className="group flex flex-col border border-[#D6DDEB] rounded-lg p-6
                 transition-all duration-250 ease-in-out
                 hover:bg-[#4640DE] hover:border-[#4640DE]
                 hover:shadow-[0_8px_30px_rgba(70,64,222,0.25)]
                 hover:-translate-y-0.5"
    >
      <div className="text-[#4640DE] group-hover:text-white transition-colors duration-250 mb-6">
        {icon}
      </div>
      <p
        className="font-[family-name:var(--font-epilogue)] font-bold text-[18px]
                    text-[#25324B] group-hover:text-white transition-colors duration-250 mb-2"
      >
        {category}
      </p>
      <div className="flex items-center gap-2 mt-auto">
        <span
          className="font-[family-name:var(--font-epilogue)] text-[14px]
                         text-[#7C8493] group-hover:text-[#E0DFFF] transition-colors duration-250"
        >
          {count} jobs available
        </span>
        <ArrowRight
          size={16}
          className="text-[#25324B] group-hover:text-white transition-colors duration-250 flex-shrink-0"
        />
      </div>
    </Link>
  );
}

// ── Mobile row variant ────────────────────────────────────────
function CategoryRow({ category, count }) {
  const icon = CATEGORY_ICONS[category] || (
    <Briefcase size={24} className="text-[#4640DE]" />
  );

  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      className="group flex items-center gap-4 border border-[#D6DDEB] rounded-lg px-4 py-4
                 transition-all duration-250 active:bg-[#4640DE] active:border-[#4640DE]"
    >
      <div
        className="text-[#4640DE] group-active:text-white transition-colors duration-250
                      flex-shrink-0 w-10 h-10 flex items-center justify-center"
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-[family-name:var(--font-epilogue)] font-bold text-[16px]
                      text-[#25324B] group-active:text-white transition-colors duration-250"
        >
          {category}
        </p>
        <p
          className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493]
                      group-active:text-[#E0DFFF] transition-colors duration-250 mt-0.5"
        >
          {count} jobs available
        </p>
      </div>
      <ArrowRight
        size={18}
        className="text-[#25324B] group-active:text-white transition-colors duration-250 flex-shrink-0"
      />
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-[#D6DDEB] rounded-lg p-6 animate-pulse">
      <div className="w-10 h-10 bg-[#F0F0F0] rounded-lg mb-6" />
      <div className="h-5 bg-[#F0F0F0] rounded mb-3 w-2/3" />
      <div className="h-4 bg-[#F0F0F0] rounded w-1/2" />
    </div>
  );
}

export default function ExploreCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/categories`,
        );
        const data = await res.json();
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Sort: put known categories first (those with hardcoded icons), then unknown
  const sorted = [...categories].sort((a, b) => {
    const aKnown = !!CATEGORY_ICONS[a.category];
    const bKnown = !!CATEGORY_ICONS[b.category];
    if (aKnown && !bKnown) return -1;
    if (!aKnown && bKnown) return 1;
    return b.count - a.count; // within same group, sort by count desc
  });

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-12">
          <h2
            className="font-[family-name:var(--font-epilogue)] font-extrabold
                         text-[20px] sm:text-[28px] md:text-[32px] text-[#25324B]"
          >
            Explore by <span className="text-[#26A4FF]">category</span>
          </h2>
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]
                       font-semibold text-[15px] text-[#4640DE] hover:underline"
          >
            Show all jobs
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-4 gap-4">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : sorted.length === 0 ? (
            <div className="col-span-4 py-16 text-center">
              <p className="text-[#7C8493] font-[family-name:var(--font-epilogue)]">
                No categories yet. Seed the database to populate this section.
              </p>
            </div>
          ) : (
            sorted.map(({ category, count }) => (
              <CategoryCard key={category} category={category} count={count} />
            ))
          )}
        </div>

        {/* Mobile list */}
        <div className="sm:hidden flex flex-col gap-3">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border border-[#D6DDEB] rounded-lg px-4 py-4 animate-pulse"
                >
                  <div className="w-10 h-10 bg-[#F0F0F0] rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-[#F0F0F0] rounded mb-2 w-1/2" />
                    <div className="h-3 bg-[#F0F0F0] rounded w-1/3" />
                  </div>
                </div>
              ))
            : sorted.map(({ category, count }) => (
                <CategoryRow key={category} category={category} count={count} />
              ))}
        </div>

        {/* Show all — mobile */}
        <div className="sm:hidden mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]
                       font-semibold text-[15px] text-[#4640DE]"
          >
            Show all jobs
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
