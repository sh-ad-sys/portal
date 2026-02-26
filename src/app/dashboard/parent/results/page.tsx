"use client";

import { useState } from "react";
import { FaGraduationCap, FaChartLine, FaDownload, FaStar, FaSearch, FaFilter } from "react-icons/fa";
import "../../../../styles/parent-pages.css";

interface ExamResult {
  id: string;
  examName: string;
  subject: string;
  date: string;
  marks: number;
  totalMarks: number;
  grade: string;
  percentage: number;
  trend: "up" | "down" | "stable";
}

const mockResults: ExamResult[] = [
  { id: "1", examName: "Mid Term 2026", subject: "Mathematics", date: "2026-02-20", marks: 85, totalMarks: 100, grade: "A", percentage: 85, trend: "up" },
  { id: "2", examName: "Mid Term 2026", subject: "Physics", date: "2026-02-18", marks: 78, totalMarks: 100, grade: "B+", percentage: 78, trend: "up" },
  { id: "3", examName: "Mid Term 2026", subject: "Chemistry", date: "2026-02-15", marks: 92, totalMarks: 100, grade: "A+", percentage: 92, trend: "up" },
  { id: "4", examName: "Mid Term 2026", subject: "English", date: "2026-02-12", marks: 72, totalMarks: 100, grade: "B", percentage: 72, trend: "stable" },
  { id: "5", examName: "Mid Term 2026", subject: "History", date: "2026-02-10", marks: 68, totalMarks: 100, grade: "C+", percentage: 68, trend: "down" },
  { id: "6", examName: "Unit Test 3", subject: "Mathematics", date: "2026-01-28", marks: 80, totalMarks: 100, grade: "A-", percentage: 80, trend: "up" },
];

const getGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "excellent";
  if (grade.startsWith("B")) return "good";
  if (grade.startsWith("C")) return "average";
  return "needs-improvement";
};

export default function ParentResultsPage() {
  const [selectedExam, setSelectedExam] = useState("Mid Term 2026");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = mockResults.filter(r => 
    r.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const average = Math.round(mockResults.reduce((acc, r) => acc + r.percentage, 0) / mockResults.length);
  const highest = Math.max(...mockResults.map(r => r.percentage));
  const lowest = Math.min(...mockResults.map(r => r.percentage));

  const getGradeDistribution = () => {
    const dist = { A: 0, B: 0, C: 0, D: 0 };
    mockResults.forEach(r => {
      if (r.grade.startsWith("A")) dist.A++;
      else if (r.grade.startsWith("B")) dist.B++;
      else if (r.grade.startsWith("C")) dist.C++;
      else dist.D++;
    });
    return dist;
  };

  const distribution = getGradeDistribution();

  return (
    <div className="parent-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaGraduationCap />
          Exam Results
        </h1>
        <p>View your child's academic performance and grades</p>
      </div>

      {/* Child Profile Card */}
      <div className="child-profile-card">
        <div className="child-avatar">AJ</div>
        <h2>Alex Johnson</h2>
        <p className="grade-info">Grade 10-A • Mid Term Results</p>
        <div className="quick-stats">
          <div className="quick-stat">
            <div className="value">{average}%</div>
            <div className="label">Average</div>
          </div>
          <div className="quick-stat">
            <div className="value">{highest}%</div>
            <div className="label">Highest</div>
          </div>
          <div className="quick-stat">
            <div className="value">{lowest}%</div>
            <div className="label">Lowest</div>
          </div>
          <div className="quick-stat">
            <div className="value">6</div>
            <div className="label">Subjects</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab active">All Results</button>
        <button className="tab">Term Exams</button>
        <button className="tab">Unit Tests</button>
        <button className="tab">Quizzes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginTop: '24px' }}>
        {/* Results Table */}
        <div className="content-card">
          <div className="card-header">
            <h2>
              <FaChartLine />
              Subject Grades
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select 
                className="form-control" 
                style={{ width: 'auto' }}
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option>Mid Term 2026</option>
                <option>Unit Test 3</option>
                <option>Unit Test 2</option>
              </select>
              <button className="btn btn-secondary">
                <FaDownload /> Download
              </button>
            </div>
          </div>
          <div className="card-body">
            {/* Search */}
            <div className="search-bar">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ padding: '0 16px' }}>
              {filteredResults.map((result) => (
                <div key={result.id} className="result-subject">
                  <div className="subject-name">
                    {result.subject}
                    {result.percentage >= 90 && <FaStar style={{ color: '#f59e0b', marginLeft: '8px', fontSize: '14px' }} />}
                  </div>
                  <div className="subject-marks">
                    <span style={{ color: '#64748b', fontSize: '13px' }}>
                      {result.marks}/{result.totalMarks}
                    </span>
                    <span className={`marks-badge ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                    <span style={{ 
                      color: result.trend === 'up' ? '#10b981' : result.trend === 'down' ? '#ef4444' : '#64748b',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {result.trend === 'up' ? '↑' : result.trend === 'down' ? '↓' : '→'} {result.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Summary */}
            <div style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ marginBottom: '16px', color: '#1e293b' }}>Performance Summary</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{distribution.A}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Grade A</div>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>{distribution.B}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Grade B</div>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>{distribution.C}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Grade C</div>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>{distribution.D}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Grade D</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div>
          <div className="progress-card" style={{ marginBottom: '20px' }}>
            <h3>Overall Performance</h3>
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: `conic-gradient(#10b981 ${average * 3.6}deg, #e2e8f0 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <div style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>{average}%</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Average</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <span className="badge" style={{ background: '#d1fae5', color: '#059669' }}>Above Average</span>
            </div>
          </div>

          <div className="progress-card">
            <h3>Performance Trend</h3>
            <div className="activity-timeline" style={{ marginTop: '16px' }}>
              <div className="activity-item">
                <div className="activity-time">Mid Term 2026</div>
                <div className="activity-title" style={{ color: '#10b981' }}>85% Average</div>
                <div className="activity-desc">Excellent performance</div>
              </div>
              <div className="activity-item">
                <div className="activity-time">Unit Test 3</div>
                <div className="activity-title" style={{ color: '#3b82f6' }}>80% Average</div>
                <div className="activity-desc">Good improvement</div>
              </div>
              <div className="activity-item">
                <div className="activity-time">Unit Test 2</div>
                <div className="activity-title" style={{ color: '#f59e0b' }}>75% Average</div>
                <div className="activity-desc">Stable performance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
