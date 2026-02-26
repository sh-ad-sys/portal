"use client";

import { ReactNode } from "react";
import DashboardLayout from "@/components/DashboardLayout";

interface ParentLayoutProps {
  children: ReactNode;
}

export default function ParentLayout({ children }: ParentLayoutProps) {
  return (
    <DashboardLayout
      role="parent"
      userName="Parent"
      logoName="GVHS"
      schoolName="Green Valley High School"
    >
      {children}
    </DashboardLayout>
  );
}
