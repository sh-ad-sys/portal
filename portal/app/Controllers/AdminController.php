<?php

require_once __DIR__ . '/../Helpers/Auth.php';
require_once __DIR__ . '/../Helpers/Response.php';

/**
 * Admin Controller
 */
class AdminController
{
    private function requireAuth(): void
    {
        if (!Auth::check()) {
            Response::unauthorized('Please login to continue');
        }
        if (!Auth::hasRole('admin')) {
            Response::forbidden('Access denied');
        }
    }

    /**
     * Get admin dashboard data
     */
    public function dashboard(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $db = db();

        // Get admin info
        $stmt = $db->prepare("SELECT * FROM admins WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $admin = $stmt->fetch();

        // Get counts
        $stats = [
            'totalStudents' => $db->query("SELECT COUNT(*) FROM students")->fetchColumn(),
            'totalTeachers' => $db->query("SELECT COUNT(*) FROM teachers")->fetchColumn(),
            'totalParents' => $db->query("SELECT COUNT(*) FROM parents")->fetchColumn(),
            'totalClasses' => $db->query("SELECT COUNT(*) FROM classes")->fetchColumn(),
            'averageAttendance' => 92
        ];

        // Get recent users
        $stmt = $db->query("
            SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, 
                   u.email, u.role, u.status, u.created_at
            FROM users u
            ORDER BY u.created_at DESC
            LIMIT 10
        ");
        $recentUsers = array_map(function($u) {
            return [
                'id' => $u['id'],
                'name' => $u['name'],
                'email' => $u['email'],
                'role' => $u['role'],
                'status' => $u['status'],
                'lastLogin' => $u['created_at']
            ];
        }, $stmt->fetchAll());

        // Get announcements
        $stmt = $db->query("
            SELECT * FROM announcements
            WHERE status = 'published'
            ORDER BY created_at DESC
            LIMIT 5
        ");
        $notifications = array_map(function($n) {
            return [
                'id' => $n['id'],
                'title' => $n['title'],
                'message' => $n['message'],
                'targetRole' => $n['target_role'],
                'date' => $n['created_at'],
                'status' => $n['status']
            ];
        }, $stmt->fetchAll());

        Response::success([
            'adminName' => $user['first_name'] . ' ' . $user['last_name'],
            'adminId' => $admin['id'],
            'stats' => $stats,
            'tasks' => [
                [
                    'title' => 'Admin Dashboard Home',
                    'description' => 'Overview of all administrative functions and key metrics.',
                    'action' => 'Go to Dashboard',
                    'route' => '/admin'
                ],
                [
                    'title' => 'Manage Users & Roles',
                    'description' => 'Add, edit, or remove users and assign roles.',
                    'action' => 'Manage Users',
                    'route' => '/admin/users'
                ],
                [
                    'title' => 'Attendance Overview',
                    'description' => 'View attendance records for all students and teachers.',
                    'action' => 'View Attendance',
                    'route' => '/admin/attendance'
                ],
                [
                    'title' => 'Exam & Assignment Setup',
                    'description' => 'Create exams, assignments, and track results.',
                    'action' => 'Setup Exams',
                    'route' => '/admin/exams'
                ],
                [
                    'title' => 'Notifications & Announcements',
                    'description' => 'Send notifications and important announcements.',
                    'action' => 'Send Notification',
                    'route' => '/admin/notifications'
                ]
            ],
            'recentUsers' => $recentUsers,
            'notifications' => $notifications
        ]);
    }

    /**
     * Get all users
     */
    public function users(): void
    {
        $this->requireAuth();
        
        $db = db();

        // Get all users with pagination
        $page = $_GET['page'] ?? 1;
        $limit = 20;
        $offset = ($page - 1) * $limit;

        $stmt = $db->query("SELECT COUNT(*) as total FROM users");
        $total = $stmt->fetch()['total'];

        $stmt = $db->prepare("
            SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, 
                   u.email, u.role, u.status, u.phone, u.created_at
            FROM users u
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$limit, $offset]);
        $users = $stmt->fetchAll();

        Response::success([
            'users' => array_map(function($u) {
                return [
                    'id' => $u['id'],
                    'name' => $u['name'],
                    'email' => $u['email'],
                    'role' => $u['role'],
                    'status' => $u['status'],
                    'phone' => $u['phone'],
                    'createdAt' => $u['created_at']
                ];
            }, $users),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * Get admin notifications
     */
    public function notifications(): void
    {
        $this->requireAuth();
        
        $db = db();

        $stmt = $db->query("
            SELECT * FROM announcements
            ORDER BY created_at DESC
            LIMIT 50
        ");
        $notifications = array_map(function($n) {
            return [
                'id' => $n['id'],
                'title' => $n['title'],
                'message' => $n['message'],
                'targetRole' => $n['target_role'],
                'priority' => $n['priority'],
                'status' => $n['status'],
                'startDate' => $n['start_date'],
                'endDate' => $n['end_date'],
                'createdAt' => $n['created_at']
            ];
        }, $stmt->fetchAll());

        Response::success($notifications);
    }

    /**
     * Send notification
     */
    public function sendNotification(): void
    {
        $this->requireAuth();
        
        $user = Auth::user();
        $data = Response::getJsonInput();

        $title = $data['title'] ?? '';
        $message = $data['message'] ?? '';
        $targetRole = $data['targetRole'] ?? 'all';
        $priority = $data['priority'] ?? 'medium';

        if (empty($title) || empty($message)) {
            Response::validationError([
                'title' => 'Title is required',
                'message' => 'Message is required'
            ]);
        }

        $db = db();

        // Get admin ID
        $stmt = $db->prepare("SELECT id FROM admins WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $admin = $stmt->fetch();

        // Create announcement
        $stmt = $db->prepare("
            INSERT INTO announcements (title, message, target_role, priority, status, created_by, created_at)
            VALUES (?, ?, ?, ?, 'published', ?, NOW())
        ");
        $stmt->execute([$title, $message, $targetRole, $priority, $admin['id']]);

        $announcementId = $db->lastInsertId();

        // Create notifications for each user in target role
        if ($targetRole === 'all') {
            $targetUsers = $db->query("SELECT id, 'student' as role FROM users WHERE role = 'student'
                UNION SELECT id, 'teacher' as role FROM users WHERE role = 'teacher'
                UNION SELECT id, 'parent' as role FROM users WHERE role = 'parent'")->fetchAll();
        } else {
            $role = str_replace('students', 'student', str_replace('teachers', 'teacher', str_replace('parents', 'parent', $targetRole)));
            $stmt = $db->prepare("SELECT id, '$role' as role FROM users WHERE role = ?");
            $stmt->execute([$role]);
            $targetUsers = $stmt->fetchAll();
        }

        $notifStmt = $db->prepare("
            INSERT INTO notifications (user_id, user_type, title, message, type, created_by, created_at)
            VALUES (?, ?, ?, ?, 'info', ?, NOW())
        ");

        foreach ($targetUsers as $u) {
            $notifStmt->execute([$u['id'], $u['role'], $title, $message, $admin['id']]);
        }

        Response::success(['id' => $announcementId], 'Notification sent successfully');
    }
}
