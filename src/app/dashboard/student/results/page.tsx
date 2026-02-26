"use client";

import { useState } from "react";
import "@/styles/student-pages.css";

// Result types
interface SubjectResult {
  subject: string;
  teacher: string;
  score: number;
  maxMarks: number;
  grade: string;
  points: number;
  rank: number;
  comments: string;
}

interface ExamResult {
  id: string;
  examName: string;
  examType: "CAT" | "Mid-Term" | "End-Term" | "Practice";
  date: string;
  totalScore: number;
  totalMax: number;
  meanGrade: string;
  meanPoints: number;
  classPosition: number;
  totalStudents: number;
  subjects: SubjectResult[];
}

// Mock results data
const examResults: ExamResult[] = [
  {
    id: "ER001",
    examName: "February 2026 Mid-Term Examination",
    examType: "Mid-Term",
    date: "2026-02-15",
    totalScore: 823,
    totalMax: 1000,
    meanGrade: "A-",
    meanPoints: 82.3,
    classPosition: 5,
    totalStudents: 45,
    subjects: [
      { subject: "Mathematics", teacher: "Mr. J. Ochieng", score: 88, maxMarks: 100, grade: "A", points: 88, rank: 3, comments: "Excellent performance! Keep up the good work." },
      { subject: "English", teacher: "Mrs. K. Akinyi", score: 82, maxMarks: 100, grade: "A-", points: 82, rank: 7, comments: "Good progress in essay writing." },
      { subject: "Kiswahili", teacher: "Mr. D. Mwangi", score: 78, maxMarks: 100, grade: "B+", points: 78, rank: 10, comments: "Work on oral expressions." },
      { subject: "Physics", teacher: "Mr. S. Otieno", score: 85, maxMarks: 100, grade: "A", points: 85, rank: 4, comments: "Great understanding of concepts." },
      { subject: "Chemistry", teacher: "Mrs. P. Wanjiku", score: 90, maxMarks: 100, grade: "A", points: 90, rank: 2, comments: "Outstanding! First in class." },
      { subject: "Biology", teacher: "Mrs. L. Njoroge", score: 80, maxMarks: 100, grade: "A-", points: 80, rank: 8, comments: "Good recall of content." },
      { subject: "Geography", teacher: "Mr. K. Kiprop", score: 75, maxMarks: 100, grade: "B+", points: 75, rank: 12, comments: "Map work needs more practice." },
      { subject: "History", teacher: "Mr. R. Omolo", score: 83, maxMarks: 100, grade: "A-", points: 83, rank: 6, comments: "Good analysis of historical events." },
      { subject: "CRE", teacher: "Mrs. E. Kamau", score: 92, maxMarks: 100, grade: "A", points: 92, rank: 1, comments: "Excellent understanding of Christian ethics." },
      { subject: "Computer", teacher: "Mr. J. Ndegwa", score: 70, maxMarks: 100, grade: "B-", points: 70, rank: 15, comments: "Practice more programming." }
    ]
  },
  {
    id: "ER002",
    examName: "January 2026 CAT 1",
    examType: "CAT",
    date: "2026-01-25",
    totalScore: 756,
    totalMax: 900,
    meanGrade: "B+",
    meanPoints: 75.6,
    classPosition: 12,
    totalStudents: 45,
    subjects: [
      { subject: "Mathematics", teacher: "Mr. J. Ochieng", score: 78, maxMarks: 90, grade: "B+", points: 78, rank: 10, comments: "Good progress." },
      { subject: "English", teacher: "Mrs. K. Akinyi", score: 80, maxMarks: 90, grade: "A-", points: 80, rank: 8, comments: "Keep it up." },
      { subject: "Kiswahili", teacher: "Mr. D. Mwangi", score: 72, maxMarks: 90, grade: "B", points: 72, rank: 15, comments: "Work harder." },
      { subject: "Physics", teacher: "Mr. S. Otieno", score: 75, maxMarks: 90, grade: "B+", points: 75, rank: 12, comments: "Average." },
      { subject: "Chemistry", teacher: "Mrs. P. Wanjiku", score: 82, maxMarks: 90, grade: "A-", points: 82, rank: 6, comments: "Good." },
      { subject: "Biology", teacher: "Mrs. L. Njoroge", score: 78, maxMarks: 90, grade: "B+", points: 78, rank: 9, comments: "Nice." },
      { subject: "Geography", teacher: "Mr. K. Kiprop", score: 70, maxMarks: 90, grade: "B", points: 70, rank: 18, comments: "Average." },
      { subject: "History", teacher: "Mr. R. Omolo", score: 76, maxMarks: 90, grade: "B+", points: 76, rank: 11, comments: "Good." },
      { subject: "CRE", teacher: "Mrs. E. Kamau", score: 85, maxMarks: 90, grade: "A", points: 85, rank: 3, comments: "Excellent." }
    ]
  },
  {
    id: "ER003",
    examName: "December 2025 End-Term Examination",
    examType: "End-Term",
    date: "2025-12-10",
    totalScore: 1678,
    totalMax: 2000,
    meanGrade: "B+",
    meanPoints: 83.9,
    classPosition: 8,
    totalStudents: 45,
    subjects: [
      { subject: "Mathematics", teacher: "Mr. J. Ochieng", score: 172, maxMarks: 200, grade: "A-", points: 86, rank: 6, comments: "Great performance." },
      { subject: "English", teacher: "Mrs. K. Akinyi", score: 168, maxMarks: 200, grade: "B+", points: 84, rank: 9, comments: "Good improvement." },
      { subject: "Kiswahili", teacher: "Mr. D. Mwangi", score: 155, maxMarks: 200, grade: "B", points: 77.5, rank: 14, comments: "Keep practicing." },
      { subject: "Physics", teacher: "Mr. S. Otieno", score: 170, maxMarks: 200, grade: "A-", points: 85, rank: 7, comments: "Well done." },
      { subject: "Chemistry", teacher: "Mrs. P. Wanjiku", score: 178, maxMarks: 200, grade: "A", points: 89, rank: 3, comments: "Excellent!" },
      { subject: "Biology", teacher: "Mrs. L. Njoroge", score: 165, maxMarks: 200, grade: "B+", points: 82.5, rank: 10, comments: "Good." },
      { subject: "Geography", teacher: "Mr. K. Kiprop", score: 160, maxMarks: 200, grade: "B", points: 80, rank: 12, comments: "Average." },
      { subject: "History", teacher: "Mr. R. Omolo", score: 172, maxMarks: 200, grade: "A-", points: 86, rank: 5, comments: "Great work." },
      { subject: "CRE", teacher: "Mrs. E. Kamau", score: 183, maxMarks: 200, grade: "A", points: 91.5, rank: 2, comments: "Outstanding!" },
      { subject: "Computer", teacher: "Mr. J. Ndegwa", score: 155, maxMarks: 200, grade: "B", points: 77.5, rank: 16, comments: "Needs improvement." }
    ]
  }
];

export default function StudentResultsPage() {
  const [selectedExam, setSelectedExam] = useState<ExamResult | null>(examResults[0]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectResult | null>(null);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "grade-a";
    if (grade.startsWith("B")) return "grade-b";
    if (grade.startsWith("C")) return "grade-c";
    return "grade-d";
  };

  const getGradePoints = (grade: string) => {
    const points: Record<string, number> = {
      "A": 12, "A-": 11, "B+": 10, "B": 9, "B-": 8,
      "C+": 7, "C": 6, "C-": 5, "D+": 4, "D": 3, "D-": 2, "E": 1
    };
    return points[grade] || 0;
  };

  return (
    <div className="results-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div className="header-content">
          <h1>📊 Exam Results</h1>
          <p>View your academic performance and progress</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">📥 Download Report</button>
        </div>
      </div>

      {/* ===== EXAM SELECTOR ===== */}
      <div className="exam-selector">
        <h3>Select Examination</h3>
        <div className="exam-tabs">
          {examResults.map((exam) => (
            <button
              key={exam.id}
              className={`exam-tab ${selectedExam?.id === exam.id ? "active" : ""}`}
              onClick={() => { setSelectedExam(exam); setSelectedSubject(null); }}
            >
              <span className="exam-name">{exam.examName}</span>
              <span className={`exam-type type-${exam.examType.toLowerCase()}`}>{exam.examType}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== RESULTS SUMMARY ===== */}
      {selectedExam && (
        <div className="results-summary">
          <div className="summary-card main">
            <div className="mean-grade-display">
              <span className="grade-label">Mean Grade</span>
              <span className={`grade-value ${getGradeColor(selectedExam.meanGrade)}`}>
                {selectedExam.meanGrade}
              </span>
            </div>
            <div className="mean-points">
              {selectedExam.meanPoints} Points
            </div>
          </div>
          
          <div className="summary-card">
            <span className="summary-label">Total Score</span>
            <span className="summary-value">{selectedExam.totalScore}/{selectedExam.totalMax}</span>
          </div>
          
          <div className="summary-card">
            <span className="summary-label">Class Position</span>
            <span className="summary-value">{selectedExam.classPosition}/{selectedExam.totalStudents}</span>
          </div>
          
          <div className="summary-card">
            <span className="summary-label">Exam Date</span>
            <span className="summary-value">
              {new Date(selectedExam.date).toLocaleDateString("en-KE", { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      )}

      {/* ===== SUBJECTS TABLE ===== */}
      {selectedExam && (
        <div className="subjects-table-container">
          <h3>Subject Performance</h3>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Points</th>
                <th>Rank</th>
                <th>Teacher</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedExam.subjects.map((subject, index) => (
                <tr 
                  key={index}
                  className={selectedSubject === subject ? "selected" : ""}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <td className="subject-name">{subject.subject}</td>
                  <td>{subject.score}/{subject.maxMarks}</td>
                  <td>
                    <span className={`grade-badge ${getGradeColor(subject.grade)}`}>
                      {subject.grade}
                    </span>
                  </td>
                  <td>{subject.points}</td>
                  <td>#{subject.rank}</td>
                  <td>{subject.teacher}</td>
                  <td>
                    <button className="view-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== SUBJECT DETAIL PANEL ===== */}
      {selectedSubject && (
        <div className="subject-detail-panel">
          <div className="panel-header">
            <h2>{selectedSubject.subject} - Detailed Analysis</h2>
            <button className="close-btn" onClick={() => setSelectedSubject(null)}>×</button>
          </div>
          <div className="panel-content">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Score</span>
                <span className="detail-value">{selectedSubject.score}/{selectedSubject.maxMarks}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Grade</span>
                <span className={`detail-value grade ${getGradeColor(selectedSubject.grade)}`}>
                  {selectedSubject.grade}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Points</span>
                <span className="detail-value">{selectedSubject.points}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Class Rank</span>
                <span className="detail-value">#{selectedSubject.rank}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Teacher</span>
                <span className="detail-value">{selectedSubject.teacher}</span>
              </div>
            </div>
            <div className="teacher-comments">
              <h4>💬 Teacher's Comments</h4>
              <p>{selectedSubject.comments}</p>
            </div>
            <div className="performance-chart">
              <h4>Performance Distribution</h4>
              <div className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ width: `${(selectedSubject.score / selectedSubject.maxMarks) * 100}%` }}
                ></div>
              </div>
              <div className="chart-labels">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== GRADING SYSTEM ===== */}
      <div className="grading-system">
        <h3>📋 KCSE Grading System</h3>
        <table className="grading-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Points</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><span className="grade-badge grade-a">A</span></td><td>12</td><td>Excellent</td></tr>
            <tr><td><span className="grade-badge grade-a">A-</span></td><td>11</td><td>Very Good</td></tr>
            <tr><td><span className="grade-badge grade-b">B+</span></td><td>10</td><td>Good</td></tr>
            <tr><td><span className="grade-badge grade-b">B</span></td><td>9</td><td>Good</td></tr>
            <tr><td><span className="grade-badge grade-b">B-</span></td><td>8</td><td>Average</td></tr>
            <tr><td><span className="grade-badge grade-c">C+</span></td><td>7</td><td>Average</td></tr>
            <tr><td><span className="grade-badge grade-c">C</span></td><td>6</td><td>Average</td></tr>
            <tr><td><span className="grade-badge grade-c">C-</span></td><td>5</td><td>Below Average</td></tr>
            <tr><td><span className="grade-badge grade-d">D+</span></td><td>4</td><td>Below Average</td></tr>
            <tr><td><span className="grade-badge grade-d">D</span></td><td>3</td><td>Poor</td></tr>
            <tr><td><span className="grade-badge grade-d">D-</span></td><td>2</td><td>Poor</td></tr>
            <tr><td><span className="grade-badge grade-e">E</span></td><td>1</td><td>Very Poor</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
