<?php

/**
 * Green Valley High School Portal API
 * Main Entry Point
 */

// Load configuration
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../app/Helpers/Response.php';
require_once __DIR__ . '/../app/Helpers/Auth.php';

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Route the request
$router = new Router();
$router->dispatch($method, $uri);

/**
 * Simple Router
 */
class Router
{
    private array $routes = [];

    public function __construct()
    {
        $this->registerRoutes();
    }

    private function registerRoutes(): void
    {
        // Auth routes
        $this->post('/api/auth/login', 'AuthController@login');
        $this->post('/api/auth/logout', 'AuthController@logout');
        $this->get('/api/auth/me', 'AuthController@me');

        // Student routes
        $this->get('/api/student/dashboard', 'StudentController@dashboard');
        $this->get('/api/student/attendance', 'StudentController@attendance');
        $this->get('/api/student/homework', 'StudentController@homework');
        $this->get('/api/student/exams', 'StudentController@exams');
        $this->get('/api/student/results', 'StudentController@results');
        $this->get('/api/student/timetable', 'StudentController@timetable');
        $this->get('/api/student/clubs', 'StudentController@clubs');
        $this->get('/api/student/resources', 'StudentController@resources');
        $this->get('/api/student/notifications', 'StudentController@notifications');
        $this->get('/api/student/messages', 'StudentController@messages');
        $this->get('/api/student/profile', 'StudentController@profile');

        // Teacher routes
        $this->get('/api/teacher/dashboard', 'TeacherController@dashboard');
        $this->get('/api/teacher/attendance', 'TeacherController@attendance');
        $this->get('/api/teacher/homework', 'TeacherController@homework');
        $this->get('/api/teacher/exams', 'TeacherController@exams');
        $this->get('/api/teacher/messages', 'TeacherController@messages');
        $this->get('/api/teacher/classes', 'TeacherController@classes');

        // Parent routes
        $this->get('/api/parent/dashboard', 'ParentController@dashboard');
        $this->get('/api/parent/attendance', 'ParentController@attendance');
        $this->get('/api/parent/results', 'ParentController@results');
        $this->get('/api/parent/notifications', 'ParentController@notifications');

        // Admin routes
        $this->get('/api/admin/dashboard', 'AdminController@dashboard');
        $this->get('/api/admin/users', 'AdminController@users');
        $this->get('/api/admin/notifications', 'AdminController@notifications');
        $this->post('/api/admin/notifications', 'AdminController@sendNotification');

        // Shared routes
        $this->get('/api/timetable', 'SharedController@timetable');
        $this->get('/api/notifications', 'SharedController@notifications');
    }

    public function dispatch(string $method, string $uri): void
    {
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $this->matchRoute($route['pattern'], $uri)) {
                $this->callController($route['controller'], $route['action']);
                return;
            }
        }

        Response::notFound('Endpoint not found');
    }

    private function matchRoute(string $pattern, string $uri): bool
    {
        $pattern = preg_replace('/\{[^}]+\}/', '([^/]+)', $pattern);
        $pattern = '#^' . $pattern . '$#';
        return preg_match($pattern, $uri) === 1;
    }

    private function callController(string $controller, string $action): void
    {
        $controllerFile = __DIR__ . '/../app/Controllers/' . $controller . '.php';
        
        if (!file_exists($controllerFile)) {
            Response::notFound('Controller not found');
        }

        require_once $controllerFile;
        
        $controller = new $controller();
        
        if (!method_exists($controller, $action)) {
            Response::notFound('Action not found');
        }

        $controller->$action();
    }

    private function get(string $route, string $handler): void
    {
        $this->routes[] = ['method' => 'GET', 'pattern' => $route, 'controller' => $handler];
    }

    private function post(string $route, string $handler): void
    {
        $this->routes[] = ['method' => 'POST', 'pattern' => $route, 'controller' => $handler];
    }

    private function put(string $route, string $handler): void
    {
        $this->routes[] = ['method' => 'PUT', 'pattern' => $route, 'controller' => $handler];
    }

    private function delete(string $route, string $handler): void
    {
        $this->routes[] = ['method' => 'DELETE', 'pattern' => $route, 'controller' => $handler];
    }
}
