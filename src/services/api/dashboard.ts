// ============================================================================
// Dashboard API Service - Backend integration layer
// Replace the mock implementations with actual API calls when backend is ready
// ============================================================================

import type {
  StudentDashboardData,
  TeacherDashboardData,
  ParentDashboardData,
  AdminDashboardData,
  ApiResponse,
  UserRole,
} from '@/types/dashboard';

// Base API URL - configure based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic fetch helper
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// ============================================================================
// Student Dashboard API
// ============================================================================

export async function getStudentDashboardData(studentId: string): Promise<ApiResponse<StudentDashboardData>> {
  // TODO: Replace with actual API call
  // return fetchApi(`/students/${studentId}/dashboard`);
  
  // Mock implementation - remove when backend is connected
  return {
    success: true,
    data: {
      studentName: 'John Doe',
      studentId,
      stats: {
        upcomingExams: 2,
        pendingHomework: 2,
        newNotifications: 2,
        attendanceRate: 95,
      },
      upcomingExams: [
        { id: '1', subject: 'Mathematics', date: '2026-03-05', status: 'upcoming' },
        { id: '2', subject: 'English', date: '2026-03-07', status: 'upcoming' },
      ],
      homeworkTasks: [
        { id: '1', title: 'History Essay', subject: 'History', due: '2026-03-01', status: 'pending' },
        { id: '2', title: 'Physics Lab Report', subject: 'Physics', due: '2026-03-02', status: 'pending' },
      ],
      notifications: [
        { id: '1', message: 'School will be closed on 28th Feb.', date: '2026-02-22', type: 'info', read: false },
        { id: '2', message: 'New assignment uploaded for Chemistry.', date: '2026-02-20', type: 'info', read: false },
      ],
      timetable: [
        { id: '1', day: 'Monday', subject: 'Mathematics', time: '09:00 - 10:30', room: 'Room 101' },
        { id: '2', day: 'Tuesday', subject: 'English', time: '10:45 - 12:15', room: 'Room 102' },
        { id: '3', day: 'Wednesday', subject: 'Chemistry', time: '09:00 - 10:30', room: 'Lab 1' },
        { id: '4', day: 'Thursday', subject: 'Physics', time: '11:00 - 12:30', room: 'Lab 2' },
        { id: '5', day: 'Friday', subject: 'History', time: '09:00 - 10:30', room: 'Room 103' },
      ],
      resources: [
        { id: '1', title: 'Mathematics Notes', subject: 'Mathematics', type: 'notes', url: '/resources/math' },
        { id: '2', title: 'English Literature', subject: 'English', type: 'document', url: '/resources/english' },
        { id: '3', title: 'Chemistry Experiments', subject: 'Chemistry', type: 'video', url: '/resources/chemistry' },
      ],
    },
  };
}

// ============================================================================
// Teacher Dashboard API
// ============================================================================

export async function getTeacherDashboardData(teacherId: string): Promise<ApiResponse<TeacherDashboardData>> {
  // TODO: Replace with actual API call
  // return fetchApi(`/teachers/${teacherId}/dashboard`);
  
  // Mock implementation - remove when backend is connected
  return {
    success: true,
    data: {
      teacherName: 'Mrs. Sarah Johnson',
      teacherId,
      stats: {
        totalClasses: 5,
        pendingMarks: 12,
        pendingHomework: 3,
        unreadMessages: 5,
      },
      tasks: [
        {
          title: 'Mark Attendance',
          description: 'Record daily attendance for all your classes.',
          action: 'Mark Now',
          route: '/teacher/attendance',
        },
        {
          title: 'Enter & Calculate Exam Marks',
          description: 'Input exam marks and automatically calculate grades.',
          action: 'Enter Marks',
          route: '/teacher/marks',
        },
        {
          title: 'Assign & Track Homework',
          description: 'Create assignments, track submissions, and give feedback.',
          action: 'Assign Homework',
          route: '/teacher/homework',
        },
        {
          title: 'Messaging to Parents & Students',
          description: 'Send messages, updates, or reminders directly.',
          action: 'Send Message',
          route: '/teacher/messages',
        },
        {
          title: 'View Class Schedule',
          description: 'Check your upcoming classes and timetable.',
          action: 'View Schedule',
          route: '/teacher/schedule',
        },
        {
          title: 'Manage Students',
          description: 'View student profiles and performance statistics.',
          action: 'View Students',
          route: '/teacher/students',
        },
      ],
      classes: [
        { id: '1', name: 'Class 10-A', subject: 'Mathematics', studentCount: 35, schedule: 'Mon, Wed, Fri' },
        { id: '2', name: 'Class 9-B', subject: 'Mathematics', studentCount: 32, schedule: 'Tue, Thu' },
      ],
      recentAttendance: [
        { id: '1', classId: '1', date: '2026-02-25', totalStudents: 35, present: 33, absent: 2 },
        { id: '2', classId: '2', date: '2026-02-25', totalStudents: 32, present: 30, absent: 2 },
      ],
      exams: [
        { id: '1', subject: 'Mathematics', className: 'Class 10-A', date: '2026-03-10', status: 'pending' },
        { id: '2', subject: 'Mathematics', className: 'Class 9-B', date: '2026-03-12', status: 'pending' },
      ],
    },
  };
}

// ============================================================================
// Parent Dashboard API
// ============================================================================

export async function getParentDashboardData(parentId: string): Promise<ApiResponse<ParentDashboardData>> {
  // TODO: Replace with actual API call
  // return fetchApi(`/parents/${parentId}/dashboard`);
  
  // Mock implementation - remove when backend is connected
  return {
    success: true,
    data: {
      parentName: 'Mr. Robert Williams',
      parentId,
      children: [
        { id: '1', name: 'Emily Williams', grade: 'Grade 10', section: 'A', studentId: 'STU001' },
        { id: '2', name: 'James Williams', grade: 'Grade 8', section: 'B', studentId: 'STU002' },
      ],
      selectedChildId: '1',
      stats: {
        totalChildren: 2,
        totalNotifications: 4,
        unreadMessages: 2,
      },
      notifications: [
        { id: '1', message: 'Parent-Teacher meeting scheduled for March 5th', date: '2026-02-24', type: 'info', read: false },
        { id: '2', message: 'Emily submitted her History assignment', date: '2026-02-23', type: 'success', read: true },
        { id: '3', message: 'James has 85% attendance this month', date: '2026-02-22', type: 'info', read: true },
        { id: '4', message: 'School will be closed on 28th Feb', date: '2026-02-20', type: 'warning', read: false },
      ],
      childAttendance: [
        { childId: '1', totalDays: 20, present: 18, absent: 2, rate: 90 },
        { childId: '2', totalDays: 20, present: 19, absent: 1, rate: 95 },
      ],
      childHomework: [
        { id: '1', childId: '1', title: 'History Essay', subject: 'History', due: '2026-03-01', status: 'pending' },
        { id: '2', childId: '2', title: 'Science Project', subject: 'Science', due: '2026-03-03', status: 'submitted' },
      ],
      childExamResults: [
        { id: '1', childId: '1', subject: 'Mathematics', score: 92, grade: 'A', date: '2026-02-15' },
        { id: '2', childId: '1', subject: 'English', score: 88, grade: 'B+', date: '2026-02-15' },
        { id: '3', childId: '2', subject: 'Science', score: 95, grade: 'A', date: '2026-02-18' },
      ],
    },
  };
}

// ============================================================================
// Admin Dashboard API
// ============================================================================

export async function getAdminDashboardData(adminId: string): Promise<ApiResponse<AdminDashboardData>> {
  // TODO: Replace with actual API call
  // return fetchApi(`/admin/${adminId}/dashboard`);
  
  // Mock implementation - remove when backend is connected
  return {
    success: true,
    data: {
      adminName: 'Administrator',
      adminId,
      stats: {
        totalStudents: 450,
        totalTeachers: 35,
        totalParents: 380,
        totalClasses: 20,
        averageAttendance: 92,
      },
      tasks: [
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
      ],
      recentUsers: [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', lastLogin: '2026-02-25' },
        { id: '2', name: 'Mrs. Sarah', email: 'sarah@example.com', role: 'teacher', status: 'active', lastLogin: '2026-02-25' },
        { id: '3', name: 'Mr. Robert', email: 'robert@example.com', role: 'parent', status: 'active', lastLogin: '2026-02-24' },
      ],
      notifications: [
        { id: '1', title: 'System Maintenance', message: 'Scheduled maintenance on Feb 28', targetRole: 'all', date: '2026-02-25', status: 'sent' },
        { id: '2', title: 'New Academic Year', message: 'Registration opens for new academic year', targetRole: 'students', date: '2026-02-24', status: 'scheduled' },
      ],
    },
  };
}

// ============================================================================
// Generic Dashboard Fetcher
// ============================================================================

export async function getDashboardData(role: UserRole, userId: string): Promise<ApiResponse<StudentDashboardData | TeacherDashboardData | ParentDashboardData | AdminDashboardData>> {
  switch (role) {
    case 'student':
      return getStudentDashboardData(userId);
    case 'teacher':
      return getTeacherDashboardData(userId);
    case 'parent':
      return getParentDashboardData(userId);
    case 'admin':
      return getAdminDashboardData(userId);
    default:
      return { success: false, error: 'Invalid role' };
  }
}
