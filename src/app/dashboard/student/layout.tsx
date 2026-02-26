"use client";

import { ReactNode } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <DashboardLayout
      role="student"
      userName="Brian"
      logoName="GVHS"
      schoolName="Green Valley High School"
    >
      {children}
    </DashboardLayout>
  );
}
