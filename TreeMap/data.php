<?php
$servername = "localhost";
$username = "root"; 
$password = "";     
$dbname = "treemap_db";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $order = isset($_GET['order']) ? $_GET['order'] : 'desc';
    if ($order !== 'asc' && $order !== 'desc') {
        $order = 'desc'; 
    }

    $stmt = $conn->prepare("SELECT name, value FROM companies ORDER BY value $order");
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        "name" => "root",
        "children" => $result
    ];

    header('Content-Type: application/json');
    echo json_encode($response);

} catch(PDOException $e) {
    echo "Erro: " . $e->getMessage();
}

$conn = null;
