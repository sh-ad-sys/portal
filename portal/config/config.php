<?php

/**
 * Application Configuration
 * Global settings and constants
 */

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
session_start();

// Timezone
date_default_timezone_set('Africa/Nairobi');

// Application Constants
define('APP_NAME', 'Green Valley High School Portal');
define('APP_URL', 'http://localhost:3000');
define('API_URL', 'http://localhost/portal/public/api');

// Security
define('HASH_ALGO', 'bcrypt');
define('TOKEN_EXPIRY', 86400); // 24 hours

// CORS Headers for API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * Custom Exception Handler
 */
set_exception_handler(function($e) {
    error_log("Exception: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'An unexpected error occurred'
    ]);
    exit;
});

/**
 * Error Handler
 */
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    error_log("Error [$errno]: $errstr in $errfile on line $errline");
    return true;
});
