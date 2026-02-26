"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { StudentDashboardData } from "@/types/dashboard";
import "../../styles/student.css";

interface StudentDashboardProps {
  data: StudentDashboardData;
  isLoading?: boolean;
  error?: string;
}

export default function StudentDashboard({ data, isLoading, error }: StudentDashboardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="student-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-dashboard">
        <div className="error-state">
          <p>Error loading dashboard: {error}</p>
          <button className="primary-btn" onClick={() => router.refresh()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { 
    studentName = "Student", 
    stats, 
    upcomingExams = [], 
    homeworkTasks = [], 
    notifications = [],
    timetable = [],
    resources = []
  } = data || {};

  const handleDownloadTimetable = () => {
    if (!timetable || timetable.length === 0) {
      alert("No timetable data available to download.");
      return;
    }
    
    const timetableText = `GREEN VALLEY ACADEMY - STUDENT TIMETABLE
Academic Year 2026

${timetable.map(entry => 
  `${entry.day} | ${entry.subject} | ${entry.time} | ${entry.room || 'N/A'}`
).join('\n')}

---
Generated on: ${new Date().toLocaleDateString()}
Green Valley Academy`;

    const blob = new Blob([timetableText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My_Timetable.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="student-dashboard">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome Back, {studentName} 👋</h1>
          <p>Here's what's happening today.</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => router.push("/dashboard/student/profile")}
        >
          My Profile
        </button>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="summary-grid">
        <div
          className="summary-card clickable"
          onClick={() => router.push("/dashboard/student/exams")}
        >
          <h3>{stats?.upcomingExams ?? 0}</h3>
          <p>Upcoming Exams</p>
        </div>

        <div
          className="summary-card clickable"
          onClick={() => router.push("/dashboard/student/homework")}
        >
          <h3>{stats?.pendingHomework ?? 0}</h3>
          <p>Pending Homework</p>
        </div>

        <div
          className="summary-card clickable"
          onClick={() => router.push("/dashboard/student/notifications")}
        >
          <h3>{stats?.newNotifications ?? 0}</h3>
          <p>New Notifications</p>
        </div>

        {stats?.attendanceRate && (
          <div
            className="summary-card clickable"
            onClick={() => router.push("/dashboard/student/attendance")}
          >
            <h3>{stats.attendanceRate}%</h3>
            <p>Attendance Rate</p>
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT GRID ===== */}
      <div className="dashboard-grid">
        {/* ===== Exams ===== */}
        <div className="card">
          <div className="card-header">
            <h2>Upcoming Exams</h2>
            <button
              className="link-btn"
              onClick={() => router.push("/dashboard/student/exams")}
            >
              View All →
            </button>
          </div>

          {upcomingExams.length > 0 ? (
            upcomingExams.map((exam) => (
              <div key={exam.id} className="list-item">
                <div>
                  <strong>{exam.subject}</strong>
                  <span className={`badge ${exam.status}`}>{exam.status}</span>
                </div>
                <span className="date">{exam.date}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No upcoming exams</p>
            </div>
          )}
        </div>

        {/* ===== Homework ===== */}
        <div className="card">
          <div className="card-header">
            <h2>Homework</h2>
            <button
              className="link-btn"
              onClick={() => router.push("/dashboard/student/homework")}
            >
              View All →
            </button>
          </div>

          {homeworkTasks.length > 0 ? (
            homeworkTasks.map((hw) => (
              <div key={hw.id} className="list-item">
                <div>
                  <strong>{hw.title}</strong>
                  <span className={`badge ${hw.status === 'pending' ? 'urgent' : hw.status}`}>
                    {hw.status === 'pending' ? 'Due Soon' : hw.status}
                  </span>
                </div>
                <span className="date">{hw.due}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No pending homework</p>
            </div>
          )}
        </div>

        {/* ===== Notifications ===== */}
        <div className="card">
          <div className="card-header">
            <h2>Notifications</h2>
            <button
              className="link-btn"
              onClick={() => router.push("/dashboard/student/notifications")}
            >
              View All →
            </button>
          </div>

          {notifications.length > 0 ? (
            notifications.map((note) => (
              <div key={note.id} className="list-item">
                <div>
                  <p>{note.message}</p>
                  <span className={`badge ${note.read ? 'read' : 'new'}`}>
                    {note.read ? 'Read' : 'New'}
                  </span>
                </div>
                <span className="date">{note.date}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No notifications</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== TIMETABLE ===== */}
      <div className="card timetable">
        <div className="card-header">
          <h2>Weekly Timetable</h2>
          <button
            className="link-btn"
            onClick={() => router.push("/dashboard/student/timetable")}
          >
            View Full →
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {timetable.length > 0 ? (
                timetable.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.day}</td>
                    <td>{entry.subject}</td>
                    <td>{entry.time}</td>
                    <td>{entry.room || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="empty-cell">No timetable available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== RESOURCES ===== */}
      <div className="card">
        <div className="card-header">
          <h2>Learning Resources</h2>
          <button
            className="link-btn"
            onClick={() => router.push("/dashboard/student/resources")}
          >
            View All →
          </button>
        </div>

        <div className="resource-grid">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <div
                key={resource.id}
                className="resource-card"
                onClick={() => router.push(resource.url)}
              >
                {resource.title}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No resources available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
