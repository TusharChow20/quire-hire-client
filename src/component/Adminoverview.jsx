"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Star,
  Trash2,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
} from "lucide-react";
import Swal from "sweetalert2";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TYPE_STYLES = {
  "Full Time": { bg: "#E8F9F0", text: "#56CDAD" },
  "Part Time": { bg: "#FFF0E6", text: "#FFB836" },
  Remote: { bg: "#EEF9FF", text: "#26A4FF" },
  Internship: { bg: "#F0EFFE", text: "#7B61FF" },
  Contract: { bg: "#FFE9E9", text: "#FF6550" },
};

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493] mb-0.5">
          {label}
        </p>
        <p className="font-[family-name:var(--font-epilogue)] font-extrabold text-[28px] text-[#25324B] leading-none">
          {value ?? "—"}
        </p>
        {sub && (
          <p className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7] mt-1">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [sRes, jRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`),
        fetch(`${API}/api/jobs?limit=6&sortBy=newest`),
      ]);
      const sd = await sRes.json();
      const jd = await jRes.json();
      if (sd.success) setStats(sd.stats);
      if (jd.success) setJobs(jd.jobs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Feature toggle ────────────────────────────────────
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

  // ── Delete with SweetAlert2 ───────────────────────────
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
      customClass: { cancelButton: "!text-gray-700" },
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/api/jobs/${job._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== job._id));
        showToast("Job deleted");
        fetchData(); // refresh stats
      } else showToast(data.message || "Delete failed", "error");
    } catch {
      showToast("Network error", "error");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#4640DE]" />
      </div>
    );

  return (
    <div className="space-y-8">
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
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px] text-[#25324B]">
            Admin Dashboard
          </h1>
          <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] mt-1">
            Manage your entire job board from here
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Jobs"
          value={stats?.totalJobs}
          icon={Briefcase}
          color="#4640DE"
          sub={`+${stats?.newJobsToday ?? 0} today`}
        />
        <StatCard
          label="Total Applications"
          value={stats?.totalApplications}
          icon={Users}
          color="#26A4FF"
          sub={`+${stats?.newApplicationsToday ?? 0} today`}
        />
        <StatCard
          label="Companies"
          value={stats?.totalCompanies}
          icon={Building2}
          color="#56CDAD"
        />
        <StatCard
          label="Top Category"
          value={stats?.topCategories?.[0]?.category ?? "—"}
          icon={TrendingUp}
          color="#FFB836"
          sub={`${stats?.topCategories?.[0]?.count ?? 0} listings`}
        />
      </div>

      {/* Application status breakdown */}
      {stats?.applicationsByStatus?.length > 0 && (
        <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <h2 className="font-[family-name:var(--font-epilogue)] font-bold text-[17px] text-[#25324B] mb-5">
            Applications by Status
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: "pending", label: "Pending", color: "#FFB836" },
              { key: "reviewed", label: "Reviewed", color: "#26A4FF" },
              { key: "shortlisted", label: "Shortlisted", color: "#56CDAD" },
              { key: "rejected", label: "Rejected", color: "#FF6550" },
            ].map(({ key, label, color }) => {
              const found = stats.applicationsByStatus.find(
                (s) => s.status === key,
              );
              return (
                <div
                  key={key}
                  className="text-center p-4 rounded-xl"
                  style={{ background: `${color}12` }}
                >
                  <p
                    className="font-[family-name:var(--font-epilogue)] font-extrabold text-[28px]"
                    style={{ color }}
                  >
                    {found?.count ?? 0}
                  </p>
                  <p
                    className="font-[family-name:var(--font-epilogue)] text-[13px] font-semibold mt-1"
                    style={{ color: `${color}CC` }}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent jobs */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F4F4F6]">
          <h2 className="font-[family-name:var(--font-epilogue)] font-bold text-[17px] text-[#25324B]">
            Recent Job Listings
          </h2>
          <Link
            href="/dashboard/jobs"
            className="flex items-center gap-1 font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#4640DE] hover:underline"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase size={36} className="mx-auto text-[#D6DDEB] mb-3" />
            <p className="font-[family-name:var(--font-epilogue)] text-[#7C8493] mb-3">
              No jobs yet
            </p>
            <Link
              href="/dashboard/jobs/create"
              className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#4640DE] hover:underline"
            >
              <Plus size={14} /> Post your first job
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#F4F4F6]">
            {jobs.map((job) => {
              const ts = TYPE_STYLES[job.type] || {
                bg: "#F0F0F0",
                text: "#666",
              };
              const logoColor = [
                "#4640DE",
                "#26A4FF",
                "#56CDAD",
                "#FFB836",
                "#FF6550",
              ][(job.company?.charCodeAt(0) || 0) % 5];
              return (
                <div
                  key={job._id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  {/* Logo initial */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-[14px] flex-shrink-0"
                    style={{ background: logoColor }}
                  >
                    {job.company?.[0]?.toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#25324B] truncate">
                        {job.title}
                      </p>
                      {job.isFeatured && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#FFB836] bg-[#FFF8E6] px-2 py-0.5 rounded-full border border-[#FFE8A3] flex-shrink-0">
                          <Star size={8} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493] flex items-center gap-1.5">
                      {job.company}
                      <span className="w-1 h-1 rounded-full bg-[#D6DDEB]" />
                      {job.location}
                    </p>
                  </div>

                  {/* Type tag */}
                  <span
                    className="hidden sm:inline-flex font-[family-name:var(--font-epilogue)] font-semibold text-[11px] px-2.5 py-1 rounded-full border flex-shrink-0"
                    style={{
                      background: ts.bg,
                      color: ts.text,
                      borderColor: ts.text,
                    }}
                  >
                    {job.type}
                  </span>

                  {/* Meta */}
                  <div className="hidden md:flex flex-col items-end gap-0.5 flex-shrink-0 text-[#A8ADB7]">
                    <span className="flex items-center gap-1 font-[family-name:var(--font-epilogue)] text-[12px]">
                      <Eye size={11} />
                      {job.views ?? 0}
                    </span>
                    <span className="flex items-center gap-1 font-[family-name:var(--font-epilogue)] text-[12px]">
                      <Clock size={11} />
                      {timeAgo(job.created_at)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleFeature(job)}
                      title={job.isFeatured ? "Unfeature" : "Feature"}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        job.isFeatured
                          ? "text-[#FFB836] bg-[#FFF8E6] hover:bg-[#FFE8A3]"
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
                      className="p-2 rounded-lg text-[#A8ADB7] bg-[#F8F8FD] hover:text-[#4640DE] hover:bg-[#F1F0FF] transition-all duration-200"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(job)}
                      className="p-2 rounded-lg text-[#A8ADB7] bg-[#F8F8FD] hover:text-[#FF6550] hover:bg-[#FFF4F3] transition-all duration-200"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
