// src/app/dashboard/[role]/timetable/page.tsx

import StudentTimetable from "./StudentTimetableClient";
import "@/styles/timetable.css";

interface TimetablePageProps {
  params: Promise<{ role: string }>;
}

export default async function TimetablePage({ params }: TimetablePageProps) {
  const resolvedParams = await params;
  return <StudentTimetable role={resolvedParams.role} />;
}
