"use client";

import { ReactNode, useState } from "react";
import Sidebar, { UserRole } from "./Sidebar";
import Header from "./Header";
import "../styles/sidebar.css";

interface DashboardLayoutProps {
  role: UserRole;
  children: ReactNode;
  userName: string;
  logoName: string;
  schoolName: string;
}

export default function DashboardLayout({
  role,
  children,
  userName,
  logoName,
  schoolName,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-wrapper">
      {/* ===== HEADER ===== */}
      <Header
        role={role}
        logoName={logoName}
        schoolName={schoolName}
        userName={userName}
        toggleSidebar={toggleSidebar}
      />

      {/* ===== SIDEBAR + CONTENT ===== */}
      <div className="dashboard-body">
        <Sidebar
          role={role}
          open={sidebarOpen}
          onToggle={toggleSidebar}   
        />

        <main className={`main-content ${sidebarOpen ? "expanded" : "collapsed"}`}>
          <div className="page-content">{children}</div>
        </main>
      </div>
    </div>
  );
}