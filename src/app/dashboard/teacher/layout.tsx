"use client";

import { ReactNode } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface TeacherLayoutProps {
  children: ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <DashboardLayout
      role="teacher"
      userName="Teacher"
      logoName="GVHS"
      schoolName="Green Valley High School"
    >
      {children}
    </DashboardLayout>
  );
}
