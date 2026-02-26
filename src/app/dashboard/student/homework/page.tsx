"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/student-pages.css";

// Homework types
interface Homework {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: "pending" | "submitted" | "late" | "graded";
  marks: number;
  maxMarks: number;
  attachments: string[];
  submittedDate?: string;
  feedback?: string;
}

// Mock homework data
const homeworkData: Homework[] = [
  {
    id: "HW001",
    title: "History Essay: Kenya's Independence Movement",
    subject: "History",
    teacher: "Mr. R. Omolo",
    description: "Write a 1000-word essay on the key events that led to Kenya's independence. Include at least 5 key figures and their contributions.",
    dueDate: "2026-03-01",
    dueTime: "11:59 PM",
    status: "pending",
    marks: 0,
    maxMarks: 20,
    attachments: ["history_essay_guidelines.pdf", "kenya_independence_timeline.pdf"]
  },
  {
    id: "HW002",
    title: "Physics Lab Report: Simple Pendulum",
    subject: "Physics",
    teacher: "Mr. S. Otieno",
    description: "Complete the lab report for the simple pendulum experiment. Include methodology, data collection, calculations, and conclusion.",
    dueDate: "2026-03-02",
    dueTime: "04:00 PM",
    status: "pending",
    marks: 0,
    maxMarks: 15,
    attachments: ["pendulum_lab_format.pdf"]
  },
  {
    id: "HW003",
    title: "Mathematics: Algebraic Equations Worksheet",
    subject: "Mathematics",
    teacher: "Mr. J. Ochieng",
    description: "Complete questions 1-25 from Chapter 5. Show all working clearly.",
    dueDate: "2026-03-03",
    dueTime: "11:59 PM",
    status: "pending",
    marks: 0,
    maxMarks: 25,
    attachments: ["algebra_worksheet_5.pdf"]
  },
  {
    id: "HW004",
    title: "English: Book Review",
    subject: "English",
    teacher: "Mrs. K. Akinyi",
    description: "Write a book review for 'A Grain of Wheat' by Ngũgĩ wa Thiong'o. Minimum 800 words.",
    dueDate: "2026-02-28",
    dueTime: "11:59 PM",
    status: "submitted",
    marks: 0,
    maxMarks: 20,
    attachments: ["book_review_template.pdf"],
    submittedDate: "2026-02-27"
  },
  {
    id: "HW005",
    title: "Kiswahili: Insha ya Mahusiano",
    subject: "Kiswahili",
    teacher: "Mr. D. Mwangi",
    description: "Andika insha ya hadithi fupi kuhusu mahusiano katika jamii ya Kenya.urefu wa maneno 500-700.",
    dueDate: "2026-02-25",
    dueTime: "11:59 PM",
    status: "late",
    marks: 0,
    maxMarks: 15,
    attachments: [],
    submittedDate: "2026-02-26"
  },
  {
    id: "HW006",
    title: "Chemistry: Organic Chemistry Notes",
    subject: "Chemistry",
    teacher: "Mrs. P. Wanjiku",
    description: "Read and summarize Chapter 6: Organic Chemistry. Create detailed notes on hydrocarbons.",
    dueDate: "2026-02-20",
    dueTime: "11:59 PM",
    status: "graded",
    marks: 18,
    maxMarks: 20,
    attachments: [],
    feedback: "Excellent work! Well organized and comprehensive notes. Keep it up!"
  },
  {
    id: "HW007",
    title: "Geography: Map Work Exercise",
    subject: "Geography",
    teacher: "Mr. K. Kiprop",
    description: "Complete the map of East Africa. Identify all countries, capitals, and physical features.",
    dueDate: "2026-03-05",
    dueTime: "11:59 PM",
    status: "pending",
    marks: 0,
    maxMarks: 15,
    attachments: ["east_africa_map.pdf"]
  },
  {
    id: "HW008",
    title: "CRE: Sunday School Assignment",
    subject: "CRE",
    teacher: "Mrs. E. Kamau",
    description: "Research and present a 5-minute presentation on the Fruits of the Holy Spirit.",
    dueDate: "2026-03-08",
    dueTime: "11:59 PM",
    status: "pending",
    marks: 0,
    maxMarks: 10,
    attachments: ["fruits_of_spirit.pdf"]
  }
];

export default function StudentHomeworkPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "submitted" | "graded">("pending");
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  const handleDownloadHomework = (homework: Homework) => {
    const homeworkText = `GREEN VALLEY ACADEMY - HOMEWORK ASSIGNMENT
=====================================

Subject: ${homework.subject}
Teacher: ${homework.teacher}
Title: ${homework.title}

Description:
-----------
${homework.description}

Due Date: ${formatDate(homework.dueDate)} at ${homework.dueTime}
Maximum Marks: ${homework.maxMarks}

${homework.attachments.length > 0 ? `Attachments:\n- ${homework.attachments.join('\n- ')}` : ''}

---
Generated on: ${new Date().toLocaleDateString()}
Green Valley Academy`;

    const blob = new Blob([homeworkText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Homework_${homework.subject.replace(/\s+/g, '_')}_${homework.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pendingHomework = homeworkData.filter(h => h.status === "pending" || h.status === "late");
  const submittedHomework = homeworkData.filter(h => h.status === "submitted");
  const gradedHomework = homeworkData.filter(h => h.status === "graded");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "status-pending";
      case "submitted": return "status-submitted";
      case "late": return "status-late";
      case "graded": return "status-graded";
      default: return "";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const currentHomework = activeTab === "pending" ? pendingHomework : activeTab === "submitted" ? submittedHomework : gradedHomework;

  return (
    <div className="homework-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div className="header-content">
          <h1>📝 Homework & Assignments</h1>
          <p>View and submit your homework assignments</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">📤 Submit Homework</button>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="homework-stats">
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-count">{pendingHomework.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card submitted">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-count">{submittedHomework.length}</span>
            <span className="stat-label">Submitted</span>
          </div>
        </div>
        <div className="stat-card graded">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-count">{gradedHomework.length}</span>
            <span className="stat-label">Graded</span>
          </div>
        </div>
        <div className="stat-card late">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <span className="stat-count">{homeworkData.filter(h => h.status === "late").length}</span>
            <span className="stat-label">Late</span>
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="homework-tabs">
        <button 
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          ⏳ Pending ({pendingHomework.length})
        </button>
        <button 
          className={`tab ${activeTab === "submitted" ? "active" : ""}`}
          onClick={() => setActiveTab("submitted")}
        >
          ✅ Submitted ({submittedHomework.length})
        </button>
        <button 
          className={`tab ${activeTab === "graded" ? "active" : ""}`}
          onClick={() => setActiveTab("graded")}
        >
          📊 Graded ({gradedHomework.length})
        </button>
      </div>

      {/* ===== HOMEWORK LIST ===== */}
      <div className="homework-list">
        {currentHomework.map((homework) => (
          <div 
            key={homework.id} 
            className={`homework-card ${selectedHomework?.id === homework.id ? "selected" : ""}`}
            onClick={() => setSelectedHomework(homework)}
          >
            <div className="homework-subject">
              <span className="subject-badge">{homework.subject}</span>
              <span className={`status-badge ${getStatusColor(homework.status)}`}>
                {homework.status === "pending" ? "Pending" : 
                 homework.status === "submitted" ? "Submitted" :
                 homework.status === "late" ? "Late" : "Graded"}
              </span>
            </div>
            <h3 className="homework-title">{homework.title}</h3>
            <p className="homework-teacher">👤 {homework.teacher}</p>
            <div className="homework-meta">
              <span className="due-date">
                📅 Due: {formatDate(homework.dueDate)} at {homework.dueTime}
              </span>
              {homework.status === "pending" && (
                <span className={`days-remaining ${getDaysRemaining(homework.dueDate) <= 1 ? "urgent" : ""}`}>
                  {getDaysRemaining(homework.dueDate) > 0 
                    ? `${getDaysRemaining(homework.dueDate)} days left` 
                    : getDaysRemaining(homework.dueDate) === 0 
                      ? "Due Today!" 
                      : `${Math.abs(getDaysRemaining(homework.dueDate))} days overdue`}
                </span>
              )}
              {homework.status === "graded" && (
                <span className="marks-obtained">
                  📝 {homework.marks}/{homework.maxMarks} marks
                </span>
              )}
            </div>
            {homework.attachments.length > 0 && (
              <div className="attachment-indicator">
                📎 {homework.attachments.length} attachment{homework.attachments.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== HOMEWORK DETAIL PANEL ===== */}
      {selectedHomework && (
        <div className="homework-detail-panel">
          <div className="panel-header">
            <h2>{selectedHomework.title}</h2>
            <button className="close-btn" onClick={() => setSelectedHomework(null)}>×</button>
          </div>
          <div className="panel-content">
            <div className="detail-row">
              <span className="detail-label">📚 Subject</span>
              <span className="detail-value">{selectedHomework.subject}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">👤 Teacher</span>
              <span className="detail-value">{selectedHomework.teacher}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">📅 Due Date</span>
              <span className="detail-value">{formatDate(selectedHomework.dueDate)} at {selectedHomework.dueTime}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">📝 Marks</span>
              <span className="detail-value">{selectedHomework.maxMarks} marks</span>
            </div>
            
            <div className="description-section">
              <h4>Description</h4>
              <p>{selectedHomework.description}</p>
            </div>

            {selectedHomework.attachments.length > 0 && (
              <div className="attachments-section">
                <h4>📎 Attachments</h4>
                <ul className="attachment-list">
                  {selectedHomework.attachments.map((file, index) => (
                    <li key={index}>
                      <a href={`#${file}`} className="attachment-link">
                        📄 {file}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedHomework.status === "graded" && selectedHomework.feedback && (
              <div className="feedback-section">
                <h4>💬 Teacher Feedback</h4>
                <p className="feedback-text">{selectedHomework.feedback}</p>
              </div>
            )}

            <div className="panel-actions">
              {selectedHomework.status === "pending" && (
                <>
                  <button className="btn btn-primary">📤 Submit Homework</button>
                  <button className="btn btn-secondary" onClick={() => handleDownloadHomework(selectedHomework)}>📥 Download Assignment</button>
                </>
              )}
              {selectedHomework.status === "submitted" && (
                <button className="btn btn-secondary" disabled>✓ Submitted on {selectedHomework.submittedDate}</button>
              )}
              {selectedHomework.status === "graded" && (
                <button className="btn btn-secondary" onClick={() => handleDownloadHomework(selectedHomework)}>📥 Download Marked Work</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== SUBMITTION GUIDELELINES ===== */}
      <div className="submission-guidelines">
        <h3>📋 Homework Submission Guidelines</h3>
        <ul>
          <li>Submit all homework before the due date and time</li>
          <li>Late submissions will receive a 10% deduction per day</li>
          <li>All submissions must be in PDF or Word format unless specified otherwise</li>
          <li>Include your name, admission number, and subject in the document header</li>
          <li>For group projects, submit only one copy per group</li>
          <li>Contact your teacher immediately if you face any difficulties</li>
        </ul>
      </div>
    </div>
  );
}
