"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User } from "lucide-react";

// Password strength logic
const getStrength = (pw = "") => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["", "#FF6550", "#FFB836", "#56CDAD", "#4640DE", "#2BCE8C"];
  return { score, label: labels[score], color: colors[score] };
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const password = watch("password", "");
  const {
    score,
    label: strengthLabel,
    color: strengthColor,
  } = getStrength(password);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
          }),
        },
      );
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1800);
      } else {
        setServerError(
          json.message ||
            (json.errors ? json.errors.join(", ") : "Registration failed."),
        );
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  const inputCls = (hasError, extra = "") =>
    `w-full py-3.5 border rounded-lg font-[family-name:var(--font-epilogue)] text-[15px] text-[#25324B] placeholder:text-[#A8ADB7] bg-white focus:outline-none focus:ring-2 transition-all duration-200 pl-11 ${extra} ${
      hasError
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-[#D6DDEB] focus:border-[#4640DE] focus:ring-[#4640DE]/10"
    }`;

  return (
    <div className="min-h-screen bg-[#F8F8FD] flex">
      {/* ── Left decorative panel ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#25324B] overflow-hidden flex-col justify-between p-12">
        {/* grid lines */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#4640DE] opacity-20" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#26A4FF] opacity-15" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="QuickHire"
              width={140}
              height={36}
              className="object-contain brightness-0 invert"
            />
          </Link>
        </div>

        {/* Copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[#4640DE]/20 text-[#A5C8FF] rounded-full px-4 py-1.5 mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26A4FF] animate-pulse" />
            <span className="font-[family-name:var(--font-epilogue)] text-[13px] font-semibold">
              Free forever
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-white text-[38px] leading-[1.15] mb-5">
            Your next great
            <br />
            <span className="text-[#26A4FF]">opportunity</span>
            <br />
            starts here.
          </h2>
          <p className="font-[family-name:var(--font-epilogue)] text-white/60 text-[15px] leading-relaxed max-w-[320px]">
            Create your free account and get matched with jobs that fit your
            skills and ambitions.
          </p>
          <div className="flex flex-col gap-3 mt-10">
            {[
              "Access 5,000+ verified job listings",
              "Apply with one click",
              "Track all your applications",
              "Get notified about new matches",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#4640DE] flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-[family-name:var(--font-epilogue)] text-white/80 text-[14px]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["#4640DE", "#26A4FF", "#56CDAD", "#FFB836"].map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#25324B] flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: c }}
              >
                {["JK", "MS", "LR", "AK"][i]}
              </div>
            ))}
          </div>
          <p className="font-[family-name:var(--font-epilogue)] text-white/60 text-[13px]">
            Join <span className="text-white font-semibold">50,000+</span> job
            seekers
          </p>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="QuickHire"
                width={120}
                height={32}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Success state */}
          {success ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#E8F9F0] flex items-center justify-center mx-auto mb-5">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#56CDAD"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[24px] text-[#25324B] mb-2">
                Account created!
              </h2>
              <p className="font-[family-name:var(--font-epilogue)] text-[15px] text-[#7C8493]">
                Redirecting you to sign in…
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[32px] text-[#25324B] mb-2">
                  Create account
                </h1>
                <p className="font-[family-name:var(--font-epilogue)] text-[15px] text-[#7C8493]">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#4640DE] font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Server error */}
              {serverError && (
                <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-red-600">
                    {serverError}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
                noValidate
              >
                {/* Full name */}
                <div>
                  <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#25324B] block mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Tushar Chow"
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      className={inputCls(errors.name, "pr-4")}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 font-[family-name:var(--font-epilogue)] text-[12px] text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#25324B] block mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
                    />
                    <input
                      type="email"
                      placeholder="tushar@gmail.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      className={inputCls(errors.email, "pr-4")}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 font-[family-name:var(--font-epilogue)] text-[12px] text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#25324B] block mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
                    />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={inputCls(errors.password, "pr-12")}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] hover:text-[#515B6F] transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 font-[family-name:var(--font-epilogue)] text-[12px] text-red-500">
                      {errors.password.message}
                    </p>
                  )}

                  {/* Strength bar — only shows when user starts typing */}
                  {password && (
                    <div className="mt-2.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background:
                                i <= score ? strengthColor : "#E7E7F5",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="font-[family-name:var(--font-epilogue)] text-[12px] mt-1 transition-colors"
                        style={{ color: strengthColor }}
                      >
                        {strengthLabel}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#25324B] block mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
                    />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      {...register("confirm", {
                        required: "Please confirm your password",
                        validate: (val) =>
                          val === password || "Passwords do not match",
                      })}
                      className={inputCls(errors.confirm, "pr-12")}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] hover:text-[#515B6F] transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirm && (
                    <p className="mt-1.5 font-[family-name:var(--font-epilogue)] text-[12px] text-red-500">
                      {errors.confirm.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 w-full flex items-center justify-center gap-2 bg-[#4640DE] hover:bg-[#3730C4] disabled:opacity-60 disabled:cursor-not-allowed text-white font-[family-name:var(--font-epilogue)] font-bold text-[16px] py-4 rounded-lg transition-all duration-200 hover:shadow-[0_8px_24px_rgba(70,64,222,0.3)]"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="white"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="white"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center font-[family-name:var(--font-epilogue)] text-[13px] text-[#A8ADB7]">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-[#4640DE] hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#4640DE] hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
