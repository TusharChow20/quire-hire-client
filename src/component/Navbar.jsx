"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on outside click
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
        {/* ── Logo ─────────────────────────────── */}
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

        {/* ── Desktop Nav Links ─────────────────── */}
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

        {/* ── Desktop CTA Buttons ───────────────── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#4640DE] px-5 py-2.5 rounded hover:bg-[#F1F0FF] transition-colors duration-200 no-underline"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-white bg-[#4640DE] px-5 py-2.5 rounded hover:bg-[#3730C4] transition-all duration-200 hover:-translate-y-px no-underline"
          >
            Sign Up
          </Link>
        </div>

        {/* ── Mobile Hamburger ──────────────────── */}
        <button
          id="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-[#25324B] hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ── Mobile Menu ───────────────────────── */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white border-t border-[#E7E7F5] overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 flex flex-col gap-0">
          <Link
            href="/jobs"
            className="font-[family-name:var(--font-epilogue)] font-medium text-base text-[#25324B] py-3 border-b border-[#F4F4F6] no-underline"
            onClick={() => setMenuOpen(false)}
          >
            Find Jobs
          </Link>
          <Link
            href="/companies"
            className="font-[family-name:var(--font-epilogue)] font-medium text-base text-[#25324B] py-3 border-b border-[#F4F4F6] no-underline"
            onClick={() => setMenuOpen(false)}
          >
            Browse Companies
          </Link>
          <div className="flex gap-3 mt-4">
            <Link
              href="/login"
              className="flex-1 text-center font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-[#4640DE] py-3 border-2 border-[#4640DE] rounded no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center font-[family-name:var(--font-epilogue)] font-bold text-[15px] text-white bg-[#4640DE] py-3 rounded no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
