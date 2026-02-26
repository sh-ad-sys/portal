import { ReactNode, ReactElement, isValidElement, cloneElement } from "react";
import DashboardLayout from "@/components/DashboardLayout";

// Allowed roles
const allowedRoles = ["admin", "teacher", "student", "parent"] as const;
type Role = (typeof allowedRoles)[number];

interface RoleLayoutProps {
  children: ReactNode;
  params: { role: string } | Promise<{ role: string }>; // params may be a Promise
}

export default async function RoleDashboardLayout({ children, params }: RoleLayoutProps) {
  // Await params if it is a Promise
  const resolvedParams = params instanceof Promise ? await params : params;

  if (!resolvedParams || !resolvedParams.role) {
    return <div>Role not found in URL</div>;
  }

  const roleParam = resolvedParams.role.toLowerCase();

  if (!allowedRoles.includes(roleParam as Role)) {
    return <div>Invalid role</div>;
  }

  const role = roleParam as Role;

  // Mock user info — replace with real session logic
  const user = {
    role,
    userName: "Muthoni",
    logoName: "GVHS",
    schoolName: "Green Valley High School",
  };

  return (
    <DashboardLayout
      role={user.role}
      userName={user.userName}
      logoName={user.logoName}
      schoolName={user.schoolName}
    >
      {/* Only clone if children is a ReactElement (and not a string or fragment) */}
      {isValidElement(children)
        ? cloneElement(children as ReactElement<{ role: string }>, { role: user.role })
        : children}
    </DashboardLayout>
  );
}