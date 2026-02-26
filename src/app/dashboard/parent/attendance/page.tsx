"use client";

import { useState } from "react";
import { FaClipboardList, FaCheck, FaTimes, FaCalendarAlt, FaUserGraduate, FaChartLine } from "react-icons/fa";
import "../../../../styles/parent-pages.css";

interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  status: "present" | "absent" | "late";
  subject?: string;
  remarks?: string;
}

const mockAttendance: AttendanceRecord[] = [
  { id: "1", date: "2026-02-26", day: "Wednesday", status: "present", subject: "Mathematics" },
  { id: "2", date: "2026-02-25", day: "Tuesday", status: "present", subject: "Physics" },
  { id: "3", date: "2026-02-24", day: "Monday", status: "absent", remarks: "Sick leave" },
  { id: "4", date: "2026-02-21", day: "Friday", status: "present", subject: "Chemistry" },
  { id: "5", date: "2026-02-20", day: "Thursday", status: "late", subject: "English" },
  { id: "6", date: "2026-02-19", day: "Wednesday", status: "present", subject: "Mathematics" },
  { id: "7", date: "2026-02-18", day: "Tuesday", status: "present", subject: "History" },
  { id: "8", date: "2026-02-17", day: "Monday", status: "present", subject: "Geography" },
];

export default function ParentAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState("February 2026");

  const stats = {
    total: 20,
    present: 17,
    absent: 2,
    late: 1,
    rate: 85,
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "present": return <FaCheck style={{ color: '#10b981' }} />;
      case "absent": return <FaTimes style={{ color: '#ef4444' }} />;
      case "late": return <span style={{ color: '#f59e0b', fontSize: '12px' }}>L</span>;
      default: return null;
    }
  };

  return (
    <div className="parent-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaClipboardList />
          Attendance Record
        </h1>
        <p>Track your child's attendance and punctuality</p>
      </div>

      {/* Child Profile Card */}
      <div className="child-profile-card">
        <div className="child-avatar">AJ</div>
        <h2>Alex Johnson</h2>
        <p className="grade-info">Grade 10-A • Section Alpha</p>
        <div className="quick-stats">
          <div className="quick-stat">
            <div className="value">{stats.present}</div>
            <div className="label">Present</div>
          </div>
          <div className="quick-stat">
            <div className="value">{stats.absent}</div>
            <div className="label">Absent</div>
          </div>
          <div className="quick-stat">
            <div className="value">{stats.late}</div>
            <div className="label">Late</div>
          </div>
          <div className="quick-stat">
            <div className="value">{stats.rate}%</div>
            <div className="label">Attendance</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Stats Cards */}
        <div>
          <div className="progress-card" style={{ marginBottom: '20px' }}>
            <h3>Attendance Rate</h3>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="fill green" style={{ width: `${stats.rate}%` }}></div>
              </div>
            </div>
            <div className="progress-value">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="progress-card">
            <h3>Monthly Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>February</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>85%</span>
                </div>
                <div className="progress-bar">
                  <div className="fill green" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>January</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>92%</span>
                </div>
                <div className="progress-bar">
                  <div className="fill green" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>December</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>88%</span>
                </div>
                <div className="progress-bar">
                  <div className="fill blue" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="content-card">
          <div className="card-header">
            <h2>
              <FaCalendarAlt />
              Attendance History
            </h2>
            <select 
              className="form-control" 
              style={{ width: 'auto' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option>February 2026</option>
              <option>January 2026</option>
              <option>December 2025</option>
              <option>November 2025</option>
            </select>
          </div>
          <div className="card-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.day}</td>
                    <td>{record.subject || '-'}</td>
                    <td>
                      <span className={`badge ${record.status}`}>
                        {getStatusIcon(record.status)}
                        <span style={{ marginLeft: '6px' }}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '13px' }}>
                      {record.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
