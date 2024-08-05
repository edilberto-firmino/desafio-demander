<?php
$servername = "localhost";
$username = "root"; 
$password = "";     
$dbname = "treemap_db";

$name = isset($_POST['name']) ? $_POST['name'] : '';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("DELETE FROM companies WHERE name = :name");
    $stmt->bindParam(':name', $name);
    $stmt->execute();

    echo "Empresa excluída com sucesso!";

} catch(PDOException $e) {
    echo "Erro: " . $e->getMessage();
}

$conn = null;