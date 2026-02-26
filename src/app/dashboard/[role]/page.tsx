import Link from "next/link";

import StudentDashboard from "@/components/dashboard/student";
import TeacherDashboard from "@/components/dashboard/teacher";
import AdminDashboard from "@/components/dashboard/admin";
import ParentDashboard from "@/components/dashboard/parent";
import { getStudentDashboardData, getTeacherDashboardData, getParentDashboardData, getAdminDashboardData } from "@/services/api/dashboard";
import type { 
  StudentDashboardData, 
  TeacherDashboardData, 
  AdminDashboardData, 
  ParentDashboardData 
} from "@/types/dashboard";

interface PageProps {
  params: Promise<{ role: string }>;
}

// Type for dashboard data
type DashboardData = StudentDashboardData | TeacherDashboardData | ParentDashboardData | AdminDashboardData;

// Function to fetch data based on role
async function fetchDashboardData(role: string): Promise<{ data: DashboardData | null; error: string | null }> {
  const normalizedRole = role.toLowerCase();
  
  try {
    switch (normalizedRole) {
      case "student": {
        // In production, get userId from session/auth
        const result = await getStudentDashboardData("STU001");
        if (result.success && result.data) {
          return { data: result.data as StudentDashboardData, error: null };
        }
        return { data: null, error: result.error || "Failed to fetch student data" };
      }
      case "teacher": {
        const result = await getTeacherDashboardData("TEA001");
        if (result.success && result.data) {
          return { data: result.data as TeacherDashboardData, error: null };
        }
        return { data: null, error: result.error || "Failed to fetch teacher data" };
      }
      case "admin": {
        const result = await getAdminDashboardData("ADM001");
        if (result.success && result.data) {
          return { data: result.data as AdminDashboardData, error: null };
        }
        return { data: null, error: result.error || "Failed to fetch admin data" };
      }
      case "parent": {
        const result = await getParentDashboardData("PAR001");
        if (result.success && result.data) {
          return { data: result.data as ParentDashboardData, error: null };
        }
        return { data: null, error: result.error || "Failed to fetch parent data" };
      }
      default:
        return { data: null, error: "Invalid role" };
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { data: null, error: "Failed to fetch dashboard data" };
  }
}

export default async function RolePage({ params }: PageProps) {
  const { role } = await params;
  const normalizedRole = role.toLowerCase();

  // Fetch data server-side
  const { data, error } = await fetchDashboardData(role);

  // Render appropriate dashboard with data
  switch (normalizedRole) {
    case "student":
      return (
        <StudentDashboard 
          data={data as StudentDashboardData} 
          error={error || undefined}
        />
      );
    case "teacher":
      return (
        <TeacherDashboard 
          data={data as TeacherDashboardData}
          error={error || undefined}
        />
      );
    case "admin":
      return (
        <AdminDashboard 
          data={data as AdminDashboardData}
          error={error || undefined}
        />
      );
    case "parent":
      return (
        <ParentDashboard 
          data={data as ParentDashboardData}
          error={error || undefined}
        />
      );
    default:
      return (
        <div className="dashboard-not-found">
          <h1>Dashboard Not Found</h1>
          <p>The dashboard for role &quot;{role}&quot; does not exist.</p>
          <Link href="/" className="primary-btn">Go Home</Link>
        </div>
      );
  }
}
