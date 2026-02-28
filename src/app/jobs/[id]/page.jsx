"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Clock,
  Star,
  ArrowLeft,
  CheckCircle,
  Briefcase,
  DollarSign,
  Users,
  Eye,
  Send,
  Loader2,
  AlertCircle,
  ChevronRight,
  Globe,
  Linkedin,
  FileText,
  MessageSquare,
  User,
  Mail,
  Phone,
  Link2,
  Trash2,
  StarOff,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  const sym =
    currency === "USD"
      ? "$"
      : currency === "EUR"
        ? "€"
        : currency === "GBP"
          ? "£"
          : currency;
  const fmt = (n) =>
    n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} / year`;
  if (min) return `From ${fmt(min)} / year`;
  if (max) return `Up to ${fmt(max)} / year`;
  return "Salary not specified";
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)} weeks ago`;
  return `Posted ${Math.floor(days / 30)} months ago`;
}

// ── ALL components defined OUTSIDE to prevent remount/focus-steal ──

function CompanyLogo({ logo, company, size = 72 }) {
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
        className="rounded-2xl object-contain bg-white border border-[#E7E7F5] p-2 flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.36,
      }}
    >
      {company?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function ConfirmDeleteModal({ job, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-7">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FFF0EE] flex items-center justify-center flex-shrink-0">
            <Trash2 size={22} className="text-[#FF6550]" />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-[#25324B] mb-1">
              Delete this job?
            </h3>
            <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#515B6F] leading-relaxed">
              <span className="font-bold text-[#25324B]">"{job.title}"</span> at{" "}
              <span className="font-bold text-[#25324B]">{job.company}</span>{" "}
              will be permanently deleted along with all its applications. This
              cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#515B6F]
                       px-5 py-2.5 border border-[#D6DDEB] rounded-xl hover:bg-[#F8F8FD] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-bold text-[14px]
                       text-white bg-[#FF6550] px-5 py-2.5 rounded-xl hover:bg-[#e54f41]
                       disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Deleting…
              </>
            ) : (
              <>
                <Trash2 size={15} /> Yes, Delete Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminActionBar({
  job,
  onFeatureToggle,
  onDeleteClick,
  featureLoading,
}) {
  return (
    <div className="bg-[#25324B] rounded-2xl px-5 py-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-3 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="flex items-center gap-2.5 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-[#4640DE] flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <div>
          <p className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-white">
            Admin Controls
          </p>
          <p className="font-[family-name:var(--font-epilogue)] text-[12px] text-white/50">
            Manage this job listing
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:ml-auto relative z-10 flex-wrap">
        <button
          onClick={onFeatureToggle}
          disabled={featureLoading}
          className={`flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-bold
                      text-[14px] px-5 py-2.5 rounded-xl border-2 transition-all duration-200 disabled:opacity-60
                      ${
                        job.isFeatured
                          ? "border-[#FFB836] text-[#FFB836] hover:bg-[#FFB836] hover:text-[#25324B]"
                          : "border-white/30 text-white hover:border-[#FFB836] hover:text-[#FFB836]"
                      }`}
        >
          {featureLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : job.isFeatured ? (
            <>
              <StarOff size={15} /> Unfeature
            </>
          ) : (
            <>
              <Star size={15} /> Mark as Featured
            </>
          )}
        </button>
        <button
          onClick={onDeleteClick}
          className="flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-bold
                     text-[14px] text-white bg-[#FF6550] px-5 py-2.5 rounded-xl hover:bg-[#e54f41] transition-colors"
        >
          <Trash2 size={15} /> Delete Job
        </button>
      </div>
    </div>
  );
}

// ✅ Field defined OUTSIDE ApplyForm — this was the main focus-stealing culprit
function Field({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  required,
  textarea,
  hint,
  value,
  onChange,
  error,
  readOnly,
}) {
  const baseCls = `w-full px-4 py-3 border rounded-xl font-[family-name:var(--font-epilogue)] text-[14px]
    text-[#25324B] placeholder-[#A8ADB7] outline-none transition-all duration-200
    ${
      error
        ? "border-[#FF6550] bg-[#FFF4F3] focus:ring-2 focus:ring-[#FF6550]/10"
        : readOnly
          ? "border-[#E7E7F5] bg-[#F8F8FD] text-[#A8ADB7] cursor-not-allowed"
          : "border-[#D6DDEB] focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/10"
    }`;

  return (
    <div>
      <label className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] mb-1.5">
        {Icon && <Icon size={13} className="text-[#A8ADB7]" />}
        {label}
        {required && <span className="text-[#FF6550]">*</span>}
        {/* ✅ Show a lock badge on read-only fields */}
        {readOnly && (
          <span className="ml-auto text-[11px] font-normal text-[#A8ADB7] bg-[#F4F4F6] px-2 py-0.5 rounded-full">
            auto-filled
          </span>
        )}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          readOnly={readOnly}
          className={`${baseCls} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={baseCls}
        />
      )}
      {hint && !error && (
        <p className="mt-1 font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7]">
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1 flex items-center gap-1 font-[family-name:var(--font-epilogue)] text-[12px] text-[#FF6550]">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

function ApplyForm({ job, session, onSuccess }) {
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    resume_link: "",
    cover_note: "",
    linkedin_url: "",
    portfolio_url: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.resume_link.trim()) e.resume_link = "Resume link is required";
    else {
      try {
        new URL(form.resume_link);
      } catch {
        e.resume_link = "Must be a valid URL";
      }
    }
    if (form.portfolio_url) {
      try {
        new URL(form.portfolio_url);
      } catch {
        e.portfolio_url = "Must be a valid URL";
      }
    }
    if (form.linkedin_url) {
      try {
        new URL(form.linkedin_url);
      } catch {
        e.linkedin_url = "Must be a valid URL";
      }
    }
    if (form.cover_note && form.cover_note.trim().length < 10)
      e.cover_note = "Must be at least 10 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, job_id: job._id }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onSuccess?.();
      } else
        setErrors({
          general: data.message || data.errors?.[0] || "Submission failed",
        });
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 rounded-full bg-[#E8F9F0] flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={36} className="text-[#56CDAD]" />
        </div>
        <h3 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[22px] text-[#25324B] mb-2">
          Application Submitted! 🎉
        </h3>
        <p className="font-[family-name:var(--font-epilogue)] text-[#515B6F] text-[15px] mb-2 max-w-sm mx-auto">
          Your application for <strong>{job.title}</strong> at{" "}
          <strong>{job.company}</strong> has been sent.
        </p>
        <p className="font-[family-name:var(--font-epilogue)] text-[#A8ADB7] text-[13px] mb-8">
          Track its status in your dashboard.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/dashboard"
            className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#4640DE] border-2 border-[#4640DE] px-6 py-2.5 rounded-xl hover:bg-[#F1F0FF] transition-colors"
          >
            View Dashboard
          </Link>
          <Link
            href="/jobs"
            className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-white bg-[#4640DE] px-6 py-2.5 rounded-xl hover:bg-[#3730C4] transition-colors"
          >
            Browse More Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-[#F1F0FF] flex items-center justify-center mx-auto mb-4">
          <User size={28} className="text-[#4640DE]" />
        </div>
        <h3 className="font-[family-name:var(--font-epilogue)] font-bold text-[18px] text-[#25324B] mb-2">
          Sign in to Apply
        </h3>
        <p className="font-[family-name:var(--font-epilogue)] text-[#515B6F] text-[14px] mb-6 max-w-xs mx-auto">
          You need to be logged in to apply for this position.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#4640DE] border-2 border-[#4640DE] px-6 py-3 rounded-xl hover:bg-[#F1F0FF] transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-white bg-[#4640DE] px-6 py-3 rounded-xl hover:bg-[#3730C4] transition-colors"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="flex items-start gap-3 bg-[#FFF4F3] border border-[#FFD5D0] rounded-xl p-4">
          <AlertCircle
            size={16}
            className="text-[#FF6550] flex-shrink-0 mt-0.5"
          />
          <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#FF6550]">
            {errors.general}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ✅ Name and Email are read-only — pre-filled from session */}
        <Field
          label="Full Name"
          name="name"
          icon={User}
          required
          placeholder="Jane Doe"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
          readOnly={true}
        />
        <Field
          label="Email"
          name="email"
          icon={Mail}
          required
          type="email"
          placeholder="jane@email.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          error={errors.email}
          readOnly={true}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Phone Number"
          name="phone"
          icon={Phone}
          placeholder="+1 (555) 000-0000"
          hint="Optional"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          error={errors.phone}
        />
        <Field
          label="Resume Link"
          name="resume_link"
          icon={Link2}
          required
          placeholder="https://drive.google.com/…"
          hint="Google Drive, Dropbox, or any public link"
          value={form.resume_link}
          onChange={(e) => set("resume_link", e.target.value)}
          error={errors.resume_link}
        />
      </div>
      <Field
        label="Cover Note"
        name="cover_note"
        icon={MessageSquare}
        textarea
        placeholder="Tell us why you're excited about this role…"
        hint="Optional but recommended (min. 10 characters)"
        value={form.cover_note}
        onChange={(e) => set("cover_note", e.target.value)}
        error={errors.cover_note}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="LinkedIn Profile"
          name="linkedin_url"
          icon={Linkedin}
          placeholder="https://linkedin.com/in/…"
          hint="Optional"
          value={form.linkedin_url}
          onChange={(e) => set("linkedin_url", e.target.value)}
          error={errors.linkedin_url}
        />
        <Field
          label="Portfolio / Website"
          name="portfolio_url"
          icon={Globe}
          placeholder="https://yourportfolio.com"
          hint="Optional"
          value={form.portfolio_url}
          onChange={(e) => set("portfolio_url", e.target.value)}
          error={errors.portfolio_url}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2.5 font-[family-name:var(--font-epilogue)]
                   font-bold text-[15px] text-white bg-[#4640DE] py-4 rounded-xl
                   hover:bg-[#3730C4] active:scale-[.99] disabled:opacity-60
                   transition-all duration-200 shadow-[0_4px_14px_rgba(70,64,222,0.3)]"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send size={16} /> Submit Application
          </>
        )}
      </button>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function JobDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);
  const [featureLoading, setFeatureLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);

  const isAdmin = session?.user?.role === "admin";
  const isUser = session?.user?.role === "user";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API}/api/jobs/${id}`);
        const data = await res.json();
        if (data.success) setJob(data.job);
        else setError("Job not found");
      } catch {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleFeatureToggle = async () => {
    if (!job) return;
    setFeatureLoading(true);
    try {
      const res = await fetch(`${API}/api/jobs/${job._id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !job.isFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        setJob((prev) => ({ ...prev, isFeatured: !prev.isFeatured }));
        showToast(
          job.isFeatured ? "Removed from featured" : "Marked as featured ⭐",
        );
      } else showToast(data.message || "Failed to update", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setFeatureLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API}/api/jobs/${job._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Job deleted successfully");
        setTimeout(() => router.push("/jobs"), 1200);
      } else {
        showToast(data.message || "Failed to delete", "error");
        setShowDeleteModal(false);
      }
    } catch {
      showToast("Network error", "error");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8FD] pt-16">
        <div className="max-w-[900px] mx-auto px-6 py-12 animate-pulse">
          <div className="bg-white rounded-2xl p-8 mb-6 border border-[#E7E7F5]">
            <div className="flex gap-5">
              <div
                className="rounded-2xl bg-[#F0F0F0] flex-shrink-0"
                style={{ width: 72, height: 72 }}
              />
              <div className="flex-1">
                <div className="h-7 bg-[#F0F0F0] rounded mb-3 w-2/3" />
                <div className="h-4 bg-[#F0F0F0] rounded w-1/2" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-[#E7E7F5]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-[#F0F0F0] rounded mb-3"
                style={{ width: `${65 + ((i * 7) % 35)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F8F8FD] pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF4F3] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-[#FF6550]" />
          </div>
          <h2 className="font-[family-name:var(--font-epilogue)] font-bold text-[20px] text-[#25324B] mb-2">
            {error || "Job not found"}
          </h2>
          <Link
            href="/jobs"
            className="font-[family-name:var(--font-epilogue)] text-[#4640DE] hover:underline"
          >
            ← Back to all jobs
          </Link>
        </div>
      </div>
    );
  }

  const salary = formatSalary(
    job.salary_min,
    job.salary_max,
    job.salary_currency,
  );

  return (
    <div className="min-h-screen bg-[#F8F8FD] pt-16">
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl
                         shadow-lg font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-white
                         transition-all duration-300 ${toast.type === "error" ? "bg-[#FF6550]" : "bg-[#56CDAD]"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <CheckCircle size={16} />
          )}
          {toast.msg}
        </div>
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          job={job}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}

      <div className="max-w-[900px] mx-auto px-6 py-8 sm:py-12">
        <div className="flex items-center gap-2 mb-6 font-[family-name:var(--font-epilogue)] text-[13px]">
          <Link
            href="/jobs"
            className="text-[#4640DE] hover:underline flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Jobs
          </Link>
          <ChevronRight size={13} className="text-[#D6DDEB]" />
          <span className="text-[#515B6F]">{job.category}</span>
          <ChevronRight size={13} className="text-[#D6DDEB]" />
          <span className="text-[#25324B] font-semibold truncate max-w-[180px]">
            {job.title}
          </span>
        </div>

        {isAdmin && (
          <AdminActionBar
            job={job}
            onFeatureToggle={handleFeatureToggle}
            onDeleteClick={() => setShowDeleteModal(true)}
            featureLoading={featureLoading}
          />
        )}

        <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 sm:p-8 mb-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <CompanyLogo logo={job.logo} company={job.company} size={72} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[24px] sm:text-[28px] text-[#25324B] leading-tight mb-1">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-[14px] font-[family-name:var(--font-epilogue)]">
                    <span className="flex items-center gap-1.5 text-[#515B6F] font-semibold">
                      <Building2 size={14} className="text-[#A8ADB7]" />
                      {job.company}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#D6DDEB]" />
                    <span className="flex items-center gap-1.5 text-[#515B6F]">
                      <MapPin size={13} className="text-[#A8ADB7]" />
                      {job.location}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#D6DDEB]" />
                    <span className="flex items-center gap-1.5 text-[#A8ADB7] text-[13px]">
                      <Clock size={12} />
                      {timeAgo(job.created_at)}
                    </span>
                  </div>
                </div>
                {job.isFeatured && (
                  <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#FFB836] bg-[#FFF8E6] px-3 py-1.5 rounded-full border border-[#FFE8A3]">
                    <Star size={11} fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {job.type &&
                  (() => {
                    const s = TAG_STYLES[job.type] || {
                      bg: "#F0F0F0",
                      text: "#666",
                    };
                    return (
                      <span
                        className="font-[family-name:var(--font-epilogue)] font-semibold text-[12px] px-3 py-1.5 rounded-full border"
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
                {job.tags?.map((tag) => {
                  const s = TAG_STYLES[tag] || { bg: "#F0F0F0", text: "#666" };
                  return (
                    <span
                      key={tag}
                      className="font-[family-name:var(--font-epilogue)] font-semibold text-[12px] px-3 py-1.5 rounded-full border"
                      style={{
                        background: s.bg,
                        color: s.text,
                        borderColor: s.text,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F4F4F6]">
            {[
              {
                icon: DollarSign,
                label: "Salary",
                value: salary,
                color: "#56CDAD",
              },
              {
                icon: Briefcase,
                label: "Job Type",
                value: job.type || "Full Time",
                color: "#4640DE",
              },
              {
                icon: Eye,
                label: "Views",
                value: `${job.views ?? 0} views`,
                color: "#26A4FF",
              },
              {
                icon: Users,
                label: "Applicants",
                value: `${job.applicationCount ?? 0} applied`,
                color: "#FFB836",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 bg-[#F8F8FD] rounded-xl p-3"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}18` }}
                >
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-epilogue)] text-[11px] text-[#A8ADB7]">
                    {s.label}
                  </p>
                  <p className="font-[family-name:var(--font-epilogue)] font-bold text-[13px] text-[#25324B] leading-tight">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 sm:p-8 mb-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[20px] text-[#25324B] mb-4 flex items-center gap-2">
            <FileText size={20} className="text-[#4640DE]" /> Job Description
          </h2>
          <div className="font-[family-name:var(--font-epilogue)] text-[15px] text-[#515B6F] leading-[1.8] whitespace-pre-line">
            {job.description}
          </div>
          {job.requirements?.length > 0 && (
            <div className="mt-7">
              <h3 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-[#25324B] mb-4">
                Requirements
              </h3>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E8F9F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={12} className="text-[#56CDAD]" />
                    </div>
                    <span className="font-[family-name:var(--font-epilogue)] text-[15px] text-[#515B6F] leading-relaxed">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {isUser && (
          <div
            id="apply-form"
            className="bg-white border border-[#E7E7F5] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
          >
            {!applied && (
              <div className="mb-6">
                <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[20px] text-[#25324B] flex items-center gap-2">
                  <Send size={20} className="text-[#4640DE]" /> Apply for this
                  Position
                </h2>
                <p className="font-[family-name:var(--font-epilogue)] text-[#515B6F] text-[14px] mt-1">
                  Applying as{" "}
                  <span className="font-semibold text-[#25324B]">
                    {session.user.email}
                  </span>
                </p>
              </div>
            )}
            <ApplyForm
              job={job}
              session={session}
              onSuccess={() => setApplied(true)}
            />
          </div>
        )}

        {!session && (
          <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <div className="mb-6">
              <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[20px] text-[#25324B] flex items-center gap-2">
                <Send size={20} className="text-[#4640DE]" /> Apply for this
                Position
              </h2>
            </div>
            <ApplyForm job={job} session={null} />
          </div>
        )}

        {isAdmin && (
          <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 sm:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F1F0FF] flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={22} className="text-[#4640DE]" />
              </div>
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-epilogue)] font-bold text-[17px] text-[#25324B] mb-1">
                  Admin view — applications managed in dashboard
                </h3>
                <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#515B6F] mb-5 leading-relaxed">
                  You're viewing as admin. Use the{" "}
                  <span className="font-semibold text-[#25324B]">
                    Admin Controls
                  </span>{" "}
                  bar above to feature or delete this listing. To review
                  submitted applications, visit the dashboard.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-white bg-[#4640DE] px-5 py-2.5 rounded-xl hover:bg-[#3730C4] transition-colors"
                >
                  Go to Admin Dashboard <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#515B6F] hover:text-[#4640DE] transition-colors"
          >
            <ArrowLeft size={15} /> Back to all jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
