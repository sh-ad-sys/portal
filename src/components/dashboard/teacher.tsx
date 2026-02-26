"use client";

import { useRouter } from "next/navigation";
import { FaCheck, FaPen, FaFileAlt, FaEnvelope, FaUsers, FaCalendarAlt, FaChalkboardTeacher, FaClipboardCheck, FaBell } from "react-icons/fa";
import type { TeacherDashboardData, DashboardTask } from "@/types/dashboard";
import "../../styles/teacher.css";

interface TeacherDashboardProps {
  data: TeacherDashboardData;
  isLoading?: boolean;
  error?: string;
}

// Icon mapping for dynamic rendering
const iconMap: Record<string, React.ReactNode> = {
  'attendance': <FaCheck />,
  'marks': <FaPen />,
  'homework': <FaFileAlt />,
  'messages': <FaEnvelope />,
  'schedule': <FaCalendarAlt />,
  'students': <FaUsers />,
  'class': <FaChalkboardTeacher />,
  'exam': <FaClipboardCheck />,
  'notification': <FaBell />,
};

export default function TeacherDashboard({ data, isLoading, error }: TeacherDashboardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="teacher-dashboard-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-dashboard-page">
        <div className="error-state">
          <p>Error loading dashboard: {error}</p>
          <button className="primary-btn" onClick={() => router.refresh()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { teacherName = "Teacher", stats, tasks = [], classes = [], recentAttendance = [], exams = [] } = data || {};

  // Default tasks if none provided
  const defaultTasks: DashboardTask[] = [
    {
      title: 'Mark Attendance',
      description: 'Record daily attendance for all your classes.',
      action: 'Mark Now',
      route: '/teacher/attendance',
    },
    {
      title: 'Enter & Calculate Exam Marks',
      description: 'Input exam marks and automatically calculate grades.',
      action: 'Enter Marks',
      route: '/teacher/marks',
    },
    {
      title: 'Assign & Track Homework',
      description: 'Create assignments, track submissions, and give feedback.',
      action: 'Assign Homework',
      route: '/teacher/homework',
    },
    {
      title: 'Messaging to Parents & Students',
      description: 'Send messages, updates, or reminders directly.',
      action: 'Send Message',
      route: '/teacher/messages',
    },
    {
      title: 'View Class Schedule',
      description: 'Check your upcoming classes and timetable.',
      action: 'View Schedule',
      route: '/teacher/schedule',
    },
    {
      title: 'Manage Students',
      description: 'View student profiles and performance statistics.',
      action: 'View Students',
      route: '/teacher/students',
    },
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;

  const handleTaskClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="teacher-dashboard-page">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {teacherName} 👩‍🏫</h1>
          <p>Manage your classes and students efficiently.</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => router.push("/teacher/profile")}
        >
          My Profile
        </button>
      </div>

      {/* ===== STATS CARDS ===== */}
      {stats && (
        <div className="summary-grid">
          <div className="summary-card" onClick={() => router.push("/teacher/classes")}>
            <h3>{stats.totalClasses}</h3>
            <p>Total Classes</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/teacher/marks")}>
            <h3>{stats.pendingMarks}</h3>
            <p>Pending Marks</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/teacher/homework")}>
            <h3>{stats.pendingHomework}</h3>
            <p>Pending Homework</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/teacher/messages")}>
            <h3>{stats.unreadMessages}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
      )}

      {/* ===== TASKS GRID ===== */}
      <h2 className="section-title">Quick Actions</h2>
      <div className="dashboard-grid">
        {displayTasks.map((task, index) => (
          <div key={task.title + index} className="dashboard-card">
            <div className="card-icon">{iconMap[task.route.split('/').pop() || 'class'] || <FaChalkboardTeacher />}</div>
            <h2 className="card-title">{task.title}</h2>
            <p className="card-desc">{task.description}</p>
            <button
              className="card-action"
              onClick={() => handleTaskClick(task.route)}
            >
              {task.action}
            </button>
          </div>
        ))}
      </div>

      {/* ===== CLASSES SECTION ===== */}
      {classes.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>My Classes</h2>
            <button className="link-btn" onClick={() => router.push("/teacher/classes")}>
              View All →
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Students</th>
                  <th>Schedule</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.name}</td>
                    <td>{cls.subject}</td>
                    <td>{cls.studentCount}</td>
                    <td>{cls.schedule || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== RECENT ATTENDANCE ===== */}
      {recentAttendance.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Recent Attendance</h2>
            <button className="link-btn" onClick={() => router.push("/teacher/attendance")}>
              View All →
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Class</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{classes.find(c => c.id === record.classId)?.name || 'N/A'}</td>
                    <td>{record.present}</td>
                    <td>{record.absent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== UPCOMING EXAMS ===== */}
      {exams.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Upcoming Exams</h2>
            <button className="link-btn" onClick={() => router.push("/teacher/exams")}>
              View All →
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.subject}</td>
                    <td>{exam.className}</td>
                    <td>{exam.date}</td>
                    <td><span className={`badge ${exam.status}`}>{exam.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
