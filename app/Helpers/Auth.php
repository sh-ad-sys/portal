<?php

require_once __DIR__ . '/../../config/database.php';

/**
 * Authentication Helper
 */
class Auth
{
    private static ?array $user = null;

    /**
     * Login user with credentials
     * Supports: admission number (student), email (parent), email format (teacher/admin)
     */
    public static function login(string $identifier, string $password): array
    {
        $db = db();
        
        if (self::isAdmissionNumber($identifier)) {
            return self::loginStudent($db, $identifier, $password);
        } elseif (self::isTeacherEmail($identifier)) {
            return self::loginUser($db, $identifier, $password, 'teacher');
        } elseif (self::isAdminEmail($identifier)) {
            return self::loginUser($db, $identifier, $password, 'admin');
        } else {
            return self::loginUser($db, $identifier, $password, 'parent');
        }
    }

    private static function isAdmissionNumber(string $identifier): bool
    {
        return preg_match('/^GVHS\/\d{4}\/\d{3,6}$/', $identifier) === 1;
    }

    private static function isTeacherEmail(string $identifier): bool
    {
        return preg_match('/^.+\.teacher@gvhs\.co\.ke$/i', $identifier) === 1;
    }

    private static function isAdminEmail(string $identifier): bool
    {
        return preg_match('/^.+\.ad,?in@gvhs\.co\.ke$/i', $identifier) === 1;
    }

    private static function loginStudent(PDO $db, string $admissionNumber, string $password): array
    {
        $stmt = $db->prepare("
            SELECT u.*, s.admission_number, s.class_id
            FROM users u
            INNER JOIN students s ON u.id = s.user_id
            WHERE s.admission_number = ? AND u.role = 'student'
        ");
        $stmt->execute([$admissionNumber]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            throw new Exception('Invalid admission number or password');
        }

        if ($user['status'] !== 'active') {
            throw new Exception('Your account is not active. Please contact administrator.');
        }

        return self::createSession($db, $user);
    }

    private static function loginUser(PDO $db, string $email, string $password, string $role): array
    {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ? AND role = ?");
        $stmt->execute([$email, $role]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            throw new Exception('Invalid email or password');
        }

        if ($user['status'] !== 'active') {
            throw new Exception('Your account is not active. Please contact administrator.');
        }

        return self::createSession($db, $user);
    }

    private static function createSession(PDO $db, array $user): array
    {
        $token = bin2hex(random_bytes(32));

        $stmt = $db->prepare("
            INSERT INTO login_logs (user_id, ip_address, user_agent, login_status, created_at)
            VALUES (?, ?, ?, 'success', NOW())
        ");
        $stmt->execute([
            $user['id'],
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['token'] = $token;
        $_SESSION['login_time'] = time();

        $roleData = self::getRoleData($db, $user);

        return [
            'user' => [
                'id' => $user['id'],
                'role' => $user['role'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'profileImage' => $user['profile_image']
            ],
            'roleData' => $roleData,
            'token' => $token
        ];
    }

    private static function getRoleData(PDO $db, array $user): array
    {
        switch ($user['role']) {
            case 'student':
                $stmt = $db->prepare("
                    SELECT s.*, c.name as class_name, c.grade_level
                    FROM students s
                    LEFT JOIN classes c ON s.class_id = c.id
                    WHERE s.user_id = ?
                ");
                $stmt->execute([$user['id']]);
                $data = $stmt->fetch();
                return [
                    'studentId' => $data['id'],
                    'admissionNumber' => $data['admission_number'],
                    'classId' => $data['class_id'],
                    'className' => $data['class_name'] ?? '',
                    'gradeLevel' => $data['grade_level'] ?? 0
                ];

            case 'teacher':
                $stmt = $db->prepare("SELECT * FROM teachers WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $data = $stmt->fetch();
                return [
                    'teacherId' => $data['id'],
                    'employeeId' => $data['employee_id'],
                    'department' => $data['department']
                ];

            case 'parent':
                $stmt = $db->prepare("SELECT * FROM parents WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $data = $stmt->fetch();
                
                $stmt = $db->prepare("
                    SELECT s.id, s.admission_number, s.user_id, 
                           u.first_name, u.last_name, c.name as class_name
                    FROM parent_students ps
                    INNER JOIN students s ON ps.student_id = s.id
                    INNER JOIN users u ON s.user_id = u.id
                    LEFT JOIN classes c ON s.class_id = c.id
                    WHERE ps.parent_id = ?
                ");
                $stmt->execute([$data['id']]);
                $children = $stmt->fetchAll();
                
                return [
                    'parentId' => $data['id'],
                    'children' => array_map(function($child) {
                        return [
                            'id' => $child['id'],
                            'studentId' => $child['student_id'] ?? $child['user_id'],
                            'admissionNumber' => $child['admission_number'],
                            'name' => $child['first_name'] . ' ' . $child['last_name'],
                            'className' => $child['class_name']
                        ];
                    }, $children)
                ];

            case 'admin':
                $stmt = $db->prepare("SELECT * FROM admins WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $data = $stmt->fetch();
                return [
                    'adminId' => $data['id'],
                    'employeeId' => $data['employee_id'],
                    'accessLevel' => $data['access_level']
                ];

            default:
                return [];
        }
    }

    public static function logout(): void
    {
        session_destroy();
        session_unset();
    }

    public static function user(): ?array
    {
        if (self::$user !== null) {
            return self::$user;
        }

        if (!isset($_SESSION['user_id'])) {
            return null;
        }

        $db = db();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        self::$user = $stmt->fetch() ?: null;

        return self::$user;
    }

    public static function check(): bool
    {
        return self::user() !== null;
    }

    public static function hasRole(string $role): bool
    {
        return self::user()['role'] === $role;
    }

    public static function hash(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    public static function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
}
