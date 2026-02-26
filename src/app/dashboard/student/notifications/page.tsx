"use client";

import { useState } from "react";
import "@/styles/notifications.css";

// Notification types
interface Notification {
  id: string;
  type: "general" | "academic" | "admin" | "alert";
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  isImportant: boolean;
  sender: string;
  category: string;
  attachments?: string[];
}

// Mock notifications data
const notificationsData: Notification[] = [
  {
    id: "N001",
    type: "academic",
    title: "Mathematics Exam Results Released",
    message: "Your Mathematics Paper 1 results have been released. You scored 85% (Grade A). Great work!",
    time: "2 hours ago",
    date: "2026-02-25",
    isRead: false,
    isImportant: true,
    sender: "Mr. J. Ochieng",
    category: "Academic",
  },
  {
    id: "N002",
    type: "admin",
    title: "School Fee Payment Reminder",
    message: "This is a reminder that the second term school fees are due by March 1st, 2026. Please ensure payment is made on time to avoid any inconvenience.",
    time: "5 hours ago",
    date: "2026-02-25",
    isRead: false,
    isImportant: true,
    sender: "Finance Office",
    category: "Administration",
  },
  {
    id: "N003",
    type: "general",
    title: "Tomorrow's Assembly Schedule",
    message: "Tomorrow's morning assembly will be held in the main hall at 7:30 AM sharp. All students are required to attend in their full uniform.",
    time: "Yesterday",
    date: "2026-02-24",
    isRead: true,
    isImportant: false,
    sender: "Deputy Principal",
    category: "General",
  },
  {
    id: "N004",
    type: "academic",
    title: "Homework Submitted: History Essay",
    message: "Your History essay 'Kenya's Independence Movement' has been submitted successfully. Teacher feedback will be available within 3 days.",
    time: "Yesterday",
    date: "2026-02-24",
    isRead: true,
    isImportant: false,
    sender: "Mr. R. Omolo",
    category: "Academic",
  },
  {
    id: "N005",
    type: "alert",
    title: "Lab Safety Reminder",
    message: "When attending Chemistry and Biology labs, always wear your lab coat and safety goggles. Failure to comply may result in being sent out of the lab.",
    time: "2 days ago",
    date: "2026-02-23",
    isRead: true,
    isImportant: false,
    sender: "Science Department",
    category: "Alert",
  },
  {
    id: "N006",
    type: "general",
    title: "Sports Day Registration Open",
    message: "Registration for Sports Day activities is now open. Sign up at the Games Master's office by February 28th. Events include track, field, and team sports.",
    time: "3 days ago",
    date: "2026-02-22",
    isRead: true,
    isImportant: false,
    sender: "Games Department",
    category: "General",
  },
  {
    id: "N007",
    type: "academic",
    title: "New Study Materials Available",
    message: "New revision materials for Physics and Chemistry have been uploaded to the Resources section. All students are encouraged to download and use them for exam preparation.",
    time: "4 days ago",
    date: "2026-02-21",
    isRead: true,
    isImportant: false,
    sender: "Library",
    category: "Academic",
  },
  {
    id: "N008",
    type: "admin",
    title: "Uniform Shop Hours Extended",
    message: "The school uniform shop will now be open on Saturdays from 9:00 AM to 1:00 PM to accommodate working parents. This is effective from this Saturday.",
    time: "5 days ago",
    date: "2026-02-20",
    isRead: true,
    isImportant: false,
    sender: "Administration",
    category: "Administration",
  },
];

export default function StudentNotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = notificationsData.filter(n => !n.isRead).length;
  const importantCount = notificationsData.filter(n => n.isImportant).length;

  const filteredNotifications = notificationsData.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.isRead;
    if (activeFilter === "important") return notification.isImportant;
    if (activeFilter === "academic") return notification.category === "Academic";
    if (activeFilter === "admin") return notification.category === "Administration";
    if (activeFilter === "general") return notification.category === "General";
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "academic": return "📚";
      case "admin": return "🏫";
      case "alert": return "⚠️";
      default: return "📢";
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case "academic": return "academic";
      case "admin": return "admin";
      case "alert": return "alert";
      default: return "general";
    }
  };

  const handleMarkAllRead = () => {
    // In production, this would update the backend
    alert("All notifications marked as read!");
  };

  return (
    <div className="notifications-page">
      {/* ===== HEADER ===== */}
      <div className="notifications-header">
        <div className="header-left">
          <h1>🔔 Notifications</h1>
          <p>Stay updated with the latest announcements and alerts</p>
        </div>
        <div className="header-actions">
          <button className="mark-all-btn" onClick={handleMarkAllRead}>
            ✓ Mark All as Read
          </button>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="notifications-stats">
        <div className="stat-box unread">
          <div className="stat-icon">📩</div>
          <div className="stat-info">
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">Unread</div>
          </div>
        </div>
        <div className="stat-box important">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{importantCount}</div>
            <div className="stat-label">Important</div>
          </div>
        </div>
        <div className="stat-box academic">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <div className="stat-value">{notificationsData.filter(n => n.category === 'Academic').length}</div>
            <div className="stat-label">Academic</div>
          </div>
        </div>
        <div className="stat-box all">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{notificationsData.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      {/* ===== FILTER TABS ===== */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All <span className="count">{notificationsData.length}</span>
        </button>
        <button 
          className={`filter-tab ${activeFilter === "unread" ? "active" : ""}`}
          onClick={() => setActiveFilter("unread")}
        >
          Unread <span className="count">{unreadCount}</span>
        </button>
        <button 
          className={`filter-tab ${activeFilter === "important" ? "active" : ""}`}
          onClick={() => setActiveFilter("important")}
        >
          Important <span className="count">{importantCount}</span>
        </button>
        <button 
          className={`filter-tab ${activeFilter === "academic" ? "active" : ""}`}
          onClick={() => setActiveFilter("academic")}
        >
          📚 Academic
        </button>
        <button 
          className={`filter-tab ${activeFilter === "admin" ? "active" : ""}`}
          onClick={() => setActiveFilter("admin")}
        >
          🏫 Admin
        </button>
        <button 
          className={`filter-tab ${activeFilter === "general" ? "active" : ""}`}
          onClick={() => setActiveFilter("general")}
        >
          📢 General
        </button>
      </div>

      {/* ===== NOTIFICATIONS LIST ===== */}
      <div className="notifications-list">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id}
            className={`notification-card ${notification.isRead ? '' : 'unread'} ${notification.isImportant ? 'important' : ''}`}
            onClick={() => setSelectedNotification(notification)}
          >
            <div className={`notification-icon ${getTypeClass(notification.type)}`}>
              {getTypeIcon(notification.type)}
            </div>
            <div className="notification-content">
              <div className="notification-header">
                <h3 className="notification-title">{notification.title}</h3>
                <span className="notification-time">{notification.time}</span>
              </div>
              <p className="notification-message">{notification.message}</p>
              <div className="notification-meta">
                <span>👤 {notification.sender}</span>
                <span>📁 {notification.category}</span>
              </div>
            </div>
            <div className="notification-actions">
              <button className="action-btn">View</button>
              {!notification.isRead && (
                <button className="action-btn dismiss">Dismiss</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ===== NOTIFICATION DETAIL ===== */}
      {selectedNotification && (
        <div className="notification-detail">
          <div className="detail-header">
            <div>
              <div className={`detail-icon notification-icon ${getTypeClass(selectedNotification.type)}`} style={{ marginBottom: '16px' }}>
                {getTypeIcon(selectedNotification.type)}
              </div>
              <h2 className="detail-title">{selectedNotification.title}</h2>
              <div className="detail-meta">
                <span>👤 {selectedNotification.sender}</span>
                <span>📅 {new Date(selectedNotification.date).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>⏰ {selectedNotification.time}</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setSelectedNotification(null)}>×</button>
          </div>
          <div className="detail-body">
            <p>{selectedNotification.message}</p>
          </div>
          <div className="detail-actions">
            <button className="btn btn-primary" style={{ background: '#1e3a8a' }}>
              ✓ Mark as Read
            </button>
            <button className="btn btn-secondary">
              ↩️ Reply
            </button>
          </div>
        </div>
      )}

      {/* ===== SETTINGS SECTION ===== */}
      <div className="settings-section">
        <h3>⚙️ Notification Preferences</h3>
        <div className="preferences-grid">
          <div className="preference-card active">
            <h4>📧 Email Notifications</h4>
            <p>Receive important notifications via email</p>
          </div>
          <div className="preference-card active">
            <h4>🔔 Push Notifications</h4>
            <p>Get real-time alerts on your device</p>
          </div>
          <div className="preference-card">
            <h4>📱 SMS Alerts</h4>
            <p>Receive critical alerts via SMS</p>
          </div>
          <div className="preference-card active">
            <h4>📅 Daily Digest</h4>
            <p>Get a daily summary of all activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
