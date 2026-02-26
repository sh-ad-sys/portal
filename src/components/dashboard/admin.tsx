"use client";

import { useRouter } from "next/navigation";
import { FaUsers, FaClipboardList, FaBook, FaBell, FaHome, FaUserPlus, FaChartLine, FaCog } from "react-icons/fa";
import type { AdminDashboardData, DashboardTask, SystemUser } from "@/types/dashboard";
import "../../styles/admin.css";

interface AdminDashboardProps {
  data: AdminDashboardData;
  isLoading?: boolean;
  error?: string;
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  'home': <FaHome />,
  'users': <FaUsers />,
  'attendance': <FaClipboardList />,
  'exams': <FaBook />,
  'notifications': <FaBell />,
  'user': <FaUserPlus />,
  'stats': <FaChartLine />,
  'settings': <FaCog />,
};

export default function AdminDashboard({ data, isLoading, error }: AdminDashboardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="admin-dashboard-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="error-state">
          <p>Error loading dashboard: {error}</p>
          <button className="primary-btn" onClick={() => router.refresh()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { adminName = "Admin", stats, tasks = [], recentUsers = [], notifications = [] } = data || {};

  // Default tasks
  const defaultTasks: DashboardTask[] = [
    {
      title: 'Admin Dashboard Home',
      description: 'Overview of all administrative functions and key metrics.',
      action: 'Go to Dashboard',
      route: '/admin',
    },
    {
      title: 'Manage Users & Roles',
      description: 'Add, edit, or remove users and assign roles.',
      action: 'Manage Users',
      route: '/admin/users',
    },
    {
      title: 'Attendance Overview',
      description: 'View attendance records for all students and teachers.',
      action: 'View Attendance',
      route: '/admin/attendance',
    },
    {
      title: 'Exam & Assignment Setup',
      description: 'Create exams, assignments, and track results.',
      action: 'Setup Exams',
      route: '/admin/exams',
    },
    {
      title: 'Notifications & Announcements',
      description: 'Send notifications and important announcements.',
      action: 'Send Notification',
      route: '/admin/notifications',
    },
    {
      title: 'Settings',
      description: 'Configure system settings and preferences.',
      action: 'Settings',
      route: '/admin/settings',
    },
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'student': return 'student';
      case 'teacher': return 'teacher';
      case 'parent': return 'parent';
      case 'admin': return 'admin';
      default: return 'default';
    }
  };

  return (
    <div className="admin-dashboard-page">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {adminName} 🔧</h1>
          <p>Manage your school efficiently.</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => router.push("/admin/profile")}
        >
          Admin Profile
        </button>
      </div>

      {/* ===== SCHOOL STATS ===== */}
      {stats && (
        <div className="summary-grid">
          <div className="summary-card" onClick={() => router.push("/admin/students")}>
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/admin/teachers")}>
            <h3>{stats.totalTeachers}</h3>
            <p>Total Teachers</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/admin/parents")}>
            <h3>{stats.totalParents}</h3>
            <p>Total Parents</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/admin/classes")}>
            <h3>{stats.totalClasses}</h3>
            <p>Total Classes</p>
          </div>
          <div className="summary-card" onClick={() => router.push("/admin/attendance")}>
            <h3>{stats.averageAttendance}%</h3>
            <p>Average Attendance</p>
          </div>
        </div>
      )}

      {/* ===== QUICK ACTIONS ===== */}
      <h2 className="section-title">Quick Actions</h2>
      <div className="dashboard-grid">
        {displayTasks.slice(0, 6).map((task, index) => (
          <div key={task.title + index} className="dashboard-card">
            <div className="card-icon">
              {iconMap[task.route.split('/').pop() || 'home'] || <FaCog />}
            </div>
            <h2 className="card-title">{task.title}</h2>
            <p className="card-desc">{task.description}</p>
            <button className="card-action" onClick={() => router.push(task.route)}>
              {task.action}
            </button>
          </div>
        ))}
      </div>

      {/* ===== RECENT USERS ===== */}
      {recentUsers.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2><FaUsers /> Recent Users</h2>
            <button className="link-btn" onClick={() => router.push("/admin/users")}>
              View All →
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user: SystemUser) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastLogin || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== RECENT NOTIFICATIONS ===== */}
      {notifications.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2><FaBell /> Recent Notifications</h2>
            <button className="link-btn" onClick={() => router.push("/admin/notifications")}>
              View All →
            </button>
          </div>
          {notifications.map((note) => (
            <div key={note.id} className="list-item">
              <div>
                <strong>{note.title}</strong>
                <p>{note.message}</p>
              </div>
              <div className="notification-meta">
                <span className={`badge ${note.status}`}>{note.status}</span>
                <span className="date">{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== ADDITIONAL STATS SECTION ===== */}
      <div className="card">
        <div className="card-header">
          <h2><FaChartLine /> School Analytics</h2>
        </div>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Student-Teacher Ratio</h3>
            <p className="analytics-value">
              {stats ? Math.round(stats.totalStudents / stats.totalTeachers) : 0}:1
            </p>
          </div>
          <div className="analytics-card">
            <h3>Parent Engagement</h3>
            <p className="analytics-value">
              {stats ? Math.round((stats.totalParents / stats.totalStudents) * 100) : 0}%
            </p>
          </div>
          <div className="analytics-card">
            <h3>Classes per Teacher</h3>
            <p className="analytics-value">
              {stats ? Math.round(stats.totalClasses / stats.totalTeachers) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
