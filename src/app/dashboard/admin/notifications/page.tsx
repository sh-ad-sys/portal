"use client";

import { useState } from "react";
import { FaBell, FaPaperPlane, FaUsers, FaSearch, FaFilter, FaCheck, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import "../../../../styles/admin-pages.css";

interface Notification {
  id: string;
  title: string;
  message: string;
  targetRole: string;
  sentDate: string;
  status: "sent" | "scheduled" | "draft";
  recipients: number;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "Mid Term Exam Schedule", message: "The mid-term examination schedule has been finalized. All students and teachers are requested to check the notice board.", targetRole: "all", sentDate: "2026-02-20", status: "sent", recipients: 450 },
  { id: "2", title: "Parent-Teacher Meeting", message: "A parent-teacher meeting is scheduled for March 5, 2026. Parents are requested to confirm their attendance.", targetRole: "parent", sentDate: "2026-02-18", status: "sent", recipients: 120 },
  { id: "3", title: "Holiday Notice", message: "School will remain closed on February 28, 2026 for Sports Day.", targetRole: "all", sentDate: "2026-02-25", status: "scheduled", recipients: 450 },
  { id: "4", title: "Homework Submission Reminder", message: "Students are reminded to submit their pending homework assignments by the end of this week.", targetRole: "student", sentDate: "2026-02-15", status: "sent", recipients: 280 },
  { id: "5", title: "Staff Development Workshop", message: "All teachers are requested to attend the professional development workshop on March 10.", targetRole: "teacher", sentDate: "2026-03-01", status: "draft", recipients: 45 },
];

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "create">("notifications");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = mockNotifications.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: mockNotifications.length,
    sent: mockNotifications.filter(n => n.status === "sent").length,
    scheduled: mockNotifications.filter(n => n.status === "scheduled").length,
    draft: mockNotifications.filter(n => n.status === "draft").length,
  };

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaBell />
          Notifications & Announcements
        </h1>
        <p>Send notifications and announcements to users</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBell />
          </div>
          <h3>{stats.total}</h3>
          <p>Total</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
            <FaPaperPlane />
          </div>
          <h3>{stats.sent}</h3>
          <p>Sent</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
            <FaBell />
          </div>
          <h3>{stats.scheduled}</h3>
          <p>Scheduled</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)' }}>
            <FaEdit />
          </div>
          <h3>{stats.draft}</h3>
          <p>Drafts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          All Notifications
        </button>
        <button 
          className={`tab ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          <FaPlus /> Create New
        </button>
      </div>

      {activeTab === "notifications" ? (
        <div className="content-card">
          <div className="card-header">
            <h2>
              <FaBell />
              Notification History
            </h2>
          </div>
          <div className="card-body">
            {/* Search */}
            <div className="search-bar">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Notifications List */}
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Target</th>
                  <th>Recipients</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id}>
                    <td><strong>{notification.title}</strong></td>
                    <td style={{ maxWidth: '300px' }}>{notification.message.substring(0, 80)}...</td>
                    <td>
                      <span className={`role-badge ${notification.targetRole}`}>
                        {notification.targetRole.charAt(0).toUpperCase() + notification.targetRole.slice(1)}
                      </span>
                    </td>
                    <td>{notification.recipients}</td>
                    <td>{notification.sentDate}</td>
                    <td>
                      <span className={`badge ${notification.status}`}>
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
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
      ) : (
        <div className="content-card">
          <div className="card-header">
            <h2>
              <FaPaperPlane />
              Create New Notification
            </h2>
          </div>
          <div className="card-body">
            <form>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" placeholder="Enter notification title..." />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  className="form-control" 
                  rows={5} 
                  placeholder="Write your notification message..."
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Send To</label>
                  <select className="form-control">
                    <option value="all">All Users</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Teachers Only</option>
                    <option value="parents">Parents Only</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Schedule</label>
                  <select className="form-control">
                    <option value="now">Send Immediately</option>
                    <option value="scheduled">Schedule for Later</option>
                    <option value="draft">Save as Draft</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Scheduled Date (Optional)</label>
                <input type="date" className="form-control" />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary">
                  Save as Draft
                </button>
                <button type="submit" className="btn btn-primary">
                  <FaPaperPlane /> Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
