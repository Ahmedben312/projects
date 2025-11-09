<?php
// classes/Database.php

class Database {
    private $host = DB_HOST;
    private $dbname = DB_NAME;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $conn;

    public function __construct() {
        try {
            $this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    public function getConnection() {
        return $this->conn;
    }

    public function query($sql, $params = []) {
        $stmt = $this->conn->prepare($sql);
        if (!empty($params)) {
            foreach ($params as $i => $param) {
                $type = PDO::PARAM_STR;
                if (is_int($param)) {
                    $type = PDO::PARAM_INT;
                } else if (is_bool($param)) {
                    $type = PDO::PARAM_BOOL;
                } else if (is_null($param)) {
                    $type = PDO::PARAM_NULL;
                }
                $stmt->bindValue($i + 1, $param, $type);
            }
        }
        $stmt->execute();
        return $stmt;
    }

    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function lastInsertId() {
        return $this->conn->lastInsertId();
    }
}