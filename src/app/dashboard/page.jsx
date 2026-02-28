"use client";

import AdminOverview from "@/component/Adminoverview";
import UserOverview from "@/component/Useroverview";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  if (!session) return null;
  return session.user.role === "admin" ? <AdminOverview /> : <UserOverview />;
}
