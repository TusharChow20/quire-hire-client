"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  Bookmark,
  Clock,
  CheckCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { fetchUserApplications, fetchBookmarks } from "@/lib/api";
import StatusBadge from "@/component/StatusBadge";

export default function UserOverview() {
  const { data: session } = useSession();
  const [applications, setApps] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    Promise.all([
      fetchUserApplications(session.user.email),
      fetchBookmarks(session.user.id),
    ]).then(([appsData, bmData]) => {
      if (appsData.success) setApps(appsData.applications || []);
      if (bmData.success) setBookmarks(bmData.bookmarks || []);
      setLoading(false);
    });
  }, [session]);

  const stats = [
    {
      label: "Applications",
      value: applications.length,
      icon: <Briefcase size={20} />,
      color: "#4640DE",
      bg: "#F1F0FF",
    },
    {
      label: "Saved Jobs",
      value: bookmarks.length,
      icon: <Bookmark size={20} />,
      color: "#10B981",
      bg: "#ECFDF5",
    },
    {
      label: "In Review",
      value: applications.filter((a) => a.status === "reviewed").length,
      icon: <Clock size={20} />,
      color: "#F59E0B",
      bg: "#FFF7E6",
    },
    {
      label: "Shortlisted",
      value: applications.filter((a) => a.status === "shortlisted").length,
      icon: <CheckCircle size={20} />,
      color: "#56CDAD",
      bg: "#E8F9F0",
    },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-extrabold text-[28px] text-[#25324B] font-[family-name:var(--font-epilogue)]">
          Hello, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-[#7C8493] text-[15px] mt-1 font-[family-name:var(--font-epilogue)]">
          Here's what's happening with your job search.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-[#D6DDEB] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: bg, color }}
              >
                {icon}
              </div>
            </div>
            <p className="font-extrabold text-[28px] text-[#25324B] font-[family-name:var(--font-epilogue)]">
              {value}
            </p>
            <p className="text-[13px] text-[#7C8493] font-[family-name:var(--font-epilogue)]">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-[#D6DDEB] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6DDEB]">
          <h2 className="font-bold text-[17px] text-[#25324B] font-[family-name:var(--font-epilogue)]">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/applications"
            className="text-[13px] text-[#4640DE] font-semibold flex items-center gap-1 font-[family-name:var(--font-epilogue)]"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center">
            <Briefcase size={32} className="text-[#D6DDEB] mx-auto mb-3" />
            <p className="text-[#7C8493] text-[15px] font-[family-name:var(--font-epilogue)]">
              No applications yet.
            </p>
            <Link
              href="/jobs"
              className="mt-3 inline-block text-[#4640DE] text-[14px] font-semibold font-[family-name:var(--font-epilogue)]"
            >
              Browse jobs →
            </Link>
          </div>
        ) : (
          <div>
            {applications.slice(0, 5).map((app) => (
              <div
                key={app._id}
                className="flex items-center gap-4 px-6 py-4 border-b border-[#F8F8FD] last:border-0 hover:bg-[#F8F8FD] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F1F0FF] flex items-center justify-center text-[#4640DE] font-bold flex-shrink-0">
                  {app.job?.company?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-[#25324B] truncate font-[family-name:var(--font-epilogue)]">
                    {app.job?.title || "Job"}
                  </p>
                  <p className="text-[12px] text-[#7C8493] flex items-center gap-1 font-[family-name:var(--font-epilogue)]">
                    <MapPin size={11} /> {app.job?.company} ·{" "}
                    {app.job?.location}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved jobs preview */}
      <div className="bg-white rounded-xl border border-[#D6DDEB] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6DDEB]">
          <h2 className="font-bold text-[17px] text-[#25324B] font-[family-name:var(--font-epilogue)]">
            Saved Jobs
          </h2>
          <Link
            href="/dashboard/saved"
            className="text-[13px] text-[#4640DE] font-semibold flex items-center gap-1 font-[family-name:var(--font-epilogue)]"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {bookmarks.length === 0 ? (
          <div className="py-12 text-center">
            <Bookmark size={32} className="text-[#D6DDEB] mx-auto mb-3" />
            <p className="text-[#7C8493] text-[15px] font-[family-name:var(--font-epilogue)]">
              No saved jobs yet.
            </p>
            <Link
              href="/jobs"
              className="mt-3 inline-block text-[#4640DE] text-[14px] font-semibold font-[family-name:var(--font-epilogue)]"
            >
              Browse jobs →
            </Link>
          </div>
        ) : (
          <div>
            {bookmarks.slice(0, 3).map((b) => (
              <Link
                key={b._id}
                href={`/jobs/${b.job_id}`}
                className="flex items-center gap-4 px-6 py-4 border-b border-[#F8F8FD] last:border-0 hover:bg-[#F8F8FD] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F1F0FF] flex items-center justify-center text-[#4640DE] font-bold flex-shrink-0">
                  {b.job?.company?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-[#25324B] group-hover:text-[#4640DE] truncate font-[family-name:var(--font-epilogue)]">
                    {b.job?.title}
                  </p>
                  <p className="text-[12px] text-[#7C8493] font-[family-name:var(--font-epilogue)]">
                    {b.job?.company} · {b.job?.location}
                  </p>
                </div>
                <ArrowRight
                  size={15}
                  className="text-[#D6DDEB] group-hover:text-[#4640DE] flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
