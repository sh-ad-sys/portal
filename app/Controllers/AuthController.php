<?php

require_once __DIR__ . '/../Helpers/Auth.php';
require_once __DIR__ . '/../Helpers/Response.php';

/**
 * Authentication Controller
 */
class AuthController
{
    /**
     * Login user
     * POST /api/auth/login
     */
    public function login(): void
    {
        try {
            $data = Response::getJsonInput();
            
            $identifier = $data['identifier'] ?? '';
            $password = $data['password'] ?? '';

            if (empty($identifier) || empty($password)) {
                Response::validationError([
                    'identifier' => 'Identifier is required',
                    'password' => 'Password is required'
                ]);
            }

            $result = Auth::login($identifier, $password);
            Response::success($result, 'Login successful');
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 401);
        }
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    public function logout(): void
    {
        Auth::logout();
        Response::success(null, 'Logout successful');
    }

    /**
     * Get current user
     * GET /api/auth/me
     */
    public function me(): void
    {
        if (!Auth::check()) {
            Response::unauthorized('Please login to continue');
        }

        $user = Auth::user();
        
        $response = [
            'user' => [
                'id' => $user['id'],
                'role' => $user['role'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'profileImage' => $user['profile_image']
            ]
        ];

        $db = db();
        switch ($user['role']) {
            case 'student':
                $stmt = $db->prepare("SELECT * FROM students WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $data = $stmt->fetch();
                $response['roleData'] = [
                    'studentId' => $data['id'],
                    'admissionNumber' => $data['admission_number'],
                    'classId' => $data['class_id']
                ];
                break;

            case 'teacher':
                $stmt = $db->prepare("SELECT * FROM teachers WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $data = $stmt->fetch();
                $response['roleData'] = [
                    'teacherId' => $data['id'],
                    'employeeId' => $data['employee_id'],
                    'department' => $data['department']
                ];
                break;

            case 'parent':
                $stmt = $db->prepare("SELECT * FROM parents WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $data = $stmt->fetch();
                $response['roleData'] = [
                    'parentId' => $data['id']
                ];
                break;

            case 'admin':
                $stmt = $db->prepare("SELECT * FROM admins WHERE user_id = ?");
                $stmt->execute([$user['id']]);
                $data = $stmt->fetch();
                $response['roleData'] = [
                    'adminId' => $data['id'],
                    'accessLevel' => $data['access_level']
                ];
                break;
        }

        Response::success($response);
    }
}
