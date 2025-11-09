<?php
// models/Message.php

class Message {
    private $db;
    private $table = 'messages';

    public function __construct($db) {
        $this->db = $db;
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (sender_id, receiver_id, property_id, message) 
                VALUES (?, ?, ?, ?)";
        return $this->db->query($sql, [
            $data['sender_id'],
            $data['receiver_id'],
            $data['property_id'],
            $data['message']
        ]);
    }

    public function getMessages($userId, $propertyId) {
        $sql = "SELECT m.*, u.name as sender_name 
                FROM {$this->table} m
                JOIN users u ON m.sender_id = u.id
                WHERE m.property_id = ? AND (m.sender_id = ? OR m.receiver_id = ?)
                ORDER BY m.created_at ASC";
        return $this->db->fetchAll($sql, [$propertyId, $userId, $userId]);
    }
}
