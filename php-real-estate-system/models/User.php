<?php
// models/User.php

class User {
    private $db;
    private $table = 'users';

    public function __construct($db) {
        $this->db = $db;
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)";
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        return $this->db->query($sql, [
            $data['email'],
            $hashedPassword,
            $data['name'],
            $data['phone'],
            $data['role'] ?? 'buyer'
        ]);
    }

    public function findByEmail($email) {
        $sql = "SELECT * FROM {$this->table} WHERE email = ?";
        return $this->db->fetch($sql, [$email]);
    }

    public function findById($id) {
        $sql = "SELECT * FROM {$this->table} WHERE id = ?";
        return $this->db->fetch($sql, [$id]);
    }

    public function update($id, $data) {
        $sql = "UPDATE {$this->table} SET name = ?, phone = ?, avatar = ? WHERE id = ?";
        return $this->db->query($sql, [
            $data['name'],
            $data['phone'],
            $data['avatar'],
            $id
        ]);
    }

    public function verifyPassword($password, $hashedPassword) {
        return password_verify($password, $hashedPassword);
    }

    public function getAllAgents() {
        $sql = "SELECT * FROM {$this->table} WHERE role = 'agent'";
        return $this->db->fetchAll($sql);
    }

    public function getAgentRating($agentId) {
        $sql = "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
                FROM agent_ratings WHERE agent_id = ?";
        return $this->db->fetch($sql, [$agentId]);
    }
}