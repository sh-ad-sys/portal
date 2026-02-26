"use client";

import { useState } from "react";
import "@/styles/student-pages.css";

// Club types
interface Club {
  id: string;
  name: string;
  category: "sports" | "academic" | "cultural" | "service" | "creative";
  description: string;
  meetingDay: string;
  meetingTime: string;
  venue: string;
  teacher: string;
  memberCount: number;
  isMember: boolean;
  image: string;
}

interface Activity {
  id: string;
  name: string;
  club: string;
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "ongoing" | "completed";
  description: string;
}

// Mock clubs data
const clubs: Club[] = [
  {
    id: "CLB001",
    name: "Football Club",
    category: "sports",
    description: "Join our football team and compete in inter-school tournaments. All skill levels welcome!",
    meetingDay: "Tuesday & Thursday",
    meetingTime: "04:00 PM - 06:00 PM",
    venue: "Sports Field",
    teacher: "Mr. P. Korir",
    memberCount: 35,
    isMember: true,
    image: "⚽"
  },
  {
    id: "CLB002",
    name: "Science Club",
    category: "academic",
    description: "Explore the wonders of science through experiments, projects, and competitions.",
    meetingDay: "Wednesday",
    meetingTime: "03:30 PM - 05:00 PM",
    venue: "Science Lab 2",
    teacher: "Mrs. P. Wanjiku",
    memberCount: 28,
    isMember: true,
    image: "🔬"
  },
  {
    id: "CLB003",
    name: "Drama Club",
    category: "cultural",
    description: "Express yourself through acting, stagecraft, and creative writing.",
    meetingDay: "Monday",
    meetingTime: "03:30 PM - 05:30 PM",
    venue: "Drama Hall",
    teacher: "Mrs. K. Akinyi",
    memberCount: 22,
    isMember: false,
    image: "🎭"
  },
  {
    id: "CLB004",
    name: "Debate Club",
    category: "academic",
    description: "Sharpen your public speaking and critical thinking skills through competitive debates.",
    meetingDay: "Friday",
    meetingTime: "03:30 PM - 05:00 PM",
    venue: "Room 201",
    teacher: "Mr. J. Ochieng",
    memberCount: 18,
    isMember: false,
    image: "🎤"
  },
  {
    id: "CLB005",
    name: "Music Club",
    category: "creative",
    description: "Learn to play instruments, sing, and compose music. Join our school band!",
    meetingDay: "Thursday",
    meetingTime: "03:30 PM - 05:30 PM",
    venue: "Music Room",
    teacher: "Mr. M. Onyango",
    memberCount: 25,
    isMember: false,
    image: "🎵"
  },
  {
    id: "CLB006",
    name: "Environmental Club",
    category: "service",
    description: "Promote environmental awareness and participate in conservation activities.",
    meetingDay: "Saturday (Bi-weekly)",
    meetingTime: "09:00 AM - 12:00 PM",
    venue: "School Garden",
    teacher: "Mr. K. Kiprop",
    memberCount: 30,
    isMember: false,
    image: "🌱"
  },
  {
    id: "CLB007",
    name: "Basketball Club",
    category: "sports",
    description: "Stay fit and competitive through basketball. Teams for all levels.",
    meetingDay: "Monday & Wednesday",
    meetingTime: "04:00 PM - 06:00 PM",
    venue: "Basketball Court",
    teacher: "Mr. S. Otieno",
    memberCount: 24,
    isMember: false,
    image: "🏀"
  },
  {
    id: "CLB008",
    name: "Art Club",
    category: "creative",
    description: "Explore your artistic talents through painting, drawing, and sculpture.",
    meetingDay: "Tuesday",
    meetingTime: "03:30 PM - 05:00 PM",
    venue: "Art Room",
    teacher: "Mrs. R. Atieno",
    memberCount: 20,
    isMember: false,
    image: "🎨"
  },
  {
    id: "CLB009",
    name: "Scouts Club",
    category: "service",
    description: "Learn leadership, survival skills, and community service through scouting.",
    meetingDay: "Saturday",
    meetingTime: "08:00 AM - 12:00 PM",
    venue: "Scout Hall",
    teacher: "Mr. D. Mwangi",
    memberCount: 40,
    isMember: false,
    image: "🏕️"
  },
  {
    id: "CLB010",
    name: "Computer Club",
    category: "academic",
    description: "Learn programming, web development, and digital skills.",
    meetingDay: "Friday",
    meetingTime: "03:30 PM - 05:30 PM",
    venue: "Computer Lab",
    teacher: "Mr. J. Ndegwa",
    memberCount: 32,
    isMember: false,
    image: "💻"
  }
];

// Mock activities data
const activities: Activity[] = [
  {
    id: "ACT001",
    name: "Inter-School Football Tournament",
    club: "Football Club",
    date: "2026-03-15",
    time: "09:00 AM",
    venue: "Nairobi Sports Complex",
    status: "upcoming",
    description: "Annual football tournament against other schools."
  },
  {
    id: "ACT002",
    name: "Science Fair 2026",
    club: "Science Club",
    date: "2026-03-20",
    time: "08:00 AM",
    venue: "School Hall",
    status: "upcoming",
    description: "Showcase your science projects and compete for prizes."
  },
  {
    id: "ACT003",
    name: "Drama Production",
    club: "Drama Club",
    date: "2026-04-05",
    time: "06:00 PM",
    venue: "School Auditorium",
    status: "upcoming",
    description: "Annual drama production - 'A Midsummer Night's Dream'."
  },
  {
    id: "ACT004",
    name: "Debate Championship",
    club: "Debate Club",
    date: "2026-03-10",
    time: "09:00 AM",
    venue: "Room 201",
    status: "upcoming",
    description: "Inter-class debate championship."
  }
];

export default function StudentClubsPage() {
  const [activeTab, setActiveTab] = useState<"clubs" | "activities">("clubs");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const categories = [
    { value: "all", label: "All Clubs", icon: "🏆" },
    { value: "sports", label: "Sports", icon: "⚽" },
    { value: "academic", label: "Academic", icon: "📚" },
    { value: "cultural", label: "Cultural", icon: "🎭" },
    { value: "service", label: "Service", icon: "🌍" },
    { value: "creative", label: "Creative", icon: "🎨" }
  ];

  const filteredClubs = selectedCategory === "all" 
    ? clubs 
    : clubs.filter(club => club.category === selectedCategory);

  const myClubs = clubs.filter(club => club.isMember);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sports": return "category-sports";
      case "academic": return "category-academic";
      case "cultural": return "category-cultural";
      case "service": return "category-service";
      case "creative": return "category-creative";
      default: return "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming": return "status-upcoming";
      case "ongoing": return "status-ongoing";
      case "completed": return "status-completed";
      default: return "";
    }
  };

  return (
    <div className="clubs-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div className="header-content">
          <h1>🏆 Clubs & Activities</h1>
          <p>Join clubs, participate in activities, and develop your talents</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">🎯 {myClubs.length} Active Memberships</span>
        </div>
      </div>

      {/* ===== MY CLUBS ===== */}
      {myClubs.length > 0 && (
        <div className="my-clubs-section">
          <h3>My Clubs</h3>
          <div className="my-clubs-grid">
            {myClubs.map(club => (
              <div key={club.id} className="my-club-card">
                <span className="club-icon">{club.image}</span>
                <div className="club-info">
                  <h4>{club.name}</h4>
                  <p>{club.meetingDay} • {club.meetingTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TABS ===== */}
      <div className="clubs-tabs">
        <button 
          className={`tab ${activeTab === "clubs" ? "active" : ""}`}
          onClick={() => setActiveTab("clubs")}
        >
          🏟️ Browse Clubs
        </button>
        <button 
          className={`tab ${activeTab === "activities" ? "active" : ""}`}
          onClick={() => setActiveTab("activities")}
        >
          📅 Upcoming Activities ({activities.length})
        </button>
      </div>

      {/* ===== CATEGORY FILTER ===== */}
      {activeTab === "clubs" && (
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`category-btn ${selectedCategory === cat.value ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ===== CLUBS GRID ===== */}
      {activeTab === "clubs" && (
        <div className="clubs-grid">
          {filteredClubs.map(club => (
            <div 
              key={club.id}
              className={`club-card ${getCategoryColor(club.category)} ${selectedClub?.id === club.id ? "selected" : ""}`}
              onClick={() => setSelectedClub(club)}
            >
              <div className="club-header">
                <span className="club-emoji">{club.image}</span>
                <span className={`membership-badge ${club.isMember ? "active" : ""}`}>
                  {club.isMember ? "✓ Member" : "Join"}
                </span>
              </div>
              <h3 className="club-name">{club.name}</h3>
              <p className="club-description">{club.description}</p>
              <div className="club-meta">
                <span className="meta-item">📅 {club.meetingDay}</span>
                <span className="meta-item">⏰ {club.meetingTime}</span>
                <span className="meta-item">📍 {club.venue}</span>
              </div>
              <div className="club-footer">
                <span className="member-count">👥 {club.memberCount} members</span>
                <span className="club-teacher">👨‍🏫 {club.teacher}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== ACTIVITIES LIST ===== */}
      {activeTab === "activities" && (
        <div className="activities-list">
          {activities.map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-date-box">
                <span className="date-day">{new Date(activity.date).getDate()}</span>
                <span className="date-month">{new Date(activity.date).toLocaleDateString("en-KE", { month: 'short' })}</span>
              </div>
              <div className="activity-details">
                <h3>{activity.name}</h3>
                <p className="activity-club">🏟️ {activity.club}</p>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span>🕐 {activity.time}</span>
                  <span>📍 {activity.venue}</span>
                </div>
              </div>
              <div className="activity-status">
                <span className={`status-badge ${getStatusBadge(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== CLUB DETAIL MODAL ===== */}
      {selectedClub && activeTab === "clubs" && (
        <div className="club-modal">
          <div className="modal-overlay" onClick={() => setSelectedClub(null)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-emoji">{selectedClub.image}</span>
              <div className="modal-title">
                <h2>{selectedClub.name}</h2>
                <span className={`category-tag ${getCategoryColor(selectedClub.category)}`}>
                  {selectedClub.category}
                </span>
              </div>
              <button className="close-btn" onClick={() => setSelectedClub(null)}>×</button>
            </div>
            <div className="modal-body">
              <p className="club-full-description">{selectedClub.description}</p>
              
              <div className="club-details">
                <div className="detail-row">
                  <span className="detail-label">Meeting Days</span>
                  <span className="detail-value">{selectedClub.meetingDay}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{selectedClub.meetingTime}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Venue</span>
                  <span className="detail-value">{selectedClub.venue}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Teacher</span>
                  <span className="detail-value">{selectedClub.teacher}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Members</span>
                  <span className="detail-value">{selectedClub.memberCount} students</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedClub.isMember ? (
                <button className="btn btn-secondary">✓ You're a Member</button>
              ) : (
                <button className="btn btn-primary">Join Club</button>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedClub(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== JOINING BENEFITS ===== */}
      <div className="benefits-section">
        <h3>✨ Benefits of Joining Clubs</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="benefit-icon">🎯</span>
            <h4>Skill Development</h4>
            <p>Learn new skills and develop existing talents</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">👥</span>
            <h4>Social Connections</h4>
            <p>Make friends with similar interests</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🏆</span>
            <h4>Achievements</h4>
            <p>Earn recognition and awards</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">💼</span>
            <h4>College Applications</h4>
            <p>Stand out in university applications</p>
          </div>
        </div>
      </div>
    </div>
  );
}
