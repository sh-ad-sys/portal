"use client";

import { useState } from "react";
import { FaCheck, FaTimes, FaSearch, FaFilter, FaDownload, FaUserPlus, FaClipboardList } from "react-icons/fa";
import "../../../../styles/teacher-pages.css";

interface AttendanceRecord {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  subject: string;
}

const mockAttendanceData: AttendanceRecord[] = [
  { id: "1", studentName: "Alex Johnson", studentId: "STU001", class: "Grade 10-A", date: "2026-02-26", status: "present", subject: "Mathematics" },
  { id: "2", studentName: "Emma Wilson", studentId: "STU002", class: "Grade 10-A", date: "2026-02-26", status: "present", subject: "Mathematics" },
  { id: "3", studentName: "Michael Brown", studentId: "STU003", class: "Grade 10-A", date: "2026-02-26", status: "absent", subject: "Mathematics" },
  { id: "4", studentName: "Sarah Davis", studentId: "STU004", class: "Grade 10-A", date: "2026-02-26", status: "present", subject: "Mathematics" },
  { id: "5", studentName: "James Miller", studentId: "STU005", class: "Grade 10-A", date: "2026-02-26", status: "late", subject: "Mathematics" },
  { id: "6", studentName: "Lisa Anderson", studentId: "STU006", class: "Grade 10-A", date: "2026-02-26", status: "excused", subject: "Mathematics" },
  { id: "7", studentName: "David Taylor", studentId: "STU007", class: "Grade 10-A", date: "2026-02-26", status: "present", subject: "Mathematics" },
  { id: "8", studentName: "Jennifer White", studentId: "STU008", class: "Grade 10-A", date: "2026-02-26", status: "present", subject: "Mathematics" },
];

export default function TeacherAttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [selectedDate, setSelectedDate] = useState("2026-02-26");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  const handleStatusChange = (id: string, status: AttendanceRecord["status"]) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.id === id ? { ...record, status } : record
      )
    );
  };

  const getStatusCounts = () => {
    return {
      present: attendanceData.filter(r => r.status === "present").length,
      absent: attendanceData.filter(r => r.status === "absent").length,
      late: attendanceData.filter(r => r.status === "late").length,
      excused: attendanceData.filter(r => r.status === "excused").length,
    };
  };

  const counts = getStatusCounts();
  const attendanceRate = Math.round((counts.present / attendanceData.length) * 100);

  const filteredStudents = attendanceData.filter(student => 
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="teacher-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaClipboardList />
          Mark Attendance
        </h1>
        <p>Track and manage student attendance for your classes</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <FaCheck />
          </div>
          <h3>{counts.present}</h3>
          <p>Present</p>
          <div className="stat-change positive">
            <span>↑ {attendanceRate}% attendance rate</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <FaTimes />
          </div>
          <h3>{counts.absent}</h3>
          <p>Absent</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <FaCheck />
          </div>
          <h3>{counts.late}</h3>
          <p>Late Arrivals</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaClipboardList />
          </div>
          <h3>{counts.excused}</h3>
          <p>Excused</p>
        </div>
      </div>

      {/* Filters */}
      <div className="content-card">
        <div className="card-header">
          <h2>
            <FaClipboardList />
            Class Attendance - {selectedDate}
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary">
              <FaDownload /> Export
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="filters-bar">
            <div className="filter-group">
              <label>Date:</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-control"
                style={{ width: 'auto' }}
              />
            </div>
            <div className="filter-group">
              <label>Class:</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="form-control"
                style={{ width: 'auto' }}
              >
                <option value="all">All Classes</option>
                <option value="10a">Grade 10-A</option>
                <option value="10b">Grade 10-B</option>
                <option value="11a">Grade 11-A</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Subject:</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-control"
                style={{ width: 'auto' }}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="search-bar">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Attendance Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>
                    <strong>{student.studentName}</strong>
                  </td>
                  <td>{student.class}</td>
                  <td>{student.subject}</td>
                  <td>
                    <span className={`badge ${student.status}`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className={`btn ${student.status === 'present' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleStatusChange(student.id, 'present')}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Present
                      </button>
                      <button 
                        className={`btn ${student.status === 'absent' ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Absent
                      </button>
                      <button 
                        className={`btn ${student.status === 'late' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleStatusChange(student.id, 'late')}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Late
                      </button>
                      <button 
                        className={`btn ${student.status === 'excused' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleStatusChange(student.id, 'excused')}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Excused
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Class Summary:</strong> {attendanceData.length} students | {counts.present} present | {counts.absent} absent
            </div>
            <button className="btn btn-primary">
              <FaCheck /> Save Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
