<?php

require_once __DIR__ . '/../Helpers/Auth.php';
require_once __DIR__ . '/../Helpers/Response.php';

class TeacherController
{
    private function requireAuth(): void
    {
        if (!Auth::check()) Response::unauthorized('Please login to continue');
        if (!Auth::hasRole('teacher')) Response::forbidden('Access denied');
    }

    public function dashboard(): void
    {
        $this->requireAuth();
        $user = Auth::user();
        $db = db();
        $stmt = $db->prepare("SELECT * FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();
        $stmt = $db->prepare("SELECT c.*, sub.name as subject_name FROM class_subjects cs INNER JOIN classes c ON cs.class_id = c.id INNER JOIN subjects sub ON cs.subject_id = sub.id WHERE cs.teacher_id = ?");
        $stmt->execute([$teacher['id']]);
        $classes = array_map(function($c) use ($db) {
            $countStmt = $db->prepare("SELECT COUNT(*) as cnt FROM students WHERE class_id = ?");
            $countStmt->execute([$c['id']]);
            return ['id' => $c['id'], 'name' => $c['name'], 'subject' => $c['subject_name'], 'studentCount' => $countStmt->fetch()['cnt'], 'schedule' => 'Mon, Wed, Fri'];
        }, $stmt->fetchAll());
        $stmt = $db->prepare("SELECT e.*, c.name as class_name, sub.name as subject_name FROM exams e INNER JOIN classes c ON e.class_id = c.id INNER JOIN subjects sub ON e.subject_id = sub.id WHERE e.created_by = ? AND e.date >= CURDATE() ORDER BY e.date ASC LIMIT 5");
        $stmt->execute([$teacher['id']]);
        $exams = array_map(fn($e) => ['id' => $e['id'], 'subject' => $e['subject_name'], 'className' => $e['class_name'], 'date' => $e['date'], 'status' => $e['status']], $stmt->fetchAll());
        Response::success(['teacherName' => $user['first_name'] . ' ' . $user['last_name'], 'teacherId' => $teacher['id'], 'stats' => ['totalClasses' => count($classes), 'pendingMarks' => 12, 'pendingHomework' => 3, 'unreadMessages' => 5], 'classes' => $classes, 'exams' => $exams]);
    }

    public function attendance(): void
    {
        $this->requireAuth();
        $user = Auth::user();
        $db = db();
        $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();
        $stmt = $db->prepare("SELECT a.*, c.name as class_name FROM attendance a INNER JOIN classes c ON a.class_id = c.id WHERE a.marked_by = ? ORDER BY a.date DESC LIMIT 10");
        $stmt->execute([$teacher['id']]);
        Response::success(['records' => array_map(fn($r) => ['id' => $r['id'], 'classId' => $r['class_id'], 'className' => $r['class_name'], 'date' => $r['date'], 'totalStudents' => 35, 'present' => 33, 'absent' => 2], $stmt->fetchAll())]);
    }

    public function homework(): void
    {
        $this->requireAuth();
        $user = Auth::user();
        $db = db();
        $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();
        $stmt = $db->prepare("SELECT h.*, sub.name as subject_name, c.name as class_name FROM homework h LEFT JOIN subjects sub ON h.subject_id = sub.id LEFT JOIN classes c ON h.class_id = c.id WHERE h.teacher_id = ? ORDER BY h.due_date DESC");
        $stmt->execute([$teacher['id']]);
        Response::success(array_map(fn($h) => ['id' => $h['id'], 'title' => $h['title'], 'subject' => $h['subject_name'], 'class' => $h['class_name'], 'dueDate' => $h['due_date'], 'type' => $h['homework_type'], 'totalMarks' => $h['total_marks']], $stmt->fetchAll()));
    }

    public function exams(): void
    {
        $this->requireAuth();
        $user = Auth::user();
        $db = db();
        $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();
        $stmt = $db->prepare("SELECT e.*, sub.name as subject_name, c.name as class_name FROM exams e LEFT JOIN subjects sub ON e.subject_id = sub.id LEFT JOIN classes c ON e.class_id = c.id WHERE e.created_by = ? ORDER BY e.date DESC");
        $stmt->execute([$teacher['id']]);
        Response::success(array_map(fn($e) => ['id' => $e['id'], 'name' => $e['name'], 'subject' => $e['subject_name'], 'className' => $e['class_name'], 'date' => $e['date'], 'status' => $e['status']], $stmt->fetchAll()));
    }

    public function messages(): void
    {
        $this->requireAuth();
        $user = Auth::user();
        $db = db();
        $stmt = $db->prepare("SELECT m.*, CONCAT(u.first_name, ' ', u.last_name) as sender_name, u.role as sender_type FROM messages m INNER JOIN users u ON m.sender_id = u.id WHERE m.receiver_id = ? AND m.receiver_type = 'teacher' ORDER BY m.created_at DESC LIMIT 50");
        $stmt->execute([$user['id']]);
        Response::success(array_map(fn($m) => ['id' => $m['id'], 'sender' => $m['sender_name'], 'senderType' => $m['sender_type'], 'subject' => $m['subject'], 'message' => $m['message'], 'read' => (bool)$m['is_read'], 'date' => $m['created_at']], $stmt->fetchAll()));
    }

    public function classes(): void
    {
        $this->requireAuth();
        $user = Auth::user();
        $db = db();
        $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $teacher = $stmt->fetch();
        $stmt = $db->prepare("SELECT c.*, sub.name as subject_name FROM class_subjects cs INNER JOIN classes c ON cs.class_id = c.id INNER JOIN subjects sub ON cs.subject_id = sub.id WHERE cs.teacher_id = ?");
        $stmt->execute([$teacher['id']]);
        Response::success(array_map(function($c) use ($db) {
            $countStmt = $db->prepare("SELECT COUNT(*) as cnt FROM students WHERE class_id = ?");
            $countStmt->execute([$c['id']]);
            return ['id' => $c['id'], 'name' => $c['name'], 'subject' => $c['subject_name'], 'studentCount' => $countStmt->fetch()['cnt']];
        }, $stmt->fetchAll()));
    }
}
