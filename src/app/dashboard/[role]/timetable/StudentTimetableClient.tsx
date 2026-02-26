"use client";

import { useState, useRef } from "react";
import "@/styles/timetable.css";

// Timetable types
interface TimetableSlot {
  id: string;
  time: string;
  duration: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
}

interface DaySchedule {
  day: string;
  date: string;
  slots: TimetableSlot[];
}

// Mock timetable data for Kenya High School
const timetableData: DaySchedule[] = [
  {
    day: "Monday",
    date: "2026-02-24",
    slots: [
      { id: "1", time: "07:30 - 08:30", duration: "1 hr", subject: "Morning Assembly", teacher: "All", room: "Assembly Ground", day: "Monday" },
      { id: "2", time: "08:30 - 09:30", duration: "1 hr", subject: "Mathematics", teacher: "Mr. J. Ochieng", room: "Room 101", day: "Monday" },
      { id: "3", time: "09:30 - 10:30", duration: "1 hr", subject: "English", teacher: "Mrs. K. Akinyi", room: "Room 102", day: "Monday" },
      { id: "4", time: "10:30 - 11:00", duration: "30 min", subject: "Break & Tea", teacher: "-", room: "Canteen", day: "Monday" },
      { id: "5", time: "11:00 - 12:00", duration: "1 hr", subject: "Physics", teacher: "Mr. S. Otieno", room: "Lab 2", day: "Monday" },
      { id: "6", time: "12:00 - 13:00", duration: "1 hr", subject: "Kiswahili", teacher: "Mr. D. Mwangi", room: "Room 103", day: "Monday" },
      { id: "7", time: "13:00 - 14:00", duration: "1 hr", subject: "Lunch Break", teacher: "-", room: "Dining Hall", day: "Monday" },
      { id: "8", time: "14:00 - 15:00", duration: "1 hr", subject: "Chemistry", teacher: "Mrs. P. Wanjiku", room: "Lab 1", day: "Monday" },
      { id: "9", time: "15:00 - 16:00", duration: "1 hr", subject: "Games/Clubs", teacher: "Various", room: "Sports Field", day: "Monday" },
    ]
  },
  {
    day: "Tuesday",
    date: "2026-02-25",
    slots: [
      { id: "10", time: "07:30 - 08:30", duration: "1 hr", subject: "Morning Assembly", teacher: "All", room: "Assembly Ground", day: "Tuesday" },
      { id: "11", time: "08:30 - 09:30", duration: "1 hr", subject: "Biology", teacher: "Mrs. L. Njoroge", room: "Lab 3", day: "Tuesday" },
      { id: "12", time: "09:30 - 10:30", duration: "1 hr", subject: "History", teacher: "Mr. R. Omolo", room: "Room 104", day: "Tuesday" },
      { id: "13", time: "10:30 - 11:00", duration: "30 min", subject: "Break & Tea", teacher: "-", room: "Canteen", day: "Tuesday" },
      { id: "14", time: "11:00 - 12:00", duration: "1 hr", subject: "Geography", teacher: "Mr. K. Kiprop", room: "Room 105", day: "Tuesday" },
      { id: "15", time: "12:00 - 13:00", duration: "1 hr", subject: "Mathematics", teacher: "Mr. J. Ochieng", room: "Room 101", day: "Tuesday" },
      { id: "16", time: "13:00 - 14:00", duration: "1 hr", subject: "Lunch Break", teacher: "-", room: "Dining Hall", day: "Tuesday" },
      { id: "17", time: "14:00 - 15:00", duration: "1 hr", subject: "Computer Studies", teacher: "Mr. J. Ndegwa", room: "Computer Lab", day: "Tuesday" },
      { id: "18", time: "15:00 - 16:00", duration: "1 hr", subject: "CRE", teacher: "Mrs. E. Kamau", room: "Room 106", day: "Tuesday" },
    ]
  },
  {
    day: "Wednesday",
    date: "2026-02-26",
    slots: [
      { id: "19", time: "07:30 - 08:30", duration: "1 hr", subject: "Morning Assembly", teacher: "All", room: "Assembly Ground", day: "Wednesday" },
      { id: "20", time: "08:30 - 09:30", duration: "1 hr", subject: "English", teacher: "Mrs. K. Akinyi", room: "Room 102", day: "Wednesday" },
      { id: "21", time: "09:30 - 10:30", duration: "1 hr", subject: "Chemistry", teacher: "Mrs. P. Wanjiku", room: "Lab 1", day: "Wednesday" },
      { id: "22", time: "10:30 - 11:00", duration: "30 min", subject: "Break & Tea", teacher: "-", room: "Canteen", day: "Wednesday" },
      { id: "23", time: "11:00 - 12:00", duration: "1 hr", subject: "Mathematics", teacher: "Mr. J. Ochieng", room: "Room 101", day: "Wednesday" },
      { id: "24", time: "12:00 - 13:00", duration: "1 hr", subject: "Physics", teacher: "Mr. S. Otieno", room: "Lab 2", day: "Wednesday" },
      { id: "25", time: "13:00 - 14:00", duration: "1 hr", subject: "Lunch Break", teacher: "-", room: "Dining Hall", day: "Wednesday" },
      { id: "26", time: "14:00 - 15:00", duration: "1 hr", subject: "Games", teacher: "Mr. P. Korir", room: "Sports Field", day: "Wednesday" },
      { id: "27", time: "15:00 - 16:00", duration: "1 hr", subject: "Self Study", teacher: "Various", room: "Library", day: "Wednesday" },
    ]
  },
  {
    day: "Thursday",
    date: "2026-02-27",
    slots: [
      { id: "28", time: "07:30 - 08:30", duration: "1 hr", subject: "Morning Assembly", teacher: "All", room: "Assembly Ground", day: "Thursday" },
      { id: "29", time: "08:30 - 09:30", duration: "1 hr", subject: "Kiswahili", teacher: "Mr. D. Mwangi", room: "Room 103", day: "Thursday" },
      { id: "30", time: "09:30 - 10:30", duration: "1 hr", subject: "Geography", teacher: "Mr. K. Kiprop", room: "Room 105", day: "Thursday" },
      { id: "31", time: "10:30 - 11:00", duration: "30 min", subject: "Break & Tea", teacher: "-", room: "Canteen", day: "Thursday" },
      { id: "32", time: "11:00 - 12:00", duration: "1 hr", subject: "Biology", teacher: "Mrs. L. Njoroge", room: "Lab 3", day: "Thursday" },
      { id: "33", time: "12:00 - 13:00", duration: "1 hr", subject: "History", teacher: "Mr. R. Omolo", room: "Room 104", day: "Thursday" },
      { id: "34", time: "13:00 - 14:00", duration: "1 hr", subject: "Lunch Break", teacher: "-", room: "Dining Hall", day: "Thursday" },
      { id: "35", time: "14:00 - 15:00", duration: "1 hr", subject: "Computer Studies", teacher: "Mr. J. Ndegwa", room: "Computer Lab", day: "Thursday" },
      { id: "36", time: "15:00 - 16:00", duration: "1 hr", subject: "Clubs & Activities", teacher: "Various", room: "Various", day: "Thursday" },
    ]
  },
  {
    day: "Friday",
    date: "2026-02-28",
    slots: [
      { id: "37", time: "07:30 - 08:30", duration: "1 hr", subject: "Morning Assembly", teacher: "All", room: "Assembly Ground", day: "Friday" },
      { id: "38", time: "08:30 - 09:30", duration: "1 hr", subject: "Physics", teacher: "Mr. S. Otieno", room: "Lab 2", day: "Friday" },
      { id: "39", time: "09:30 - 10:30", duration: "1 hr", subject: "Mathematics", teacher: "Mr. J. Ochieng", room: "Room 101", day: "Friday" },
      { id: "40", time: "10:30 - 11:00", duration: "30 min", subject: "Break & Tea", teacher: "-", room: "Canteen", day: "Friday" },
      { id: "41", time: "11:00 - 12:00", duration: "1 hr", subject: "English", teacher: "Mrs. K. Akinyi", room: "Room 102", day: "Friday" },
      { id: "42", time: "12:00 - 13:00", duration: "1 hr", subject: "CRE", teacher: "Mrs. E. Kamau", room: "Room 106", day: "Friday" },
      { id: "43", time: "13:00 - 14:00", duration: "1 hr", subject: "Lunch Break", teacher: "-", room: "Dining Hall", day: "Friday" },
      { id: "44", time: "14:00 - 15:00", duration: "1 hr", subject: "Chemistry", teacher: "Mrs. P. Wanjiku", room: "Lab 1", day: "Friday" },
      { id: "45", time: "15:00 - 16:00", duration: "1 hr", subject: "Home Room", teacher: "Mr. J. Ochieng", room: "Room 101", day: "Friday" },
    ]
  },
];

interface StudentTimetableProps {
  role: string;
}

export default function StudentTimetable({ role }: StudentTimetableProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  const handleDownloadPDF = () => {
    // Create a simple text-based timetable for download
    const timetableText = `GREEN VALLEY ACADEMY - STUDENT TIMETABLE
Academic Year 2026 - Grade 10 East

${timetableData.map(day => 
  `\n${day.day.toUpperCase()} (${day.date})
` +
  day.slots.map((slot, i) => 
    `${i + 1}. ${slot.time} - ${slot.subject} (${slot.teacher}) - ${slot.room}`
  ).join('\n')
).join('\n')}

---
Generated on: ${new Date().toLocaleDateString()}
Green Valley Academy Timetable`;

    // Create and download the file
    const blob = new Blob([timetableText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KenyaHighSchool_Timetable.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const today = new Date().getDay();
  const currentDayIndex = today === 0 ? 0 : today - 1; // Convert to Mon-Fri index

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      "Mathematics": "subject-math",
      "English": "subject-english",
      "Kiswahili": "subject-kiswahili",
      "Physics": "subject-physics",
      "Chemistry": "subject-chemistry",
      "Biology": "subject-biology",
      "History": "subject-history",
      "Geography": "subject-geography",
      "CRE": "subject-cre",
      "Computer Studies": "subject-computer",
      "Morning Assembly": "subject-assembly",
      "Break & Tea": "subject-break",
      "Lunch Break": "subject-lunch",
      "Games": "subject-games",
      "Clubs & Activities": "subject-clubs",
      "Self Study": "subject-study",
      "Home Room": "subject-homeroom",
    };
    return colors[subject] || "subject-default";
  };

  return (
    <div className="timetable-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div className="header-content">
          <h1>📅 My Timetable</h1>
          <p>Green Valley Academy • Grade 10 East • Academic Year 2026</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleDownloadPDF}>📥 Download</button>
        </div>
      </div>

      {/* ===== QUICK INFO CARDS ===== */}
      <div className="quick-info">
        <div className="info-card">
          <span className="info-icon">📚</span>
          <div className="info-text">
            <span className="info-value">8</span>
            <span className="info-label">Subjects</span>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">⏰</span>
          <div className="info-text">
            <span className="info-value">40</span>
            <span className="info-label">Lessons/Week</span>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">🏠</span>
          <div className="info-text">
            <span className="info-value">Room 101</span>
            <span className="info-label">Home Room</span>
          </div>
        </div>
        <div className="info-card">
          <span className="info-icon">👨‍🏫</span>
          <div className="info-text">
            <span className="info-value">Mr. J. Ochieng</span>
            <span className="info-label">Class Teacher</span>
          </div>
        </div>
      </div>

      {/* ===== DAY SELECTOR ===== */}
      <div className="day-selector">
        <div className="day-tabs">
          {days.map((day, index) => (
            <button
              key={day}
              className={`day-tab ${selectedDay === index ? "active" : ""} ${index === currentDayIndex ? "today" : ""}`}
              onClick={() => setSelectedDay(index)}
            >
              <span className="day-name">{day}</span>
              <span className="day-date">{timetableData[index]?.date}</span>
            </button>
          ))}
        </div>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "daily" ? "active" : ""}`}
            onClick={() => setViewMode("daily")}
          >
            Daily View
          </button>
          <button
            className={`toggle-btn ${viewMode === "weekly" ? "active" : ""}`}
            onClick={() => setViewMode("weekly")}
          >
            Weekly View
          </button>
        </div>
      </div>

      {/* ===== TIMETABLE CONTENT ===== */}
      <div className="timetable-content">
        {viewMode === "daily" ? (
          <div className="daily-view">
            <div className="day-header">
              <h2>{days[selectedDay]} Schedule</h2>
              <span className="date-badge">{timetableData[selectedDay]?.date}</span>
            </div>
            <div className="time-slots">
              {timetableData[selectedDay]?.slots.map((slot, index) => (
                <div key={slot.id} className={`time-slot ${getSubjectColor(slot.subject)}`}>
                  <div className="slot-time">
                    <span className="time">{slot.time}</span>
                    <span className="duration">{slot.duration}</span>
                  </div>
                  <div className="slot-details">
                    <span className="subject">{slot.subject}</span>
                    <span className="teacher">👨‍🏫 {slot.teacher}</span>
                    <span className="room">📍 {slot.room}</span>
                  </div>
                  <div className="slot-number">{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="weekly-view">
            <div className="weekly-table">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    {days.map(day => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 9 }).map((_, slotIndex) => (
                    <tr key={slotIndex}>
                      <td className="time-cell">
                        {timetableData[0]?.slots[slotIndex]?.time.split(" - ")[0]}
                      </td>
                      {days.map((_, dayIndex) => {
                        const slot = timetableData[dayIndex]?.slots[slotIndex];
                        return (
                          <td key={dayIndex} className={slot ? getSubjectColor(slot.subject) : ""}>
                            {slot && (
                              <div className="slot-cell">
                                <span className="cell-subject">{slot.subject}</span>
                                <span className="cell-room">{slot.room}</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ===== SUBJECT LEGEND ===== */}
      <div className="subject-legend">
        <h3>📚 Subject Legend</h3>
        <div className="legend-grid">
          <div className="legend-item"><span className="legend-color subject-math"></span> Mathematics</div>
          <div className="legend-item"><span className="legend-color subject-english"></span> English</div>
          <div className="legend-item"><span className="legend-color subject-kiswahili"></span> Kiswahili</div>
          <div className="legend-item"><span className="legend-color subject-physics"></span> Physics</div>
          <div className="legend-item"><span className="legend-color subject-chemistry"></span> Chemistry</div>
          <div className="legend-item"><span className="legend-color subject-biology"></span> Biology</div>
          <div className="legend-item"><span className="legend-color subject-history"></span> History</div>
          <div className="legend-item"><span className="legend-color subject-geography"></span> Geography</div>
          <div className="legend-item"><span className="legend-color subject-cre"></span> CRE</div>
          <div className="legend-item"><span className="legend-color subject-computer"></span> Computer</div>
        </div>
      </div>

      {/* ===== UPCOMING EVENTS ===== */}
      <div className="upcoming-events">
        <h3>📅 Upcoming Events This Week</h3>
        <div className="events-grid">
          <div className="event-card">
            <span className="event-date">Wed</span>
            <div className="event-details">
              <h4>Science Fair</h4>
              <p>9:00 AM - School Hall</p>
            </div>
          </div>
          <div className="event-card">
            <span className="event-date">Fri</span>
            <div className="event-details">
              <h4>Home Room Inspection</h4>
              <p>3:00 PM - All Classes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
