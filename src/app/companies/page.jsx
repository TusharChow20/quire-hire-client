// src/app/companies/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Building2,
  Briefcase,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PER_PAGE = 12;
const PALETTE = [
  { bg: "#F1F0FF", text: "#4640DE" },
  { bg: "#E8F9F0", text: "#1A9E6E" },
  { bg: "#FFF0E6", text: "#D97706" },
  { bg: "#EEF9FF", text: "#0284C7" },
  { bg: "#FFE9E9", text: "#DC2626" },
  { bg: "#F0FFF4", text: "#16A34A" },
  { bg: "#FDF4FF", text: "#9333EA" },
  { bg: "#FFFBEB", text: "#B45309" },
];

function colorFor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function CompanyCard({ company, count, categories, locations }) {
  const { bg, text } = colorFor(company);
  const letter = company?.[0]?.toUpperCase() ?? "?";
  const topCat = categories?.[0] ?? null;

  return (
    <div
      className="bg-white border border-[#D6DDEB] rounded-2xl p-6 flex flex-col gap-4
                    hover:border-[#4640DE] hover:shadow-[0_8px_32px_rgba(70,64,222,0.12)]
                    transition-all duration-200 group"
    >
      {/* Logo initial + name row */}
      <div className="flex items-center gap-4">
        {/* Logo initial avatar */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center font-[family-name:var(--font-epilogue)] font-extrabold text-[22px] flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{ background: bg, color: text }}
        >
          {letter}
        </div>

        {/* Company name */}
        <div className="min-w-0">
          <h3 className="font-[family-name:var(--font-epilogue)] font-bold text-[16px] text-[#25324B] truncate">
            {company}
          </h3>
          {topCat && (
            <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493] mt-0.5 truncate">
              {topCat}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#F4F4F6]" />

      {/* Open jobs count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: bg }}
          >
            <Briefcase size={13} style={{ color: text }} />
          </div>
          <span className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#515B6F]">
            {count} open {count === 1 ? "job" : "jobs"}
          </span>
        </div>

        {/* Subtle arrow on hover */}
        <span
          className="font-[family-name:var(--font-epilogue)] font-bold text-[12px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: bg, color: text }}
        >
          View jobs →
        </span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#D6DDEB] rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-[#F0F0F0] flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-[#F0F0F0] rounded w-2/3 mb-2" />
          <div className="h-3 bg-[#F0F0F0] rounded w-1/2" />
        </div>
      </div>
      <div className="h-px bg-[#F4F4F6] mb-4" />
      <div className="h-4 bg-[#F0F0F0] rounded w-1/3" />
    </div>
  );
}

export default function CompaniesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/jobs?limit=1000`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      setJobs(data.jobs || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const companies = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const name = job.company?.trim();
      if (!name) return;
      if (!map[name])
        map[name] = { count: 0, categories: new Set(), locations: new Set() };
      map[name].count++;
      if (job.category) map[name].categories.add(job.category);
      if (job.location) map[name].locations.add(job.location);
    });
    return Object.entries(map)
      .map(([company, d]) => ({
        company,
        count: d.count,
        categories: [...d.categories],
        locations: [...d.locations],
      }))
      .sort((a, b) => b.count - a.count || a.company.localeCompare(b.company));
  }, [jobs]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.categories.some((cat) => cat.toLowerCase().includes(q)),
    );
  }, [companies, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen ">
      <section className="bg-white border-b border-[#D6DDEB]">
        <div className="max-w-[1200px] mx-auto px-6 py-15">
          <div className="max-w-xl">
            <p
              className="font-[family-name:var(--font-epilogue)] text-[13px] font-semibold
                          text-[#4640DE] uppercase tracking-widest mb-3"
            >
              Browse Companies
            </p>
            <h1
              className="font-[family-name:var(--font-epilogue)] font-extrabold
                           text-[28px] sm:text-[36px] md:text-[42px] text-[#25324B] leading-[1.15] mb-4"
            >
              Find your dream <span className="text-[#26A4FF]">company</span>
            </h1>
            <p className="font-[family-name:var(--font-epilogue)] text-[15px] text-[#515B6F] leading-relaxed">
              Explore companies hiring right now. Every card shows real open
              positions pulled live from our job board.
            </p>
          </div>

          {!loading && !error && (
            <div className="flex items-center gap-6 mt-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F1F0FF] flex items-center justify-center">
                  <Building2 size={15} className="text-[#4640DE]" />
                </div>
                <span className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#25324B]">
                  {companies.length}
                </span>
                <span className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493]">
                  companies
                </span>
              </div>
              <div className="w-px h-5 bg-[#D6DDEB]" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E8F9F0] flex items-center justify-center">
                  <Briefcase size={15} className="text-[#1A9E6E]" />
                </div>
                <span className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#25324B]">
                  {jobs.length}
                </span>
                <span className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493]">
                  open positions
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Search bar */}
        <div className="relative mb-8 max-w-md">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies or categories…"
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-[#D6DDEB] rounded-xl
                       font-[family-name:var(--font-epilogue)] text-[14px] text-[#25324B]
                       placeholder:text-[#A8ADB7] focus:outline-none focus:border-[#4640DE]
                       focus:ring-2 focus:ring-[#4640DE]/10 transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8ADB7] hover:text-[#515B6F] transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Result count */}
        {!loading && !error && search && (
          <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] mb-6">
            {filtered.length} {filtered.length === 1 ? "company" : "companies"}{" "}
            found
            {search && (
              <>
                {" "}
                for "
                <span className="text-[#25324B] font-semibold">{search}</span>"
              </>
            )}
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-3 bg-white border border-[#FFD5D0] rounded-xl p-5 mb-8 max-w-lg">
            <AlertCircle
              size={18}
              className="text-[#FF6550] flex-shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <p className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#FF6550]">
                Failed to load companies
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F] mt-0.5">
                {error}
              </p>
            </div>
            <button
              onClick={fetchJobs}
              className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#4640DE] hover:underline flex-shrink-0"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            [...Array(PER_PAGE)].map((_, i) => <SkeletonCard key={i} />)
          ) : paginated.length === 0 ? (
            <div className="col-span-full py-24 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F1F0FF] flex items-center justify-center">
                <Building2 size={28} className="text-[#4640DE]" />
              </div>
              <p className="font-[family-name:var(--font-epilogue)] font-bold text-[17px] text-[#25324B]">
                No companies found
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493]">
                {search
                  ? "Try a different search term"
                  : "No job listings in the database yet"}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#4640DE] hover:underline mt-1"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            paginated.map((c) => <CompanyCard key={c.company} {...c} />)
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E7E7F5]">
            <span className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493]">
              Showing {(page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-[#D6DDEB] flex items-center justify-center
                           text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE]
                           disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pages around current
                let p = i + 1;
                if (totalPages > 5) {
                  if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl font-[family-name:var(--font-epilogue)] font-bold text-[13px] transition-all ${
                      page === p
                        ? "bg-[#4640DE] text-white shadow-[0_4px_12px_rgba(70,64,222,0.3)]"
                        : "border border-[#D6DDEB] text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-[#D6DDEB] flex items-center justify-center
                           text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE]
                           disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
