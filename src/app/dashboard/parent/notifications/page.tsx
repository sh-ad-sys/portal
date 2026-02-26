"use client";

import { useState } from "react";
import { FaBell, FaSearch, FaFilter, FaCheck, FaTrash, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../../../styles/parent-pages.css";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  { 
    id: "1", 
    type: "info",
    title: "Homework Assignment", 
    message: "New homework has been assigned for Mathematics - Chapter 5. Due date: February 28, 2026.",
    time: "2 hours ago",
    read: false 
  },
  { 
    id: "2", 
    type: "success",
    title: "Exam Results Available", 
    message: "Mid Term exam results for Physics have been published. You can view them in the Results section.",
    time: "1 day ago",
    read: false 
  },
  { 
    id: "3", 
    type: "warning",
    title: "Attendance Alert", 
    message: "Your child was marked absent on February 24, 2026. Please submit a medical certificate if applicable.",
    time: "2 days ago",
    read: true 
  },
  { 
    id: "4", 
    type: "info",
    title: "School Event", 
    message: "Parent-Teacher meeting scheduled for March 5, 2026. Please confirm your attendance.",
    time: "3 days ago",
    read: true 
  },
  { 
    id: "5", 
    type: "success",
    title: "Homework Submitted", 
    message: "English essay assignment has been submitted and graded. Score: 18/20.",
    time: "4 days ago",
    read: true 
  },
  { 
    id: "6", 
    type: "info",
    title: "Timetable Update", 
    message: "The class timetable has been updated for the new term. Please check the schedule.",
    time: "1 week ago",
    read: true 
  },
];

const getIcon = (type: string) => {
  switch(type) {
    case "info": return <FaInfoCircle />;
    case "success": return <FaCheckCircle />;
    case "warning": return <FaExclamationTriangle />;
    case "error": return <FaTimesCircle />;
    default: return <FaBell />;
  }
};

export default function ParentNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = mockNotifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "unread" && !n.read);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="parent-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaBell />
          Notifications
        </h1>
        <p>Stay updated with school announcements and alerts</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
            <FaBell />
          </div>
          <h3>{mockNotifications.length}</h3>
          <p>Total</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' }}>
            <FaBell />
          </div>
          <h3>{unreadCount}</h3>
          <p>Unread</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
            <FaCheckCircle />
          </div>
          <h3>{mockNotifications.filter(n => n.type === "success").length}</h3>
          <p>Updates</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
            <FaExclamationTriangle />
          </div>
          <h3>{mockNotifications.filter(n => n.type === "warning").length}</h3>
          <p>Alerts</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="content-card">
        <div className="card-header">
          <h2>
            <FaBell />
            All Notifications
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary">
              <FaCheck /> Mark All Read
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Notifications
            </button>
            <button 
              className={`tab ${filter === "unread" ? "active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Unread {unreadCount > 0 && (
                <span style={{ marginLeft: '6px', background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="search-bar" style={{ marginTop: '16px' }}>
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Notifications List */}
          <div style={{ marginTop: '16px' }}>
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-card ${!notification.read ? 'unread' : ''}`}
              >
                <div className={`notification-icon ${notification.type}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <div className="notification-time">{notification.time}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {!notification.read && (
                    <span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>New</span>
                  )}
                  <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="empty-state">
              <FaBell />
              <h3>No notifications</h3>
              <p>No notifications match your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
