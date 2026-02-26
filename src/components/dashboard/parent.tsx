"use client";

import { useRouter } from "next/navigation";
import { FaClipboardList, FaBook, FaBell, FaEnvelope, FaChild, FaUserGraduate } from "react-icons/fa";
import type { ParentDashboardData, ChildInfo } from "@/types/dashboard";
import "../../styles/parent.css";

interface ParentDashboardProps {
  data: ParentDashboardData;
  isLoading?: boolean;
  error?: string;
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  'attendance': <FaClipboardList />,
  'results': <FaBook />,
  'notifications': <FaBell />,
  'messages': <FaEnvelope />,
  'child': <FaChild />,
};

export default function ParentDashboard({ data, isLoading, error }: ParentDashboardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="parent-dashboard-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parent-dashboard-page">
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
    parentName = "Parent", 
    children = [], 
    selectedChildId,
    stats, 
    notifications = [],
    childAttendance = [],
    childHomework = [],
    childExamResults = []
  } = data || {};

  // Default tasks
  const defaultTasks = [
    {
      title: 'Track Child\'s Attendance & Homework',
      description: 'Monitor your child\'s attendance and submitted homework.',
      action: 'View Attendance',
      route: '/parent/attendance',
    },
    {
      title: 'View Exam Results & Performance',
      description: 'Check exam results and track academic performance.',
      action: 'View Results',
      route: '/parent/results',
    },
    {
      title: 'Receive Notifications',
      description: 'Get important school updates and announcements.',
      action: 'View Notifications',
      route: '/parent/notifications',
    },
    {
      title: 'Messaging with Teachers',
      description: 'Send messages to teachers regarding your child\'s progress.',
      action: 'Send Message',
      route: '/parent/messages',
    },
  ];

  // Filter data for selected child
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];
  const selectedAttendance = childAttendance.find(a => a.childId === selectedChild?.id);
  const selectedHomework = childHomework.filter(h => h.childId === selectedChild?.id);
  const selectedExamResults = childExamResults.filter(e => e.childId === selectedChild?.id);

  const handleChildSelect = (childId: string) => {
    // In a real app, this would update the selected child
    router.push(`/parent/child/${childId}`);
  };

  return (
    <div className="parent-dashboard-page">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {parentName} 👨‍👩‍👧</h1>
          <p>Stay connected with your child's education.</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => router.push("/parent/profile")}
        >
          My Profile
        </button>
      </div>

      {/* ===== CHILD SELECTOR ===== */}
      {children.length > 0 && (
        <div className="child-selector">
          <h3>Select Child:</h3>
          <div className="child-tabs">
            {children.map((child: ChildInfo) => (
              <button
                key={child.id}
                className={`child-tab ${child.id === selectedChildId || child.id === selectedChild?.id ? 'active' : ''}`}
                onClick={() => handleChildSelect(child.id)}
              >
                <FaChild /> {child.name} - {child.grade}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== STATS CARDS ===== */}
      {stats && (
        <div className="summary-grid">
          <div className="summary-card" onClick={() => router.push("/parent/children")}>
            <h3>{stats.totalChildren}</h3>
            <p>Children</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/parent/notifications")}>
            <h3>{stats.totalNotifications}</h3>
            <p>Notifications</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/parent/messages")}>
            <h3>{stats.unreadMessages}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
      )}

      {/* ===== SELECTED CHILD INFO ===== */}
      {selectedChild && (
        <div className="card">
          <div className="card-header">
            <h2><FaUserGraduate /> {selectedChild.name}'s Progress</h2>
            <span className="badge info">{selectedChild.grade} - {selectedChild.section}</span>
          </div>
          
          {selectedAttendance && (
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-label">Attendance Rate</span>
                <span className="stat-value">{selectedAttendance.rate}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Days Present</span>
                <span className="stat-value">{selectedAttendance.present}/{selectedAttendance.totalDays}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Days Absent</span>
                <span className="stat-value">{selectedAttendance.absent}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== QUICK ACTIONS ===== */}
      <h2 className="section-title">Quick Actions</h2>
      <div className="dashboard-grid">
        {defaultTasks.map((task, index) => (
          <div key={task.title + index} className="dashboard-card">
            <div className="card-icon">{iconMap[task.route.split('/').pop() || 'child']}</div>
            <h2 className="card-title">{task.title}</h2>
            <p className="card-desc">{task.description}</p>
            <button className="card-action" onClick={() => router.push(task.route)}>
              {task.action}
            </button>
          </div>
        ))}
      </div>

      {/* ===== HOMEWORK ===== */}
      {selectedHomework.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2><FaClipboardList /> Homework</h2>
            <button className="link-btn" onClick={() => router.push("/parent/homework")}>
              View All →
            </button>
          </div>
          {selectedHomework.map((hw) => (
            <div key={hw.id} className="list-item">
              <div>
                <strong>{hw.title}</strong>
                <span className="badge">{hw.subject}</span>
              </div>
              <div>
                <span className={`badge ${hw.status}`}>{hw.status}</span>
                <span className="date">Due: {hw.due}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== EXAM RESULTS ===== */}
      {selectedExamResults.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2><FaBook /> Recent Exam Results</h2>
            <button className="link-btn" onClick={() => router.push("/parent/results")}>
              View All →
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedExamResults.map((result) => (
                  <tr key={result.id}>
                    <td>{result.subject}</td>
                    <td>{result.score}</td>
                    <td><span className="badge grade">{result.grade}</span></td>
                    <td>{result.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== NOTIFICATIONS ===== */}
      {notifications.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2><FaBell /> Recent Notifications</h2>
            <button className="link-btn" onClick={() => router.push("/parent/notifications")}>
              View All →
            </button>
          </div>
          {notifications.slice(0, 5).map((note) => (
            <div key={note.id} className="list-item">
              <div>
                <p>{note.message}</p>
                <span className={`badge ${note.read ? 'read' : 'new'}`}>
                  {note.read ? 'Read' : 'New'}
                </span>
              </div>
              <span className="date">{note.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
