"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ShieldCheck, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  if (status === "loading") {
    return null;
  }

  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";

  // The correct dashboard href based on role
  const dashboardHref = isAdmin ? "/dashboard" : "/dashboard";
  const dashboardLabel = isAdmin ? "Admin Panel" : "Dashboard";
  const DashboardIcon = isAdmin ? ShieldCheck : LayoutDashboard;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (
        !e.target.closest("#mobile-menu") &&
        !e.target.closest("#hamburger")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
          : "border-b border-[#E7E7F5]"
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <Image
              src="/logo.png"
              alt="QuickHire logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-[family-name:var(--font-epilogue)] font-extrabold text-[18px] text-[#25324B] tracking-tight">
              QuickHire
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-9">
            <Link
              href="/jobs"
              className="font-[family-name:var(--font-epilogue)] font-medium text-[15px] text-[#515B6F] hover:text-[#4640DE] transition-colors duration-200 no-underline"
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className="font-[family-name:var(--font-epilogue)] font-medium text-[15px] text-[#515B6F] hover:text-[#4640DE] transition-colors duration-200 no-underline"
            >
              Browse Companies
            </Link>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Role-aware dashboard button */}
              <Link
                href={dashboardHref}
                className={`flex items-center gap-1.5 font-[family-name:var(--font-epilogue)] font-bold
                            text-[15px] px-5 py-2.5 rounded transition-colors duration-200 no-underline
                            ${
                              isAdmin
                                ? "text-[#FFB836] hover:bg-[#FFF8E6]"
                                : "text-[#4640DE] hover:bg-[#F1F0FF]"
                            }`}
              >
                <DashboardIcon size={15} />
                {dashboardLabel}
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-white
                           bg-[#4640DE] px-5 py-2.5 rounded hover:bg-[#3730C4]
                           transition-all duration-200 hover:-translate-y-px"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#4640DE]
                           px-5 py-2.5 rounded hover:bg-[#F1F0FF] transition-colors duration-200 no-underline"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-white
                           bg-[#4640DE] px-5 py-2.5 rounded hover:bg-[#3730C4]
                           transition-all duration-200 hover:-translate-y-px no-underline"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          id="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-[#25324B]
                     hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white border-t border-[#E7E7F5] overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 pb-6 flex flex-col gap-0">
          <Link
            href="/jobs"
            className="font-[family-name:var(--font-epilogue)] font-medium text-base text-[#25324B]
                       py-3 border-b border-[#F4F4F6] no-underline"
            onClick={() => setMenuOpen(false)}
          >
            Find Jobs
          </Link>
          <Link
            href="/companies"
            className="font-[family-name:var(--font-epilogue)] font-medium text-base text-[#25324B]
                       py-3 border-b border-[#F4F4F6] no-underline"
            onClick={() => setMenuOpen(false)}
          >
            Browse Companies
          </Link>

          {/* Role badge in mobile menu */}
          {isAuthenticated && (
            <div
              className={`mt-3 mb-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold
                             font-[family-name:var(--font-epilogue)] w-fit
                             ${isAdmin ? "bg-[#FFF8E6] text-[#FFB836]" : "bg-[#F1F0FF] text-[#4640DE]"}`}
            >
              <DashboardIcon size={12} />
              {isAdmin ? "Admin Account" : "User Account"} ·{" "}
              {session?.user?.email}
            </div>
          )}

          <div className="flex gap-3 mt-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className={`flex-1 text-center font-[family-name:var(--font-epilogue)] font-bold
                              text-[15px] py-3 border-2 rounded no-underline
                              ${
                                isAdmin
                                  ? "text-[#FFB836] border-[#FFB836]"
                                  : "text-[#4640DE] border-[#4640DE]"
                              }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {dashboardLabel}
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex-1 text-center font-[family-name:var(--font-epilogue)] font-bold
                             text-[15px] text-white bg-[#4640DE] py-3 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 text-center font-[family-name:var(--font-epilogue)] font-bold
                             text-[15px] text-[#4640DE] py-3 border-2 border-[#4640DE] rounded no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 text-center font-[family-name:var(--font-epilogue)] font-bold
                             text-[15px] text-white bg-[#4640DE] py-3 rounded no-underline"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
