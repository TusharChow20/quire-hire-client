"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Paintbrush,
  TrendingUp,
  Megaphone,
  Landmark,
  Monitor,
  Wrench,
  Briefcase,
  Users,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// ── Category meta: icon + colours ────────────────────────
const CATEGORY_META = {
  Design: { icon: Paintbrush, color: "#7B61FF", bg: "#F0EFFE" },
  Sales: { icon: TrendingUp, color: "#56CDAD", bg: "#E8F9F0" },
  Marketing: { icon: Megaphone, color: "#FFB836", bg: "#FFF0E6" },
  Finance: { icon: Landmark, color: "#26A4FF", bg: "#EEF9FF" },
  Technology: { icon: Monitor, color: "#FF6550", bg: "#FFE9E9" },
  Engineering: { icon: Wrench, color: "#4640DE", bg: "#F1F0FF" },
  Business: { icon: Briefcase, color: "#10B981", bg: "#ECFDF5" },
  "Human Resource": { icon: Users, color: "#F59E0B", bg: "#FFF7E6" },
};
const DEFAULT_META = { icon: Briefcase, color: "#7C8493", bg: "#F0F0F0" };

// ── Desktop card ──────────────────────────────────────────
function CategoryCard({ category, count }) {
  const meta = CATEGORY_META[category] || DEFAULT_META;
  const Icon = meta.icon;

  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      className="group flex flex-col border border-[#D6DDEB] rounded-xl p-6
                 transition-all duration-200 ease-in-out
                 hover:bg-[#4640DE] hover:border-[#4640DE]
                 hover:shadow-[0_8px_30px_rgba(70,64,222,0.25)]
                 hover:-translate-y-0.5"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5
                   transition-all duration-200 group-hover:bg-white/20"
        style={{ background: meta.bg }}
      >
        <Icon
          size={22}
          style={{ color: meta.color }}
          className="transition-all duration-200 group-hover:!text-white"
        />
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

// ── Mobile row ────────────────────────────────────────────
function CategoryRow({ category, count }) {
  const meta = CATEGORY_META[category] || DEFAULT_META;
  const Icon = meta.icon;

  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      className="flex items-center gap-4 border border-[#D6DDEB] rounded-xl px-4 py-4
                 hover:border-[#4640DE] hover:bg-[#F8F8FD] transition-all duration-200"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: meta.bg }}
      >
        <Icon size={20} style={{ color: meta.color }} />
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

// ── Skeleton ──────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="border border-[#D6DDEB] rounded-xl p-6 animate-pulse">
      <div className="w-12 h-12 bg-[#F0F0F0] rounded-xl mb-5" />
      <div className="h-5 bg-[#F0F0F0] rounded mb-2 w-2/3" />
      <div className="h-4 bg-[#F0F0F0] rounded w-1/2" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export default function ExploreCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // ── CRITICAL: make sure NEXT_PUBLIC_API_URL is set in .env.local ──
      // e.g.  NEXT_PUBLIC_API_URL=http://localhost:5000
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not set. Add it to .env.local and restart the dev server.",
        );
      }

      const res = await fetch(`${apiUrl}/api/jobs/categories`);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "API returned success: false");
      }

      setCategories(data.categories || []);
    } catch (err) {
      console.error("❌ ExploreCategories fetch error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Known categories first, then by count descending
  const sorted = [...categories].sort((a, b) => {
    const aKnown = !!CATEGORY_META[a.category];
    const bKnown = !!CATEGORY_META[b.category];
    if (aKnown && !bKnown) return -1;
    if (!aKnown && bKnown) return 1;
    return b.count - a.count;
  });

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
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

        {/* ── Error state ── */}
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
              className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold
                         text-[13px] text-[#4640DE] hover:underline flex-shrink-0"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* ── Desktop grid ── */}
        <div className="hidden sm:grid grid-cols-4 gap-4">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : sorted.length === 0 && !error ? (
            <div className="col-span-4 py-16 text-center">
              <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[15px] text-[#7C8493] mb-2">
                No categories found
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#A8ADB7]">
                Make sure your database has jobs with a{" "}
                <code className="bg-[#F4F4F6] px-1.5 py-0.5 rounded text-[#4640DE]">
                  category
                </code>{" "}
                field, or run the seed route:{" "}
                <code className="bg-[#F4F4F6] px-1.5 py-0.5 rounded text-[#4640DE]">
                  POST /api/seed
                </code>
              </p>
            </div>
          ) : (
            sorted.map(({ category, count }) => (
              <CategoryCard key={category} category={category} count={count} />
            ))
          )}
        </div>

        {/* ── Mobile list ── */}
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

        {/* Mobile "show all" */}
        <div className="sm:hidden mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]
                       font-semibold text-[15px] text-[#4640DE]"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
