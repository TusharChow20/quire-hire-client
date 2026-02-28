"use client";

import { useState, useEffect } from "react";
import { useSession, update as updateSession } from "next-auth/react";
import {
  User, Mail, Lock, Eye, EyeOff, CheckCircle,
  Loader2, AlertCircle, Save, ShieldCheck, KeyRound,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Avatar initials ───────────────────────────────────────
function Avatar({ name, size = 80 }) {
  const colors = ["#4640DE","#26A4FF","#56CDAD","#FFB836","#FF6550","#7B61FF"];
  const color  = colors[(name?.charCodeAt(0) || 0) % colors.length];
  const initials = name
    ? name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="rounded-full flex items-center justify-center font-extrabold text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}>
      {initials}
    </div>
  );
}

// ── Inline toast ──────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-white
                     font-[family-name:var(--font-epilogue)] font-semibold text-[14px]
                     ${toast.type === "error" ? "bg-[#FF6550]" : "bg-[#56CDAD]"}`}>
      {toast.type === "error"
        ? <AlertCircle size={16} />
        : <CheckCircle size={16} />
      }
      {toast.msg}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, update: updateNextAuthSession } = useSession();

  // ── Name form state ───────────────────────────────────
  const [name,        setName]        = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameToast,   setNameToast]   = useState(null);
  const [nameError,   setNameError]   = useState("");

  // ── Password form state ───────────────────────────────
  const [currentPassword,  setCurrentPassword]  = useState("");
  const [newPassword,      setNewPassword]       = useState("");
  const [confirmPassword,  setConfirmPassword]   = useState("");
  const [showCurrent,      setShowCurrent]       = useState(false);
  const [showNew,          setShowNew]           = useState(false);
  const [showConfirm,      setShowConfirm]       = useState(false);
  const [passLoading,      setPassLoading]       = useState(false);
  const [passToast,        setPassToast]         = useState(null);
  const [passErrors,       setPassErrors]        = useState({});

  // Pre-fill name from session
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  const showToast = (setter, msg, type = "success") => {
    setter({ msg, type });
    setTimeout(() => setter(null), 3500);
  };

  // ── Save name ─────────────────────────────────────────
  const handleSaveName = async (e) => {
    e.preventDefault();
    setNameError("");

    if (!name.trim()) { setNameError("Name cannot be empty"); return; }
    if (name.trim() === session?.user?.name) {
      showToast(setNameToast, "That's already your current name", "error");
      return;
    }

    setNameLoading(true);
    try {
      const userId = session?.user?.id || session?.user?._id;
      const res  = await fetch(`${API}/api/users/${userId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        // Update the NextAuth session so the navbar refreshes immediately
        await updateNextAuthSession({ name: name.trim() });
        showToast(setNameToast, "Name updated successfully!");
      } else {
        showToast(setNameToast, data.message || "Failed to update name", "error");
      }
    } catch {
      showToast(setNameToast, "Network error. Please try again.", "error");
    } finally {
      setNameLoading(false);
    }
  };

  // ── Change password ───────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!currentPassword)      errs.current  = "Current password is required";
    if (!newPassword)          errs.new      = "New password is required";
    else if (newPassword.length < 6) errs.new = "Must be at least 6 characters";
    if (!confirmPassword)      errs.confirm  = "Please confirm your new password";
    else if (newPassword !== confirmPassword) errs.confirm = "Passwords do not match";
    if (currentPassword && newPassword && currentPassword === newPassword)
      errs.new = "New password must be different from current";

    if (Object.keys(errs).length > 0) { setPassErrors(errs); return; }

    setPassErrors({});
    setPassLoading(true);
    try {
      const userId = session?.user?.id || session?.user?._id;
      const res  = await fetch(`${API}/api/users/${userId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast(setPassToast, "Password changed successfully!");
      } else {
        if (data.message?.toLowerCase().includes("current password")) {
          setPassErrors({ current: data.message });
        } else {
          showToast(setPassToast, data.message || "Failed to change password", "error");
        }
      }
    } catch {
      showToast(setPassToast, "Network error. Please try again.", "error");
    } finally {
      setPassLoading(false);
    }
  };

  // ── Input helper ─────────────────────────────────────
  const Input = ({ label, value, onChange, type = "text", placeholder, icon: Icon,
                   error, hint, readOnly, rightEl }) => (
    <div>
      <label className="flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]
                         font-semibold text-[13px] text-[#25324B] mb-1.5">
        {Icon && <Icon size={13} className="text-[#A8ADB7]" />}
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full px-4 py-3 border rounded-xl font-[family-name:var(--font-epilogue)]
                       text-[14px] text-[#25324B] placeholder-[#A8ADB7] outline-none
                       transition-all duration-200 pr-${rightEl ? "12" : "4"}
                       ${readOnly
                         ? "bg-[#F8F8FD] text-[#A8ADB7] cursor-not-allowed border-[#E7E7F5]"
                         : error
                           ? "border-[#FF6550] bg-[#FFF4F3] focus:ring-2 focus:ring-[#FF6550]/10"
                           : "border-[#D6DDEB] focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/10"
                       }`}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
      {hint && !error && (
        <p className="mt-1 font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7]">{hint}</p>
      )}
      {error && (
        <p className="mt-1 flex items-center gap-1 font-[family-name:var(--font-epilogue)]
                       text-[12px] text-[#FF6550]">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle} className="text-[#A8ADB7] hover:text-[#515B6F] transition-colors p-0.5">
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="max-w-[640px] space-y-6">

      {/* ── Profile card ── */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl overflow-hidden
                      shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        {/* Header strip */}
        <div className="bg-gradient-to-r from-[#4640DE] to-[#26A4FF] px-6 pt-8 pb-14 relative">
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 1px,transparent 30px)" }} />
        </div>

        {/* Avatar + name pull-up */}
        <div className="px-6 pb-6 -mt-10 relative z-10">
          <div className="flex items-end gap-4 mb-4">
            <div className="ring-4 ring-white rounded-full">
              <Avatar name={session?.user?.name} size={80} />
            </div>
            <div className="mb-1">
              <p className="font-[family-name:var(--font-epilogue)] font-extrabold text-[20px] text-[#25324B] leading-tight">
                {session?.user?.name || "—"}
              </p>
              <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493]">
                {session?.user?.email}
              </p>
            </div>
          </div>

          {/* Role chip */}
          <span className={`inline-flex items-center gap-1.5 font-[family-name:var(--font-epilogue)]
                            font-bold text-[12px] px-3 py-1.5 rounded-full
                            ${session?.user?.role === "admin"
                              ? "bg-[#FFF8E6] text-[#FFB836]"
                              : "bg-[#F1F0FF] text-[#4640DE]"
                            }`}>
            <ShieldCheck size={12} />
            {session?.user?.role === "admin" ? "Admin" : "User"} Account
          </span>
        </div>
      </div>

      {/* ── Edit Name card ── */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6
                      shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#F1F0FF] flex items-center justify-center">
            <User size={15} className="text-[#4640DE]" />
          </div>
          <h2 className="font-[family-name:var(--font-epilogue)] font-bold text-[17px] text-[#25324B]">
            Edit Display Name
          </h2>
        </div>
        <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493] mb-5 ml-10">
          This is how your name appears across QuickHire.
        </p>

        <form onSubmit={handleSaveName} className="space-y-4">
          <Input
            label="Full Name" icon={User}
            value={name} onChange={e => { setName(e.target.value); setNameError(""); }}
            placeholder="Your full name"
            error={nameError}
          />
          <Input
            label="Email address" icon={Mail}
            value={session?.user?.email || ""}
            readOnly
            hint="Email cannot be changed"
          />

          {nameToast && <Toast toast={nameToast} />}

          <button type="submit" disabled={nameLoading}
            className="flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-bold
                       text-[14px] text-white bg-[#4640DE] px-6 py-3 rounded-xl
                       hover:bg-[#3730C4] disabled:opacity-60 transition-all duration-200
                       shadow-[0_4px_12px_rgba(70,64,222,0.25)] active:scale-[.99]">
            {nameLoading
              ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
              : <><Save size={16} /> Save Name</>
            }
          </button>
        </form>
      </div>

      {/* ── Change Password card ── */}
      <div className="bg-white border border-[#E7E7F5] rounded-2xl p-6
                      shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#FFF8E6] flex items-center justify-center">
            <KeyRound size={15} className="text-[#FFB836]" />
          </div>
          <h2 className="font-[family-name:var(--font-epilogue)] font-bold text-[17px] text-[#25324B]">
            Change Password
          </h2>
        </div>
        <p className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493] mb-5 ml-10">
          Use a strong password you don't use elsewhere.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password" icon={Lock}
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={e => { setCurrentPassword(e.target.value); setPassErrors(p => ({ ...p, current: null })); }}
            placeholder="Enter your current password"
            error={passErrors.current}
            rightEl={<EyeBtn show={showCurrent} toggle={() => setShowCurrent(p => !p)} />}
          />
          <Input
            label="New Password" icon={Lock}
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={e => { setNewPassword(e.target.value); setPassErrors(p => ({ ...p, new: null })); }}
            placeholder="At least 6 characters"
            error={passErrors.new}
            hint={!passErrors.new ? "Minimum 6 characters" : undefined}
            rightEl={<EyeBtn show={showNew} toggle={() => setShowNew(p => !p)} />}
          />
          <Input
            label="Confirm New Password" icon={Lock}
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); setPassErrors(p => ({ ...p, confirm: null })); }}
            placeholder="Re-enter your new password"
            error={passErrors.confirm}
            rightEl={<EyeBtn show={showConfirm} toggle={() => setShowConfirm(p => !p)} />}
          />

          {/* Password strength indicator */}
          {newPassword && (
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                {[1,2,3,4].map(i => {
                  const score =
                    (newPassword.length >= 6   ? 1 : 0) +
                    (newPassword.length >= 10  ? 1 : 0) +
                    (/[A-Z]/.test(newPassword) ? 1 : 0) +
                    (/[0-9!@#$%^&*]/.test(newPassword) ? 1 : 0);
                  const colors = ["#FF6550","#FFB836","#26A4FF","#56CDAD"];
                  return (
                    <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                      style={{ background: i <= score ? colors[score - 1] : "#E7E7F5" }} />
                  );
                })}
              </div>
              <p className="font-[family-name:var(--font-epilogue)] text-[12px] text-[#A8ADB7]">
                {(() => {
                  const s = (newPassword.length >= 6 ? 1 : 0) + (newPassword.length >= 10 ? 1 : 0) +
                            (/[A-Z]/.test(newPassword) ? 1 : 0) + (/[0-9!@#$%^&*]/.test(newPassword) ? 1 : 0);
                  return ["","Weak — add more characters","Fair — try uppercase letters","Good — add numbers or symbols","Strong password!"][s];
                })()}
              </p>
            </div>
          )}

          {passToast && <Toast toast={passToast} />}

          <button type="submit" disabled={passLoading}
            className="flex items-center gap-2 font-[family-name:var(--font-epilogue)] font-bold
                       text-[14px] text-white bg-[#25324B] px-6 py-3 rounded-xl
                       hover:bg-[#1a2235] disabled:opacity-60 transition-all duration-200
                       active:scale-[.99]">
            {passLoading
              ? <><Loader2 size={16} className="animate-spin" /> Updating…</>
              : <><KeyRound size={16} /> Update Password</>
            }
          </button>
        </form>
      </div>

      {/* ── Account info (read-only) ── */}
      <div className="bg-[#F8F8FD] border border-[#E7E7F5] rounded-2xl p-5">
        <h3 className="font-[family-name:var(--font-epilogue)] font-bold text-[14px] text-[#515B6F] mb-3">
          Account Information
        </h3>
        <div className="space-y-2">
          {[
            { label: "Account ID",  value: session?.user?.id || session?.user?._id || "—" },
            { label: "Role",        value: session?.user?.role || "user" },
            { label: "Email",       value: session?.user?.email || "—" },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between gap-4">
              <span className="font-[family-name:var(--font-epilogue)] text-[13px] text-[#7C8493]">
                {row.label}
              </span>
              <span className="font-[family-name:var(--font-epilogue)] font-semibold text-[13px]
                               text-[#25324B] truncate max-w-[240px]">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}