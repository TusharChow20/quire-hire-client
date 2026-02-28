"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase, Users, Building2, TrendingUp, ArrowRight,
  Star, Clock, CheckCircle, XCircle, Eye
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { adminFetchStats, adminFetchGrowth } from "@/lib/api";
import StatusBadge from "@/component/StatusBadge";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#D6DDEB] rounded-lg p-3 shadow-lg text-[12px] font-[family-name:var(--font-epilogue)]">
      <p className="font-bold text-[#25324B] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function AdminOverview() {
  const { data: session }   = useSession();
  const [stats, setStats]   = useState(null);
  const [growth, setGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminFetchStats(), adminFetchGrowth(30)]).then(([s, g]) => {
      if (s.success) setStats(s.stats);
      if (g.success) {
        // Merge job & application growth by date
        const merged = g.jobGrowth.map((d) => {
          const appDay = g.applicationGrowth.find((a) => a.date === d.date);
          return {
            date: d.date.slice(5), // "MM-DD"
            Jobs: d.count,
            Applications: appDay?.count || 0,
          };
        });
        setGrowth(merged);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { label: "Total Jobs",           value: stats?.totalJobs,         icon: <Briefcase  size={20} />, color: "#4640DE", bg: "#F1F0FF",  link: "/dashboard/jobs"         },
    { label: "Total Applications",   value: stats?.totalApplications, icon: <Users      size={20} />, color: "#10B981", bg: "#ECFDF5",  link: "/dashboard/applications" },
    { label: "Total Companies",      value: stats?.totalCompanies,    icon: <Building2  size={20} />, color: "#F59E0B", bg: "#FFF7E6",  link: null                      },
    { label: "New Apps Today",       value: stats?.newApplicationsToday, icon: <TrendingUp size={20} />, color: "#FF6550", bg: "#FFE9E9", link: null                    },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-extrabold text-[28px] text-[#25324B] font-[family-name:var(--font-epilogue)]">
          Admin Dashboard 🛠️
        </h1>
        <p className="text-[#7C8493] text-[15px] mt-1 font-[family-name:var(--font-epilogue)]">
          Manage jobs, applications, and track platform growth.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, color, bg, link }) => {
          const inner = (
            <div className="bg-white rounded-xl border border-[#D6DDEB] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: bg, color }}>
                  {icon}
                </div>
                {link && <ArrowRight size={14} className="text-[#D6DDEB]" />}
              </div>
              <p className="font-extrabold text-[28px] text-[#25324B] font-[family-name:var(--font-epilogue)]">{value ?? "—"}</p>
              <p className="text-[13px] text-[#7C8493] font-[family-name:var(--font-epilogue)]">{label}</p>
            </div>
          );
          return link
            ? <Link key={label} href={link}>{inner}</Link>
            : <div key={label}>{inner}</div>;
        })}
      </div>

      {/* Growth chart */}
      <div className="bg-white rounded-xl border border-[#D6DDEB] p-6">
        <h2 className="font-bold text-[17px] text-[#25324B] mb-1 font-[family-name:var(--font-epilogue)]">Growth — Last 30 Days</h2>
        <p className="text-[13px] text-[#7C8493] mb-6 font-[family-name:var(--font-epilogue)]">Jobs posted vs. applications received</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={growth} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4640DE" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4640DE" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#26A4FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#26A4FF" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7C8493", fontFamily: "Epilogue" }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 11, fill: "#7C8493", fontFamily: "Epilogue" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", fontFamily: "Epilogue" }} />
            <Area type="monotone" dataKey="Jobs"         stroke="#4640DE" strokeWidth={2} fill="url(#colorJobs)" dot={false} />
            <Area type="monotone" dataKey="Applications" stroke="#26A4FF" strokeWidth={2} fill="url(#colorApps)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Applications by status + Top categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application statuses */}
        <div className="bg-white rounded-xl border border-[#D6DDEB] p-6">
          <h2 className="font-bold text-[17px] text-[#25324B] mb-4 font-[family-name:var(--font-epilogue)]">Applications by Status</h2>
          <div className="space-y-3">
            {(stats?.applicationsByStatus || []).map(({ status, count }) => {
              const total   = stats?.totalApplications || 1;
              const pct     = Math.round((count / total) * 100);
              const colors  = { pending: "#F59E0B", reviewed: "#3B82F6", shortlisted: "#10B981", rejected: "#EF4444" };
              return (
                <div key={status}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] font-semibold text-[#25324B] capitalize font-[family-name:var(--font-epilogue)]">{status}</span>
                    <span className="text-[13px] text-[#7C8493] font-[family-name:var(--font-epilogue)]">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: colors[status] || "#7C8493" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top categories */}
        <div className="bg-white rounded-xl border border-[#D6DDEB] p-6">
          <h2 className="font-bold text-[17px] text-[#25324B] mb-4 font-[family-name:var(--font-epilogue)]">Top Job Categories</h2>
          <div className="space-y-3">
            {(stats?.topCategories || []).map(({ category, count }, i) => (
              <div key={category} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F1F0FF] text-[#4640DE] text-[11px] font-bold flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-epilogue)]">
                  {i + 1}
                </span>
                <span className="flex-1 text-[14px] text-[#25324B] font-[family-name:var(--font-epilogue)]">{category}</span>
                <span className="text-[13px] font-bold text-[#4640DE] font-[family-name:var(--font-epilogue)]">{count} jobs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-xl border border-[#D6DDEB] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6DDEB]">
          <h2 className="font-bold text-[17px] text-[#25324B] font-[family-name:var(--font-epilogue)]">Recent Applications</h2>
          <Link href="/dashboard/applications" className="text-[13px] text-[#4640DE] font-semibold flex items-center gap-1 font-[family-name:var(--font-epilogue)]">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {(stats?.recentApplications || []).map((app) => (
          <div key={app._id} className="flex items-center gap-4 px-6 py-4 border-b border-[#F8F8FD] last:border-0">
            <div className="w-9 h-9 rounded-full bg-[#F1F0FF] flex items-center justify-center text-[#4640DE] font-bold flex-shrink-0">
              {app.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] text-[#25324B] truncate font-[family-name:var(--font-epilogue)]">{app.name}</p>
              <p className="text-[12px] text-[#7C8493] font-[family-name:var(--font-epilogue)]">{app.email}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>
        ))}
      </div>
    </div>
  );
}