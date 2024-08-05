<?php
$servername = "localhost";
$username = "root"; 
$password = "";     
$dbname = "treemap_db";

$name = isset($_POST['name']) ? $_POST['name'] : '';
$value = isset($_POST['value']) ? $_POST['value'] : '';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("INSERT INTO companies (name, value) VALUES (:name, :value)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':value', $value);
    $stmt->execute();

    echo "Empresa adicionada com sucesso!";

} catch(PDOException $e) {
    echo "Erro: " . $e->getMessage();
}

$conn = null;
