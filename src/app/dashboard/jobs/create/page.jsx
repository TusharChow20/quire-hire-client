"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  ArrowLeft,
  Plus,
  X,
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Tag,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
  Star,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Design",
  "Engineering",
  "Marketing",
  "Technology",
  "Business",
  "Finance",
  "Human Resource",
  "Sales",
  "Customer Service",
  "Operations",
];
const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Remote",
  "Internship",
  "Contract",
];
const CURRENCIES = ["USD", "EUR", "GBP", "CHF", "CAD", "AUD"];
const AVAILABLE_TAGS = [
  "Design",
  "Marketing",
  "Developer",
  "Technology",
  "Business",
  "Finance",
  "Management",
  "Sales",
  "Remote",
  "Startup",
];

export default function CreateJobPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      type: "Full Time",
      salary_currency: "USD",
      isFeatured: false,
      requirements: [{ value: "" }],
    },
  });
  const watchedType = useWatch({ control, name: "type" });
  const watchedFeatured = useWatch({ control, name: "isFeatured" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  });

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const payload = {
        ...data,
        tags: selectedTags,
        requirements: data.requirements.map((r) => r.value).filter(Boolean),
        salary_min: data.salary_min ? parseInt(data.salary_min) : null,
        salary_max: data.salary_max ? parseInt(data.salary_max) : null,
        isFeatured: !!data.isFeatured,
      };

      const res = await fetch(`${API}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/jobs"), 1800);
      } else {
        setServerError(json.message || "Failed to create job.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    }
  };

  // ── Shared helpers ─────────────────────────────────────────────────
  const inputCls = (hasErr) =>
    `w-full px-4 py-3 border rounded-xl font-[family-name:var(--font-epilogue)] text-[14px]
     text-[#25324B] placeholder:text-[#A8ADB7] bg-white focus:outline-none focus:ring-2
     transition-all duration-200 ${
       hasErr
         ? "border-red-400 focus:border-red-400 focus:ring-red-100"
         : "border-[#D6DDEB] focus:border-[#4640DE] focus:ring-[#4640DE]/10"
     }`;

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#F4F4F6]">
        <div className="w-8 h-8 rounded-lg bg-[#F1F0FF] flex items-center justify-center">
          <Icon size={16} className="text-[#4640DE]" />
        </div>
        <h2 className="font-[family-name:var(--font-epilogue)] font-bold text-[16px] text-[#25324B]">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  const ErrMsg = ({ err }) =>
    err ? (
      <p className="mt-1.5 flex items-center gap-1 font-[family-name:var(--font-epilogue)] text-[12px] text-[#FF6550]">
        <AlertCircle size={11} />
        {err.message}
      </p>
    ) : null;

  // ── Success screen ─────────────────────────────────────────────────
  if (success)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8F9F0] flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={36} className="text-[#56CDAD]" />
          </div>
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[24px] text-[#25324B] mb-2">
            Job Posted!
          </h2>
          <p className="font-[family-name:var(--font-epilogue)] text-[#7C8493] text-[15px]">
            Redirecting to manage jobs…
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-[760px] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/jobs"
          className="w-9 h-9 rounded-xl border border-[#D6DDEB] flex items-center justify-center text-[#515B6F] hover:border-[#4640DE] hover:text-[#4640DE] transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[24px] text-[#25324B]">
            Post New Job
          </h1>
          <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#7C8493]">
            Fill in the details to create a listing
          </p>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="flex items-start gap-3 bg-[#FFF4F3] border border-[#FFD5D0] rounded-xl p-4">
          <AlertCircle
            size={16}
            className="text-[#FF6550] flex-shrink-0 mt-0.5"
          />
          <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#FF6550]">
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* ── Basic Info ────────────────────────────────────────────── */}
        <Section title="Basic Information" icon={Briefcase}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Job Title <span className="text-[#FF6550]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Product Designer"
                {...register("title", { required: "Job title is required" })}
                className={inputCls(errors.title)}
              />
              <ErrMsg err={errors.title} />
            </div>

            {/* Company */}
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Company <span className="text-[#FF6550]">*</span>
              </label>
              <div className="relative">
                <Building2
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="e.g. Airbnb"
                  {...register("company", { required: "Company is required" })}
                  className={`${inputCls(errors.company)} pl-10`}
                />
              </div>
              <ErrMsg err={errors.company} />
            </div>

            {/* Location */}
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Location <span className="text-[#FF6550]">*</span>
              </label>
              <div className="relative">
                <MapPin
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="e.g. San Francisco, US"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={`${inputCls(errors.location)} pl-10`}
                />
              </div>
              <ErrMsg err={errors.location} />
            </div>

            {/* Category */}
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Category <span className="text-[#FF6550]">*</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`${inputCls(errors.category)} cursor-pointer`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ErrMsg err={errors.category} />
            </div>

            {/* Job Type */}
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Job Type <span className="text-[#FF6550]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((type) => {
                  const active = watchedType === type;
                  return (
                    <label key={type} className="cursor-pointer">
                      <input
                        type="radio"
                        value={type}
                        {...register("type")}
                        className="sr-only"
                      />
                      <span
                        className={`inline-block font-[family-name:var(--font-epilogue)] font-semibold text-[13px] px-3.5 py-2 rounded-xl border-2 transition-all duration-200 ${
                          active
                            ? "bg-[#4640DE] text-white border-[#4640DE]"
                            : "bg-white text-[#515B6F] border-[#D6DDEB] hover:border-[#4640DE] hover:text-[#4640DE]"
                        }`}
                      >
                        {type}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Logo URL */}
            <div className="sm:col-span-2">
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Company Logo URL{" "}
                <span className="font-normal text-[#A8ADB7]">(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://logo.clearbit.com/company.com"
                {...register("logo")}
                className={inputCls(false)}
              />
              <p className="mt-1 font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7]">
                Tip:{" "}
                <span className="text-[#4640DE]">
                  https://logo.clearbit.com/yourcompany.com
                </span>
              </p>
            </div>
          </div>
        </Section>

        {/* ── Description & Requirements ────────────────────────────── */}
        <Section title="Description & Requirements" icon={FileText}>
          <div className="space-y-5">
            {/* Description */}
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Job Description <span className="text-[#FF6550]">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting…"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 50,
                    message: "Must be at least 50 characters",
                  },
                })}
                className={`${inputCls(errors.description)} resize-none`}
              />
              <ErrMsg err={errors.description} />
            </div>

            {/* Requirements */}
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-2">
                Requirements
              </label>
              <div className="space-y-2.5">
                {fields.map((field, i) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#E8F9F0] flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={11} className="text-[#56CDAD]" />
                    </div>
                    <input
                      type="text"
                      placeholder={`Requirement ${i + 1}`}
                      {...register(`requirements.${i}.value`)}
                      className="flex-1 px-3.5 py-2.5 border border-[#D6DDEB] rounded-xl font-[family-name:var(--font-epilogue)] text-[14px] text-[#25324B] placeholder:text-[#A8ADB7] focus:outline-none focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/10 transition-all"
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A8ADB7] hover:text-[#FF6550] hover:bg-[#FFF4F3] transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="mt-3 flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#4640DE] hover:underline"
              >
                <Plus size={14} /> Add requirement
              </button>
            </div>
          </div>
        </Section>

        {/* ── Salary ───────────────────────────────────────────────── */}
        <Section title="Salary & Compensation" icon={DollarSign}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Min Salary
              </label>
              <input
                type="number"
                placeholder="60000"
                {...register("salary_min", {
                  min: { value: 0, message: "Must be positive" },
                })}
                className={inputCls(errors.salary_min)}
              />
              <ErrMsg err={errors.salary_min} />
            </div>
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Max Salary
              </label>
              <input
                type="number"
                placeholder="90000"
                {...register("salary_max", {
                  min: { value: 0, message: "Must be positive" },
                })}
                className={inputCls(errors.salary_max)}
              />
              <ErrMsg err={errors.salary_max} />
            </div>
            <div>
              <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-1.5">
                Currency
              </label>
              <select
                {...register("salary_currency")}
                className={`${inputCls(false)} cursor-pointer`}
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* ── Tags & Settings ──────────────────────────────────────── */}
        <Section title="Tags & Settings" icon={Tag}>
          {/* Tags */}
          <div className="mb-5">
            <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px] text-[#25324B] block mb-2">
              Tags{" "}
              <span className="font-normal text-[#A8ADB7]">
                (click to select)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`font-[family-name:var(--font-epilogue)] font-semibold text-[13px] px-3.5 py-1.5 rounded-full border-2 transition-all duration-200 ${
                      active
                        ? "bg-[#4640DE] text-white border-[#4640DE]"
                        : "bg-white text-[#515B6F] border-[#D6DDEB] hover:border-[#4640DE] hover:text-[#4640DE]"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured checkbox */}
          <label className="flex items-center gap-4 p-4 border-2 border-[#D6DDEB] rounded-xl cursor-pointer hover:border-[#FFB836] transition-colors group">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                watchedFeatured
                  ? "bg-[#FFB836] border-[#FFB836]"
                  : "border-[#D6DDEB] group-hover:border-[#FFB836]"
              }`}
            >
              {watchedFeatured && (
                <CheckCircle size={12} className="text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-[#FFB836]" fill="#FFB836" />
                <span className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#25324B]">
                  Mark as Featured
                </span>
              </div>
              <p className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7] mt-0.5">
                Featured jobs appear on the homepage and highlighted in search
              </p>
            </div>
          </label>
        </Section>

        {/* ── Submit ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 pb-8">
          <Link
            href="/dashboard/jobs"
            className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#515B6F] border border-[#D6DDEB] px-6 py-3 rounded-xl hover:bg-[#F8F8FD] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#4640DE] hover:bg-[#3730C4] disabled:opacity-60 disabled:cursor-not-allowed text-white font-[family-name:var(--font-epilogue)] font-bold text-[15px] px-8 py-3.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(70,64,222,0.3)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Publishing…
              </>
            ) : (
              <>
                <Briefcase size={16} /> Publish Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
