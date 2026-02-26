"use client";

import { useState } from "react";
import { FaPen, FaSearch, FaFilter, FaDownload, FaPlus, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import "../../../../styles/teacher-pages.css";

interface ExamRecord {
  id: string;
  subject: string;
  class: string;
  examType: string;
  date: string;
  totalMarks: number;
  status: "published" | "pending" | "draft";
  submitted: number;
}

interface StudentMark {
  id: string;
  studentName: string;
  studentId: string;
  marks: number;
  totalMarks: number;
  grade: string;
  status: "entered" | "pending";
}

const mockExams: ExamRecord[] = [
  { id: "1", subject: "Mathematics", class: "Grade 10-A", examType: "Mid Term", date: "2026-02-20", totalMarks: 100, status: "published", submitted: 35 },
  { id: "2", subject: "Physics", class: "Grade 10-A", examType: "Unit Test", date: "2026-02-22", totalMarks: 50, status: "pending", submitted: 0 },
  { id: "3", subject: "Chemistry", class: "Grade 11-A", examType: "Mid Term", date: "2026-02-25", totalMarks: 100, status: "draft", submitted: 0 },
  { id: "4", subject: "Mathematics", class: "Grade 10-B", examType: "Quiz", date: "2026-02-18", totalMarks: 25, status: "published", submitted: 30 },
];

const mockMarks: StudentMark[] = [
  { id: "1", studentName: "Alex Johnson", studentId: "STU001", marks: 85, totalMarks: 100, grade: "A", status: "entered" },
  { id: "2", studentName: "Emma Wilson", studentId: "STU002", marks: 72, totalMarks: 100, grade: "B", status: "entered" },
  { id: "3", studentName: "Michael Brown", studentId: "STU003", marks: 0, totalMarks: 100, grade: "-", status: "pending" },
  { id: "4", studentName: "Sarah Davis", studentId: "STU004", marks: 91, totalMarks: 100, grade: "A", status: "entered" },
  { id: "5", studentName: "James Miller", studentId: "STU005", marks: 68, totalMarks: 100, grade: "C", status: "entered" },
  { id: "6", studentName: "Lisa Anderson", studentId: "STU006", marks: 0, totalMarks: 100, grade: "-", status: "pending" },
];

export default function TeacherExamsPage() {
  const [activeTab, setActiveTab] = useState<"exams" | "marks">("exams");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState<ExamRecord | null>(mockExams[0]);

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case "A": return "grade-a";
      case "B": return "grade-b";
      case "C": return "grade-c";
      case "D": return "grade-d";
      default: return "";
    }
  };

  const filteredMarks = mockMarks.filter(student => 
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="teacher-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaPen />
          Exam & Marks Management
        </h1>
        <p>Create exams, enter marks, and manage student performance</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "exams" ? "active" : ""}`}
          onClick={() => setActiveTab("exams")}
        >
          My Exams
        </button>
        <button 
          className={`tab ${activeTab === "marks" ? "active" : ""}`}
          onClick={() => setActiveTab("marks")}
        >
          Enter Marks
        </button>
      </div>

      {activeTab === "exams" ? (
        <>
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <FaPen />
              </div>
              <h3>{mockExams.length}</h3>
              <p>Total Exams</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <FaPen />
              </div>
              <h3>{mockExams.filter(e => e.status === "published").length}</h3>
              <p>Published</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <FaPen />
              </div>
              <h3>{mockExams.filter(e => e.status === "pending").length}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">
                <FaPen />
              </div>
              <h3>{mockExams.filter(e => e.status === "draft").length}</h3>
              <p>Drafts</p>
            </div>
          </div>

          {/* Exams List */}
          <div className="content-card">
            <div className="card-header">
              <h2>
                <FaPen />
                Scheduled Exams
              </h2>
              <button className="btn btn-primary">
                <FaPlus /> Create Exam
              </button>
            </div>
            <div className="card-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Class</th>
                    <th>Exam Type</th>
                    <th>Date</th>
                    <th>Total Marks</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockExams.map((exam) => (
                    <tr key={exam.id}>
                      <td><strong>{exam.subject}</strong></td>
                      <td>{exam.class}</td>
                      <td>{exam.examType}</td>
                      <td>{exam.date}</td>
                      <td>{exam.totalMarks}</td>
                      <td>{exam.submitted}/{mockMarks.length}</td>
                      <td>
                        <span className={`badge ${exam.status}`}>
                          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
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
          {/* Marks Entry */}
          <div className="content-card">
            <div className="card-header">
              <h2>
                <FaPen />
                Enter Marks - {selectedExam?.subject} ({selectedExam?.class})
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select className="form-control" style={{ width: 'auto' }}>
                  <option>Mathematics - Grade 10-A - Mid Term</option>
                  <option>Physics - Grade 10-A - Unit Test</option>
                </select>
                <button className="btn btn-secondary">
                  <FaDownload /> Export
                </button>
              </div>
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
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarks.map((student) => (
                    <tr key={student.id}>
                      <td>{student.studentId}</td>
                      <td><strong>{student.studentName}</strong></td>
                      <td>
                        <input 
                          type="number" 
                          defaultValue={student.marks || ""}
                          placeholder="Enter marks"
                          className="form-control"
                          style={{ width: '100px', padding: '8px' }}
                          disabled={student.status === "entered"}
                        />
                      </td>
                      <td>{student.totalMarks}</td>
                      <td>
                        <span className={`badge ${getGradeColor(student.grade)}`}>
                          {student.grade}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${student.status === "entered" ? "submitted" : "pending"}`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-primary" style={{ padding: '8px 16px' }}>
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Progress:</strong> {mockMarks.filter(m => m.status === "entered").length}/{mockMarks.length} marks entered
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary">Save as Draft</button>
                  <button className="btn btn-primary">Publish Results</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
