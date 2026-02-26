"use client";

import { useState } from "react";
import "@/styles/student-pages.css";

// Message types
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "teacher" | "admin" | "parent";
  senderAvatar?: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  starred: boolean;
  attachments?: string[];
}

// Mock messages data
const messages: Message[] = [
  {
    id: "MSG001",
    senderId: "T001",
    senderName: "Mr. J. Ochieng",
    senderRole: "teacher",
    subject: "Mathematics Homework Clarification",
    message: `Dear Brian,

I hope this message finds you well. I wanted to clarify a few points regarding the Mathematics homework due on March 1st.

For question 5, use the quadratic formula as demonstrated in class. For question 12, show all your working clearly - partial marks will be awarded.

If you have any questions, feel free to ask during the next class or reply to this message.

Best regards,
Mr. J. Ochieng
Mathematics Teacher`,
    date: "2026-02-25",
    time: "10:30 AM",
    read: false,
    starred: true
  },
  {
    id: "MSG002",
    senderId: "T002",
    senderName: "Mrs. K. Akinyi",
    senderRole: "teacher",
    subject: "English Essay Feedback",
    message: `Dear Brian,

Great work on your essay about "A Grain of Wheat"! Your analysis of character development was insightful.

Here are some suggestions for improvement:
- Work on paragraph transitions
- Include more textual evidence
- Expand your conclusion

Keep up the good work!

Best,
Mrs. K. Akinyi
English Teacher`,
    date: "2026-02-24",
    time: "03:15 PM",
    read: true,
    starred: false
  },
  {
    id: "MSG003",
    senderId: "A001",
    senderName: "School Administration",
    senderRole: "admin",
    subject: "Mid-Term Examination Schedule",
    message: `Dear Students,

This is to inform you that the mid-term examinations will be held from March 5th to March 15th, 2026.

Key points:
- Timetable will be released on February 28th
- Bring your exam cards to all papers
- No electronics allowed in exam halls

Please prepare accordingly.

Regards,
Administration
Green Valley Academy`,
    date: "2026-02-23",
    time: "09:00 AM",
    read: false,
    starred: false
  },
  {
    id: "MSG004",
    senderId: "T003",
    senderName: "Mr. S. Otieno",
    senderRole: "teacher",
    subject: "Physics Lab Tomorrow",
    message: `Dear Brian,

Just a reminder that we have the Physics practical exam tomorrow at 1:00 PM in Science Lab 1.

Please bring:
- Lab coat
- Calculator
- All previous lab reports

See you tomorrow!

Mr. S. Otieno
Physics Teacher`,
    date: "2026-02-22",
    time: "04:00 PM",
    read: true,
    starred: true
  },
  {
    id: "MSG005",
    senderId: "T004",
    senderName: "Mrs. P. Wanjiku",
    senderRole: "teacher",
    subject: "Chemistry Test Results",
    message: `Dear Brian,

Your Chemistry test results are as follows:
- Score: 82/100
- Grade: A
- Rank: 3rd in class

Excellent performance! Keep it up.

Mrs. P. Wanjiku
Chemistry Teacher`,
    date: "2026-02-20",
    time: "02:30 PM",
    read: true,
    starred: false
  },
  {
    id: "MSG006",
    senderId: "G001",
    senderName: "Mary Ombogo",
    senderRole: "parent",
    subject: "Parent-Teacher Meeting Confirmation",
    message: `Dear Brian,

I am confirming that I will attend the parent-teacher meeting on March 5th.

Please ensure I have your latest report card before then.

Love,
Mum`,
    date: "2026-02-19",
    time: "07:00 PM",
    read: true,
    starred: false
  },
  {
    id: "MSG007",
    senderId: "T005",
    senderName: "Mr. R. Omolo",
    senderRole: "teacher",
    subject: "History Project Deadline",
    message: `Dear Brian,

This is a reminder that the History project is due on March 10th.

Remember to include:
- Cover page
- Table of contents
- At least 5 credible sources
- Bibliography

Mr. R. Omolo
History Teacher`,
    date: "2026-02-18",
    time: "11:00 AM",
    read: true,
    starred: false
  }
];

export default function StudentMessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [showCompose, setShowCompose] = useState(false);

  const filteredMessages = messages.filter(msg => {
    if (filter === "unread") return !msg.read;
    if (filter === "starred") return msg.starred;
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "teacher": return { icon: "👨‍🏫", label: "Teacher" };
      case "admin": return { icon: "🏫", label: "Admin" };
      case "parent": return { icon: "👨‍👩‍👧", label: "Parent" };
      default: return { icon: "👤", label: "Unknown" };
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-KE", { month: 'short', day: 'numeric' });
  };

  return (
    <div className="messages-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div className="header-content">
          <h1>💬 Messages</h1>
          <p>Communicate with teachers and school administration</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowCompose(true)}>
            ✉️ Compose
          </button>
        </div>
      </div>

      {/* ===== MESSAGES LAYOUT ===== */}
      <div className="messages-container">
        {/* ===== MESSAGES LIST ===== */}
        <div className="messages-list-panel">
          {/* ===== FILTER TABS ===== */}
          <div className="messages-filter">
            <button 
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              📋 All ({messages.length})
            </button>
            <button 
              className={`filter-tab ${filter === "unread" ? "active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              📬 Unread ({unreadCount})
            </button>
            <button 
              className={`filter-tab ${filter === "starred" ? "active" : ""}`}
              onClick={() => setFilter("starred")}
            >
              ⭐ Starred ({messages.filter(m => m.starred).length})
            </button>
          </div>

          {/* ===== MESSAGE LIST ===== */}
          <div className="messages-list">
            {filteredMessages.map((message) => (
              <div 
                key={message.id}
                className={`message-item ${selectedMessage?.id === message.id ? "selected" : ""} ${!message.read ? "unread" : ""}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="message-avatar">
                  <span className="avatar-initials">{getInitials(message.senderName)}</span>
                  <span className={`role-badge ${message.senderRole}`}>
                    {getRoleBadge(message.senderRole).icon}
                  </span>
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">{message.senderName}</span>
                    <span className="message-date">{formatDate(message.date)}</span>
                  </div>
                  <div className="message-subject">{message.subject}</div>
                  <div className="message-preview">
                    {message.message.substring(0, 60)}...
                  </div>
                </div>
                <div className="message-indicators">
                  {!message.read && <span className="unread-dot"></span>}
                  {message.starred && <span className="star-icon">⭐</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MESSAGE DETAIL ===== */}
        <div className="message-detail-panel">
          {selectedMessage ? (
            <>
              <div className="detail-header">
                <div className="detail-sender">
                  <div className="sender-avatar">
                    <span className="avatar-initials large">{getInitials(selectedMessage.senderName)}</span>
                  </div>
                  <div className="sender-info">
                    <h3>{selectedMessage.senderName}</h3>
                    <span className="sender-role">
                      {getRoleBadge(selectedMessage.senderRole).icon} {getRoleBadge(selectedMessage.senderRole).label}
                    </span>
                  </div>
                </div>
                <div className="detail-actions">
                  <button className="action-btn" title="Star">
                    {selectedMessage.starred ? "⭐" : "☆"}
                  </button>
                  <button className="action-btn" title="Reply">↩️</button>
                  <button className="action-btn" title="Forward">↪️</button>
                  <button className="action-btn" title="Delete">🗑️</button>
                </div>
              </div>
              <div className="detail-meta">
                <h2 className="detail-subject">{selectedMessage.subject}</h2>
                <span className="detail-time">
                  {new Date(selectedMessage.date).toLocaleDateString("en-KE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedMessage.time}
                </span>
              </div>
              <div className="detail-body">
                <pre>{selectedMessage.message}</pre>
              </div>
              <div className="detail-reply">
                <textarea placeholder="Type your reply..." rows={4}></textarea>
                <div className="reply-actions">
                  <button className="btn btn-primary">Send Reply</button>
                  <button className="btn btn-secondary">Attach File</button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-message-selected">
              <span className="empty-icon">📧</span>
              <h3>Select a message</h3>
              <p>Choose a message from the list to view its contents</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== COMPOSE MODAL ===== */}
      {showCompose && (
        <div className="compose-modal">
          <div className="modal-overlay" onClick={() => setShowCompose(false)}></div>
          <div className="compose-modal-content">
            <div className="compose-header">
              <h2>New Message</h2>
              <button className="close-btn" onClick={() => setShowCompose(false)}>×</button>
            </div>
            <div className="compose-body">
              <div className="compose-field">
                <label>To:</label>
                <select>
                  <option value="">Select recipient...</option>
                  <option value="T001">Mr. J. Ochieng (Mathematics)</option>
                  <option value="T002">Mrs. K. Akinyi (English)</option>
                  <option value="T003">Mr. S. Otieno (Physics)</option>
                  <option value="T004">Mrs. P. Wanjiku (Chemistry)</option>
                  <option value="A001">School Administration</option>
                </select>
              </div>
              <div className="compose-field">
                <label>Subject:</label>
                <input type="text" placeholder="Enter subject..." />
              </div>
              <div className="compose-field">
                <label>Message:</label>
                <textarea rows={10} placeholder="Type your message..."></textarea>
              </div>
              <div className="compose-actions">
                <button className="btn btn-primary">Send Message</button>
                <button className="btn btn-secondary" onClick={() => setShowCompose(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
