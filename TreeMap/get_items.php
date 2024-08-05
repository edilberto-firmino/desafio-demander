<?php
$servername = "localhost";
$username = "root"; 
$password = "";     
$dbname = "treemap_db";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare("SELECT name, value FROM companies");
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
