<?php
header('Content-Type: application/json');

// Подключение к базе данных
$main_host = "localhost";
$main_user = "root";
$main_pass = "root";
$main_db = "linker";

try {
    $pdo = new PDO(
        "mysql:host=$main_host;dbname=$main_db;charset=utf8mb4",
        $main_user,
        $main_pass, 
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => true
        ]
    );
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

// Получаем данные
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    $id = $data['id'] ?? '';

    if (empty($id)) {
        echo json_encode(['success' => false, 'message' => 'Неизвестная ошибка!']);
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM `linker` WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Успешно удалено!']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Ошибка базы данных']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Неверный метод запроса']);
}
?>