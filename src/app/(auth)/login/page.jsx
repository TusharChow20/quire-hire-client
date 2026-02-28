"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const onSubmit = async (data) => {
    setServerError("");
    const result = await signIn("credentials", {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      redirect: false,
    });
    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setServerError("Invalid email or password. Please try again.");
    }
  };

  // reusable input class builder
  const inputCls = (hasError) =>
    `w-full py-3.5 border rounded-lg font-[family-name:var(--font-epilogue)] text-[15px] text-[#25324B] placeholder:text-[#A8ADB7] bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
      hasError
        ? "border-red-400 focus:border-red-400 focus:ring-red-100 pl-11 pr-4"
        : "border-[#D6DDEB] focus:border-[#4640DE] focus:ring-[#4640DE]/10 pl-11 pr-4"
    }`;

  return (
    <div className="min-h-screen bg-[#F8F8FD] flex">
      {/* ── Left decorative panel ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#4640DE] overflow-hidden flex-col justify-between p-12">
        {/* crosshatch pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg,white 0,white 1px,transparent 1px,transparent 40px),repeating-linear-gradient(-45deg,white 0,white 1px,transparent 1px,transparent 40px)`,
          }}
        />
        <div
          className="absolute top-0 right-0 w-52 h-52 bg-[#3730C4]"
          style={{ clipPath: "polygon(100% 0,0 0,100% 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-40 h-40 bg-[#3730C4]"
          style={{ clipPath: "polygon(0 0,0 100%,100% 100%)" }}
        />

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
          <h2 className="font-[family-name:var(--font-epilogue)] font-extrabold text-white text-[40px] leading-[1.12] mb-5">
            Find the perfect
            <br />
            <span className="text-[#A5F3C8]">job for you.</span>
          </h2>
          <p className="font-[family-name:var(--font-epilogue)] text-white/70 text-[16px] leading-relaxed max-w-[320px]">
            Thousands of opportunities. One platform. Sign in and get back to
            building your career.
          </p>
          <div className="flex gap-8 mt-10">
            {[
              { v: "5,000+", l: "Job listings" },
              { v: "1,200+", l: "Companies" },
              { v: "98%", l: "Satisfaction" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-[family-name:var(--font-epilogue)] font-extrabold text-white text-[22px]">
                  {s.v}
                </p>
                <p className="font-[family-name:var(--font-epilogue)] text-white/60 text-[13px] mt-0.5">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 border border-white/20 rounded-xl p-5 bg-white/5">
          <p className="font-[family-name:var(--font-epilogue)] text-white/90 text-[14px] italic mb-3">
            "QuickHire helped me land my dream role at a top tech company in
            less than 3 weeks."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#A5F3C8] flex items-center justify-center">
              <span className="text-[#4640DE] font-bold text-[11px]">JK</span>
            </div>
            <span className="font-[family-name:var(--font-epilogue)] text-white/70 text-[13px]">
              Tushar Chowdhury, Software Engineer
            </span>
          </div>
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

          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-epilogue)] font-extrabold text-[32px] text-[#25324B] mb-2">
              Welcome back!
            </h1>
            <p className="font-[family-name:var(--font-epilogue)] text-[15px] text-[#7C8493]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#4640DE] font-semibold hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Server error banner */}
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
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className={inputCls(errors.email)}
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
              <div className="flex items-center justify-between mb-2">
                <label className="font-[family-name:var(--font-epilogue)] font-semibold text-[14px] text-[#25324B]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#4640DE] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8ADB7] pointer-events-none"
                />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`${inputCls(errors.password)} pr-12`}
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full cursor-pointer flex items-center justify-center gap-2 bg-[#4640DE] hover:bg-[#3730C4] disabled:opacity-60 disabled:cursor-not-allowed text-white font-[family-name:var(--font-epilogue)] font-bold text-[16px] py-4 rounded-lg transition-all duration-200 hover:shadow-[0_8px_24px_rgba(70,64,222,0.3)]"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#D6DDEB]" />
            <span className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#A8ADB7]">
              or
            </span>
            <div className="flex-1 h-px bg-[#D6DDEB]" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 border border-[#D6DDEB] bg-white hover:bg-[#F8F8FD] text-[#25324B] font-[family-name:var(--font-epilogue)] font-semibold text-[15px] py-3.5 rounded-lg transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center font-[family-name:var(--font-epilogue)] text-[13px] text-[#A8ADB7]">
            Don't have an account{" "}
            <Link href="/register" className="text-[#4640DE] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
