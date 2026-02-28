"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Star,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Briefcase,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PER_PAGE = 8;

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
  "Customer Service",
];

const TYPE_STYLES = {
  "Full Time": { bg: "#E8F9F0", text: "#56CDAD" },
  "Part Time": { bg: "#FFF0E6", text: "#FFB836" },
  Remote: { bg: "#EEF9FF", text: "#26A4FF" },
  Internship: { bg: "#F0EFFE", text: "#7B61FF" },
  Contract: { bg: "#FFE9E9", text: "#FF6550" },
};

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: PER_PAGE });
      if (search) p.set("search", search);
      if (category !== "All") p.set("category", category);
      const res = await fetch(`${API}/api/jobs?${p}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  // ── Feature toggle ─────────────────────────────────────────────────
  const handleFeature = async (job) => {
    const newVal = !job.isFeatured;
    try {
      const res = await fetch(`${API}/api/jobs/${job._id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newVal }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) =>
          prev.map((j) =>
            j._id === job._id ? { ...j, isFeatured: newVal } : j,
          ),
        );
        showToast(newVal ? "Marked as featured ⭐" : "Removed from featured");
      } else showToast(data.message || "Failed", "error");
    } catch {
      showToast("Network error", "error");
    }
  };

  // ── Delete with SweetAlert2 ────────────────────────────────────────
  const handleDelete = async (job) => {
    const result = await Swal.fire({
      title: "Delete this job?",
      html: `<p style="font-size:14px;color:#515B6F;margin-top:6px">
                <strong style="color:#25324B">${job.title}</strong> at
                <strong style="color:#25324B"> ${job.company}</strong> will be permanently
                removed along with all its applications.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6550",
      cancelButtonColor: "#E5E7EB",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/api/jobs/${job._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Job deleted");
        fetchJobs();
      } else showToast(data.message || "Delete failed", "error");
    } catch {
      showToast("Network error", "error");
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-lg
          font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-white
          ${toast.type === "error" ? "bg-[#FF6550]" : "bg-[#56CDAD]"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[24px] text-[#25324B]">
            Manage Jobs
          </h1>
          <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] mt-0.5">
            {total} total listings
          </p>
        </div>
        <Link
          href="/dashboard/jobs/create"
          className="flex items-center gap-2 bg-[#4640DE] hover:bg-[#3730C4] text-white
            font-[family-name:var(--font-epilogue)] font-bold text-[14px] px-5 py-3 rounded-xl
            transition-colors shadow-[0_4px_14px_rgba(70,64,222,0.3)]"
        >
          <Plus size={16} /> Post New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ADB7]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs…"
            className="w-full pl-11 pr-10 py-3 border border-[#D6DDEB] rounded-xl font-[family-name:var(--font-epilogue)] text-[14px] text-[#25324B] bg-white focus:outline-none focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8ADB7] hover:text-[#515B6F]"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 border border-[#D6DDEB] rounded-xl font-[family-name:var(--font-epilogue)] text-[14px] text-[#515B6F] bg-white focus:outline-none focus:border-[#4640DE] cursor-pointer min-w-[160px]"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#4640DE]" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center">
            <Briefcase size={36} className="mx-auto text-[#D6DDEB] mb-3" />
            <p className="font-[family-name:var(--font-epilogue)] text-[#7C8493]">
              No jobs found
            </p>
          </div>
        ) : (
          <>
            {/* Table header — desktop */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-[#F4F4F6] bg-[#FAFAFA]">
              {["Job", "Category", "Type", "Actions"].map((h) => (
                <span
                  key={h}
                  className="font-[family-name:var(--font-epilogue)] font-bold text-[12px] text-[#A8ADB7] uppercase tracking-wider"
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-[#F4F4F6]">
              {jobs.map((job) => {
                const ts = TYPE_STYLES[job.type] || {
                  bg: "#F0F0F0",
                  text: "#666",
                };
                const logo = [
                  "#4640DE",
                  "#26A4FF",
                  "#56CDAD",
                  "#FFB836",
                  "#FF6550",
                ][(job.company?.charCodeAt(0) || 0) % 5];
                return (
                  <div
                    key={job._id}
                    className="flex md:grid md:grid-cols-[2fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors flex-wrap"
                  >
                    {/* Job info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-[14px] flex-shrink-0"
                        style={{ background: logo }}
                      >
                        {job.company?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#25324B] truncate">
                            {job.title}
                          </span>
                          {job.isFeatured && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-[#FFB836] bg-[#FFF8E6] px-2 py-0.5 rounded-full border border-[#FFE8A3] flex-shrink-0">
                              <Star size={8} fill="currentColor" /> Featured
                            </span>
                          )}
                        </div>
                        <p className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#7C8493] truncate">
                          {job.company} · {job.location}
                        </p>
                      </div>
                    </div>

                    <span className="hidden md:block font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F]">
                      {job.category}
                    </span>

                    <span
                      className="hidden md:inline-flex font-[family-name:var(--font-epilogue)] font-semibold text-[11px] px-2.5 py-1 rounded-full border w-fit"
                      style={{
                        background: ts.bg,
                        color: ts.text,
                        borderColor: ts.text,
                      }}
                    >
                      {job.type}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => handleFeature(job)}
                        title={job.isFeatured ? "Unfeature" : "Feature"}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          job.isFeatured
                            ? "text-[#FFB836] bg-[#FFF8E6]"
                            : "text-[#A8ADB7] bg-[#F8F8FD] hover:text-[#FFB836] hover:bg-[#FFF8E6]"
                        }`}
                      >
                        <Star
                          size={15}
                          fill={job.isFeatured ? "currentColor" : "none"}
                        />
                      </button>
                      <Link
                        href={`/jobs/${job._id}`}
                        className="p-2 rounded-lg text-[#A8ADB7] bg-[#F8F8FD] hover:text-[#4640DE] hover:bg-[#F1F0FF] transition-all"
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(job)}
                        className="p-2 rounded-lg text-[#A8ADB7] bg-[#F8F8FD] hover:text-[#FF6550] hover:bg-[#FFF4F3] transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#F4F4F6]">
                <span className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493]">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-xl border border-[#D6DDEB] flex items-center justify-center text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl font-[family-name:var(--font-epilogue)] font-bold text-[13px] transition-all ${
                        page === p
                          ? "bg-[#4640DE] text-white"
                          : "border border-[#D6DDEB] text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 rounded-xl border border-[#D6DDEB] flex items-center justify-center text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
