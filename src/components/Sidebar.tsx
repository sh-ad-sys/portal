"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/sidebar.css";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaBook,
  FaBell,
  FaCheck,
  FaPen,
  FaEnvelope,
  FaRegCalendarAlt,
  FaFileAlt,
  FaGraduationCap,
  FaBookOpen,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";
import React from "react";

export type UserRole = "admin" | "teacher" | "student" | "parent";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

/* ===============================
   Sidebar Items Per Role
================================ */
const sidebarItems: Record<UserRole, MenuItem[]> = {
  admin: [
    { label: "Dashboard Home", path: "/dashboard/admin", icon: <FaHome /> },
    { label: "Manage Users & Roles", path: "/dashboard/admin/users", icon: <FaUsers /> },
    { label: "Attendance Overview", path: "/dashboard/admin/attendance", icon: <FaClipboardList /> },
    { label: "Exam & Assignment Setup", path: "/dashboard/admin/exams", icon: <FaBook /> },
    { label: "Notifications", path: "/dashboard/admin/notifications", icon: <FaBell /> },
  ],

  teacher: [
    { label: "Dashboard Home", path: "/dashboard/teacher", icon: <FaHome /> },
    { label: "Mark Attendance", path: "/dashboard/teacher/attendance", icon: <FaCheck /> },
    { label: "Enter Exam Marks", path: "/dashboard/teacher/exams", icon: <FaPen /> },
    { label: "Assign Homework", path: "/dashboard/teacher/homework", icon: <FaFileAlt /> },
    { label: "Messaging", path: "/dashboard/teacher/messages", icon: <FaEnvelope /> },
  ],

  student: [
    { label: "Dashboard Home", path: "/dashboard/student", icon: <FaHome /> },
    { label: "Timetable", path: "/dashboard/student/timetable", icon: <FaRegCalendarAlt /> },
    { label: "Exams", path: "/dashboard/student/exams", icon: <FaPen /> },
    { label: "Homework", path: "/dashboard/student/homework", icon: <FaFileAlt /> },
    { label: "Results", path: "/dashboard/student/results", icon: <FaGraduationCap /> },
    { label: "Attendance", path: "/dashboard/student/attendance", icon: <FaCheck /> },
    { label: "Resources", path: "/dashboard/student/resources", icon: <FaBookOpen /> },
    { label: "Messages", path: "/dashboard/student/messages", icon: <FaEnvelope /> },
    { label: "Clubs", path: "/dashboard/student/clubs", icon: <FaTrophy /> },
  ],

  parent: [
    { label: "Dashboard Home", path: "/dashboard/parent", icon: <FaHome /> },
    { label: "Attendance & Homework", path: "/dashboard/parent/attendance", icon: <FaClipboardList /> },
    { label: "Exam Results", path: "/dashboard/parent/exams", icon: <FaBook /> },
    { label: "Notifications", path: "/dashboard/parent/notifications", icon: <FaBell /> },
    { label: "Messages", path: "/dashboard/parent/messages", icon: <FaEnvelope /> },
  ],
};

interface SidebarProps {
  role: UserRole;
  open: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ role, open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  /* ===============================
     Detect Mobile Screen
  ================================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = sidebarItems[role] ?? [];

  return (
    <>
      {/* Mobile Hamburger */}
      {isMobile && (
        <button className="hamburger" onClick={onToggle}>
          ☰
        </button>
      )}

      <aside
        className={`sidebar ${open ? "open" : "collapsed"} ${
          isMobile ? "mobile" : ""
        }`}
      >
        {/* Mobile Close Button */}
        {isMobile && open && (
          <button className="close-btn" onClick={onToggle}>
            ✕
          </button>
        )}

        {/* Header */}
        <div className="sidebar-header">
          {open && <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Panel</h2>}
        </div>

        {/* Menu */}
        <ul className="menu">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path ||
              pathname.startsWith(item.path + "/");

            return (
              <li
                key={item.path}
                className={`menu-item ${isActive ? "active" : ""}`}
              >
                <Link href={item.path}>
                  <span className="icon">{item.icon}</span>
                  {open && <span className="label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
