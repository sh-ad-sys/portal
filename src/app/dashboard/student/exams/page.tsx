"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/student-pages.css";

// Exam types
interface Exam {
  id: string;
  subject: string;
  paper: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  invigilator: string;
  status: "upcoming" | "completed" | "published";
  notes?: string;
  syllabus?: string[];
}

// Mock exam data
const upcomingExams: Exam[] = [
  {
    id: "EX001",
    subject: "Mathematics",
    paper: "Paper 1 (Algebra & Statistics)",
    date: "2026-03-05",
    time: "08:00 AM - 11:00 AM",
    duration: "3 hours",
    venue: "Exam Hall A",
    invigilator: "Mr. J. Ochieng",
    status: "upcoming",
    syllabus: ["Algebra", "Statistics", "Probability", "Indices", "Logarithms"],
    notes: "Bring mathematical instruments - calculator, ruler, protractor"
  },
  {
    id: "EX002",
    subject: "English",
    paper: "Paper 2 (Essays & Comprehension)",
    date: "2026-03-07",
    time: "08:00 AM - 10:30 AM",
    duration: "2.5 hours",
    venue: "Exam Hall B",
    invigilator: "Mrs. K. Akinyi",
    status: "upcoming",
    syllabus: ["Essay Writing", "Comprehension", "Summary", "Poetry"],
    notes: "Dictionary allowed"
  },
  {
    id: "EX003",
    subject: "Kiswahili",
    paper: "Paper 1 (Insha & Lugha)",
    date: "2026-03-10",
    time: "08:00 AM - 10:30 AM",
    duration: "2.5 hours",
    venue: "Exam Hall A",
    invigilator: "Mr. D. Mwangi",
    status: "upcoming",
    syllabus: ["Insha", "Sarufi", "Fasihi"],
    notes: undefined
  },
  {
    id: "EX004",
    subject: "Chemistry",
    paper: "Paper 2 (Practical)",
    date: "2026-03-12",
    time: "01:00 PM - 04:00 PM",
    duration: "3 hours",
    venue: "Science Lab 1",
    invigilator: "Mrs. P. Wanjiku",
    status: "upcoming",
    notes: "Bring lab coat and safety goggles"
  },
  {
    id: "EX005",
    subject: "Physics",
    paper: "Paper 1 (Theory)",
    date: "2026-03-14",
    time: "08:00 AM - 11:00 AM",
    duration: "3 hours",
    venue: "Exam Hall B",
    invigilator: "Mr. S. Otieno",
    status: "upcoming",
    syllabus: ["Mechanics", "Waves", "Optics", "Electricity"],
    notes: "Bring calculator"
  }
];

const completedExams: Exam[] = [
  {
    id: "EX006",
    subject: "Biology",
    paper: "Paper 1 (Theory)",
    date: "2026-02-15",
    time: "08:00 AM - 10:30 AM",
    duration: "2.5 hours",
    venue: "Exam Hall A",
    invigilator: "Mrs. L. Njoroge",
    status: "completed"
  },
  {
    id: "EX007",
    subject: "Geography",
    paper: "Paper 1 (Theory)",
    date: "2026-02-18",
    time: "08:00 AM - 10:30 AM",
    duration: "2.5 hours",
    venue: "Exam Hall B",
    invigilator: "Mr. K. Kiprop",
    status: "completed"
  },
  {
    id: "EX008",
    subject: "History",
    paper: "Paper 1 (Theory)",
    date: "2026-02-20",
    time: "08:00 AM - 11:00 AM",
    duration: "3 hours",
    venue: "Exam Hall B",
    invigilator: "Mr. R. Omolo",
    status: "completed"
  }
];

const publishedResults: Exam[] = [
  {
    id: "EX009",
    subject: "CRE",
    paper: "Paper 1",
    date: "2026-02-10",
    time: "08:00 AM - 10:30 AM",
    duration: "2.5 hours",
    venue: "Exam Hall A",
    invigilator: "Mrs. E. Kamau",
    status: "published"
  },
  {
    id: "EX010",
    subject: "Computer Studies",
    paper: "Paper 1",
    date: "2026-02-08",
    time: "08:00 AM - 10:30 AM",
    duration: "2.5 hours",
    venue: "Computer Lab",
    invigilator: "Mr. J. Ndegwa",
    status: "published"
  }
];

export default function StudentExamsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "results">("upcoming");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const handleDownloadAdmitCard = () => {
    if (!selectedExam) {
      alert("Please select an exam first.");
      return;
    }
    
    const admitCardText = `GREEN VALLEY ACADEMY - EXAM ADMIT CARD
=====================================

Student Name: [Student Name]
Admission Number: [ADM001]

Exam Details:
-------------
Subject: ${selectedExam.subject}
Paper: ${selectedExam.paper}
Date: ${formatDate(selectedExam.date)}
Time: ${selectedExam.time}
Duration: ${selectedExam.duration}
Venue: ${selectedExam.venue}
Invigilator: ${selectedExam.invigilator}

Instructions:
-------------
1. Arrive at the venue at least 30 minutes before the exam
2. Bring your student ID card
3. No electronic devices allowed
4. Follow all examination rules

---
Generated on: ${new Date().toLocaleDateString()}
Green Valley Academy`;

    const blob = new Blob([admitCardText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AdmitCard_${selectedExam.subject.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "status-upcoming";
      case "completed": return "status-completed";
      case "published": return "status-published";
      default: return "";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const daysUntil = (dateStr: string) => {
    const examDate = new Date(dateStr);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="exams-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div className="header-content">
          <h1>📝 Examinations</h1>
          <p>View upcoming exams, completed papers, and your results</p>
        </div>
        <div className="header-actions">
          <Link href="/dashboard/student/timetable" className="btn btn-secondary">
            📅 Timetable
          </Link>
        </div>
      </div>

      {/* ===== EXAM COUNTDOWN ===== */}
      <div className="exam-countdown">
        <div className="countdown-card">
          <h3>Next Exam</h3>
          {upcomingExams[0] && (
            <>
              <p className="countdown-subject">{upcomingExams[0].subject}</p>
              <p className="countdown-date">{formatDate(upcomingExams[0].date)}</p>
              <div className="countdown-timer">
                <div className="timer-block">
                  <span className="timer-value">{daysUntil(upcomingExams[0].date)}</span>
                  <span className="timer-label">Days</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="countdown-stats">
          <div className="stat-item">
            <span className="stat-number">{upcomingExams.length}</span>
            <span className="stat-text">Upcoming</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{completedExams.length}</span>
            <span className="stat-text">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{publishedResults.length}</span>
            <span className="stat-text">Results</span>
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="exam-tabs">
        <button 
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          📅 Upcoming ({upcomingExams.length})
        </button>
        <button 
          className={`tab ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          ✅ Completed ({completedExams.length})
        </button>
        <button 
          className={`tab ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          📊 Results ({publishedResults.length})
        </button>
      </div>

      {/* ===== EXAM LIST ===== */}
      <div className="exam-list">
        {activeTab === "upcoming" && upcomingExams.map((exam) => (
          <div 
            key={exam.id} 
            className={`exam-card ${selectedExam?.id === exam.id ? "selected" : ""}`}
            onClick={() => setSelectedExam(exam)}
          >
            <div className="exam-date-box">
              <span className="date-day">{new Date(exam.date).getDate()}</span>
              <span className="date-month">{new Date(exam.date).toLocaleDateString("en-KE", { month: 'short' })}</span>
            </div>
            <div className="exam-details">
              <h3>{exam.subject}</h3>
              <p className="paper-name">{exam.paper}</p>
              <div className="exam-meta">
                <span>🕐 {exam.time}</span>
                <span>📍 {exam.venue}</span>
                <span>⏱ {exam.duration}</span>
              </div>
            </div>
            <div className="exam-status">
              <span className={`status-badge ${getStatusColor(exam.status)}`}>
                {exam.status}
              </span>
              <span className="days-remaining">{daysUntil(exam.date)} days</span>
            </div>
          </div>
        ))}

        {activeTab === "completed" && completedExams.map((exam) => (
          <div 
            key={exam.id} 
            className={`exam-card completed ${selectedExam?.id === exam.id ? "selected" : ""}`}
            onClick={() => setSelectedExam(exam)}
          >
            <div className="exam-date-box">
              <span className="date-day">{new Date(exam.date).getDate()}</span>
              <span className="date-month">{new Date(exam.date).toLocaleDateString("en-KE", { month: 'short' })}</span>
            </div>
            <div className="exam-details">
              <h3>{exam.subject}</h3>
              <p className="paper-name">{exam.paper}</p>
              <div className="exam-meta">
                <span>🕐 {exam.time}</span>
                <span>📍 {exam.venue}</span>
              </div>
            </div>
            <div className="exam-status">
              <span className={`status-badge ${getStatusColor(exam.status)}`}>
                Awaiting Results
              </span>
            </div>
          </div>
        ))}

        {activeTab === "results" && publishedResults.map((exam) => (
          <div 
            key={exam.id} 
            className={`exam-card result ${selectedExam?.id === exam.id ? "selected" : ""}`}
            onClick={() => setSelectedExam(exam)}
          >
            <div className="exam-date-box">
              <span className="date-day">{new Date(exam.date).getDate()}</span>
              <span className="date-month">{new Date(exam.date).toLocaleDateString("en-KE", { month: 'short' })}</span>
            </div>
            <div className="exam-details">
              <h3>{exam.subject}</h3>
              <p className="paper-name">{exam.paper}</p>
              <div className="exam-meta">
                <span>🕐 {exam.time}</span>
                <span>📍 {exam.venue}</span>
              </div>
            </div>
            <div className="exam-status">
              <span className={`status-badge ${getStatusColor(exam.status)}`}>
                Results Available
              </span>
              <Link href="/dashboard/student/results" className="view-results-btn">
                View Score →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ===== EXAM DETAIL PANEL ===== */}
      {selectedExam && activeTab === "upcoming" && (
        <div className="exam-detail-panel">
          <div className="panel-header">
            <h2>{selectedExam.subject} - {selectedExam.paper}</h2>
            <button className="close-btn" onClick={() => setSelectedExam(null)}>×</button>
          </div>
          <div className="panel-content">
            <div className="detail-row">
              <span className="detail-label">📅 Date</span>
              <span className="detail-value">{formatDate(selectedExam.date)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">🕐 Time</span>
              <span className="detail-value">{selectedExam.time}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">⏱ Duration</span>
              <span className="detail-value">{selectedExam.duration}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">📍 Venue</span>
              <span className="detail-value">{selectedExam.venue}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">👤 Invigilator</span>
              <span className="detail-value">{selectedExam.invigilator}</span>
            </div>
            {selectedExam.notes && (
              <div className="detail-row notes">
                <span className="detail-label">📝 Important Notes</span>
                <span className="detail-value">{selectedExam.notes}</span>
              </div>
            )}
            {selectedExam.syllabus && (
              <div className="syllabus-section">
                <h4>📚 Syllabus Topics</h4>
                <div className="syllabus-tags">
                  {selectedExam.syllabus.map((topic, index) => (
                    <span key={index} className="syllabus-tag">{topic}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="panel-actions">
              <button className="btn btn-primary" onClick={handleDownloadAdmitCard}>📥 Download Admit Card</button>
              <Link href="/dashboard/student/resources" className="btn btn-secondary">📚 View Revision Materials</Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== EXAM RULES ===== */}
      <div className="exam-rules">
        <h3>📋 Examination Rules & Guidelines</h3>
        <ul>
          <li>Arrive at the venue at least 30 minutes before the exam starts</li>
          <li>Bring your student ID card and exam admit card</li>
          <li>No electronic devices allowed unless specified</li>
          <li>No communication with other students during the exam</li>
          <li>Use of unauthorized materials will result in disqualification</li>
          <li>Raise your hand if you need assistance from the invigilator</li>
        </ul>
      </div>
    </div>
  );
}
