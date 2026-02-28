"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  Star,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_COLORS = {
  pending: "#FFB836",
  reviewed: "#26A4FF",
  shortlisted: "#7B61FF",
  rejected: "#FF6550",
  hired: "#56CDAD",
};

const STATUS_ICONS = {
  pending: Clock,
  reviewed: Eye,
  shortlisted: Star,
  rejected: XCircle,
  hired: CheckCircle,
};

// ── All components outside to prevent remount ──

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="bg-white border border-[#E7E7F5] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 font-[family-name:var(--font-epilogue)] font-bold text-[12px] px-2 py-1 rounded-full
                           ${trend > 0 ? "bg-[#E8F9F0] text-[#56CDAD]" : "bg-[#F4F4F6] text-[#A8ADB7]"}`}
          >
            <ArrowUpRight size={11} className={trend > 0 ? "" : "rotate-180"} />
            {Math.abs(trend)} today
          </span>
        )}
      </div>
      <p className="font-[family-name:var(--font-epilogue)] font-extrabold text-[28px] text-[#25324B] leading-none mb-1">
        {value?.toLocaleString() ?? "—"}
      </p>
      <p className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#515B6F]">
        {label}
      </p>
      {sub && (
        <p className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7] mt-0.5">
          {sub}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-[#25324B]">
        {title}
      </h2>
      {subtitle && (
        <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#A8ADB7] mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E7E7F5] rounded-xl shadow-lg px-4 py-3">
      <p className="font-[family-name:var(--font-epilogue)] font-bold text-[13px] text-[#25324B] mb-1">
        {label}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          className="font-[family-name:var(--font-epilogue)] text-[13px]"
          style={{ color: p.color }}
        >
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────
export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/admin/stats?role=admin`);
        const data = await res.json();
        if (data.success) setStats(data.stats);
        else setError("Failed to load analytics");
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2
            size={36}
            className="animate-spin text-[#4640DE] mx-auto mb-4"
          />
          <p className="font-[family-name:var(--font-epilogue)] text-[#7C8493]">
            Loading analytics…
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF4F3] flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={26} className="text-[#FF6550]" />
          </div>
          <p className="font-[family-name:var(--font-epilogue)] font-bold text-[#25324B]">
            {error || "No data"}
          </p>
        </div>
      </div>
    );
  }

  // ── Derived chart data ──
  const applicationStatusData = (stats.applicationsByStatus || []).map((s) => ({
    name: s.status?.charAt(0).toUpperCase() + s.status?.slice(1),
    value: s.count,
    color: STATUS_COLORS[s.status] || "#A8ADB7",
  }));

  const categoryData = (stats.topCategories || []).map((c) => ({
    name: c.category,
    jobs: c.count,
  }));

  // Build application status bar data for overview
  const statusBarData = [
    "pending",
    "reviewed",
    "shortlisted",
    "hired",
    "rejected",
  ].map((s) => {
    const found = stats.applicationsByStatus?.find((a) => a.status === s);
    return {
      name: s.charAt(0).toUpperCase() + s.slice(1),
      count: found?.count || 0,
      color: STATUS_COLORS[s],
    };
  });

  const totalApplications = applicationStatusData.reduce(
    (sum, s) => sum + s.value,
    0,
  );
  const hiredCount =
    stats.applicationsByStatus?.find((s) => s.status === "hired")?.count || 0;
  const conversionRate =
    totalApplications > 0
      ? ((hiredCount / totalApplications) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[26px] text-[#25324B]">
          Analytics
        </h1>
        <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493] mt-0.5">
          Overview of your platform performance
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Total Jobs"
          value={stats.totalJobs}
          sub="All active listings"
          color="#4640DE"
          trend={stats.newJobsToday}
        />
        <StatCard
          icon={Users}
          label="Applications"
          value={stats.totalApplications}
          sub="All time submissions"
          color="#56CDAD"
          trend={stats.newApplicationsToday}
        />
        <StatCard
          icon={Building2}
          label="Companies"
          value={stats.totalCompanies}
          sub="Unique companies hiring"
          color="#FFB836"
        />
        <StatCard
          icon={TrendingUp}
          label="Hire Rate"
          value={`${conversionRate}%`}
          sub={`${hiredCount} hired of ${totalApplications}`}
          color="#7B61FF"
        />
      </div>

      {/* ── Today's activity strip ── */}
      <div className="bg-[#25324B] rounded-2xl px-6 py-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <p className="font-[family-name:var(--font-epilogue)] font-bold text-[13px] text-white/50 uppercase tracking-wide mb-3 relative z-10">
          Today's Activity
        </p>
        <div className="flex gap-8 relative z-10 flex-wrap">
          <div>
            <p className="font-[family-name:var(--font-epilogue)] font-extrabold text-[32px] text-white leading-none">
              {stats.newJobsToday}
            </p>
            <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-white/60 mt-0.5">
              New Jobs Posted
            </p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="font-[family-name:var(--font-epilogue)] font-extrabold text-[32px] text-[#56CDAD] leading-none">
              {stats.newApplicationsToday}
            </p>
            <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-white/60 mt-0.5">
              New Applications
            </p>
          </div>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application status bar chart */}
        <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <SectionTitle
            title="Application Status Breakdown"
            subtitle="Distribution across all stages"
          />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusBarData} barSize={32}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F4F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontFamily: "inherit", fontSize: 12, fill: "#A8ADB7" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: "inherit", fontSize: 12, fill: "#A8ADB7" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application status donut */}
        <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <SectionTitle
            title="Status Distribution"
            subtitle="Percentage share by status"
          />
          {applicationStatusData.length === 0 ? (
            <div className="flex items-center justify-center h-[220px]">
              <p className="font-[family-name:var(--font-epilogue)] text-[#A8ADB7] text-[14px]">
                No application data yet
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {applicationStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {applicationStatusData.map((s) => {
                  const pct =
                    totalApplications > 0
                      ? ((s.value / totalApplications) * 100).toFixed(0)
                      : 0;
                  const Icon = STATUS_ICONS[s.name?.toLowerCase()] || Clock;
                  return (
                    <div key={s.name} className="flex items-center gap-2.5">
                      <Icon
                        size={13}
                        style={{ color: s.color }}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-[family-name:var(--font-epilogue)] text-[12px] font-semibold text-[#515B6F]">
                            {s.name}
                          </span>
                          <span className="font-[family-name:var(--font-epilogue)] text-[12px] font-bold text-[#25324B]">
                            {s.value}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#F4F4F6] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: s.color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Top categories bar chart ── */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <SectionTitle
          title="Jobs by Category"
          subtitle="Top 5 categories with most listings"
        />
        {categoryData.length === 0 ? (
          <div className="flex items-center justify-center h-[240px]">
            <p className="font-[family-name:var(--font-epilogue)] text-[#A8ADB7] text-[14px]">
              No category data yet
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} layout="vertical" barSize={22}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F4F4F6"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontFamily: "inherit", fontSize: 12, fill: "#A8ADB7" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontFamily: "inherit", fontSize: 12, fill: "#515B6F" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="jobs"
                fill="#4640DE"
                radius={[0, 6, 6, 0]}
                name="Jobs"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Summary table ── */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="px-6 py-5 border-b border-[#F4F4F6]">
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-[#25324B]">
            Application Summary
          </h2>
          <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#A8ADB7] mt-0.5">
            Detailed breakdown by status
          </p>
        </div>
        <div className="divide-y divide-[#F4F4F6]">
          {["pending", "reviewed", "shortlisted", "hired", "rejected"].map(
            (s) => {
              const found = stats.applicationsByStatus?.find(
                (a) => a.status === s,
              );
              const count = found?.count || 0;
              const pct =
                totalApplications > 0
                  ? ((count / totalApplications) * 100).toFixed(1)
                  : 0;
              const style = STATUS_STYLES_MAP[s];
              const Icon = STATUS_ICONS[s] || Clock;
              return (
                <div key={s} className="flex items-center gap-4 px-6 py-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${STATUS_COLORS[s]}18` }}
                  >
                    <Icon size={16} style={{ color: STATUS_COLORS[s] }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#25324B] capitalize">
                        {s}
                      </span>
                      <span className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#25324B]">
                        {count}{" "}
                        <span className="font-normal text-[#A8ADB7] text-[12px]">
                          ({pct}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 bg-[#F4F4F6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: STATUS_COLORS[s],
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
        <div className="px-6 py-4 bg-[#F8F8FD] border-t border-[#F4F4F6] flex items-center justify-between">
          <span className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#25324B]">
            Total
          </span>
          <span className="font-[family-name:var(--font-epilogue)] font-extrabold text-[16px] text-[#4640DE]">
            {totalApplications}
          </span>
        </div>
      </div>
    </div>
  );
}

// needed for summary table rows (inline reference)
const STATUS_STYLES_MAP = {
  pending: { bg: "#FFF8E6", text: "#FFB836" },
  reviewed: { bg: "#EEF9FF", text: "#26A4FF" },
  shortlisted: { bg: "#F0EFFE", text: "#7B61FF" },
  rejected: { bg: "#FFE9E9", text: "#FF6550" },
  hired: { bg: "#E8F9F0", text: "#56CDAD" },
};
