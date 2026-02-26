"use client";

import { useState } from "react";
import { FaFileAlt, FaSearch, FaPlus, FaEdit, FaEye, FaTrash, FaPaperPlane, FaClock } from "react-icons/fa";
import "../../../../styles/teacher-pages.css";

interface Homework {
  id: string;
  title: string;
  subject: string;
  class: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  status: "active" | "closed" | "draft";
  submissions: number;
  totalStudents: number;
}

const mockHomework: Homework[] = [
  { 
    id: "1", 
    title: "Algebra Equations Practice", 
    subject: "Mathematics", 
    class: "Grade 10-A", 
    description: "Complete all odd-numbered problems from Chapter 5. Show all working steps.",
    dueDate: "2026-02-28", 
    totalMarks: 20, 
    status: "active", 
    submissions: 25,
    totalStudents: 35 
  },
  { 
    id: "2", 
    title: "Physics Lab Report", 
    subject: "Physics", 
    class: "Grade 10-A", 
    description: "Write a lab report on the pendulum experiment conducted in class.",
    dueDate: "2026-03-01", 
    totalMarks: 30, 
    status: "active", 
    submissions: 15,
    totalStudents: 35 
  },
  { 
    id: "3", 
    title: "Chemistry Vocabulary", 
    subject: "Chemistry", 
    class: "Grade 11-A", 
    description: "Learn and write definitions for all key terms in Unit 3.",
    dueDate: "2026-02-20", 
    totalMarks: 10, 
    status: "closed", 
    submissions: 28,
    totalStudents: 30 
  },
  { 
    id: "4", 
    title: "Essay - Shakespeare", 
    subject: "English", 
    class: "Grade 10-B", 
    description: "Write a 500-word essay on the theme of ambition in Macbeth.",
    dueDate: "2026-03-05", 
    totalMarks: 25, 
    status: "draft", 
    submissions: 0,
    totalStudents: 32 
  },
];

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  status: "submitted" | "late" | "not_submitted";
  marks: number | null;
}

const mockSubmissions: Submission[] = [
  { id: "1", studentName: "Alex Johnson", studentId: "STU001", submittedAt: "2026-02-27 14:30", status: "submitted", marks: 18 },
  { id: "2", studentName: "Emma Wilson", studentId: "STU002", submittedAt: "2026-02-27 09:15", status: "submitted", marks: null },
  { id: "3", studentName: "Michael Brown", studentId: "STU003", submittedAt: "", status: "not_submitted", marks: null },
  { id: "4", studentName: "Sarah Davis", studentId: "STU004", submittedAt: "2026-02-28 08:45", status: "late", marks: null },
  { id: "5", studentName: "James Miller", studentId: "STU005", submittedAt: "2026-02-26 16:20", status: "submitted", marks: 20 },
];

export default function TeacherHomeworkPage() {
  const [activeTab, setActiveTab] = useState<"homework" | "submissions">("homework");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(mockHomework[0]);

  const filteredHomework = mockHomework.filter(hw => 
    hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hw.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hw.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingSubmissions = mockSubmissions.filter(s => s.status !== "submitted").length;

  return (
    <div className="teacher-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaFileAlt />
          Homework & Assignments
        </h1>
        <p>Create, manage, and track homework assignments for your classes</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "homework" ? "active" : ""}`}
          onClick={() => setActiveTab("homework")}
        >
          My Homework
        </button>
        <button 
          className={`tab ${activeTab === "submissions" ? "active" : ""}`}
          onClick={() => setActiveTab("submissions")}
        >
          Submissions
        </button>
      </div>

      {activeTab === "homework" ? (
        <>
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <FaFileAlt />
              </div>
              <h3>{mockHomework.length}</h3>
              <p>Total Assignments</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <FaFileAlt />
              </div>
              <h3>{mockHomework.filter(h => h.status === "active").length}</h3>
              <p>Active</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <FaClock />
              </div>
              <h3>{mockHomework.filter(h => h.status === "draft").length}</h3>
              <p>Drafts</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">
                <FaPaperPlane />
              </div>
              <h3>{pendingSubmissions}</h3>
              <p>Pending Submissions</p>
            </div>
          </div>

          {/* Homework List */}
          <div className="content-card">
            <div className="card-header">
              <h2>
                <FaFileAlt />
                All Homework Assignments
              </h2>
              <button className="btn btn-primary">
                <FaPlus /> Create Homework
              </button>
            </div>
            <div className="card-body">
              {/* Search */}
              <div className="search-bar">
                <FaSearch />
                <input 
                  type="text" 
                  placeholder="Search homework by title, subject or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Class</th>
                    <th>Due Date</th>
                    <th>Marks</th>
                    <th>Submissions</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHomework.map((hw) => (
                    <tr key={hw.id}>
                      <td><strong>{hw.title}</strong></td>
                      <td>{hw.subject}</td>
                      <td>{hw.class}</td>
                      <td>{hw.dueDate}</td>
                      <td>{hw.totalMarks}</td>
                      <td>{hw.submissions}/{hw.totalStudents}</td>
                      <td>
                        <span className={`badge ${hw.status}`}>
                          {hw.status.charAt(0).toUpperCase() + hw.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px' }} title="View">
                            <FaEye />
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '6px' }} title="Edit">
                            <FaEdit />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '6px' }} title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Submissions */}
          <div className="content-card">
            <div className="card-header">
              <h2>
                <FaPaperPlane />
                Submissions - {selectedHomework?.title}
              </h2>
              <select className="form-control" style={{ width: 'auto' }}>
                <option>Algebra Equations Practice - Grade 10-A</option>
                <option>Physics Lab Report - Grade 10-A</option>
              </select>
            </div>
            <div className="card-body">
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

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Submitted At</th>
                    <th>Status</th>
                    <th>Marks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.studentId}</td>
                      <td><strong>{submission.studentName}</strong></td>
                      <td>{submission.submittedAt || "-"}</td>
                      <td>
                        <span className={`badge ${submission.status}`}>
                          {submission.status === "not_submitted" ? "Not Submitted" : 
                           submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {submission.marks !== null ? (
                          <span className="badge submitted">{submission.marks}/{selectedHomework?.totalMarks}</span>
                        ) : (
                          <input 
                            type="number" 
                            placeholder="Enter"
                            className="form-control"
                            style={{ width: '80px', padding: '6px' }}
                          />
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px' }} title="View Submission">
                            <FaEye />
                          </button>
                          {submission.marks === null && (
                            <button className="btn btn-primary" style={{ padding: '6px 12px' }}>
                              Grade
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Summary:</strong> {mockSubmissions.filter(s => s.status === "submitted").length} submitted | {mockSubmissions.filter(s => s.status === "late").length} late | {mockSubmissions.filter(s => s.status === "not_submitted").length} not submitted
                </div>
                <button className="btn btn-primary">
                  <FaPaperPlane /> Send Reminders
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
