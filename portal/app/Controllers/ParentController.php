<?php

require_once __DIR__ . '/../Helpers/Auth.php';
require_once __DIR__ . '/../Helpers/Response.php';

/**
 * Parent Controller
 */
class ParentController
{
    private function requireAuth(): void
    {
        if (!Auth::check()) {
            Response::unauthorized('Please login to continue');
        }
        if (!Auth::hasRole('parent')) {
            Response::forbidden('Access denied');
        }
    }

    /**
     * Get parent dashboard data
     */
    public function dashboard(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        // Get parent info
        $stmt = $db->prepare("SELECT * FROM parents WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $parent = $stmt->fetch();

        // Get children
        $stmt = $db->prepare("
            SELECT s.id, s.admission_number, s.class_id, s.user_id,
                   u.first_name, u.last_name, c.name as class_name, c.grade_level
            FROM parent_students ps
            INNER JOIN students s ON ps.student_id = s.id
            INNER JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE ps.parent_id = ?
        ");
        $stmt->execute([$parent['id']]);
        $children = $stmt->fetchAll();

        $childData = array_map(function($child) use ($db) {
            // Get attendance for each child
            $stmt = $db->prepare("
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present
                FROM attendance
                WHERE student_id = ?
            ");
            $stmt->execute([$child['id']]);
            $attendance = $stmt->fetch();
            $attendanceRate = $attendance['total'] > 0 
                ? round(($attendance['present'] / $attendance['total']) * 100) 
                : 0;

            return [
                'id' => $child['id'],
                'name' => $child['first_name'] . ' ' . $child['last_name'],
                'grade' => 'Grade ' . $child['grade_level'],
                'section' => 'A',
                'studentId' => $child['user_id'],
                'attendanceRate' => $attendanceRate
            ];
        }, $children);

        // Get notifications
        $stmt = $db->prepare("
            SELECT * FROM notifications
            WHERE user_id = ? AND user_type = 'parent'
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

        Response::success([
            'parentName' => $user['first_name'] . ' ' . $user['last_name'],
            'parentId' => $parent['id'],
            'children' => $childData,
            'selectedChildId' => $children[0]['id'] ?? null,
            'stats' => [
                'totalChildren' => count($children),
                'totalNotifications' => count($notifications),
                'unreadMessages' => 2
            ],
            'notifications' => $notifications
        ]);
    }

    /**
     * Get child attendance
     */
    public function attendance(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM parents WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $parent = $stmt->fetch();

        // Get children IDs
        $stmt = $db->prepare("
            SELECT s.id, CONCAT(u.first_name, ' ', u.last_name) as name
            FROM parent_students ps
            INNER JOIN students s ON ps.student_id = s.id
            INNER JOIN users u ON s.user_id = u.id
            WHERE ps.parent_id = ?
        ");
        $stmt->execute([$parent['id']]);
        $children = $stmt->fetchAll();

        $childAttendance = [];
        foreach ($children as $child) {
            $stmt = $db->prepare("
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
                    SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent
                FROM attendance
                WHERE student_id = ?
            ");
            $stmt->execute([$child['id']]);
            $stats = $stmt->fetch();

            $childAttendance[] = [
                'childId' => $child['id'],
                'childName' => $child['name'],
                'totalDays' => $stats['total'],
                'present' => $stats['present'],
                'absent' => $stats['absent'],
                'rate' => $stats['total'] > 0 ? round(($stats['present'] / $stats['total']) * 100) : 0
            ];
        }

        Response::success($childAttendance);
    }

    /**
     * Get child results
     */
    public function results(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("SELECT id FROM parents WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $parent = $stmt->fetch();

        // Get children
        $stmt = $db->prepare("
            SELECT s.id, CONCAT(u.first_name, ' ', u.last_name) as name
            FROM parent_students ps
            INNER JOIN students s ON ps.student_id = s.id
            INNER JOIN users u ON s.user_id = u.id
            WHERE ps.parent_id = ?
        ");
        $stmt->execute([$parent['id']]);
        $children = $stmt->fetchAll();

        $allResults = [];
        foreach ($children as $child) {
            $stmt = $db->prepare("
                SELECT er.*, e.name as exam_name, sub.name as subject_name, e.date as exam_date
                FROM exam_results er
                INNER JOIN exams e ON er.exam_id = e.id
                INNER JOIN subjects sub ON e.subject_id = sub.id
                WHERE er.student_id = ?
                ORDER BY e.date DESC
            ");
            $stmt->execute([$child['id']]);
            $results = $stmt->fetchAll();

            foreach ($results as $r) {
                $allResults[] = [
                    'childId' => $child['id'],
                    'childName' => $child['name'],
                    'id' => $r['id'],
                    'examName' => $r['exam_name'],
                    'subject' => $r['subject_name'],
                    'score' => $r['marks_obtained'],
                    'grade' => $r['grade'],
                    'date' => $r['exam_date']
                ];
            }
        }

        Response::success($allResults);
    }

    /**
     * Get parent notifications
     */
    public function notifications(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("
            SELECT * FROM notifications
            WHERE user_id = ? AND user_type = 'parent'
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
                'date' => $n['created_at']
            ];
        }, $stmt->fetchAll());

        Response::success($notifications);
    }
}
