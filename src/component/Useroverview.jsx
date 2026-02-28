"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
  Loader2,
  Search,
  Star,
  Building2,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_STYLES = {
  pending: { bg: "#FFF8E6", text: "#FFB836", label: "Pending" },
  reviewed: { bg: "#EEF9FF", text: "#26A4FF", label: "Reviewed" },
  shortlisted: { bg: "#E8F9F0", text: "#56CDAD", label: "Shortlisted" },
  rejected: { bg: "#FFF4F3", text: "#FF6550", label: "Rejected" },
  hired: { bg: "#E8F9F0", text: "#10B981", label: "Hired 🎉" },
};

const LOGO_COLORS = [
  "#4640DE",
  "#26A4FF",
  "#56CDAD",
  "#FFB836",
  "#FF6550",
  "#7B61FF",
  "#10B981",
];

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function CompanyInitial({ company }) {
  const color = LOGO_COLORS[(company?.charCodeAt(0) || 0) % LOGO_COLORS.length];
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-[14px] flex-shrink-0"
      style={{ background: color }}
    >
      {company?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

export default function UserOverview() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    setError(null);
    try {
      // ✅ Correct endpoint: /api/applications/my?email=...
      const res = await fetch(
        `${API}/api/applications/my?email=${encodeURIComponent(session.user.email)}`,
      );
      const data = await res.json();
      if (data.success) setApplications(data.applications || []);
      else setError(data.message || "Failed to load applications");
    } catch (e) {
      console.error(e);
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [session?.user?.email]);

  // Counts derived from full list
  const counts = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  // Show only 5 most recent on overview
  const recent = applications.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ── Welcome banner ── */}
      <div
        className="bg-gradient-to-r from-[#4640DE] to-[#26A4FF] rounded-2xl p-6 sm:p-8
                      text-white relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,white 0,white 1px,transparent 1px,transparent 40px),repeating-linear-gradient(-45deg,white 0,white 1px,transparent 1px,transparent 40px)",
          }}
        />
        <div className="relative z-10">
          <p className="font-[family-name:var(--font-epilogue)] text-white/70 text-[14px] mb-1">
            Welcome back,
          </p>
          <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px] mb-3 leading-tight">
            {session?.user?.name ?? "there"} 👋
          </h1>
          <p className="font-[family-name:var(--font-epilogue)] text-white/80 text-[14px] mb-5 max-w-md">
            {counts.total > 0 ? (
              <>
                You have <strong>{counts.total}</strong> application
                {counts.total !== 1 ? "s" : ""} tracked.
                {counts.shortlisted > 0 && (
                  <>
                    {" "}
                    🎉 <strong>{counts.shortlisted}</strong> shortlisted!
                  </>
                )}
              </>
            ) : (
              "Start applying to jobs and track everything here."
            )}
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-white text-[#4640DE]
                       font-[family-name:var(--font-epilogue)] font-bold text-[14px]
                       px-5 py-2.5 rounded-xl hover:shadow-lg transition-all"
          >
            <Search size={15} /> Browse Jobs
          </Link>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Applied",
            value: counts.total,
            color: "#4640DE",
            icon: Briefcase,
          },
          {
            label: "Pending",
            value: counts.pending,
            color: "#FFB836",
            icon: Clock,
          },
          {
            label: "Shortlisted",
            value: counts.shortlisted,
            color: "#56CDAD",
            icon: CheckCircle,
          },
          {
            label: "Rejected",
            value: counts.rejected,
            color: "#FF6550",
            icon: XCircle,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#E7E7F5] rounded-2xl p-5 flex flex-col gap-3
                       shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${s.color}18` }}
            >
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p
                className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px]
                             text-[#25324B] leading-none"
              >
                {loading ? "—" : s.value}
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493] mt-0.5">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent applications ── */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F4F4F6]">
          <h2 className="font-[family-name:var(--font-epilogue)] font-bold text-[17px] text-[#25324B]">
            Recent Applications
          </h2>
          {applications.length > 5 && (
            <Link
              href="/dashboard?tab=applications"
              className="flex items-center gap-1 font-[family-name:var(--font-epilogue)]
                         font-semibold text-[13px] text-[#4640DE] hover:underline"
            >
              View all <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div
            className="flex items-center gap-3 mx-6 my-4 bg-[#FFF4F3] border border-[#FFD5D0]
                          rounded-xl p-4"
          >
            <AlertCircle size={16} className="text-[#FF6550] flex-shrink-0" />
            <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#FF6550] flex-1">
              {error}
            </p>
            <button
              onClick={fetchApplications}
              className="flex items-center gap-1 font-[family-name:var(--font-epilogue)]
                         font-semibold text-[12px] text-[#4640DE] hover:underline"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#4640DE]" />
          </div>
        )}

        {/* Empty */}
        {!loading && !error && applications.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F1F0FF] flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-[#4640DE] opacity-50" />
            </div>
            <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[#25324B] mb-1">
              No applications yet
            </p>
            <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] mb-5">
              Start applying to jobs you love
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-[#4640DE] text-white
                         font-[family-name:var(--font-epilogue)] font-bold text-[14px]
                         px-5 py-2.5 rounded-xl hover:bg-[#3730C4] transition-colors"
            >
              <Search size={14} /> Find Jobs
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && !error && recent.length > 0 && (
          <div className="divide-y divide-[#F4F4F6]">
            {recent.map((app) => {
              const s = STATUS_STYLES[app.status] || STATUS_STYLES.pending;
              const company = app.company || app.job?.company || "Unknown";
              const title = app.job_title || app.job?.title || "Job";
              const location = app.job?.location;

              return (
                <div
                  key={app._id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  <CompanyInitial company={company} />

                  <div className="flex-1 min-w-0">
                    <p
                      className="font-[family-name:var(--font-epilogue)] font-bold text-[15px]
                                   text-[#25324B] truncate"
                    >
                      {title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span
                        className="flex items-center gap-1 font-[family-name:var(--font-epilogue)]
                                       text-[13px] text-[#7C8493]"
                      >
                        <Building2 size={11} className="text-[#A8ADB7]" />
                        {company}
                      </span>
                      {location && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[#D6DDEB]" />
                          <span
                            className="flex items-center gap-1 font-[family-name:var(--font-epilogue)]
                                           text-[12px] text-[#A8ADB7]"
                          >
                            <MapPin size={10} />
                            {location}
                          </span>
                        </>
                      )}
                      <span className="w-1 h-1 rounded-full bg-[#D6DDEB]" />
                      <span className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7]">
                        Applied {timeAgo(app.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className="font-[family-name:var(--font-epilogue)] font-bold text-[12px]
                                   px-3 py-1.5 rounded-full flex-shrink-0"
                    style={{ background: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>

                  {/* View job link */}
                  <Link
                    href={`/jobs/${app.job_id}`}
                    className="p-2 rounded-lg text-[#A8ADB7] bg-[#F8F8FD]
                               hover:text-[#4640DE] hover:bg-[#F1F0FF] transition-all flex-shrink-0"
                  >
                    <Eye size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Featured jobs CTA ── */}
      <div className="bg-[#F8F8FD] border border-[#E7E7F5] rounded-2xl p-6 flex items-center gap-5 flex-wrap">
        <div className="w-12 h-12 rounded-xl bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
          <Star size={22} className="text-[#FFB836]" fill="#FFB836" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-epilogue)] font-bold text-[16px] text-[#25324B]">
            Featured Jobs For You
          </h3>
          <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493]">
            Explore hand-picked opportunities matching your profile.
          </p>
        </div>
        <Link
          href="/jobs?featured=true"
          className="flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-bold
                     text-[14px] text-[#4640DE] border-2 border-[#4640DE] px-5 py-2.5 rounded-xl
                     hover:bg-[#F1F0FF] transition-colors whitespace-nowrap"
        >
          Browse <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
