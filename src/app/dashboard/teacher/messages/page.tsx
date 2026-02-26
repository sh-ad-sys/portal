"use client";

import { useState } from "react";
import { FaEnvelope, FaSearch, FaPaperPlane, FaUser, FaInbox, FaStar, FaTrash, FaArchive } from "react-icons/fa";
import "../../../../styles/teacher-pages.css";

interface Message {
  id: string;
  senderName: string;
  senderRole: string;
  senderId: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
}

const mockMessages: Message[] = [
  { 
    id: "1", 
    senderName: "Sarah Johnson", 
    senderRole: "Parent", 
    senderId: "PAR001",
    subject: "Question about homework", 
    preview: "Hello, I wanted to ask about the algebra homework assigned to my son...",
    timestamp: "2026-02-26 09:30", 
    read: false,
    starred: true
  },
  { 
    id: "2", 
    senderName: "Michael Chen", 
    senderRole: "Parent", 
    senderId: "PAR002",
    subject: "Meeting request", 
    preview: "Dear Mr. Anderson, I would like to schedule a meeting to discuss...",
    timestamp: "2026-02-25 14:20", 
    read: true,
    starred: false
  },
  { 
    id: "3", 
    senderName: "Emily Davis", 
    senderRole: "Student", 
    senderId: "STU015",
    subject: "Question about exam", 
    preview: "Sir, I wanted to clarify something about the physics exam next week...",
    timestamp: "2026-02-25 11:45", 
    read: true,
    starred: false
  },
  { 
    id: "4", 
    senderName: "Principal Williams", 
    senderRole: "Admin", 
    senderId: "ADM001",
    subject: "Staff meeting reminder", 
    preview: "This is a reminder about the staff meeting scheduled for tomorrow...",
    timestamp: "2024-02-24 16:00", 
    read: true,
    starred: true
  },
  { 
    id: "5", 
    senderName: "Robert Taylor", 
    senderRole: "Parent", 
    senderId: "PAR003",
    subject: "Thank you note", 
    preview: "I wanted to thank you for the extra help you provided to my daughter...",
    timestamp: "2026-02-23 10:30", 
    read: true,
    starred: false
  },
];

export default function TeacherMessagesPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "starred" | "sent" | "compose">("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(mockMessages[0]);
  const [showCompose, setShowCompose] = useState(false);

  const filteredMessages = mockMessages.filter(msg => 
    msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = mockMessages.filter(m => !m.read).length;
  const starredCount = mockMessages.filter(m => m.starred).length;

  const getInitial = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="teacher-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaEnvelope />
          Messages
        </h1>
        <p>Communicate with parents, students, and staff</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "inbox" ? "active" : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          <FaInbox /> Inbox {unreadCount > 0 && <span style={{ marginLeft: '6px', background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{unreadCount}</span>}
        </button>
        <button 
          className={`tab ${activeTab === "starred" ? "active" : ""}`}
          onClick={() => setActiveTab("starred")}
        >
          <FaStar /> Starred ({starredCount})
        </button>
        <button 
          className={`tab ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          <FaPaperPlane /> Sent
        </button>
        <button 
          className={`tab ${activeTab === "compose" ? "active" : ""}`}
          onClick={() => { setShowCompose(true); setActiveTab("compose"); }}
        >
          <FaPaperPlane /> Compose
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '24px' }}>
        {/* Messages List */}
        <div className="content-card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h2>
              <FaInbox />
              {activeTab === "inbox" ? "Inbox" : activeTab === "starred" ? "Starred" : "Sent"}
            </h2>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {/* Search */}
            <div className="search-bar" style={{ margin: '16px', borderRadius: '8px' }}>
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Messages List */}
            <div className="messages-list">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message-item ${!message.read ? 'unread' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                  style={{ 
                    background: selectedMessage?.id === message.id ? '#eff6ff' : undefined 
                  }}
                >
                  <div className="message-avatar">
                    {getInitial(message.senderName)}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="sender-name">{message.senderName}</span>
                      <span className="message-time">{message.timestamp.split(' ')[1]}</span>
                    </div>
                    <div className="message-preview"><strong>{message.subject}</strong> - {message.preview}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Detail / Compose */}
        <div className="content-card" style={{ marginBottom: 0 }}>
          {showCompose || activeTab === "compose" ? (
            <div className="card-body">
              <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaPaperPlane /> Compose Message
              </h2>
              <form>
                <div className="form-group">
                  <label>To (Recipient)</label>
                  <select className="form-control">
                    <option value="">Select recipient...</option>
                    <optgroup label="Parents">
                      <option value="PAR001">Sarah Johnson (Parent of Alex)</option>
                      <option value="PAR002">Michael Chen (Parent of Emma)</option>
                    </optgroup>
                    <optgroup label="Students">
                      <option value="STU001">Alex Johnson</option>
                      <option value="STU002">Emma Wilson</option>
                    </optgroup>
                    <optgroup label="Staff">
                      <option value="ADM001">Principal Williams</option>
                    </optgroup>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" className="form-control" placeholder="Enter subject..." />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea 
                    className="form-control" 
                    rows={10} 
                    placeholder="Write your message..."
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCompose(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FaPaperPlane /> Send Message
                  </button>
                </div>
              </form>
            </div>
          ) : selectedMessage ? (
            <>
              <div className="card-header">
                <h2>{selectedMessage.subject}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ padding: '8px' }} title="Archive">
                    <FaArchive />
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '8px' }} title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                  <div className="message-avatar" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                    {getInitial(selectedMessage.senderName)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{selectedMessage.senderName}</div>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>{selectedMessage.senderRole} • {selectedMessage.timestamp}</div>
                  </div>
                </div>
                <div style={{ lineHeight: '1.8', color: '#374151' }}>
                  <p>Dear Mr. Anderson,</p>
                  <p style={{ marginTop: '16px' }}>{selectedMessage.preview}</p>
                  <p style={{ marginTop: '16px' }}>I would appreciate your guidance on this matter. Please let me know if you need any additional information.</p>
                  <p style={{ marginTop: '16px' }}>Best regards,<br/>{selectedMessage.senderName}</p>
                </div>
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary">
                    <FaPaperPlane /> Reply
                  </button>
                  <button className="btn btn-secondary">
                    <FaUser /> Forward
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <FaEnvelope />
              <h3>No message selected</h3>
              <p>Select a message from the list to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
