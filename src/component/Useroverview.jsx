
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
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_STYLES = {
  pending: { bg: "#FFF8E6", text: "#FFB836", label: "Pending" },
  reviewed: { bg: "#EEF9FF", text: "#26A4FF", label: "Reviewed" },
  shortlisted: { bg: "#E8F9F0", text: "#56CDAD", label: "Shortlisted" },
  rejected: { bg: "#FFF4F3", text: "#FF6550", label: "Rejected" },
};

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function UserOverview() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;
    (async () => {
      try {
        const res = await fetch(
          `${API}/api/applications?user_email=${encodeURIComponent(session.user.email)}&limit=5`,
        );
        const data = await res.json();
        if (data.success) setApplications(data.applications || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  const counts = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#4640DE] to-[#26A4FF] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
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
          <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px] mb-3">
            {session?.user?.name} 👋
          </h1>
          <p className="font-[family-name:var(--font-epilogue)] text-white/80 text-[14px] mb-5 max-w-md">
            You have <strong>{counts.total}</strong> application
            {counts.total !== 1 ? "s" : ""} tracked.
            {counts.shortlisted > 0 && ` 🎉 ${counts.shortlisted} shortlisted!`}
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-white text-[#4640DE] font-[family-name:var(--font-epilogue)] font-bold text-[14px] px-5 py-2.5 rounded-xl hover:shadow-lg transition-all"
          >
            <Search size={15} /> Browse Jobs
          </Link>
        </div>
      </div>

      {/* Stats */}
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
            className="bg-white border border-[#E7E7F5] rounded-2xl p-5 flex flex-col gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${s.color}18` }}
            >
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px] text-[#25324B] leading-none">
                {s.value}
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493] mt-0.5">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F4F4F6]">
          <h2 className="font-[family-name:var(--font-epilogue)] font-bold text-[17px] text-[#25324B]">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="flex items-center gap-1 font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#4640DE] hover:underline"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#4640DE]" />
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase size={36} className="mx-auto text-[#D6DDEB] mb-3" />
            <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[#25324B] mb-1">
              No applications yet
            </p>
            <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] mb-4">
              Start applying to jobs you love
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-[#4640DE] text-white font-[family-name:var(--font-epilogue)] font-bold text-[14px] px-5 py-2.5 rounded-xl hover:bg-[#3730C4] transition-colors"
            >
              <Search size={14} /> Find Jobs
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#F4F4F6]">
            {applications.map((app) => {
              const s = STATUS_STYLES[app.status] || STATUS_STYLES.pending;
              const logo = [
                "#4640DE",
                "#26A4FF",
                "#56CDAD",
                "#FFB836",
                "#FF6550",
              ][(app.job?.company?.charCodeAt(0) || 0) % 5];
              return (
                <div
                  key={app._id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-[14px] flex-shrink-0"
                    style={{ background: logo }}
                  >
                    {app.job?.company?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#25324B] truncate">
                      {app.job?.title ?? "Job"}
                    </p>
                    <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493]">
                      {app.job?.company} · {timeAgo(app.created_at)}
                    </p>
                  </div>
                  <span
                    className="font-[family-name:var(--font-epilogue)] font-bold text-[12px] px-3 py-1.5 rounded-full flex-shrink-0"
                    style={{ background: s.bg, color: s.text }}
                  >
                    {s.label}
                  </span>
                  <Link
                    href={`/jobs/${app.job_id}`}
                    className="p-2 rounded-lg text-[#A8ADB7] bg-[#F8F8FD] hover:text-[#4640DE] hover:bg-[#F1F0FF] transition-all flex-shrink-0"
                  >
                    <Eye size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured jobs CTA */}
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
          className="flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#4640DE] border-2 border-[#4640DE] px-5 py-2.5 rounded-xl hover:bg-[#F1F0FF] transition-colors whitespace-nowrap"
        >
          Browse <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
