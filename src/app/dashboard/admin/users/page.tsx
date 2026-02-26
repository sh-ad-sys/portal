"use client";

import { useState } from "react";
import { FaUsers, FaSearch, FaPlus, FaEdit, FaTrash, FaUserShield, FaUserGraduate, FaChalkboardTeacher, FaUser, FaFilter, FaDownload } from "react-icons/fa";
import "../../../../styles/admin-pages.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student" | "parent";
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  joinDate: string;
}

const mockUsers: User[] = [
  { id: "1", name: "John Smith", email: "john.smith@greenvalley.edu", role: "admin", status: "active", lastLogin: "2026-02-26 09:00", joinDate: "2020-01-15" },
  { id: "2", name: "Sarah Johnson", email: "sarah.j@greenvalley.edu", role: "teacher", status: "active", lastLogin: "2026-02-25 14:30", joinDate: "2021-03-20" },
  { id: "3", name: "Michael Brown", email: "michael.b@greenvalley.edu", role: "teacher", status: "active", lastLogin: "2026-02-26 08:15", joinDate: "2021-06-10" },
  { id: "4", name: "Emily Davis", email: "emily.d@greenvalley.edu", role: "student", status: "active", lastLogin: "2026-02-26 07:45", joinDate: "2023-09-01" },
  { id: "5", name: "David Wilson", email: "david.w@greenvalley.edu", role: "student", status: "inactive", lastLogin: "2026-01-20 10:00", joinDate: "2023-09-01" },
  { id: "6", name: "Lisa Anderson", email: "lisa.a@email.com", role: "parent", status: "active", lastLogin: "2026-02-24 16:20", joinDate: "2023-09-05" },
  { id: "7", name: "James Taylor", email: "james.t@greenvalley.edu", role: "student", status: "pending", lastLogin: "-", joinDate: "2026-02-20" },
  { id: "8", name: "Jennifer Martin", email: "jennifer.m@greenvalley.edu", role: "teacher", status: "active", lastLogin: "2026-02-25 11:30", joinDate: "2022-01-10" },
];

const getAvatarColor = (role: string) => {
  switch(role) {
    case "admin": return "purple";
    case "teacher": return "blue";
    case "student": return "green";
    case "parent": return "red";
    default: return "blue";
  }
};

const getInitial = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: mockUsers.length,
    admins: mockUsers.filter(u => u.role === "admin").length,
    teachers: mockUsers.filter(u => u.role === "teacher").length,
    students: mockUsers.filter(u => u.role === "student").length,
    parents: mockUsers.filter(u => u.role === "parent").length,
  };

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          <FaUsers />
          User Management
        </h1>
        <p>Manage all users - students, teachers, parents, and administrators</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setRoleFilter("all")} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">
            <FaUsers />
          </div>
          <h3>{stats.total}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card" onClick={() => setRoleFilter("admin")} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}>
            <FaUserShield />
          </div>
          <h3>{stats.admins}</h3>
          <p>Admins</p>
        </div>
        <div className="stat-card" onClick={() => setRoleFilter("teacher")} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
            <FaChalkboardTeacher />
          </div>
          <h3>{stats.teachers}</h3>
          <p>Teachers</p>
        </div>
        <div className="stat-card" onClick={() => setRoleFilter("student")} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
            <FaUserGraduate />
          </div>
          <h3>{stats.students}</h3>
          <p>Students</p>
        </div>
        <div className="stat-card" onClick={() => setRoleFilter("parent")} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
            <FaUser />
          </div>
          <h3>{stats.parents}</h3>
          <p>Parents</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="content-card">
        <div className="card-header">
          <h2>
            <FaUsers />
            All Users
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary">
              <FaDownload /> Export
            </button>
            <button className="btn btn-primary">
              <FaPlus /> Add User
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* Filters */}
          <div className="filters-bar">
            <div className="search-bar" style={{ flex: 1, maxWidth: '400px' }}>
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Role:</label>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Users List */}
          <div style={{ marginTop: '16px' }}>
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className={`user-avatar ${getAvatarColor(user.role)}`}>
                  {getInitial(user.name)}
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
                <span className={`role-badge ${user.role}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`status-badge ${user.status}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
                <div style={{ fontSize: '12px', color: '#64748b', minWidth: '100px' }}>
                  {user.lastLogin}
                </div>
                <div className="user-actions">
                  <button className="btn btn-secondary" style={{ padding: '8px' }} title="Edit">
                    <FaEdit />
                  </button>
                  <button className="btn btn-danger" style={{ padding: '8px' }} title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <FaUsers />
              <h3>No users found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
