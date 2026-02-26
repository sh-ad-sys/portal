<?php

require_once __DIR__ . '/../Helpers/Auth.php';
require_once __DIR__ . '/../Helpers/Response.php';

/**
 * Shared Controller - For endpoints shared across roles
 */
class SharedController
{
    private function requireAuth(): void
    {
        if (!Auth::check()) {
            Response::unauthorized('Please login to continue');
        }
    }

    /**
     * Get timetable (shared endpoint)
     */
    public function timetable(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $classId = null;
        
        // Get class ID based on role
        switch ($user['role']) {
            case 'student':
                $stmt = $db->prepare("SELECT class_id FROM students WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $student = $stmt->fetch();
                $classId = $student['class_id'];
                break;
                
            case 'teacher':
                $stmt = $db->prepare("SELECT id FROM teachers WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $teacher = $stmt->fetch();
                
                $stmt = $db->prepare("
                    SELECT class_id FROM class_subjects 
                    WHERE teacher_id = ?
                ");
                $stmt->execute([$teacher['id']]);
                $teacherClasses = $stmt->fetchAll();
                break;
                
            case 'parent':
                // Get first child's class
                $stmt = $db->prepare("SELECT id FROM parents WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $parent = $stmt->fetch();
                
                $stmt = $db->prepare("
                    SELECT s.class_id FROM parent_students ps
                    INNER JOIN students s ON ps.student_id = s.id
                    WHERE ps.parent_id = ?
                    LIMIT 1
                ");
                $stmt->execute([$parent['id']]);
                $child = $stmt->fetch();
                $classId = $child['class_id'] ?? null;
                break;
                
            case 'admin':
                // Admin can see all classes
                break;
        }

        if ($user['role'] === 'teacher') {
            $timetable = [];
            foreach ($teacherClasses as $tc) {
                $stmt = $db->prepare("
                    SELECT t.*, sub.name as subject_name, 
                           u.first_name as teacher_name, c.name as class_name
                    FROM timetable t
                    LEFT JOIN subjects sub ON t.subject_id = sub.id
                    LEFT JOIN users u ON t.teacher_id = u.id
                    LEFT JOIN classes c ON t.class_id = c.id
                    WHERE t.class_id = ? AND t.is_active = 1
                    ORDER BY FIELD(t.day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'), t.start_time
                ");
                $stmt->execute([$tc['class_id']]);
                $entries = $stmt->fetchAll();
                
                foreach ($entries as $e) {
                    $timetable[] = [
                        'id' => $e['id'],
                        'className' => $e['class_name'],
                        'day' => ucfirst($e['day_of_week']),
                        'subject' => $e['subject_name'],
                        'time' => date('H:i', strtotime($e['start_time'])) . ' - ' . date('H:i', strtotime($e['end_time'])),
                        'room' => $e['room'],
                        'teacher' => $e['teacher_name']
                    ];
                }
            }
        } elseif ($classId) {
            $stmt = $db->prepare("
                SELECT t.*, sub.name as subject_name, 
                       u.first_name as teacher_name, c.name as class_name
                FROM timetable t
                LEFT JOIN subjects sub ON t.subject_id = sub.id
                LEFT JOIN users u ON t.teacher_id = u.id
                LEFT JOIN classes c ON t.class_id = c.id
                WHERE t.class_id = ? AND t.is_active = 1
                ORDER BY FIELD(t.day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'), t.start_time
            ");
            $stmt->execute([$classId]);
            $entries = $stmt->fetchAll();

            $timetable = array_map(function($e) {
                return [
                    'id' => $e['id'],
                    'className' => $e['class_name'],
                    'day' => ucfirst($e['day_of_week']),
                    'subject' => $e['subject_name'],
                    'time' => date('H:i', strtotime($e['start_time'])) . ' - ' . date('H:i', strtotime($e['end_time'])),
                    'room' => $e['room'],
                    'teacher' => $e['teacher_name']
                ];
            }, $entries);
        } else {
            $timetable = [];
        }

        Response::success($timetable);
    }

    /**
     * Get notifications (shared endpoint)
     */
    public function notifications(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        $stmt = $db->prepare("
            SELECT * FROM notifications
            WHERE user_id = ? AND user_type = ?
            ORDER BY created_at DESC
            LIMIT 50
        ");
        $stmt->execute([$user['id'], $user['role']]);
        $notifications = $stmt->fetchAll();

        Response::success(array_map(function($n) {
            return [
                'id' => $n['id'],
                'title' => $n['title'],
                'message' => $n['message'],
                'type' => $n['type'],
                'read' => (bool)$n['is_read'],
                'date' => $n['created_at'],
                'link' => $n['link']
            ];
        }, $notifications));
    }

    /**
     * Mark notification as read
     */
    public function markNotificationRead(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $data = Response::getJsonInput();
        
        $notificationId = $data['id'] ?? null;
        
        if (!$notificationId) {
            Response::validationError(['id' => 'Notification ID is required']);
        }

        $db = db();
        
        $stmt = $db->prepare("
            UPDATE notifications 
            SET is_read = 1, read_at = NOW()
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$notificationId, $user['id']]);

        Response::success(null, 'Notification marked as read');
    }
}
