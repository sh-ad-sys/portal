"use client";

import { useState } from "react";
import "@/styles/student-pages.css";

// Resource types
interface Resource {
  id: string;
  title: string;
  subject: string;
  type: "notes" | "video" | "document" | "presentation" | "link";
  format: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  description: string;
  category: string;
}

// Mock resources data
const resources: Resource[] = [
  {
    id: "R001",
    title: "Mathematics Form 4 Algebra Notes",
    subject: "Mathematics",
    type: "notes",
    format: "PDF",
    size: "2.5 MB",
    uploadedBy: "Mr. J. Ochieng",
    uploadDate: "2026-02-20",
    downloads: 145,
    description: "Complete algebra notes covering equations, inequalities, and sequences.",
    category: "Notes"
  },
  {
    id: "R002",
    title: "Physics Wave Motion Lecture",
    subject: "Physics",
    type: "video",
    format: "MP4",
    size: "156 MB",
    uploadedBy: "Mr. S. Otieno",
    uploadDate: "2026-02-18",
    downloads: 89,
    description: "Video lecture on wave motion and sound waves.",
    category: "Video"
  },
  {
    id: "R003",
    title: "Chemistry Organic Chemistry Summary",
    subject: "Chemistry",
    type: "notes",
    format: "PDF",
    size: "1.8 MB",
    uploadedBy: "Mrs. P. Wanjiku",
    uploadDate: "2026-02-15",
    downloads: 203,
    description: "Comprehensive summary of organic chemistry topics for KCSE.",
    category: "Notes"
  },
  {
    id: "R004",
    title: "English Essay Writing Guide",
    subject: "English",
    type: "document",
    format: "DOCX",
    size: "850 KB",
    uploadedBy: "Mrs. K. Akinyi",
    uploadDate: "2026-02-12",
    downloads: 167,
    description: "Guide on how to write excellent essays for KCSE English.",
    category: "Guide"
  },
  {
    id: "R005",
    title: "Geography Map Reading Practice",
    subject: "Geography",
    type: "presentation",
    format: "PPTX",
    size: "12.3 MB",
    uploadedBy: "Mr. K. Kiprop",
    uploadDate: "2026-02-10",
    downloads: 98,
    description: "PowerPoint presentation on map reading and interpretation.",
    category: "Presentation"
  },
  {
    id: "R006",
    title: "Kiswahili Fasihi Notes",
    subject: "Kiswahili",
    type: "notes",
    format: "PDF",
    size: "3.2 MB",
    uploadedBy: "Mr. D. Mwangi",
    uploadDate: "2026-02-08",
    downloads: 76,
    description: "Notes on Fasihi (literature) for KCSE.",
    category: "Notes"
  },
  {
    id: "R007",
    title: "Biology Cell Structure Animation",
    subject: "Biology",
    type: "video",
    format: "MP4",
    size: "89 MB",
    uploadedBy: "Mrs. L. Njoroge",
    uploadDate: "2026-02-05",
    downloads: 234,
    description: "Animated video explaining cell structure and functions.",
    category: "Video"
  },
  {
    id: "R008",
    title: "History Kenya History Timeline",
    subject: "History",
    type: "document",
    format: "PDF",
    size: "1.2 MB",
    uploadedBy: "Mr. R. Omolo",
    uploadDate: "2026-02-03",
    downloads: 156,
    description: "Comprehensive timeline of Kenyan history from pre-colonial to independence.",
    category: "Notes"
  },
  {
    id: "R009",
    title: "Computer Programming Basics",
    subject: "Computer",
    type: "link",
    format: "URL",
    size: "-",
    uploadedBy: "Mr. J. Ndegwa",
    uploadDate: "2026-02-01",
    downloads: 89,
    description: "Online resource for learning Python programming basics.",
    category: "External"
  },
  {
    id: "R010",
    title: "CRE Christian Ethics Notes",
    subject: "CRE",
    type: "notes",
    format: "PDF",
    size: "1.5 MB",
    uploadedBy: "Mrs. E. Kamau",
    uploadDate: "2026-01-28",
    downloads: 67,
    description: "Notes on Christian ethics and moral values.",
    category: "Notes"
  }
];

// Subject categories
const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Kiswahili", "Geography", "History", "Computer", "CRE"];
const categories = ["All", "Notes", "Video", "Document", "Presentation", "External"];

export default function StudentResourcesPage() {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const handleDownload = (resource: Resource) => {
    const content = `GREEN VALLEY ACADEMY - LEARNING RESOURCE
========================================

Title: ${resource.title}
Subject: ${resource.subject}
Category: ${resource.category}
Format: ${resource.format}
Size: ${resource.size}
Uploaded By: ${resource.uploadedBy}
Upload Date: ${new Date(resource.uploadDate).toLocaleDateString()}

Description:
-----------
${resource.description}

---
Generated on: ${new Date().toLocaleDateString()}
Green Valley Academy`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSubject = selectedSubject === "All" || resource.subject === selectedSubject;
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "notes": return "📝";
      case "video": return "🎬";
      case "document": return "📄";
      case "presentation": return "📊";
      case "link": return "🔗";
      default: return "📁";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "notes": return "type-notes";
      case "video": return "type-video";
      case "document": return "type-document";
      case "presentation": return "type-presentation";
      case "link": return "type-link";
      default: return "";
    }
  };

  return (
    <div className="resources-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div className="header-content">
          <h1>📚 Learning Resources</h1>
          <p>Access study materials, notes, and educational content</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">📚 {resources.length} Resources</span>
        </div>
      </div>

      {/* ===== SEARCH AND FILTERS ===== */}
      <div className="search-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Subject:</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== RESOURCES GRID ===== */}
      <div className="resources-grid">
        {filteredResources.map((resource) => (
          <div 
            key={resource.id}
            className={`resource-card ${getTypeColor(resource.type)} ${selectedResource?.id === resource.id ? "selected" : ""}`}
            onClick={() => setSelectedResource(resource)}
          >
            <div className="resource-icon">
              {getTypeIcon(resource.type)}
            </div>
            <div className="resource-info">
              <span className="resource-subject">{resource.subject}</span>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-meta">
                <span className="meta-item">📅 {new Date(resource.uploadDate).toLocaleDateString("en-KE", { month: 'short', day: 'numeric' })}</span>
                <span className="meta-item">📥 {resource.downloads}</span>
                <span className="meta-item">💾 {resource.size}</span>
              </div>
            </div>
            <div className="resource-type-badge">
              {resource.format}
            </div>
          </div>
        ))}
      </div>

      {/* ===== EMPTY STATE ===== */}
      {filteredResources.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No resources found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* ===== RESOURCE DETAIL MODAL ===== */}
      {selectedResource && (
        <div className="resource-modal">
          <div className="modal-overlay" onClick={() => setSelectedResource(null)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">
                <span className="modal-icon">{getTypeIcon(selectedResource.type)}</span>
                <h2>{selectedResource.title}</h2>
              </div>
              <button className="close-btn" onClick={() => setSelectedResource(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Subject</span>
                  <span className="detail-value">{selectedResource.subject}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{selectedResource.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Format</span>
                  <span className="detail-value">{selectedResource.format}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Size</span>
                  <span className="detail-value">{selectedResource.size}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Uploaded By</span>
                  <span className="detail-value">{selectedResource.uploadedBy}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Downloads</span>
                  <span className="detail-value">{selectedResource.downloads}</span>
                </div>
              </div>
              <div className="description-section">
                <h4>Description</h4>
                <p>{selectedResource.description}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => handleDownload(selectedResource)}>
                📥 Download Resource
              </button>
              <button className="btn btn-secondary" onClick={() => handleDownload(selectedResource)}>
                🔗 Open {selectedResource.type === "link" ? "Link" : "File"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUBJECT QUICK LINKS ===== */}
      <div className="subject-quick-links">
        <h3>📚 Quick Access by Subject</h3>
        <div className="subject-buttons">
          {subjects.slice(1).map(subject => (
            <button 
              key={subject}
              className={`subject-btn ${selectedSubject === subject ? "active" : ""}`}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* ===== STUDY TIPS ===== */}
      <div className="study-tips">
        <h3>💡 Study Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">📝</span>
            <h4>Take Notes</h4>
            <p>Write down key points while studying to improve retention.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎬</span>
            <h4>Watch Videos</h4>
            <p>Visual content helps understand complex topics better.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📄</span>
            <h4> Practice Past Papers</h4>
            <p>Reviewing past exam papers helps understand the format.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">👥</span>
            <h4>Study Groups</h4>
            <p>Join study groups to learn from your peers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
