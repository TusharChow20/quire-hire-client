"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  ChevronDown,
  Briefcase,
  SlidersHorizontal,
  X,
  ArrowRight,
  Star,
  Clock,
  Building2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const JOBS_PER_PAGE = 12;

const CATEGORIES = [
  "All",
  "Design",
  "Engineering",
  "Marketing",
  "Technology",
  "Business",
  "Finance",
  "Human Resource",
  "Sales",
];
const JOB_TYPES = [
  "All",
  "Full Time",
  "Part Time",
  "Remote",
  "Internship",
  "Contract",
];
const LOCATIONS = [
  "All",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Switzerland",
  "Canada",
  "Remote",
];
const SALARY_RANGES = [
  { label: "Any salary", min: null, max: null },
  { label: "$0 – $50k", min: 0, max: 50000 },
  { label: "$50k – $80k", min: 50000, max: 80000 },
  { label: "$80k – $120k", min: 80000, max: 120000 },
  { label: "$120k+", min: 120000, max: null },
];

const TAG_STYLES = {
  "Full Time": { bg: "#E8F9F0", text: "#56CDAD" },
  "Part Time": { bg: "#FFF0E6", text: "#FFB836" },
  Remote: { bg: "#EEF9FF", text: "#26A4FF" },
  Internship: { bg: "#F0EFFE", text: "#7B61FF" },
  Contract: { bg: "#FFE9E9", text: "#FF6550" },
  Design: { bg: "#F0EFFE", text: "#7B61FF" },
  Marketing: { bg: "#FFF0E6", text: "#FFB836" },
  Developer: { bg: "#F0EFFE", text: "#7B61FF" },
  Technology: { bg: "#EEF9FF", text: "#26A4FF" },
  Business: { bg: "#E8F9F0", text: "#56CDAD" },
  Finance: { bg: "#EEF9FF", text: "#26A4FF" },
  Management: { bg: "#F0EFFE", text: "#7B61FF" },
};

function formatSalary(min, max, currency = "USD") {
  const fmt = (n) =>
    n >= 1000
      ? `${currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"}${Math.round(n / 1000)}k`
      : `${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return null;
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function CompanyLogo({ logo, company, size = 52 }) {
  const [imgErr, setImgErr] = useState(false);
  const colors = [
    "#4640DE",
    "#26A4FF",
    "#56CDAD",
    "#FFB836",
    "#FF6550",
    "#7B61FF",
    "#2BCE8C",
  ];
  const color = colors[(company?.charCodeAt(0) || 0) % colors.length];

  if (logo && !imgErr) {
    return (
      <img
        src={logo}
        alt={company}
        onError={() => setImgErr(true)}
        className="rounded-xl object-contain bg-white border border-[#E7E7F5]"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.38,
      }}
    >
      {company?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────
function JobCard({ job, index }) {
  const salary = formatSalary(
    job.salary_min,
    job.salary_max,
    job.salary_currency,
  );

  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group relative bg-white border border-[#E7E7F5] rounded-2xl p-5 flex flex-col gap-4
                 hover:border-[#4640DE] hover:shadow-[0_8px_32px_rgba(70,64,222,0.12)]
                 transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Featured badge */}
      {job.isFeatured && (
        <span
          className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold
                         text-[#FFB836] bg-[#FFF8E6] px-2.5 py-1 rounded-full border border-[#FFE8A3]"
        >
          <Star size={9} fill="currentColor" /> Featured
        </span>
      )}

      {/* Logo + company */}
      <div className="flex items-start gap-3.5">
        <CompanyLogo logo={job.logo} company={job.company} size={52} />
        <div className="min-w-0 flex-1">
          <h3
            className="font-[family-name:var(--font-epilogue)] font-bold text-[16px] text-[#25324B]
                          group-hover:text-[#4640DE] transition-colors duration-200 leading-tight truncate pr-16"
          >
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="flex items-center gap-1 font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F]">
              <Building2 size={12} className="text-[#A8ADB7]" />
              {job.company}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#D6DDEB]" />
            <span className="flex items-center gap-1 font-[family-name:var(--font-epilogue)] text-[12px] text-[#7C8493]">
              <MapPin size={11} className="text-[#A8ADB7]" />
              {job.location}
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {/* Job type tag */}
          {job.type &&
            (() => {
              const s = TAG_STYLES[job.type] || { bg: "#F0F0F0", text: "#666" };
              return (
                <span
                  className="font-[family-name:var(--font-epilogue)] font-semibold text-[11px] px-2.5 py-1 rounded-full border"
                  style={{
                    background: s.bg,
                    color: s.text,
                    borderColor: s.text,
                  }}
                >
                  {job.type}
                </span>
              );
            })()}
          {job.tags.slice(0, 2).map((tag) => {
            const s = TAG_STYLES[tag] || { bg: "#F0F0F0", text: "#666" };
            return (
              <span
                key={tag}
                className="font-[family-name:var(--font-epilogue)] font-semibold text-[11px] px-2.5 py-1 rounded-full border"
                style={{ background: s.bg, color: s.text, borderColor: s.text }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F4F4F6]">
        <div className="flex flex-col gap-0.5">
          {salary ? (
            <span className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#25324B]">
              {salary}
            </span>
          ) : (
            <span className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#A8ADB7]">
              Salary not listed
            </span>
          )}
          <span className="flex items-center gap-1 font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7]">
            <Clock size={10} /> {timeAgo(job.created_at)}
          </span>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#F4F4F6] group-hover:bg-[#4640DE] flex items-center justify-center transition-colors duration-200">
          <ArrowRight
            size={14}
            className="text-[#A8ADB7] group-hover:text-white transition-colors duration-200"
          />
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton Card ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-[#E7E7F5] rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-3.5 mb-4">
        <div
          className="w-13 h-13 rounded-xl bg-[#F0F0F0] flex-shrink-0"
          style={{ width: 52, height: 52 }}
        />
        <div className="flex-1">
          <div className="h-4 bg-[#F0F0F0] rounded mb-2 w-3/4" />
          <div className="h-3 bg-[#F0F0F0] rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-[#F0F0F0] rounded-full" />
        <div className="h-6 w-16 bg-[#F0F0F0] rounded-full" />
      </div>
      <div className="pt-3 border-t border-[#F4F4F6] flex justify-between">
        <div className="h-4 w-20 bg-[#F0F0F0] rounded" />
        <div className="w-8 h-8 bg-[#F0F0F0] rounded-lg" />
      </div>
    </div>
  );
}

// ── Filter Pill ───────────────────────────────────────────
function FilterSelect({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  isObj = false,
}) {
  const [open, setOpen] = useState(false);
  const displayVal = isObj
    ? options.find((o) => o.label === value)?.label || label
    : value === "All"
      ? label
      : value;
  const isActive = isObj
    ? value !== options[0]?.label
    : value && value !== "All";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-semibold text-[14px]
                    px-4 py-2.5 rounded-xl border transition-all duration-200 whitespace-nowrap
                    ${
                      isActive
                        ? "bg-[#4640DE] text-white border-[#4640DE]"
                        : "bg-white text-[#515B6F] border-[#D6DDEB] hover:border-[#4640DE] hover:text-[#4640DE]"
                    }`}
      >
        {Icon && <Icon size={15} />}
        {displayVal}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full mt-2 left-0 z-20 bg-white border border-[#E7E7F5] rounded-xl
                          shadow-[0_8px_32px_rgba(0,0,0,0.12)] min-w-[180px] py-1 overflow-hidden"
          >
            {(isObj ? options : options).map((opt) => {
              const optVal = isObj ? opt.label : opt;
              const isSelected = isObj ? value === opt.label : value === opt;
              return (
                <button
                  key={optVal}
                  onClick={() => {
                    onChange(isObj ? opt : opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 font-[family-name:var(--font-epilogue)] text-[14px]
                              transition-colors duration-150
                              ${isSelected ? "bg-[#F1F0FF] text-[#4640DE] font-semibold" : "text-[#515B6F] hover:bg-[#F8F8FD]"}`}
                >
                  {optVal}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-10 h-10 rounded-xl border border-[#D6DDEB] flex items-center justify-center
                   text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE] disabled:opacity-40
                   disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-10 h-10 flex items-center justify-center
                                              font-[family-name:var(--font-epilogue)] text-[#A8ADB7]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-xl font-[family-name:var(--font-epilogue)] font-bold text-[14px]
                        transition-all duration-200
                        ${
                          page === p
                            ? "bg-[#4640DE] text-white shadow-[0_4px_12px_rgba(70,64,222,0.3)]"
                            : "border border-[#D6DDEB] text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE]"
                        }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-10 h-10 rounded-xl border border-[#D6DDEB] flex items-center justify-center
                   text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE] disabled:opacity-40
                   disabled:cursor-not-allowed transition-colors duration-200"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Active Filter Pills ───────────────────────────────────
function ActiveFilters({ filters, onRemove, onClear }) {
  const active = Object.entries(filters).filter(
    ([k, v]) => v && v !== "All" && v !== "Any salary",
  );
  if (active.length === 0) return null;

  return (
    <div className="flex items-center flex-wrap gap-2 mb-6">
      <span className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493]">
        Active filters:
      </span>
      {active.map(([key, val]) => (
        <span
          key={key}
          className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[12px]
                     text-[#4640DE] bg-[#F1F0FF] px-3 py-1 rounded-full border border-[#C7C4FF]"
        >
          {val}
          <button
            onClick={() => onRemove(key)}
            className="text-[#4640DE] hover:text-[#FF6550] transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={onClear}
        className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#FF6550] hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

// ── Main Jobs Page ────────────────────────────────────────
function JobsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL (so category clicks from homepage work)
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [location, setLocation] = useState(
    searchParams.get("location") || "All",
  );
  const [jobType, setJobType] = useState(searchParams.get("type") || "All");
  const [salary, setSalary] = useState(
    searchParams.get("salary") || "Any salary",
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Sync URL whenever filters change ─────────────────
  const syncUrl = useCallback(
    (params) => {
      const p = new URLSearchParams();
      if (params.q && params.q !== "") p.set("q", params.q);
      if (params.category && params.category !== "All")
        p.set("category", params.category);
      if (params.location && params.location !== "All")
        p.set("location", params.location);
      if (params.type && params.type !== "All") p.set("type", params.type);
      if (params.salary && params.salary !== "Any salary")
        p.set("salary", params.salary);
      if (params.page && params.page > 1) p.set("page", params.page);
      router.replace(`/jobs?${p.toString()}`, { scroll: false });
    },
    [router],
  );

  // ── Fetch jobs ────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", JOBS_PER_PAGE);
      if (search && search !== "") params.set("search", search);
      if (category && category !== "All") params.set("category", category);
      if (jobType && jobType !== "All") params.set("type", jobType);
      if (location && location !== "All") params.set("location", location);

      // Salary filter — pass min/max
      const salaryObj = SALARY_RANGES.find((s) => s.label === salary);
      if (salaryObj?.min != null) params.set("salary_min", salaryObj.min);
      if (salaryObj?.max != null) params.set("salary_max", salaryObj.max);

      const res = await fetch(`${API}/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.jobs || []);
        const t = data.pagination?.total || data.jobs?.length || 0;
        setTotal(t);
        setTotalPages(Math.ceil(t / JOBS_PER_PAGE));
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [search, category, location, jobType, salary, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ── Handlers that reset to page 1 ────────────────────
  const applyFilter = (key, val) => {
    const next = {
      q: search,
      category,
      location,
      type: jobType,
      salary,
      page: 1,
      [key]: val,
    };
    setPage(1);
    if (key === "q") setSearch(val);
    if (key === "category") setCategory(val);
    if (key === "location") setLocation(val);
    if (key === "type") setJobType(val);
    if (key === "salary") setSalary(val);
    syncUrl(next);
  };

  const removeFilter = (key) => {
    const defaults = {
      q: "",
      category: "All",
      location: "All",
      type: "All",
      salary: "Any salary",
    };
    applyFilter(key, defaults[key]);
  };

  const clearAll = () => {
    setSearch("");
    setCategory("All");
    setLocation("All");
    setJobType("All");
    setSalary("Any salary");
    setPage(1);
    router.replace("/jobs", { scroll: false });
  };

  const handlePageChange = (p) => {
    setPage(p);
    syncUrl({ q: search, category, location, type: jobType, salary, page: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilters = {
    ...(search && { q: `"${search}"` }),
    ...(category !== "All" && { category }),
    ...(location !== "All" && { location }),
    ...(jobType !== "All" && { type: jobType }),
    ...(salary !== "Any salary" && { salary }),
  };

  return (
    <div className="min-h-screen bg-[#F8F8FD] pt-16">
      {/* ── Hero / Search header ── */}
      <div className="bg-white border-b border-[#E7E7F5]">
        <div className="max-w-[1200px] mx-auto px-6 py-10 sm:py-14">
          <h1
            className="font-[family-name:var(--font-epilogue)] font-extrabold text-[28px] sm:text-[38px]
                          text-[#25324B] mb-2 leading-tight"
          >
            Find your <span className="text-[#4640DE]">dream job</span>
          </h1>
          <p className="font-[family-name:var(--font-epilogue)] text-[#515B6F] text-[15px] mb-8">
            {total > 0 ? (
              <>
                <span className="font-bold text-[#25324B]">
                  {total.toLocaleString()}
                </span>{" "}
                jobs available right now
              </>
            ) : (
              "Search thousands of jobs across every industry"
            )}
          </p>

          {/* Search bar */}
          <div
            className="bg-[#F8F8FD] border border-[#E7E7F5] rounded-2xl flex items-center
                          max-w-[640px] px-4 py-2 gap-3 focus-within:border-[#4640DE]
                          focus-within:shadow-[0_0_0_3px_rgba(70,64,222,0.12)] transition-all duration-200"
          >
            <Search size={20} className="text-[#A8ADB7] flex-shrink-0" />
            <input
              type="text"
              placeholder="Job title, company, or keyword…"
              value={search}
              onChange={(e) => applyFilter("q", e.target.value)}
              className="flex-1 bg-transparent font-[family-name:var(--font-epilogue)] text-[15px]
                         text-[#25324B] placeholder-[#A8ADB7] outline-none"
            />
            {search && (
              <button
                onClick={() => applyFilter("q", "")}
                className="text-[#A8ADB7] hover:text-[#515B6F]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* ── Filter bar ── */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 flex-wrap flex-1">
            <FilterSelect
              label="Category"
              icon={Briefcase}
              value={category}
              options={CATEGORIES}
              onChange={(v) => applyFilter("category", v)}
            />
            <FilterSelect
              label="Location"
              icon={MapPin}
              value={location}
              options={LOCATIONS}
              onChange={(v) => applyFilter("location", v)}
            />
            <FilterSelect
              label="Job Type"
              icon={SlidersHorizontal}
              value={jobType}
              options={JOB_TYPES}
              onChange={(v) => applyFilter("type", v)}
            />
            <FilterSelect
              label="Salary"
              icon={null}
              value={salary}
              options={SALARY_RANGES.map((s) => s.label)}
              onChange={(v) => applyFilter("salary", v)}
            />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="sm:hidden flex items-center gap-2 font-[family-name:var(--font-epilogue)]
                       font-semibold text-[14px] text-[#515B6F] bg-white border border-[#D6DDEB]
                       px-4 py-2.5 rounded-xl hover:border-[#4640DE] transition-colors"
          >
            <Filter size={15} /> Filters
            {Object.keys(activeFilters).length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#4640DE] text-white text-[11px] font-bold flex items-center justify-center">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </button>

          {/* Results count */}
          <span className="ml-auto font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] hidden sm:block">
            {loading ? "Loading…" : `${total} result${total !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Active filter pills */}
        <ActiveFilters
          filters={activeFilters}
          onRemove={removeFilter}
          onClear={clearAll}
        />

        {/* ── Jobs grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(JOBS_PER_PAGE)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#F1F0FF] flex items-center justify-center">
              <Briefcase size={32} className="text-[#4640DE] opacity-50" />
            </div>
            <h3 className="font-[family-name:var(--font-epilogue)] font-bold text-[20px] text-[#25324B] mb-2">
              No jobs found
            </h3>
            <p className="font-[family-name:var(--font-epilogue)] text-[#7C8493] text-[15px] mb-6 max-w-sm mx-auto">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              onClick={clearAll}
              className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-white
                         bg-[#4640DE] px-6 py-3 rounded-xl hover:bg-[#3730C4] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map((job, i) => (
                <JobCard key={job._id} job={job} index={i} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* ── Mobile filter drawer ── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[family-name:var(--font-epilogue)] font-bold text-[18px] text-[#25324B]">
                Filters
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-[#A8ADB7]"
              >
                <X size={22} />
              </button>
            </div>

            {[
              {
                label: "Category",
                key: "category",
                val: category,
                opts: CATEGORIES,
              },
              {
                label: "Location",
                key: "location",
                val: location,
                opts: LOCATIONS,
              },
              { label: "Job Type", key: "type", val: jobType, opts: JOB_TYPES },
              {
                label: "Salary",
                key: "salary",
                val: salary,
                opts: SALARY_RANGES.map((s) => s.label),
              },
            ].map((f) => (
              <div key={f.key} className="mb-5">
                <label className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#25324B] block mb-2">
                  {f.label}
                </label>
                <div className="flex flex-wrap gap-2">
                  {f.opts.map((opt) => {
                    const isActive =
                      f.val === opt || (f.val === "All" && opt === "All");
                    return (
                      <button
                        key={opt}
                        onClick={() => applyFilter(f.key, opt)}
                        className={`font-[family-name:var(--font-epilogue)] font-semibold text-[13px]
                                    px-3 py-1.5 rounded-lg border transition-all duration-150
                                    ${
                                      isActive
                                        ? "bg-[#4640DE] text-white border-[#4640DE]"
                                        : "bg-white text-[#515B6F] border-[#D6DDEB]"
                                    }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                clearAll();
                setMobileFiltersOpen(false);
              }}
              className="w-full mt-2 font-[family-name:var(--font-epilogue)] font-bold text-[14px]
                         text-[#4640DE] border-2 border-[#4640DE] py-3 rounded-xl"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-3 font-[family-name:var(--font-epilogue)] font-bold text-[14px]
                         text-white bg-[#4640DE] py-3 rounded-xl"
            >
              Show {total} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F8FD] pt-16 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#4640DE]" />
        </div>
      }
    >
      <JobsPageInner />
    </Suspense>
  );
}
