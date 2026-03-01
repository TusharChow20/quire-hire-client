"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const TAG_STYLES = {
  Marketing: { bg: "#FFF0E6", text: "#FFB836" },
  Design: { bg: "#E8F9F0", text: "#56CDAD" },
  Business: { bg: "#EEF0FF", text: "#7B61FF" },
  Technology: { bg: "#FFE9E9", text: "#FF6550" },
  Developer: { bg: "#EEF0FF", text: "#7B61FF" },
  Management: { bg: "#F0EFFE", text: "#7B61FF" },
};

function JobLogo({ logo, company }) {
  return (
    <div className="w-11 h-11 rounded-lg border border-[#F0F0F0] bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
      {logo ? (
        <img
          src={logo}
          alt={company}
          width={44}
          height={44}
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

function JobCard({ job }) {
  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group block bg-white border border-[#D6DDEB] rounded-xl p-6
                 hover:border-[#4640DE] hover:shadow-[0_8px_30px_rgba(70,64,222,0.12)]
                 transition-all duration-200 ease-in-out hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-5">
        <JobLogo logo={job.logo} company={job.company} />
        <span className="text-[#4640DE] border border-[#4640DE] rounded px-3 py-1 text-[13px] font-semibold flex-shrink-0 font-[family-name:var(--font-epilogue)]">
          {job.type}
        </span>
      </div>

      <h3
        className="font-bold text-[18px] text-[#25324B] mb-1.5 group-hover:text-[#4640DE]
                     transition-colors duration-200 font-[family-name:var(--font-epilogue)]"
      >
        {job.title}
      </h3>

      <p className="text-[14px] text-[#515B6F] mb-4 flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]">
        <span>{job.company}</span>
        <span className="w-1 h-1 rounded-full bg-[#D6DDEB] inline-block flex-shrink-0" />
        <MapPin size={12} className="flex-shrink-0" />
        <span className="truncate">{job.location}</span>
      </p>

      <p className="text-[14px] text-[#7C8493] leading-[1.65] mb-5 line-clamp-2 font-[family-name:var(--font-epilogue)]">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {(job.tags || []).slice(0, 3).map((tag) => {
          const style = TAG_STYLES[tag] || { bg: "#F0F0F0", text: "#666" };
          return (
            <span
              key={tag}
              className="font-semibold text-[13px] px-3 py-1 rounded-full font-[family-name:var(--font-epilogue)]"
              style={{ background: style.bg, color: style.text }}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#D6DDEB] rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="w-11 h-11 bg-[#F0F0F0] rounded-lg" />
        <div className="w-20 h-7 bg-[#F0F0F0] rounded" />
      </div>
      <div className="h-5 bg-[#F0F0F0] rounded mb-2 w-3/4" />
      <div className="h-4 bg-[#F0F0F0] rounded mb-5 w-1/2" />
      <div className="h-4 bg-[#F0F0F0] rounded mb-1 w-full" />
      <div className="h-4 bg-[#F0F0F0] rounded mb-5 w-4/5" />
      <div className="flex gap-2">
        <div className="h-7 w-20 bg-[#F0F0F0] rounded-full" />
        <div className="h-7 w-16 bg-[#F0F0F0] rounded-full" />
      </div>
    </div>
  );
}

export default function FeaturedJobs() {
  const swiperElRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/featured?limit=8`,
        );
        const data = await res.json();
        if (data.success) setJobs(data.jobs);
      } catch (err) {
        console.error("Failed to fetch featured jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || loading) return;
    const initMobileSwiper = async () => {
      if (window.innerWidth >= 640) return;
      const { register } = await import("swiper/element/bundle");
      register();
      const swiperEl = swiperElRef.current;
      if (!swiperEl) return;
      Object.assign(swiperEl, {
        slidesPerView: 1.12,
        spaceBetween: 14,
        grabCursor: true,
        loop: true,
        autoplay: { delay: 2500, disableOnInteraction: false },
      });
      swiperEl.initialize();
    };
    initMobileSwiper();
  }, [loading]);

  return (
    <section className="bg-white  ">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-10 sm:mb-12">
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[28px] sm:text-[32px] text-[#25324B]">
            Featured <span className="text-[#26A4FF]">jobs</span>
          </h2>
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-[15px]
                       text-[#4640DE] hover:underline font-[family-name:var(--font-epilogue)]"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : jobs.length === 0 ? (
            <div className="col-span-4 py-16 text-center">
              <p className="text-[#7C8493] font-[family-name:var(--font-epilogue)]">
                No featured jobs yet.
              </p>
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          )}
        </div>

        {/* Mobile swiper */}
        {!loading && jobs.length > 0 && (
          <div className="sm:hidden -mx-6 px-6">
            <swiper-container
              ref={swiperElRef}
              init="false"
              slides-per-view="1.22"
              space-between="14"
              grab-cursor="true"
              pagination="true"
              pagination-clickable="true"
            >
              {jobs.map((job) => (
                <swiper-slide key={job._id}>
                  <div className="pb-10">
                    <JobCard job={job} />
                  </div>
                </swiper-slide>
              ))}
            </swiper-container>
          </div>
        )}

        {loading && (
          <div className="sm:hidden flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 font-semibold text-[15px]
                       text-[#4640DE] font-[family-name:var(--font-epilogue)]"
          >
            Show all jobs <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
