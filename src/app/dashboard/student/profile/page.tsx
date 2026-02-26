"use client";

import { useState } from "react";
import "@/styles/profile.css";

// Student data
const studentData = {
  firstName: "Brian",
  lastName: "Ombogo",
  admissionNumber: "GVA/2024/0892",
  email: "brian.ombogo@students.greenvalley.edu",
  phone: "+254 712 345 678",
  grade: "Grade 10",
  stream: "East",
  house: "Mount Kenya",
  year: "2026",
  boarding: true,
  gender: "Male",
  dateOfBirth: "2009-05-15",
  county: "Nairobi",
  subCounty: "Starehe",
  address: "P.O. Box 12345, Nairobi",
  emergencyContact: "+254 721 234 567",
  emergencyName: "Mary Ombogo (Mother)",
  bloodGroup: "O+",
  allergies: "None known",
  medicalConditions: "None",
};

const parentData = [
  {
    name: "John Ombogo",
    relationship: "Father",
    phone: "+254 721 234 567",
    email: "john.ombogo@email.com",
    occupation: "Software Engineer",
  },
  {
    name: "Mary Ombogo",
    relationship: "Mother",
    phone: "+254 722 345 678",
    email: "mary.ombogo@email.com",
    occupation: "Teacher",
  },
];

const statsData = {
  attendance: "94%",
  totalExams: 12,
  completedHomework: 45,
  averageScore: "A-",
};

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [showEditModal, setShowEditModal] = useState(false);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "academic", label: "Academic", icon: "📚" },
    { id: "parents", label: "Parents/Guardians", icon: "👨‍👩‍👧" },
    { id: "medical", label: "Medical", icon: "🏥" },
  ];

  return (
    <div className="profile-page">
      {/* ===== COVER SECTION ===== */}
      <div className="profile-cover">
        <div className="school-badge-container">
          <div className="school-badge">
            <span>🎓</span>
            <span>Green Valley Academy</span>
          </div>
        </div>
      </div>

      {/* ===== PROFILE HEADER ===== */}
      <div className="profile-header">
        <div className="profile-main-info">
          <div className="avatar-container">
            <div className="avatar">
              {studentData.firstName[0]}{studentData.lastName[0]}
            </div>
            {studentData.boarding && (
              <span className="boarding-badge">🏫 Boarding</span>
            )}
          </div>
          <div className="profile-text">
            <h1>{studentData.firstName} {studentData.lastName}</h1>
            <p className="admission-number">Adm No: {studentData.admissionNumber}</p>
            <div className="profile-tags">
              <span className="tag grade">{studentData.grade}</span>
              <span className="tag stream">{studentData.stream}</span>
              <span className="tag house">{studentData.house} House</span>
              <span className="tag year">Year {studentData.year}</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn btn-edit" onClick={() => setShowEditModal(true)}>
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {/* ===== STATS ROW ===== */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{statsData.attendance}</div>
          <div className="stat-label">Attendance Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{statsData.totalExams}</div>
          <div className="stat-label">Exams Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{statsData.completedHomework}</div>
          <div className="stat-label">Homework Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{statsData.averageScore}</div>
          <div className="stat-label">Average Score</div>
        </div>
      </div>

      {/* ===== PROFILE TABS ===== */}
      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ===== INFO GRID ===== */}
      <div className="info-grid">
        {activeTab === "personal" && (
          <>
            <div className="info-card">
              <h3><span className="icon">👤</span> Personal Details</h3>
              <div className="info-row">
                <span className="label">Full Name</span>
                <span className="value">{studentData.firstName} {studentData.lastName}</span>
              </div>
              <div className="info-row">
                <span className="label">Admission Number</span>
                <span className="value">{studentData.admissionNumber}</span>
              </div>
              <div className="info-row">
                <span className="label">Gender</span>
                <span className="value">{studentData.gender}</span>
              </div>
              <div className="info-row">
                <span className="label">Date of Birth</span>
                <span className="value">{new Date(studentData.dateOfBirth).toLocaleDateString('en-KE')}</span>
              </div>
              <div className="info-row">
                <span className="label">Boarding Status</span>
                <span className="value">{studentData.boarding ? "Boarder" : "Day Scholar"}</span>
              </div>
            </div>

            <div className="info-card">
              <h3><span className="icon">📞</span> Contact Information</h3>
              <div className="info-row">
                <span className="label">Email</span>
                <span className="value">{studentData.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone</span>
                <span className="value">{studentData.phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Address</span>
                <span className="value">{studentData.address}</span>
              </div>
              <div className="info-row">
                <span className="label">County</span>
                <span className="value">{studentData.county}</span>
              </div>
              <div className="info-row">
                <span className="label">Sub-County</span>
                <span className="value">{studentData.subCounty}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "academic" && (
          <>
            <div className="info-card">
              <h3><span className="icon">📚</span> Class Information</h3>
              <div className="info-row">
                <span className="label">Grade/Class</span>
                <span className="value">{studentData.grade}</span>
              </div>
              <div className="info-row">
                <span className="label">Stream</span>
                <span className="value">{studentData.stream}</span>
              </div>
              <div className="info-row">
                <span className="label">House</span>
                <span className="value">{studentData.house}</span>
              </div>
              <div className="info-row">
                <span className="label">Academic Year</span>
                <span className="value">{studentData.year}</span>
              </div>
            </div>

            <div className="info-card">
              <h3><span className="icon">📊</span> Academic Performance</h3>
              <div className="info-row">
                <span className="label">Overall Average</span>
                <span className="value">{statsData.averageScore}</span>
              </div>
              <div className="info-row">
                <span className="label">Exams Taken</span>
                <span className="value">{statsData.totalExams}</span>
              </div>
              <div className="info-row">
                <span className="label">Homework Completed</span>
                <span className="value">{statsData.completedHomework}</span>
              </div>
              <div className="info-row">
                <span className="label">Attendance Rate</span>
                <span className="value">{statsData.attendance}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "parents" && (
          <div className="info-card parent-info-card">
            <h3><span className="icon">👨‍👩‍👧</span> Parents/Guardians Information</h3>
            {parentData.map((parent, index) => (
              <div key={index} className="parent-card">
                <div className="parent-avatar">
                  {parent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="parent-details">
                  <h4>{parent.name}</h4>
                  <p>{parent.relationship} • {parent.occupation}</p>
                  <p>📞 {parent.phone} • 📧 {parent.email}</p>
                </div>
              </div>
            ))}
            <div className="info-row" style={{ marginTop: '16px' }}>
              <span className="label">Emergency Contact</span>
              <span className="value">{studentData.emergencyName} ({studentData.emergencyContact})</span>
            </div>
          </div>
        )}

        {activeTab === "medical" && (
          <>
            <div className="info-card">
              <h3><span className="icon">🏥</span> Medical Information</h3>
              <div className="info-row">
                <span className="label">Blood Group</span>
                <span className="value">{studentData.bloodGroup}</span>
              </div>
              <div className="info-row">
                <span className="label">Allergies</span>
                <span className="value">{studentData.allergies}</span>
              </div>
              <div className="info-row">
                <span className="label">Medical Conditions</span>
                <span className="value">{studentData.medicalConditions}</span>
              </div>
            </div>

            <div className="info-card">
              <h3><span className="icon">🆘</span> Emergency Contact</h3>
              <div className="info-row">
                <span className="label">Contact Name</span>
                <span className="value">{studentData.emergencyName}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone Number</span>
                <span className="value">{studentData.emergencyContact}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===== PROFILE FOOTER ===== */}
      <div className="profile-footer">
        <p>Green Valley Academy • P.O. Box 12345, Nairobi • Tel: +254 20 123 4567</p>
        <p>Last Updated: February 25, 2026</p>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <div className="edit-modal" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Profile</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" defaultValue={studentData.firstName} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" defaultValue={studentData.lastName} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={studentData.email} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" defaultValue={studentData.phone} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" defaultValue={studentData.address} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
