// ============================================================================
// Dashboard Types - Shared interfaces for all role-based dashboards
// These types align with backend API responses for easy integration
// ============================================================================

// Common types
export interface DashboardStats {
  label: string;
  value: number | string;
  icon?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

export interface DashboardTask {
  title: string;
  description: string;
  action: string;
  route: string;
  icon?: string;
}

// ============================================================================
// Student Dashboard Types
// ============================================================================

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time?: string;
  room?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  due: string;
  status: 'pending' | 'submitted' | 'late';
  description?: string;
}

export interface TimetableEntry {
  id: string;
  day: string;
  subject: string;
  time: string;
  room?: string;
  teacher?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  subject: string;
  type: 'notes' | 'video' | 'document' | 'link';
  url: string;
}

export interface StudentDashboardData {
  studentName: string;
  studentId: string;
  stats: {
    upcomingExams: number;
    pendingHomework: number;
    newNotifications: number;
    attendanceRate?: number;
  };
  upcomingExams: Exam[];
  homeworkTasks: Homework[];
  notifications: Notification[];
  timetable: TimetableEntry[];
  resources: LearningResource[];
}

// ============================================================================
// Teacher Dashboard Types
// ============================================================================

export interface TeacherClass {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  schedule?: string;
}

export interface TeacherAttendanceRecord {
  id: string;
  classId: string;
  date: string;
  totalStudents: number;
  present: number;
  absent: number;
}

export interface TeacherExamRecord {
  id: string;
  subject: string;
  className: string;
  date: string;
  averageScore?: number;
  status: 'pending' | 'completed' | 'graded';
}

export interface TeacherDashboardData {
  teacherName: string;
  teacherId: string;
  stats: {
    totalClasses: number;
    pendingMarks: number;
    pendingHomework: number;
    unreadMessages: number;
  };
  tasks: DashboardTask[];
  classes: TeacherClass[];
  recentAttendance: TeacherAttendanceRecord[];
  exams: TeacherExamRecord[];
}

// ============================================================================
// Parent Dashboard Types
// ============================================================================

export interface ChildInfo {
  id: string;
  name: string;
  grade: string;
  section: string;
  studentId: string;
}

export interface ChildAttendance {
  childId: string;
  totalDays: number;
  present: number;
  absent: number;
  rate: number;
}

export interface ChildHomework {
  id: string;
  childId: string;
  title: string;
  subject: string;
  due: string;
  status: 'pending' | 'submitted';
}

export interface ChildExamResult {
  id: string;
  childId: string;
  subject: string;
  score: number;
  grade: string;
  date: string;
}

export interface ParentDashboardData {
  parentName: string;
  parentId: string;
  children: ChildInfo[];
  selectedChildId?: string;
  stats: {
    totalChildren: number;
    totalNotifications: number;
    unreadMessages: number;
  };
  notifications: Notification[];
  childAttendance: ChildAttendance[];
  childHomework: ChildHomework[];
  childExamResults: ChildExamResult[];
}

// ============================================================================
// Admin Dashboard Types
// ============================================================================

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  averageAttendance: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | 'students' | 'teachers' | 'parents';
  date: string;
  status: 'sent' | 'draft' | 'scheduled';
}

export interface AdminDashboardData {
  adminName: string;
  adminId: string;
  stats: SchoolStats;
  tasks: DashboardTask[];
  recentUsers: SystemUser[];
  notifications: AdminNotification[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Role Type
// ============================================================================

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export interface DashboardProps<T> {
  data: T;
  isLoading?: boolean;
  error?: string;
}
