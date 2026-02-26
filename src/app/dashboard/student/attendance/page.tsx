"use client";

import { useState } from "react";
import "@/styles/student-pages.css";

// Attendance record types
interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  status: "present" | "absent" | "late" | "excused";
  subject?: string;
  teacher?: string;
  remarks?: string;
}

// Mock attendance data
const attendanceRecords: AttendanceRecord[] = [
  { id: "A001", date: "2026-02-25", day: "Wednesday", status: "present", subject: "Mathematics", teacher: "Mr. J. Ochieng" },
  { id: "A002", date: "2026-02-25", day: "Wednesday", status: "present", subject: "English", teacher: "Mrs. K. Akinyi" },
  { id: "A003", date: "2026-02-25", day: "Wednesday", status: "present", subject: "Physics", teacher: "Mr. S. Otieno" },
  { id: "A004", date: "2026-02-24", day: "Tuesday", status: "present", subject: "Chemistry", teacher: "Mrs. P. Wanjiku" },
  { id: "A005", date: "2026-02-24", day: "Tuesday", status: "present", subject: "History", teacher: "Mr. R. Omolo" },
  { id: "A006", date: "2026-02-24", day: "Tuesday", status: "present", subject: "Geography", teacher: "Mr. K. Kiprop" },
  { id: "A007", date: "2026-02-21", day: "Friday", status: "late", subject: "Mathematics", teacher: "Mr. J. Ochieng", remarks: "Arrived 10 minutes late" },
  { id: "A008", date: "2026-02-21", day: "Friday", status: "present", subject: "English", teacher: "Mrs. K. Akinyi" },
  { id: "A009", date: "2026-02-20", day: "Thursday", status: "excused", subject: "Kiswahili", teacher: "Mr. D. Mwangi", remarks: "Medical leave approved" },
  { id: "A010", date: "2026-02-20", day: "Thursday", status: "present", subject: "Biology", teacher: "Mrs. L. Njoroge" },
  { id: "A011", date: "2026-02-19", day: "Wednesday", status: "present", subject: "Mathematics", teacher: "Mr. J. Ochieng" },
  { id: "A012", date: "2026-02-19", day: "Wednesday", status: "present", subject: "English", teacher: "Mrs. K. Akinyi" },
  { id: "A013", date: "2026-02-18", day: "Tuesday", status: "present", subject: "Chemistry", teacher: "Mrs. P. Wanjiku" },
  { id: "A014", date: "2026-02-18", day: "Tuesday", status: "present", subject: "History", teacher: "Mr. R. Omolo" },
  { id: "A015", date: "2026-02-17", day: "Monday", status: "absent", subject: "Physics", teacher: "Mr. S. Otieno", remarks: "Unapproved absence" },
  { id: "A016", date: "2026-02-14", day: "Friday", status: "present", subject: "Mathematics", teacher: "Mr. J. Ochieng" },
  { id: "A017", date: "2026-02-14", day: "Friday", status: "present", subject: "English", teacher: "Mrs. K. Akinyi" },
  { id: "A018", date: "2026-02-13", day: "Thursday", status: "present", subject: "CRE", teacher: "Mrs. E. Kamau" },
  { id: "A019", date: "2026-02-12", day: "Wednesday", status: "present", subject: "Computer", teacher: "Mr. J. Ndegwa" },
  { id: "A020", date: "2026-02-11", day: "Tuesday", status: "present", subject: "Chemistry", teacher: "Mrs. P. Wanjiku" },
];

// Monthly summary
const monthlySummary = {
  totalDays: 18,
  present: 16,
  absent: 1,
  late: 1,
  excused: 1,
  rate: 94.4
};

export default function StudentAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState("February 2026");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "status-present";
      case "absent": return "status-absent";
      case "late": return "status-late";
      case "excused": return "status-excused";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return "✅";
      case "absent": return "❌";
      case "late": return "⏰";
      case "excused": return "📝";
      default: return "❓";
    }
  };

  // Group attendance by date
  const groupedByDate = attendanceRecords.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = {
        date: record.date,
        day: record.day,
        records: [],
        statuses: new Set()
      };
    }
    acc[record.date].records.push(record);
    acc[record.date].statuses.add(record.status);
    return acc;
  }, {} as Record<string, { date: string; day: string; records: AttendanceRecord[]; statuses: Set<string> }>);

  const sortedDates = Object.values(groupedByDate).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="attendance-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div className="header-content">
          <h1>📊 Attendance Record</h1>
          <p>Track your daily attendance and participation</p>
        </div>
        <div className="header-actions">
          <select 
            className="month-selector"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option>February 2026</option>
            <option>January 2026</option>
            <option>December 2025</option>
            <option>November 2025</option>
          </select>
        </div>
      </div>

      {/* ===== ATTENDANCE SUMMARY CARDS ===== */}
      <div className="attendance-summary">
        <div className="summary-card main">
          <div className="circular-progress">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="bg-circle" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                className="progress-circle"
                style={{ strokeDasharray: `${monthlySummary.rate * 2.83} 283` }}
              />
            </svg>
            <div className="progress-text">
              <span className="percentage">{monthlySummary.rate}%</span>
              <span className="label">Attendance</span>
            </div>
          </div>
        </div>
        <div className="summary-card">
          <div className="stat-icon present">✅</div>
          <div className="stat-info">
            <span className="stat-value">{monthlySummary.present}</span>
            <span className="stat-label">Present</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="stat-icon absent">❌</div>
          <div className="stat-info">
            <span className="stat-value">{monthlySummary.absent}</span>
            <span className="stat-label">Absent</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="stat-icon late">⏰</div>
          <div className="stat-info">
            <span className="stat-value">{monthlySummary.late}</span>
            <span className="stat-label">Late</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="stat-icon excused">📝</div>
          <div className="stat-info">
            <span className="stat-value">{monthlySummary.excused}</span>
            <span className="stat-label">Excused</span>
          </div>
        </div>
      </div>

      {/* ===== ATTENDANCE REQUIREMENTS ===== */}
      <div className="attendance-requirements">
        <h3>⚠️ Attendance Requirements</h3>
        <div className="requirement-card">
          <div className="req-info">
            <p><strong>Minimum Required:</strong> 85% attendance to qualify for examinations</p>
            <p><strong>Current Status:</strong> <span className="status-good">✅ Met</span></p>
          </div>
          <div className="req-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${monthlySummary.rate}%` }}></div>
            </div>
            <span className="req-percentage">{monthlySummary.rate}% / 85%</span>
          </div>
        </div>
      </div>

      {/* ===== DAILY ATTENDANCE LOG ===== */}
      <div className="attendance-log">
        <h3>📅 Daily Attendance Log</h3>
        <div className="log-list">
          {sortedDates.map((dateGroup) => (
            <div 
              key={dateGroup.date}
              className={`log-entry ${selectedDate === dateGroup.date ? "selected" : ""}`}
              onClick={() => setSelectedDate(selectedDate === dateGroup.date ? null : dateGroup.date)}
            >
              <div className="entry-date">
                <span className="day-name">{dateGroup.day}</span>
                <span className="day-date">
                  {new Date(dateGroup.date).toLocaleDateString("en-KE", { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="entry-status">
                {Array.from(dateGroup.statuses).map((status) => (
                  <span key={status} className={`status-pill ${getStatusColor(status)}`}>
                    {getStatusIcon(status)} {status}
                  </span>
                ))}
              </div>
              <div className="entry-expand">
                <span>{selectedDate === dateGroup.date ? "▲" : "▼"}</span>
              </div>
            </div>
          ))}

          {/* Expandable detail */}
          {selectedDate && (
            <div className="log-detail">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedByDate[selectedDate!]?.records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.subject}</td>
                      <td>{record.teacher}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)} {record.status}
                        </span>
                      </td>
                      <td>{record.remarks || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== ATTENDANCE LEGEND ===== */}
      <div className="attendance-legend">
        <h3>📋 Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon">✅</span>
            <span>Present - Attended all classes</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">⏰</span>
            <span>Late - Arrived after class started</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">📝</span>
            <span>Excused - Absence approved</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">❌</span>
            <span>Absent - Unapproved absence</span>
          </div>
        </div>
      </div>

      {/* ===== CONTACT ATTENDANCE OFFICE ===== */}
      <div className="attendance-support">
        <h3>📞 Need Help?</h3>
        <p>If you have any questions about your attendance, please contact the Attendance Office.</p>
        <div className="contact-info">
          <span>📧 attendance@greenvalley.edu</span>
          <span>📞 +254 20 123 4567</span>
          <span>🏢 Room 101, Administration Block</span>
        </div>
      </div>
    </div>
  );
}
