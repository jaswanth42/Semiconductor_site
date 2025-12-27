<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/../data/jobs.json';

// Ensure data directory and file exist
if (!file_exists(dirname($dataFile))) {
    mkdir(dirname($dataFile), 0755, true);
}

if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([], JSON_PRETTY_PRINT));
}

// Read jobs from JSON file
function getJobs() {
    global $dataFile;
    $content = file_get_contents($dataFile);
    return json_decode($content, true) ?: [];
}

// Save jobs to JSON file
function saveJobs($jobs) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($jobs, JSON_PRETTY_PRINT));
}

// Handle GET request - Fetch all jobs
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $jobs = getJobs();
    echo json_encode(['success' => true, 'jobs' => $jobs]);
    exit();
}

// Handle POST request - Add new job
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
        exit();
    }
    
    $jobs = getJobs();
    
    $newJob = [
        'id' => time() . rand(100, 999),
        'title' => $input['title'] ?? '',
        'location' => $input['location'] ?? '',
        'type' => $input['type'] ?? 'Full-time',
        'description' => $input['description'] ?? '',
        'applyLink' => $input['applyLink'] ?? '',
        'createdAt' => date('Y-m-d H:i:s')
    ];
    
    $jobs[] = $newJob;
    saveJobs($jobs);
    
    echo json_encode(['success' => true, 'job' => $newJob, 'message' => 'Job added successfully']);
    exit();
}

// Handle DELETE request - Remove a job
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $jobId = $input['id'] ?? null;
    
    if (!$jobId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Job ID required']);
        exit();
    }
    
    $jobs = getJobs();
    $jobs = array_filter($jobs, function($job) use ($jobId) {
        return $job['id'] != $jobId;
    });
    $jobs = array_values($jobs); // Re-index array
    
    saveJobs($jobs);
    
    echo json_encode(['success' => true, 'message' => 'Job deleted successfully']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
