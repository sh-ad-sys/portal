<?php

require_once __DIR__ . '/../Helpers/Auth.php';
require_once __DIR__ . '/../Helpers/Response.php';

/**
 * Teacher Controller
 */
class TeacherController
{
    private function requireAuth(): void
    {
        if (!Auth::check()) {
            Response::unauthorized('Please login to continue');
        }
        if (!Auth::hasRole('teacher')) {
            Response::forbidden('Access denied');
        }
    }

    /**
     * Get teacher dashboard data
     */
    public function dashboard(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        // Get teacher info
        $stmt = $db->prepare("SELECT * FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();

        // Get classes taught by this teacher
        $stmt = $db->prepare("
            SELECT c.*, sub.name as subject_name
            FROM class_subjects cs
            INNER JOIN classes c ON cs.class_id = c.id
            INNER JOIN subjects sub ON cs.subject_id = sub.id
            WHERE cs.teacher_id = ?
        ");
        $stmt->execute([$teacher['id']]);
        $classes = array_map(function($c) {
            // Get student count
            $db = db();
            $countStmt = $db->prepare("SELECT COUNT(*) as cnt FROM students WHERE class_id = ?");
            $countStmt->execute([$c['id']]);
            $count = $countStmt->fetch();
            
            return [
                'id' => $c['id'],
                'name' => $c['name'],
                'subject' => $c['subject_name'],
                'studentCount' => $count['cnt'],
                'schedule' => 'Mon, Wed, Fri'
            ];
        }, $stmt->fetchAll());

        // Get pending marks count
        $stmt = $db->prepare("
            SELECT COUNT(*) as cnt FROM exam_results 
            WHERE graded_by IS NULL
        ");
        $stmt->execute();
        $pendingMarks = $stmt->fetch()['cnt'];

        // Get recent attendance
        $stmt = $db->prepare("
            SELECT a.*, c.name as class_name
            FROM attendance a
            INNER JOIN classes c ON a.class_id = c.id
            WHERE a.marked_by = ?
            ORDER BY a.date DESC
            LIMIT 5
        ");
        $stmt->execute([$teacher['id']]);
        $recentAttendance = array_map(function($a) {
            return [
                'id' => $a['id'],
                'classId' => $a['class_id'],
                'date' => $a['date'],
                'totalStudents' => 35, // Would need to calculate
                'present' => 33,
                'absent' => 2
            ];
        }, $stmt->fetchAll());

        // Get upcoming exams
        $stmt = $db->prepare("
            SELECT e.*, c.name as class_name, sub.name as subject_name
            FROM exams e
            INNER JOIN classes c ON e.class_id = c.id
            INNER JOIN subjects sub ON e.subject_id = sub.id
            WHERE e.created_by = ? AND e.date >= CURDATE()
            ORDER BY e.date ASC
            LIMIT 5
        ");
        $stmt->execute([$teacher['id']]);
        $exams = array_map(function($e) {
            return [
                'id' => $e['id'],
                'subject' => $e['subject_name'],
                'className' => $e['class_name'],
                'date' => $e['date'],
                'status' => $e['status']
            ];
        }, $stmt->fetchAll());

        // Get pending homework
        $stmt = $db->prepare("
            SELECT COUNT(*) as cnt FROM homework
            WHERE teacher_id = ? AND due_date >= NOW()
        ");
        $stmt->execute([$teacher['id']]);
        $pendingHomework = $stmt->fetch()['cnt'];

        Response::success([
            'teacherName' => $user['first_name'] . ' ' . $user['last_name'],
            'teacherId' => $teacher['id'],
            'stats' => [
                'totalClasses' => count($classes),
                'pendingMarks' => $pendingMarks,
                'pendingHomework' => $pendingHomework,
                'unreadMessages' => 5
            ],
            'tasks' => [
                [
                    'title' => 'Mark Attendance',
                    'description' => 'Record daily attendance for all your classes.',
                    'action' => 'Mark Now',
                    'route' => '/teacher/attendance'
                ],
                [
                    'title' => 'Enter & Calculate Exam Marks',
                    'description' => 'Input exam marks and automatically calculate grades.',
                    'action' => 'Enter Marks',
                    'route' => '/teacher/marks'
                ],
                [
                    'title' => 'Assign & Track Homework',
                    'description' => 'Create assignments, track submissions, and give feedback.',
                    'action' => 'Assign Homework',
                    'route' => '/teacher/homework'
                ],
                [
                    'title' => 'Messaging to Parents & Students',
                    'description' => 'Send messages, updates, or reminders directly.',
                    'action' => 'Send Message',
                    'route' => '/teacher/messages'
                ]
            ],
            'classes' => $classes,
            'recentAttendance' => $recentAttendance,
            'exams' => $exams
        ]);
    }

    /**
     * Get teacher attendance
     */
    public function attendance(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();

        // Get students from teacher's classes
        $stmt = $db->prepare("
            SELECT DISTINCT s.*, c.name as class_name, u.first_name, u.last_name
            FROM students s
            INNER JOIN classes c ON s.class_id = c.id
            INNER JOIN class_subjects cs ON c.id = cs.class_id
            INNER JOIN users u ON s.user_id = u.id
            WHERE cs.teacher_id = ?
            ORDER BY c.name, u.first_name
        ");
        $stmt->execute([$teacher['id']]);
        $students = $stmt->fetchAll();

        // Get recent attendance records
        $stmt = $db->prepare("
            SELECT a.*, c.name as class_name
            FROM attendance a
            INNER JOIN classes c ON a.class_id = c.id
            WHERE a.marked_by = ?
            ORDER BY a.date DESC
            LIMIT 10
        ");
        $stmt->execute([$teacher['id']]);
        $records = $stmt->fetchAll();

        Response::success([
            'teacherId' => $teacher['id'],
            'students' => array_map(function($s) {
                return [
                    'id' => $s['id'],
                    'name' => $s['first_name'] . ' ' . $s['last_name'],
                    'admissionNumber' => $s['admission_number'],
                    'class' => $s['class_name']
                ];
            }, $students),
            'records' => array_map(function($r) {
                return [
                    'id' => $r['id'],
                    'classId' => $r['class_id'],
                    'className' => $r['class_name'],
                    'date' => $r['date'],
                    'totalStudents' => 35,
                    'present' => 33,
                    'absent' => 2
                ];
            }, $records)
        ]);
    }

    /**
     * Get teacher homework
     */
    public function homework(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT h.*, sub.name as subject_name, c.name as class_name
            FROM homework h
            LEFT JOIN subjects sub ON h.subject_id = sub.id
            LEFT JOIN classes c ON h.class_id = c.id
            WHERE h.teacher_id = ?
            ORDER BY h.due_date DESC
        ");
        $stmt->execute([$teacher['id']]);

        $homework = array_map(function($hw) {
            return [
                'id' => $hw['id'],
                'title' => $hw['title'],
                'description' => $hw['description'],
                'subject' => $hw['subject_name'],
                'class' => $hw['class_name'],
                'dueDate' => $hw['due_date'],
                'type' => $hw['homework_type'],
                'totalMarks' => $hw['total_marks'],
                'isActive' => (bool)$hw['is_active']
            ];
        }, $stmt->fetchAll());

        Response::success($homework);
    }

    /**
     * Get teacher exams
     */
    public function exams(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT e.*, sub.name as subject_name, c.name as class_name
            FROM exams e
            LEFT JOIN subjects sub ON e.subject_id = sub.id
            LEFT JOIN classes c ON e.class_id = c.id
            WHERE e.created_by = ?
            ORDER BY e.date DESC
        ");
        $stmt->execute([$teacher['id']]);

        $exams = array_map(function($e) {
            return [
                'id' => $e['id'],
                'name' => $e['name'],
                'subject' => $e['subject_name'],
                'className' => $e['class_name'],
                'date' => $e['date'],
                'startTime' => $e['start_time'],
                'endTime' => $e['end_time'],
                'totalMarks' => $e['total_marks'],
                'status' => $e['status']
            ];
        }, $stmt->fetchAll());

        Response::success($exams);
    }

    /**
     * Get teacher messages
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
            WHERE m.receiver_id = ? AND m.receiver_type = 'teacher'
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
     * Get teacher classes
     */
    public function classes(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();

        $stmt = $db->prepare("
            SELECT c.*, sub.name as subject_name
            FROM class_subjects cs
            INNER JOIN classes c ON cs.class_id = c.id
            INNER JOIN subjects sub ON cs.subject_id = sub.id
            WHERE cs.teacher_id = ?
        ");
        $stmt->execute([$teacher['id']]);

        $classes = array_map(function($c) {
            $db = db();
            $countStmt = $db->prepare("SELECT COUNT(*) as cnt FROM students WHERE class_id = ?");
            $countStmt->execute([$c['id']]);
            $count = $countStmt->fetch();
            
            return [
                'id' => $c['id'],
                'name' => $c['name'],
                'subject' => $c['subject_name'],
                'studentCount' => $count['cnt'],
                'schedule' => 'Mon, Wed, Fri'
            ];
        }, $stmt->fetchAll());

        Response::success($classes);
    }
}
