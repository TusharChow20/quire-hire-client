"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const TAG_STYLES = {
  "Full-Time": { bg: "#E8F9F0", text: "#56CDAD" },
  "Full Time": { bg: "#E8F9F0", text: "#56CDAD" },
  Marketing: { bg: "#FFF0E6", text: "#FFB836" },
  Design: { bg: "#F0EFFE", text: "#7B61FF" },
  Developer: { bg: "#F0EFFE", text: "#7B61FF" },
  Management: { bg: "#F0EFFE", text: "#7B61FF" },
  Business: { bg: "#F0EFFE", text: "#7B61FF" },
  Technology: { bg: "#FFE9E9", text: "#FF6550" },
};

function JobLogo({ logo, company }) {
  return (
    <div className="w-12 h-12 rounded-lg border border-[#F0F0F0] bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
      {logo ? (
        <img
          src={logo}
          alt={company}
          width={48}
          height={48}
          className="object-contain p-1 w-full h-full"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <span
        className="w-full h-full items-center justify-center font-bold text-[18px] text-[#4640DE] bg-[#F1F0FF]"
        style={{ display: logo ? "none" : "flex" }}
      >
        {company?.[0]?.toUpperCase()}
      </span>
    </div>
  );
}

function LatestJobRow({ job }) {
  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group flex items-center gap-5
                 bg-white border-b border-[#D6DDEB] last:border-b-0
                 px-6 py-5 hover:bg-[#F8F8FD] transition-colors duration-200"
    >
      <JobLogo logo={job.logo} company={job.company} />

      <div className="flex-1 min-w-0">
        <h3
          className="font-[family-name:var(--font-epilogue)] font-bold text-[17px]
                       text-[#25324B] mb-0.5 group-hover:text-[#4640DE] transition-colors duration-200"
        >
          {job.title}
        </h3>
        <p
          className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#515B6F]
                      flex items-center gap-1.5 mb-3"
        >
          <span>{job.company}</span>
          <span className="w-1 h-1 rounded-full bg-[#D6DDEB] inline-block" />
          <MapPin size={12} className="flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {[job.type, ...(job.tags || [])].slice(0, 3).map((tag) => {
            const s = TAG_STYLES[tag] || { bg: "#F0F0F0", text: "#666" };
            return (
              <span
                key={tag}
                className="font-[family-name:var(--font-epilogue)] font-semibold text-[12px]
                           px-3 py-1 rounded-full border"
                style={{ background: s.bg, color: s.text, borderColor: s.text }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      <ArrowRight
        size={18}
        className="text-[#D6DDEB] group-hover:text-[#4640DE] transition-colors duration-200 flex-shrink-0"
      />
    </Link>
  );
}

function LatestJobCard({ job }) {
  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group block bg-white border border-[#D6DDEB] rounded-xl px-5 py-5
                 hover:border-[#4640DE] hover:shadow-[0_4px_20px_rgba(70,64,222,0.1)]
                 transition-all duration-200"
    >
      <div className="mb-3">
        <JobLogo logo={job.logo} company={job.company} />
      </div>
      <h3
        className="font-[family-name:var(--font-epilogue)] font-bold text-[17px]
                     text-[#25324B] mb-1 group-hover:text-[#4640DE] transition-colors duration-200"
      >
        {job.title}
      </h3>
      <p
        className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#515B6F]
                    flex items-center gap-1.5 mb-3"
      >
        <span>{job.company}</span>
        <span className="w-1 h-1 rounded-full bg-[#D6DDEB] inline-block" />
        <span>{job.location}</span>
      </p>
      <div className="flex flex-wrap gap-1">
        {[job.type, ...(job.tags || [])].slice(0, 3).map((tag) => {
          const s = TAG_STYLES[tag] || { bg: "#F0F0F0", text: "#666" };
          return (
            <span
              key={tag}
              className="font-[family-name:var(--font-epilogue)] font-semibold text-[10px] sm:text-[12px]
                         px-2 py-1 rounded-full border"
              style={{ background: s.bg, color: s.text, borderColor: s.text }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-5 bg-white border-b border-[#D6DDEB] px-6 py-5 animate-pulse">
      <div className="w-12 h-12 bg-[#F0F0F0] rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-[#F0F0F0] rounded mb-2 w-1/2" />
        <div className="h-3 bg-[#F0F0F0] rounded mb-3 w-1/3" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-[#F0F0F0] rounded-full" />
          <div className="h-6 w-14 bg-[#F0F0F0] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function LatestJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/latest?limit=8`,
        );
        const data = await res.json();
        if (data.success) setJobs(data.jobs);
      } catch (err) {
        console.error("Failed to fetch latest jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const leftJobs = jobs.filter((_, i) => i % 2 === 0);
  const rightJobs = jobs.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative bg-[#F8F8FD] sm:py-10 overflow-hidden">
      <div
        className="absolute -top-[1px] -left-[1px] w-[72px] h-[62px] bg-white hidden lg:block"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-10 sm:mb-12">
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[28px] sm:text-[32px] text-[#25324B]">
            Latest <span className="text-[#26A4FF]">jobs open</span>
          </h2>
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]
                       font-semibold text-[15px] text-[#4640DE] hover:underline"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>

        {/* Desktop 2-column grid */}
        <div className="hidden sm:grid grid-cols-2 gap-6">
          <div className="space-y-3 overflow-hidden">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
              : leftJobs.map((job) => <LatestJobRow key={job._id} job={job} />)}
          </div>
          <div className="space-y-3 overflow-hidden">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
              : rightJobs.map((job) => (
                  <LatestJobRow key={job._id} job={job} />
                ))}
          </div>
        </div>

        {/* Mobile list */}
        <div className="sm:hidden flex flex-col gap-4">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#D6DDEB] rounded-xl px-5 py-5 animate-pulse"
                >
                  <div className="w-12 h-12 bg-[#F0F0F0] rounded-lg mb-3" />
                  <div className="h-4 bg-[#F0F0F0] rounded mb-2 w-1/2" />
                  <div className="h-3 bg-[#F0F0F0] rounded w-1/3" />
                </div>
              ))
            : jobs.map((job) => <LatestJobCard key={job._id} job={job} />)}
        </div>

        {!loading && jobs.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[#7C8493] font-[family-name:var(--font-epilogue)]">
              No jobs found yet.
            </p>
          </div>
        )}

        <div className="sm:hidden mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]
                       font-semibold text-[15px] text-[#4640DE]"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
