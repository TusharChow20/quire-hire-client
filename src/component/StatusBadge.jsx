"use client";

const STATUS_STYLES = {
  pending: {
    bg: "#FFF7E6",
    text: "#F59E0B",
    border: "#FCD34D",
    label: "Pending",
  },
  reviewed: {
    bg: "#EFF6FF",
    text: "#3B82F6",
    border: "#93C5FD",
    label: "Reviewed",
  },
  shortlisted: {
    bg: "#ECFDF5",
    text: "#10B981",
    border: "#6EE7B7",
    label: "Shortlisted",
  },
  rejected: {
    bg: "#FEF2F2",
    text: "#EF4444",
    border: "#FCA5A5",
    label: "Rejected",
  },
};

export default function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: s.text }}
      />
      {s.label}
    </span>
  );
}
