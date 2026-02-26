<?php

require_once __DIR__ . '/../Helpers/Auth.php';
require_once __DIR__ . '/../Helpers/Response.php';

class AdminController
{
    private function requireAuth(): void
    {
        if (!Auth::check()) Response::unauthorized('Please login to continue');
        if (!Auth::hasRole('admin')) Response::forbidden('Access denied');
    }

    public function dashboard(): void
    {
        $this->requireAuth();
        $user = Auth::user();
        $db = db();
        $stmt = $db->prepare("SELECT * FROM admins WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $admin = $stmt->fetch();
        $stats = ['totalStudents' => $db->query("SELECT COUNT(*) FROM students")->fetchColumn(), 'totalTeachers' => $db->query("SELECT COUNT(*) FROM teachers")->fetchColumn(), 'totalParents' => $db->query("SELECT COUNT(*) FROM parents")->fetchColumn(), 'totalClasses' => $db->query("SELECT COUNT(*) FROM classes")->fetchColumn(), 'averageAttendance' => 92];
        $stmt = $db->query("SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, u.email, u.role, u.status, u.created_at FROM users u ORDER BY u.created_at DESC LIMIT 10");
        $recentUsers = array_map(fn($u) => ['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'role' => $u['role'], 'status' => $u['status'], 'lastLogin' => $u['created_at']], $stmt->fetchAll());
        $stmt = $db->query("SELECT * FROM announcements WHERE status = 'published' ORDER BY created_at DESC LIMIT 5");
        $notifications = array_map(fn($n) => ['id' => $n['id'], 'title' => $n['title'], 'message' => $n['message'], 'targetRole' => $n['target_role'], 'date' => $n['created_at'], 'status' => $n['status']], $stmt->fetchAll());
        Response::success(['adminName' => $user['first_name'] . ' ' . $user['last_name'], 'adminId' => $admin['id'], 'stats' => $stats, 'recentUsers' => $recentUsers, 'notifications' => $notifications]);
    }

    public function users(): void
    {
        $this->requireAuth();
        $db = db();
        $page = $_GET['page'] ?? 1;
        $limit = 20;
        $offset = ($page - 1) * $limit;
        $stmt = $db->query("SELECT COUNT(*) as total FROM users");
        $total = $stmt->fetch()['total'];
        $stmt = $db->prepare("SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, u.email, u.role, u.status, u.phone, u.created_at FROM users u ORDER BY u.created_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([$limit, $offset]);
        Response::success(['users' => array_map(fn($u) => ['id' => $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'role' => $u['role'], 'status' => $u['status'], 'phone' => $u['phone'], 'createdAt' => $u['created_at']], $stmt->fetchAll()), 'pagination' => ['page' => $page, 'limit' => $limit, 'total' => $total, 'totalPages' => ceil($total / $limit)]]);
    }

    public function notifications(): void
    {
        $this->requireAuth();
        $db = db();
        $stmt = $db->query("SELECT * FROM announcements ORDER BY created_at DESC LIMIT 50");
        Response::success(array_map(fn($n) => ['id' => $n['id'], 'title' => $n['title'], 'message' => $n['message'], 'targetRole' => $n['target_role'], 'priority' => $n['priority'], 'status' => $n['status'], 'createdAt' => $n['created_at']], $stmt->fetchAll()));
    }

    public function sendNotification(): void
    {
        $this->requireAuth();
        $user = Auth::user();
        $data = Response::getJsonInput();
        $title = $data['title'] ?? '';
        $message = $data['message'] ?? '';
        $targetRole = $data['targetRole'] ?? 'all';
        $priority = $data['priority'] ?? 'medium';
        if (empty($title) || empty($message)) Response::validationError(['title' => 'Title is required', 'message' => 'Message is required']);
        $db = db();
        $stmt = $db->prepare("SELECT id FROM admins WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $admin = $stmt->fetch();
        $stmt = $db->prepare("INSERT INTO announcements (title, message, target_role, priority, status, created_by, created_at) VALUES (?, ?, ?, ?, 'published', ?, NOW())");
        $stmt->execute([$title, $message, $targetRole, $priority, $admin['id']]);
        Response::success(['id' => $db->lastInsertId()], 'Notification sent successfully');
    }
}
