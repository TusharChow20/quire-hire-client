"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  User,
  LogOut,
  BarChart2,
  Settings,
  ChevronRight,
  Menu,
  X,
  Star,
  FileText,
  Users,
  Building2,
} from "lucide-react";

function NavItem({ href, icon: Icon, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 font-[family-name:var(--font-epilogue)] ${
        active
          ? "bg-[#4640DE] text-white shadow-[0_4px_12px_rgba(70,64,222,0.35)]"
          : "text-[#515B6F] hover:bg-[#F1F0FF] hover:text-[#4640DE]"
      }`}
    >
      <Icon size={18} className="flex-shrink-0" />
      {label}
      {active && <ChevronRight size={14} className="ml-auto" />}
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F8F8FD] pt-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = session.user.role === "admin";

  const userNav = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    {
      href: "/dashboard/applications",
      icon: Briefcase,
      label: "My Applications",
    },
    { href: "/dashboard/saved", icon: Bookmark, label: "Saved Jobs" },
    { href: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  const adminNav = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/jobs", icon: Briefcase, label: "Manage Jobs" },
    { href: "/dashboard/applications", icon: FileText, label: "Applications" },
    { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  ];

  const nav = isAdmin ? adminNav : userNav;

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full">
      {/* Profile block */}
      <div className="p-5 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#4640DE] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {session.user.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[15px] text-[#25324B] truncate font-[family-name:var(--font-epilogue)]">
              {session.user.name}
            </p>
            <p className="text-[12px] text-[#7C8493] truncate font-[family-name:var(--font-epilogue)]">
              {session.user.email}
            </p>
          </div>
        </div>
        <span
          className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-[family-name:var(--font-epilogue)] ${
            isAdmin
              ? "bg-[#FFF0E6] text-[#FF6550]"
              : "bg-[#ECFDF5] text-[#10B981]"
          }`}
        >
          {isAdmin ? "Admin" : "User"}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(({ href, icon, label }) => (
          <NavItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname === href}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Bottom: quick links + logout */}
      <div className="p-4 border-t border-[#F0F0F0] space-y-1">
        <NavItem
          href="/jobs"
          icon={Building2}
          label="Browse Jobs"
          active={false}
          onClick={onClose}
        />
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors font-[family-name:var(--font-epilogue)]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F8FD] pt-16">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-[#D6DDEB] px-4 py-3 flex items-center justify-between">
        <p className="font-bold text-[15px] text-[#25324B] font-[family-name:var(--font-epilogue)]">
          {isAdmin ? "Admin Dashboard" : "My Dashboard"}
        </p>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-[#F0F0F0]"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 top-16">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-64px)]  border-r border-[#D6DDEB] sticky top-16 self-start">
          <SidebarContent onClose={() => {}} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 lg:p-8 p-4 lg:mt-0 mt-12">
          {children}
        </main>
      </div>
    </div>
  );
}
