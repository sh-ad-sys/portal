<?php

require_once __DIR__ . '/../Helpers/Auth.php';
require_once __DIR__ . '/../Helpers/Response.php';

/**
 * Student Controller
 */
class StudentController
{
    private function requireAuth(): void
    {
        if (!Auth::check()) {
            Response::unauthorized('Please login to continue');
        }
        if (!Auth::hasRole('student')) {
            Response::forbidden('Access denied');
        }
    }

    /**
     * Get student dashboard data
     */
    public function dashboard(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        // Get student info
        $stmt = $db->prepare("
            SELECT s.*, c.name as class_name, c.grade_level
            FROM students s
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE s.user_id = ?
        ");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        // Get upcoming exams
        $stmt = $db->prepare("
            SELECT e.*, sub.name as subject_name
            FROM exams e
            LEFT JOIN subjects sub ON e.subject_id = sub.id
            WHERE e.class_id = ? AND e.date >= CURDATE() AND e.status = 'scheduled'
            ORDER BY e.date ASC
            LIMIT 5
        ");
        $stmt->execute([$student['class_id']]);
        $upcomingExams = array_map(function($exam) {
            return [
                'id' => $exam['id'],
                'subject' => $exam['subject_name'],
                'date' => $exam['date'],
                'status' => $exam['status']
            ];
        }, $stmt->fetchAll());

        // Get pending homework
        $stmt = $db->prepare("
            SELECT h.*, sub.name as subject_name
            FROM homework h
            LEFT JOIN subjects sub ON h.subject_id = sub.id
            WHERE h.class_id = ? AND h.due_date >= NOW() AND h.is_active = 1
            ORDER BY h.due_date ASC
            LIMIT 5
        ");
        $stmt->execute([$student['class_id']]);
        $homeworkTasks = array_map(function($hw) {
            return [
                'id' => $hw['id'],
                'title' => $hw['title'],
                'subject' => $hw['subject_name'],
                'due' => $hw['due_date'],
                'status' => 'pending'
            ];
        }, $stmt->fetchAll());

        // Get notifications
        $stmt = $db->prepare("
            SELECT * FROM notifications
            WHERE user_id = ? AND user_type = 'student'
            ORDER BY created_at DESC
            LIMIT 10
        ");
        $stmt->execute([$user['id']]);
        $notifications = array_map(function($n) {
            return [
                'id' => $n['id'],
                'message' => $n['message'],
                'date' => $n['created_at'],
                'type' => $n['type'],
                'read' => (bool)$n['is_read']
            ];
        }, $stmt->fetchAll());

        // Calculate attendance rate
        $stmt = $db->prepare("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present
            FROM attendance
            WHERE student_id = ?
        ");
        $stmt->execute([$student['id']]);
        $attendance = $stmt->fetch();
        $attendanceRate = $attendance['total'] > 0 
            ? round(($attendance['present'] / $attendance['total']) * 100) 
            : 0;

        Response::success([
            'studentName' => $user['first_name'] . ' ' . $user['last_name'],
            'studentId' => $student['id'],
            'stats' => [
                'upcomingExams' => count($upcomingExams),
                'pendingHomework' => count($homeworkTasks),
                'newNotifications' => count(array_filter($notifications, fn($n) => !$n['read'])),
                'attendanceRate' => $attendanceRate
            ],
            'upcomingExams' => $upcomingExams,
            'homeworkTasks' => $homeworkTasks,
            'notifications' => $notifications
        ]);
    }

    /**
     * Get student attendance
     */
    public function attendance(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM students WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT a.*, c.name as class_name
            FROM attendance a
            LEFT JOIN classes c ON a.class_id = c.id
            WHERE a.student_id = ?
            ORDER BY a.date DESC
            LIMIT 30
        ");
        $stmt->execute([$student['id']]);

        $attendance = array_map(function($a) {
            return [
                'id' => $a['id'],
                'date' => $a['date'],
                'status' => $a['status'],
                'remarks' => $a['remarks']
            ];
        }, $stmt->fetchAll());

        // Calculate stats
        $stmt = $db->prepare("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late
            FROM attendance
            WHERE student_id = ?
        ");
        $stmt->execute([$student['id']]);
        $stats = $stmt->fetch();

        Response::success([
            'records' => $attendance,
            'stats' => [
                'total' => $stats['total'],
                'present' => $stats['present'],
                'absent' => $stats['absent'],
                'late' => $stats['late'],
                'rate' => $stats['total'] > 0 ? round(($stats['present'] / $stats['total']) * 100) : 0
            ]
        ]);
    }

    /**
     * Get student homework
     */
    public function homework(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT class_id FROM students WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT h.*, sub.name as subject_name, t.first_name as teacher_name
            FROM homework h
            LEFT JOIN subjects sub ON h.subject_id = sub.id
            LEFT JOIN users t ON h.teacher_id = t.id
            WHERE h.class_id = ?
            ORDER BY h.due_date DESC
        ");
        $stmt->execute([$student['class_id']]);

        $homework = array_map(function($hw) {
            return [
                'id' => $hw['id'],
                'title' => $hw['title'],
                'description' => $hw['description'],
                'subject' => $hw['subject_name'],
                'due' => $hw['due_date'],
                'type' => $hw['homework_type'],
                'status' => $hw['is_active'] ? 'active' : 'inactive'
            ];
        }, $stmt->fetchAll());

        Response::success($homework);
    }

    /**
     * Get student exams
     */
    public function exams(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT class_id FROM students WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT e.*, sub.name as subject_name
            FROM exams e
            LEFT JOIN subjects sub ON e.subject_id = sub.id
            WHERE e.class_id = ?
            ORDER BY e.date DESC
        ");
        $stmt->execute([$student['class_id']]);

        $exams = array_map(function($e) {
            return [
                'id' => $e['id'],
                'subject' => $e['subject_name'],
                'name' => $e['name'],
                'date' => $e['date'],
                'startTime' => $e['start_time'],
                'endTime' => $e['end_time'],
                'room' => $e['room'],
                'status' => $e['status'],
                'totalMarks' => $e['total_marks']
            ];
        }, $stmt->fetchAll());

        Response::success($exams);
    }

    /**
     * Get student results
     */
    public function results(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM students WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT er.*, e.name as exam_name, sub.name as subject_name, e.date as exam_date
            FROM exam_results er
            LEFT JOIN exams e ON er.exam_id = e.id
            LEFT JOIN subjects sub ON e.subject_id = sub.id
            WHERE er.student_id = ?
            ORDER BY e.date DESC
        ");
        $stmt->execute([$student['id']]);

        $results = array_map(function($r) {
            return [
                'id' => $r['id'],
                'examName' => $r['exam_name'],
                'subject' => $r['subject_name'],
                'score' => $r['marks_obtained'],
                'grade' => $r['grade'],
                'date' => $r['exam_date']
            ];
        }, $stmt->fetchAll());

        Response::success($results);
    }

    /**
     * Get student timetable
     */
    public function timetable(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT class_id FROM students WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT t.*, sub.name as subject_name, u.first_name as teacher_name, r.room_number
            FROM timetable t
            LEFT JOIN subjects sub ON t.subject_id = sub.id
            LEFT JOIN users u ON t.teacher_id = u.id
            LEFT JOIN classes r ON t.class_id = r.id
            WHERE t.class_id = ? AND t.is_active = 1
            ORDER BY FIELD(t.day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'), t.start_time
        ");
        $stmt->execute([$student['class_id']]);

        $timetable = array_map(function($t) {
            return [
                'id' => $t['id'],
                'day' => ucfirst($t['day_of_week']),
                'subject' => $t['subject_name'],
                'time' => date('H:i', strtotime($t['start_time'])) . ' - ' . date('H:i', strtotime($t['end_time'])),
                'room' => $t['room'],
                'teacher' => $t['teacher_name']
            ];
        }, $stmt->fetchAll());

        Response::success($timetable);
    }

    /**
     * Get student clubs
     */
    public function clubs(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM students WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        // Get clubs student is a member of
        $stmt = $db->prepare("
            SELECT c.*, cm.role as member_role
            FROM club_members cm
            INNER JOIN clubs c ON cm.club_id = c.id
            WHERE cm.student_id = ?
        ");
        $stmt->execute([$student['id']]);
        $myClubs = array_map(function($c) {
            return [
                'id' => $c['id'],
                'name' => $c['name'],
                'description' => $c['description'],
                'category' => $c['category'],
                'meetingDay' => $c['meeting_day'],
                'meetingTime' => $c['meeting_time'],
                'role' => $c['member_role']
            ];
        }, $stmt->fetchAll());

        // Get all available clubs
        $stmt = $db->prepare("SELECT * FROM clubs WHERE is_active = 1");
        $stmt->execute([]);
        $allClubs = array_map(function($c) {
            return [
                'id' => $c['id'],
                'name' => $c['name'],
                'description' => $c['description'],
                'category' => $c['category'],
                'meetingDay' => $c['meeting_day'],
                'meetingTime' => $c['meeting_time'],
                'maxMembers' => $c['max_members']
            ];
        }, $stmt->fetchAll());

        Response::success([
            'myClubs' => $myClubs,
            'availableClubs' => $allClubs
        ]);
    }

    /**
     * Get student resources
     */
    public function resources(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT class_id FROM students WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT r.*, sub.name as subject_name
            FROM resources r
            LEFT JOIN subjects sub ON r.subject_id = sub.id
            WHERE r.class_id = ? AND r.is_active = 1
            ORDER BY r.created_at DESC
        ");
        $stmt->execute([$student['class_id']]);

        $resources = array_map(function($r) {
            return [
                'id' => $r['id'],
                'title' => $r['title'],
                'description' => $r['description'],
                'subject' => $r['subject_name'],
                'type' => $r['resource_type'],
                'url' => $r['file_url'] ?? $r['external_link'],
                'views' => $r['views']
            ];
        }, $stmt->fetchAll());

        Response::success($resources);
    }

    /**
     * Get student notifications
     */
    public function notifications(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("
            SELECT * FROM notifications
            WHERE user_id = ? AND user_type = 'student'
            ORDER BY created_at DESC
            LIMIT 50
        ");
        $stmt->execute([$user['id']]);

        $notifications = array_map(function($n) {
            return [
                'id' => $n['id'],
                'title' => $n['title'],
                'message' => $n['message'],
                'type' => $n['type'],
                'read' => (bool)$n['is_read'],
                'date' => $n['created_at'],
                'link' => $n['link']
            ];
        }, $stmt->fetchAll());

        Response::success($notifications);
    }

    /**
     * Get student messages
     */
    public function messages(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        // Get received messages
        $stmt = $db->prepare("
            SELECT m.*, 
                   CONCAT(u.first_name, ' ', u.last_name) as sender_name,
                   u.role as sender_type
            FROM messages m
            INNER JOIN users u ON m.sender_id = u.id
            WHERE m.receiver_id = ? AND m.receiver_type = 'student'
            ORDER BY m.created_at DESC
            LIMIT 50
        ");
        $stmt->execute([$user['id']]);

        $messages = array_map(function($m) {
            return [
                'id' => $m['id'],
                'sender' => $m['sender_name'],
                'senderType' => $m['sender_type'],
                'subject' => $m['subject'],
                'message' => $m['message'],
                'read' => (bool)$m['is_read'],
                'date' => $m['created_at']
            ];
        }, $stmt->fetchAll());

        Response::success($messages);
    }

    /**
     * Get student profile
     */
    public function profile(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("
            SELECT s.*, c.name as class_name, c.grade_level
            FROM students s
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE s.user_id = ?
        ");
        $stmt->execute([$user['id']]);
        $student = $stmt->fetch();

        $profile = [
            'user' => [
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'profileImage' => $user['profile_image']
            ],
            'student' => [
                'admissionNumber' => $student['admission_number'],
                'class' => $student['class_name'],
                'gradeLevel' => $student['grade_level'],
                'dateOfBirth' => $student['date_of_birth'],
                'gender' => $student['gender'],
                'bloodGroup' => $student['blood_group'],
                'address' => $student['address'],
                'fatherName' => $student['father_name'],
                'motherName' => $student['mother_name'],
                'emergencyContact' => $student['emergency_contact'],
                'emergencyContactName' => $student['emergency_contact_name']
            ]
        ];

        Response::success($profile);
    }
}
