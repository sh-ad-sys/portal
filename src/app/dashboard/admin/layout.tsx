"use client";

import { ReactNode } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <DashboardLayout
      role="admin"
      userName="Admin"
      logoName="GVHS"
      schoolName="Green Valley High School"
    >
      {children}
    </DashboardLayout>
  );
}
