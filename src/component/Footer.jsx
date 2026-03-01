"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Dribbble } from "lucide-react";

const FOOTER_LINKS = {
  About: ["Companies", "Pricing", "Terms", "Advice", "Privacy Policy"],
  Resources: ["Help Docs", "Guide", "Updates", "Contact Us"],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#202430]">
      {/* ── Main footer grid ─────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_2fr] gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 no-underline mb-4 w-fit"
            >
              <Image
                src="/logo.png"
                alt="QuickHire"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="font-[family-name:var(--font-epilogue)] font-extrabold text-[17px] text-white">
                QuickHire
              </span>
            </Link>
            <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#9199A3] leading-[1.75] lg:max-w-[320px]">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>

          {/* Link columns — side by side on mobile, separate columns on lg */}
          <div className="grid grid-cols-2 lg:contents gap-10">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-[family-name:var(--font-epilogue)] font-bold text-[16px] text-white mb-5">
                  {title}
                </h4>
                <ul className="flex flex-col gap-3 list-none p-0 m-0">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#9199A3] hover:text-white transition-colors duration-200 no-underline"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-[family-name:var(--font-epilogue)] font-bold text-[16px] text-white mb-2">
              Get job notifications
            </h4>
            <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#9199A3] leading-[1.65] mb-5">
              The latest job news, articles, sent to your inbox weekly.
            </p>

            {subscribed ? (
              <div className="bg-[#2E3446] rounded px-4 py-3">
                <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#26A4FF]">
                  ✓ You're subscribed!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col lg:flex-row"
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full lg:flex-1 lg:min-w-0 bg-white font-[family-name:var(--font-epilogue)] text-[14px] text-[#25324B] placeholder-[#A8ADB7] px-3.5 py-3 rounded-t-md lg:rounded-l-md lg:rounded-tr-none outline-none border-none"
                />
                <button
                  type="submit"
                  className="w-fit bg-[#4640DE] text-white font-[family-name:var(--font-epilogue)] font-bold text-[14px] px-6 py-3 rounded-b-md lg:rounded-r-md lg:rounded-bl-none hover:bg-[#3730C4] transition-colors duration-200 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 mt-14 border-t border-[#2E3446] py-6 flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
        <p className="font-[family-name:var(--font-epilogue)] text-[14px] text-[#9199A3] text-center lg:text-left">
          {new Date().getFullYear()} © QuickHire. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {[
            { Icon: Facebook, label: "Facebook" },
            { Icon: Instagram, label: "Instagram" },
            { Icon: Dribbble, label: "Dribbble" },
            { Icon: Linkedin, label: "LinkedIn" },
            { Icon: Twitter, label: "Twitter" },
          ].map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="w-10 h-10 rounded-full bg-[#2E3446] flex items-center justify-center text-[#9199A3] hover:text-[#26A4FF] transition-colors duration-200"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
