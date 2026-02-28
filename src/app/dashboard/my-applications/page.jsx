"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Eye,
  XCircle,
  Star,
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  Link2,
  Linkedin,
  Globe,
  MessageSquare,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_STYLES = {
  pending: {
    bg: "#FFF8E6",
    text: "#FFB836",
    border: "#FFE8A3",
    label: "Pending",
    icon: Clock,
  },
  reviewed: {
    bg: "#EEF9FF",
    text: "#26A4FF",
    border: "#B3E4FF",
    label: "Reviewed",
    icon: Eye,
  },
  shortlisted: {
    bg: "#F0EFFE",
    text: "#7B61FF",
    border: "#D4CEFF",
    label: "Shortlisted",
    icon: Star,
  },
  rejected: {
    bg: "#FFE9E9",
    text: "#FF6550",
    border: "#FFCDC8",
    label: "Rejected",
    icon: XCircle,
  },
  hired: {
    bg: "#E8F9F0",
    text: "#56CDAD",
    border: "#B3EDD8",
    label: "Hired",
    icon: CheckCircle,
  },
};

const STATUS_MESSAGES = {
  pending: "Your application is under review.",
  reviewed: "The team has reviewed your application.",
  shortlisted: "You've been shortlisted! Expect to hear from them soon.",
  rejected: "Unfortunately, you weren't selected for this role.",
  hired: "Congratulations! You've been hired! 🎉",
};

// ── All components outside to prevent remount ──

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-bold text-[12px] px-3 py-1.5 rounded-full border"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      <Icon size={11} />
      {s.label}
    </span>
  );
}

function StatusTimeline({ status }) {
  const steps = ["pending", "reviewed", "shortlisted", "hired"];
  const isRejected = status === "rejected";
  const currentIdx = steps.indexOf(status);

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-1.5 text-[#FF6550]">
          <XCircle size={14} />
          <span className="font-[family-name:var(--font-epilogue)] text-[12px] font-semibold">
            Application not selected
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const s = STATUS_STYLES[step];
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all
                          ${done ? "border-current" : "border-[#D6DDEB]"}`}
              style={
                done
                  ? { background: s.bg, borderColor: s.border, color: s.text }
                  : {}
              }
            >
              {done ? (
                <CheckCircle size={12} style={{ color: s.text }} />
              ) : (
                <div className="w-2 h-2 rounded-full bg-[#D6DDEB]" />
              )}
            </div>
            <span
              className={`font-[family-name:var(--font-epilogue)] text-[11px] font-semibold capitalize
                          ${active ? "text-[#25324B]" : done ? "text-[#7C8493]" : "text-[#D6DDEB]"}`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-6 h-0.5 mx-0.5 rounded-full ${i < currentIdx ? "bg-[#56CDAD]" : "bg-[#E7E7F5]"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ApplicationCard({ application }) {
  const [expanded, setExpanded] = useState(false);
  const s = STATUS_STYLES[application.status] || STATUS_STYLES.pending;
  const isHired = application.status === "hired";
  const isRejected = application.status === "rejected";

  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200
                     ${isHired ? "border-[#56CDAD]" : isRejected ? "border-[#FFD5D0]" : "border-[#E7E7F5]"}`}
    >
      {/* Hired banner */}
      {isHired && (
        <div className="bg-[#56CDAD] px-5 py-2 flex items-center gap-2">
          <CheckCircle size={14} className="text-white" />
          <p className="font-[family-name:var(--font-epilogue)] font-bold text-[13px] text-white">
            🎉 Congratulations — You've been hired!
          </p>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Company avatar + info */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-[18px] flex-shrink-0"
              style={{ background: s.text }}
            >
              {application.company?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[16px] text-[#25324B] leading-tight mb-0.5 truncate">
                {application.job_title}
              </h3>
              <p className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F]">
                <Building2 size={13} className="text-[#A8ADB7] flex-shrink-0" />
                {application.company}
              </p>
              <p className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7] mt-0.5">
                <Calendar size={11} />
                Applied{" "}
                {new Date(application.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex-shrink-0">
            <StatusBadge status={application.status} />
          </div>
        </div>

        {/* Status message */}
        <div
          className="mt-4 px-4 py-2.5 rounded-xl flex items-center gap-2"
          style={{ background: s.bg }}
        >
          <s.icon
            size={14}
            style={{ color: s.text }}
            className="flex-shrink-0"
          />
          <p
            className="font-[family-name:var(--font-epilogue)] text-[13px] font-semibold"
            style={{ color: s.text }}
          >
            {STATUS_MESSAGES[application.status]}
          </p>
        </div>

        {/* Progress timeline */}
        <StatusTimeline status={application.status} />

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="mt-4 flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[13px]
                     text-[#4640DE] hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp size={14} /> Hide details
            </>
          ) : (
            <>
              <ChevronDown size={14} /> View details
            </>
          )}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#F4F4F6] space-y-4">
            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {application.resume_link && (
                <a
                  href={application.resume_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 border border-[#D6DDEB] rounded-xl hover:border-[#4640DE] hover:bg-[#F8F8FD] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#F1F0FF] flex items-center justify-center flex-shrink-0">
                    <Link2 size={13} className="text-[#4640DE]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[12px] text-[#25324B] group-hover:text-[#4640DE]">
                      Resume
                    </p>
                    <p className="font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7] truncate">
                      View file
                    </p>
                  </div>
                  <ExternalLink
                    size={11}
                    className="text-[#A8ADB7] ml-auto flex-shrink-0"
                  />
                </a>
              )}
              {application.linkedin_url && (
                <a
                  href={application.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 border border-[#D6DDEB] rounded-xl hover:border-[#26A4FF] hover:bg-[#EEF9FF] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#EEF9FF] flex items-center justify-center flex-shrink-0">
                    <Linkedin size={13} className="text-[#26A4FF]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[12px] text-[#25324B] group-hover:text-[#26A4FF]">
                      LinkedIn
                    </p>
                    <p className="font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7] truncate">
                      Profile
                    </p>
                  </div>
                  <ExternalLink
                    size={11}
                    className="text-[#A8ADB7] ml-auto flex-shrink-0"
                  />
                </a>
              )}
              {application.portfolio_url && (
                <a
                  href={application.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 border border-[#D6DDEB] rounded-xl hover:border-[#56CDAD] hover:bg-[#E8F9F0] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E8F9F0] flex items-center justify-center flex-shrink-0">
                    <Globe size={13} className="text-[#56CDAD]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[12px] text-[#25324B] group-hover:text-[#56CDAD]">
                      Portfolio
                    </p>
                    <p className="font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7] truncate">
                      Website
                    </p>
                  </div>
                  <ExternalLink
                    size={11}
                    className="text-[#A8ADB7] ml-auto flex-shrink-0"
                  />
                </a>
              )}
            </div>

            {/* Cover note */}
            {application.cover_note && (
              <div className="bg-[#F8F8FD] rounded-xl p-4">
                <p className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-bold text-[12px] text-[#25324B] mb-2 uppercase tracking-wide">
                  <MessageSquare size={12} className="text-[#4640DE]" /> Cover
                  Note
                </p>
                <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F] leading-relaxed whitespace-pre-line">
                  {application.cover_note}
                </p>
              </div>
            )}

            {/* View job link */}
            <Link
              href={`/jobs/${application.job_id}`}
              className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[13px]
                         text-[#4640DE] border border-[#4640DE] px-4 py-2 rounded-xl hover:bg-[#F1F0FF] transition-colors"
            >
              <Briefcase size={13} /> View Job Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-20 h-20 rounded-2xl bg-[#F1F0FF] flex items-center justify-center">
        <Briefcase size={32} className="text-[#4640DE]" />
      </div>
      <div className="text-center">
        <h3 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-[#25324B] mb-1">
          No applications yet
        </h3>
        <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] max-w-xs mx-auto">
          You haven't applied for any jobs yet. Browse open positions and start
          applying!
        </p>
      </div>
      <Link
        href="/jobs"
        className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-white
                   bg-[#4640DE] px-6 py-3 rounded-xl hover:bg-[#3730C4] transition-colors"
      >
        Browse Jobs
      </Link>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function MyApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!session?.user?.email) return;
    (async () => {
      try {
        const res = await fetch(
          `${API}/api/applications/my?email=${encodeURIComponent(session.user.email)}`,
        );
        const data = await res.json();
        if (data.success) setApplications(data.applications);
        else setError("Failed to load your applications");
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  // Count per status for tabs
  const counts = [
    "all",
    "pending",
    "reviewed",
    "shortlisted",
    "hired",
    "rejected",
  ].reduce((acc, s) => {
    acc[s] =
      s === "all"
        ? applications.length
        : applications.filter((a) => a.status === s).length;
    return acc;
  }, {});

  // Summary stats
  const hired = applications.filter((a) => a.status === "hired").length;
  const shortlisted = applications.filter(
    (a) => a.status === "shortlisted",
  ).length;
  const pending = applications.filter((a) => a.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#4640DE]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle size={32} className="text-[#FF6550]" />
        <p className="font-[family-name:var(--font-epilogue)] text-[#515B6F]">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px] text-[#25324B]">
          My Applications
        </h1>
        <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] mt-0.5">
          Track the status of all your job applications
        </p>
      </div>

      {/* Summary cards — only show if there are applications */}
      {applications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total Applied",
              value: applications.length,
              color: "#4640DE",
              bg: "#F1F0FF",
            },
            {
              label: "Pending",
              value: pending,
              color: "#FFB836",
              bg: "#FFF8E6",
            },
            {
              label: "Shortlisted",
              value: shortlisted,
              color: "#7B61FF",
              bg: "#F0EFFE",
            },
            { label: "Hired", value: hired, color: "#56CDAD", bg: "#E8F9F0" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#E7E7F5] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <p
                className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px] leading-none mb-1"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[12px] font-semibold text-[#7C8493]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {applications.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "pending",
            "reviewed",
            "shortlisted",
            "hired",
            "rejected",
          ].map((s) => {
            const isActive = filter === s;
            const style = s !== "all" ? STATUS_STYLES[s] : null;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`font-[family-name:var(--font-epilogue)] font-bold text-[13px] px-4 py-2 rounded-xl
                            border-2 transition-all duration-200 capitalize
                            ${
                              isActive
                                ? "bg-[#4640DE] text-white border-[#4640DE]"
                                : "bg-white text-[#515B6F] border-[#D6DDEB] hover:border-[#4640DE] hover:text-[#4640DE]"
                            }`}
              >
                {s === "all" ? "All" : style.label}
                <span
                  className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full
                                 ${isActive ? "bg-white/20 text-white" : "bg-[#F4F4F6] text-[#A8ADB7]"}`}
                >
                  {counts[s]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Applications list */}
      {applications.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E7E7F5] rounded-2xl p-12 text-center">
          <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[#515B6F]">
            No applications with this status
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      )}

      {/* Browse more CTA */}
      {applications.length > 0 && (
        <div className="bg-[#25324B] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10">
            <p className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-white mb-1">
              Keep applying!
            </p>
            <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-white/60">
              More opportunities are waiting for you.
            </p>
          </div>
          <Link
            href="/jobs"
            className="relative z-10 flex-shrink-0 font-[family-name:var(--font-epilogue)] font-bold text-[14px]
                       text-[#25324B] bg-white px-6 py-3 rounded-xl hover:bg-[#F8F8FD] transition-colors"
          >
            Browse More Jobs →
          </Link>
        </div>
      )}
    </div>
  );
}
