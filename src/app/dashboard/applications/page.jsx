"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  Eye,
  XCircle,
  Briefcase,
  Users,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Link2,
  Linkedin,
  Globe,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
  Calendar,
  Star,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUSES = [
  "all",
  "pending",
  "reviewed",
  "shortlisted",
  "rejected",
  "hired",
];

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

// ── All sub-components defined OUTSIDE to prevent focus/remount issues ──

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-bold text-[12px] px-2.5 py-1 rounded-full border"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      <Icon size={11} />
      {s.label}
    </span>
  );
}

function StatusDropdown({ applicationId, currentStatus, onUpdate, loading }) {
  const [open, setOpen] = useState(false);
  const statuses = ["pending", "reviewed", "shortlisted", "rejected", "hired"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
        className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[13px]
                   text-[#515B6F] border border-[#D6DDEB] px-3 py-1.5 rounded-xl hover:border-[#4640DE]
                   hover:text-[#4640DE] transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <ArrowUpDown size={13} />
        )}
        Update
        <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-[#E7E7F5] rounded-xl shadow-lg z-20 overflow-hidden min-w-[150px]">
            {statuses.map((s) => {
              const style = STATUS_STYLES[s];
              const Icon = style.icon;
              return (
                <button
                  key={s}
                  onClick={() => {
                    onUpdate(applicationId, s);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left font-[family-name:var(--font-epilogue)]
                              font-semibold text-[13px] hover:bg-[#F8F8FD] transition-colors
                              ${currentStatus === s ? "bg-[#F8F8FD]" : ""}`}
                  style={{ color: style.text }}
                >
                  <Icon size={13} />
                  {style.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function ApplicationDrawer({
  application,
  onClose,
  onStatusUpdate,
  updatingId,
}) {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-[480px] h-full overflow-y-auto shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#F4F4F6] px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-[#25324B]">
            Application Details
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A8ADB7] hover:text-[#25324B] hover:bg-[#F4F4F6] transition-colors"
          >
            <XCircle size={18} />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          {/* Applicant info */}
          <div className="bg-[#F8F8FD] rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4640DE] flex items-center justify-center text-white font-bold text-[18px] flex-shrink-0">
                {application.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <StatusBadge status={application.status} />
            </div>
            <h4 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-[#25324B] mb-1">
              {application.name}
            </h4>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F]">
                <Mail size={13} className="text-[#A8ADB7]" />{" "}
                {application.email}
              </p>
              {application.phone && (
                <p className="flex items-center gap-2 font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F]">
                  <Phone size={13} className="text-[#A8ADB7]" />{" "}
                  {application.phone}
                </p>
              )}
            </div>
          </div>

          {/* Job info */}
          <div className="border border-[#E7E7F5] rounded-2xl p-4">
            <p className="font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7] mb-1 uppercase tracking-wide">
              Applied For
            </p>
            <p className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#25324B]">
              {application.job_title}
            </p>
            <p className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F] mt-0.5">
              <Building2 size={13} className="text-[#A8ADB7]" />{" "}
              {application.company}
            </p>
            <p className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7] mt-1">
              <Calendar size={12} />{" "}
              {new Date(application.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-2.5">
            <p className="font-[family-name:var(--font-epilogue)] font-bold text-[13px] text-[#25324B]">
              Links
            </p>
            {application.resume_link && (
              <a
                href={application.resume_link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 border border-[#D6DDEB] rounded-xl hover:border-[#4640DE] hover:bg-[#F8F8FD] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F1F0FF] flex items-center justify-center flex-shrink-0">
                  <Link2 size={14} className="text-[#4640DE]" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] group-hover:text-[#4640DE]">
                    Resume
                  </p>
                  <p className="font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7] truncate max-w-[280px]">
                    {application.resume_link}
                  </p>
                </div>
              </a>
            )}
            {application.linkedin_url && (
              <a
                href={application.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 border border-[#D6DDEB] rounded-xl hover:border-[#4640DE] hover:bg-[#F8F8FD] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EEF9FF] flex items-center justify-center flex-shrink-0">
                  <Linkedin size={14} className="text-[#26A4FF]" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] group-hover:text-[#4640DE]">
                    LinkedIn
                  </p>
                  <p className="font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7] truncate max-w-[280px]">
                    {application.linkedin_url}
                  </p>
                </div>
              </a>
            )}
            {application.portfolio_url && (
              <a
                href={application.portfolio_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 border border-[#D6DDEB] rounded-xl hover:border-[#4640DE] hover:bg-[#F8F8FD] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8F9F0] flex items-center justify-center flex-shrink-0">
                  <Globe size={14} className="text-[#56CDAD]" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] group-hover:text-[#4640DE]">
                    Portfolio
                  </p>
                  <p className="font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7] truncate max-w-[280px]">
                    {application.portfolio_url}
                  </p>
                </div>
              </a>
            )}
          </div>

          {/* Cover note */}
          {application.cover_note && (
            <div className="border border-[#E7E7F5] rounded-2xl p-4">
              <p className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-bold text-[13px] text-[#25324B] mb-2">
                <MessageSquare size={13} className="text-[#4640DE]" /> Cover
                Note
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#515B6F] leading-relaxed whitespace-pre-line">
                {application.cover_note}
              </p>
            </div>
          )}
        </div>

        {/* Footer: update status */}
        <div className="sticky bottom-0 bg-white border-t border-[#F4F4F6] px-6 py-4">
          <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[12px] text-[#A8ADB7] mb-2">
            UPDATE STATUS
          </p>
          <div className="flex flex-wrap gap-2">
            {["pending", "reviewed", "shortlisted", "rejected", "hired"].map(
              (s) => {
                const style = STATUS_STYLES[s];
                const Icon = style.icon;
                const isActive = application.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => onStatusUpdate(application._id, s)}
                    disabled={isActive || updatingId === application._id}
                    className={`flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-bold text-[12px]
                              px-3 py-2 rounded-xl border-2 transition-all duration-200 disabled:cursor-not-allowed
                              ${
                                isActive
                                  ? "border-current opacity-100 cursor-default"
                                  : "border-[#E7E7F5] text-[#515B6F] hover:border-current opacity-70 hover:opacity-100"
                              }`}
                    style={
                      isActive
                        ? {
                            background: style.bg,
                            color: style.text,
                            borderColor: style.border,
                          }
                        : {}
                    }
                  >
                    <Icon size={11} />
                    {style.label}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function ApplicationsPage() {
  const { data: session } = useSession();

  // ✅ Role guard — non-admins get a blocked screen even if they visit the URL directly
  if (session && session.user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF4F3] flex items-center justify-center">
          <AlertCircle size={28} className="text-[#FF6550]" />
        </div>
        <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[20px] text-[#25324B]">
          Access Denied
        </h2>
        <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493]">
          You don't have permission to view this page.
        </p>
        <Link
          href="/dashboard"
          className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-white bg-[#4640DE] px-6 py-2.5 rounded-xl hover:bg-[#3730C4] transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ role: "admin", page, limit: 15 });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`${API}/api/applications?${params}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
        setPagination(data.pagination);
      } else setError("Failed to load applications");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(
        `${API}/api/applications/${id}/status?role=admin`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a)),
        );
        if (selectedApp?._id === id) setSelectedApp((p) => ({ ...p, status }));
        showToast(`Status updated to "${status}"`);
      } else showToast(data.message || "Failed to update", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Client-side search filter
  const filtered = applications.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.job_title?.toLowerCase().includes(q) ||
      a.company?.toLowerCase().includes(q)
    );
  });

  // Status counts for tabs
  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] =
      s === "all"
        ? applications.length
        : applications.filter((a) => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-lg
                         font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-white transition-all
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

      {/* Drawer */}
      {selectedApp && (
        <ApplicationDrawer
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusUpdate={handleStatusUpdate}
          updatingId={updatingId}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px] text-[#25324B]">
            Applications
          </h1>
          <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] mt-0.5">
            Manage and review all job applications
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F0EFFE] px-4 py-2.5 rounded-xl">
          <Users size={16} className="text-[#4640DE]" />
          <span className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#4640DE]">
            {pagination?.total ?? 0} Total
          </span>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => {
          const style = s !== "all" ? STATUS_STYLES[s] : null;
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`font-[family-name:var(--font-epilogue)] font-bold text-[13px] px-4 py-2 rounded-xl
                          border-2 transition-all duration-200 capitalize
                          ${
                            isActive
                              ? "bg-[#4640DE] text-white border-[#4640DE]"
                              : "bg-white text-[#515B6F] border-[#D6DDEB] hover:border-[#4640DE] hover:text-[#4640DE]"
                          }`}
            >
              {s === "all" ? "All" : STATUS_STYLES[s].label}
              <span
                className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full
                               ${isActive ? "bg-white/20 text-white" : "bg-[#F4F4F6] text-[#A8ADB7]"}`}
              >
                {statusCounts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by name, email, job title or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-[#D6DDEB] rounded-xl font-[family-name:var(--font-epilogue)]
                     text-[14px] text-[#25324B] placeholder:text-[#A8ADB7] focus:outline-none
                     focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/10 transition-all bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#4640DE]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle size={32} className="text-[#FF6550]" />
            <p className="font-[family-name:var(--font-epilogue)] text-[#515B6F]">
              {error}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F4F6] flex items-center justify-center">
              <Briefcase size={24} className="text-[#A8ADB7]" />
            </div>
            <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[#515B6F]">
              No applications found
            </p>
            <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#A8ADB7]">
              Try changing the filter or search term
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-4 px-6 py-3 bg-[#F8F8FD] border-b border-[#F4F4F6]">
              {["Applicant", "Applied For", "Date", "Status", "Action"].map(
                (h) => (
                  <span
                    key={h}
                    className="font-[family-name:var(--font-epilogue)] font-bold text-[12px] text-[#A8ADB7] uppercase tracking-wide"
                  >
                    {h}
                  </span>
                ),
              )}
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#F4F4F6]">
              {filtered.map((app) => (
                <div
                  key={app._id}
                  className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-3 sm:gap-4
                             px-6 py-4 hover:bg-[#F8F8FD] transition-colors items-center"
                >
                  {/* Applicant */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#4640DE] flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0">
                      {app.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#25324B] truncate">
                        {app.name}
                      </p>
                      <p className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7] truncate">
                        {app.email}
                      </p>
                    </div>
                  </div>

                  {/* Job */}
                  <div className="min-w-0">
                    <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] truncate">
                      {app.job_title}
                    </p>
                    <p className="flex items-center gap-1 font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7] truncate">
                      <Building2 size={11} />
                      {app.company}
                    </p>
                  </div>

                  {/* Date */}
                  <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F]">
                    {new Date(app.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  {/* Status */}
                  <StatusBadge status={app.status} />

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#4640DE]
                                 border border-[#4640DE] px-3 py-1.5 rounded-xl hover:bg-[#F1F0FF] transition-colors"
                    >
                      View
                    </button>
                    <StatusDropdown
                      applicationId={app._id}
                      currentStatus={app.status}
                      onUpdate={handleStatusUpdate}
                      loading={updatingId === app._id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493]">
            Page {pagination.page} of {pagination.totalPages} —{" "}
            {pagination.total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl border border-[#D6DDEB] flex items-center justify-center text-[#515B6F]
                         hover:border-[#4640DE] hover:text-[#4640DE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl font-[family-name:var(--font-epilogue)] font-bold text-[14px] transition-colors
                            ${page === i + 1 ? "bg-[#4640DE] text-white" : "border border-[#D6DDEB] text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE]"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="w-9 h-9 rounded-xl border border-[#D6DDEB] flex items-center justify-center text-[#515B6F]
                         hover:border-[#4640DE] hover:text-[#4640DE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
