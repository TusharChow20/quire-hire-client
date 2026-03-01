"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

const IconDesign = ({ c }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 6 L28 28" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    {/* Paintbrush top diamond tip */}
    <path
      d="M5 9 L8 6 L11 9"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M25 25 L28 28 L25 31"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M26 6 L6 28" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M23 9 L26 6 L29 9"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M9 25 L6 28 L3 25"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <line
      x1="21.5"
      y1="9.5"
      x2="24.5"
      y2="12.5"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="9.5"
      y1="21.5"
      x2="12.5"
      y2="24.5"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconSales = ({ c }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 16 A9 9 0 0 1 16 7"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M16 7 A9 9 0 0 1 25 16"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="7"
      x2="16"
      y2="16"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <line
      x1="7"
      y1="16"
      x2="16"
      y2="16"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <rect
      x="6"
      y="22"
      width="4"
      height="6"
      rx="1.2"
      stroke={c}
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="13"
      y="19"
      width="4"
      height="9"
      rx="1.2"
      stroke={c}
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="20"
      y="16"
      width="4"
      height="12"
      rx="1.2"
      stroke={c}
      strokeWidth="2"
      fill="none"
    />
    <line
      x1="4"
      y1="28.5"
      x2="26"
      y2="28.5"
      stroke={c}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconMarketing = ({ c }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 13 L7 21 L12 21 L22 27 L22 7 L12 13 Z"
      stroke={c}
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M25 12 Q28 17 25 22"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Signal arc 2 (outer) */}
    <path
      d="M28 9 Q33 17 28 25"
      stroke={c}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const IconFinance = ({ c }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer wallet */}
    <rect
      x="3"
      y="10"
      width="28"
      height="18"
      rx="3.5"
      stroke={c}
      strokeWidth="2.2"
      fill="none"
    />
    <rect
      x="17"
      y="14"
      width="11"
      height="10"
      rx="3"
      stroke={c}
      strokeWidth="2"
      fill="none"
    />
    {/* Wallet top edge / fold */}
    <path
      d="M8 10 L8 7.5 Q8 5 11 5 L23 5 Q26 5 26 7.5 L26 10"
      stroke={c}
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Small dot/circle inside card */}
    <circle cx="21" cy="19" r="1.5" fill={c} />
  </svg>
);

const IconTechnology = ({ c }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="4"
      width="30"
      height="20"
      rx="3"
      stroke={c}
      strokeWidth="2.2"
      fill="none"
    />
    <line
      x1="17"
      y1="24"
      x2="17"
      y2="29"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="29"
      x2="24"
      y2="29"
      stroke={c}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="17" cy="13" r="4" stroke={c} strokeWidth="2" fill="none" />
    <line
      x1="10"
      y1="20"
      x2="24"
      y2="20"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
  </svg>
);

const IconEngineering = ({ c }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 8 L5 17 L13 26"
      stroke={c}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M21 8 L29 17 L21 26"
      stroke={c}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <line
      x1="20"
      y1="6"
      x2="14"
      y2="28"
      stroke={c}
      strokeWidth="2.3"
      strokeLinecap="round"
    />
  </svg>
);

const IconBusiness = ({ c }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body */}
    <rect
      x="3"
      y="13"
      width="28"
      height="17"
      rx="3"
      stroke={c}
      strokeWidth="2.2"
      fill="none"
    />
    {/* Handle arch */}
    <path
      d="M12 13 L12 10 Q12 7 17 7 Q22 7 22 10 L22 13"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <line x1="3" y1="21.5" x2="31" y2="21.5" stroke={c} strokeWidth="2" />
    {/* Center clasp rect */}
    <rect
      x="15"
      y="18.5"
      width="4"
      height="6"
      rx="1"
      stroke={c}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const IconHumanResource = ({ c }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Back-left head (small) */}
    <circle cx="9" cy="11" r="3.2" stroke={c} strokeWidth="2" fill="none" />
    {/* Back-left body */}
    <path
      d="M2 30 Q2 23 9 23 Q11 23 12.5 24"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Back-right head (small) */}
    <circle cx="25" cy="11" r="3.2" stroke={c} strokeWidth="2" fill="none" />
    {/* Back-right body */}
    <path
      d="M32 30 Q32 23 25 23 Q23 23 21.5 24"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Front-center head (larger) */}
    <circle cx="17" cy="12" r="4" stroke={c} strokeWidth="2.2" fill="none" />
    {/* Front-center body */}
    <path
      d="M8 32 Q8 24 17 24 Q26 24 26 32"
      stroke={c}
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const CATEGORY_META = {
  Design: { Icon: IconDesign },
  Sales: { Icon: IconSales },
  Marketing: { Icon: IconMarketing },
  Finance: { Icon: IconFinance },
  Technology: { Icon: IconTechnology },
  Engineering: { Icon: IconEngineering },
  Business: { Icon: IconBusiness },
  "Human Resource": { Icon: IconHumanResource },
};
const DEFAULT_META = { Icon: IconBusiness };

const BRAND = "#4640DE";

function CategoryCard({ category, count }) {
  const { Icon } = CATEGORY_META[category] || DEFAULT_META;
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col border border-[#D6DDEB] rounded-xl p-6
                 transition-all duration-200 ease-in-out
                 hover:bg-[#4640DE] hover:border-[#4640DE]
                 hover:shadow-[0_8px_30px_rgba(70,64,222,0.3)]
                 hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="mb-5">
        <Icon c={hovered ? "#ffffff" : BRAND} />
      </div>

      <p
        className="font-[family-name:var(--font-epilogue)] font-bold text-[17px]
                    text-[#25324B] group-hover:text-white transition-colors duration-200 mb-1"
      >
        {category}
      </p>

      <div className="flex items-center gap-1.5 mt-auto pt-2">
        <span
          className="font-[family-name:var(--font-epilogue)] text-[13px]
                         text-[#7C8493] group-hover:text-[#C7C4FF] transition-colors duration-200"
        >
          {count} {count === 1 ? "job" : "jobs"} available
        </span>
        <ArrowRight
          size={14}
          className="text-[#D6DDEB] group-hover:text-white transition-colors duration-200 flex-shrink-0"
        />
      </div>
    </Link>
  );
}

// Mobile Row
function CategoryRow({ category, count }) {
  const { Icon } = CATEGORY_META[category] || DEFAULT_META;
  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      className="flex items-center gap-4 border border-[#D6DDEB] rounded-xl px-4 py-4
                 hover:border-[#4640DE] hover:bg-[#F8F8FD] transition-all duration-200"
    >
      <div className="w-11 h-11 rounded-xl bg-[#F0EFFE] flex items-center justify-center flex-shrink-0">
        <Icon c={BRAND} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#25324B]">
          {category}
        </p>
        <p className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#7C8493] mt-0.5">
          {count} {count === 1 ? "job" : "jobs"} available
        </p>
      </div>
      <ArrowRight size={16} className="text-[#D6DDEB] flex-shrink-0" />
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-[#D6DDEB] rounded-xl p-6 animate-pulse">
      <div className="w-9 h-9 bg-[#F0F0F0] rounded mb-5" />
      <div className="h-5 bg-[#F0F0F0] rounded mb-2 w-2/3" />
      <div className="h-4 bg-[#F0F0F0] rounded w-1/2" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
export default function ExploreCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not set.");
      const res = await fetch(`${apiUrl}/api/jobs/categories`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "API error");
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const sorted = [...categories].sort((a, b) => {
    const aK = !!CATEGORY_META[a.category];
    const bK = !!CATEGORY_META[b.category];
    if (aK && !bK) return -1;
    if (!aK && bK) return 1;
    return b.count - a.count;
  });

  return (
    <section className="bg-white ">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2
            className="font-[family-name:var(--font-epilogue)] font-extrabold
                         text-[22px] sm:text-[28px] md:text-[32px] text-[#25324B]"
          >
            Explore by <span className="text-[#26A4FF]">category</span>
          </h2>
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]
                       font-semibold text-[15px] text-[#4640DE] hover:underline"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-[#FFF4F3] border border-[#FFD5D0] rounded-xl p-4">
            <AlertCircle
              size={18}
              className="text-[#FF6550] flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <p className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#FF6550]">
                Failed to load categories
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F] mt-0.5">
                {error}
              </p>
            </div>
            <button
              onClick={fetchCategories}
              className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#4640DE] hover:underline flex-shrink-0"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-4 gap-4">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : sorted.length === 0 && !error ? (
            <div className="col-span-4 py-16 text-center">
              <p className="font-[family-name:var(--font-epilogue)] text-[#7C8493]">
                No categories found
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
                  className="flex items-center gap-4 border border-[#D6DDEB] rounded-xl px-4 py-4 animate-pulse"
                >
                  <div className="w-11 h-11 bg-[#F0F0F0] rounded-xl flex-shrink-0" />
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
