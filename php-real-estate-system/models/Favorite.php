<?php
// models/Favorite.php

class Favorite {
    private $db;
    private $table = 'favorites';

    public function __construct($db) {
        $this->db = $db;
    }

    public function toggle($userId, $propertyId) {
        // Check if already favorited
        $sql = "SELECT id FROM {$this->table} WHERE user_id = ? AND property_id = ?";
        $existing = $this->db->fetch($sql, [$userId, $propertyId]);

        if ($existing) {
            // Remove from favorites
            $sql = "DELETE FROM {$this->table} WHERE user_id = ? AND property_id = ?";
            $this->db->query($sql, [$userId, $propertyId]);
            return 'removed';
        } else {
            // Add to favorites
            $sql = "INSERT INTO {$this->table} (user_id, property_id) VALUES (?, ?)";
            $this->db->query($sql, [$userId, $propertyId]);
            return 'added';
        }
    }

    public function getUserFavorites($userId) {
        $sql = "SELECT p.*, u.name as agent_name, pi.image_path 
                FROM {$this->table} f 
                JOIN properties p ON f.property_id = p.id 
                LEFT JOIN users u ON p.agent_id = u.id 
                LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = 1 
                WHERE f.user_id = ? 
                ORDER BY f.created_at DESC";
        return $this->db->fetchAll($sql, [$userId]);
    }

    public function isFavorited($userId, $propertyId) {
        $sql = "SELECT id FROM {$this->table} WHERE user_id = ? AND property_id = ?";
        return (bool) $this->db->fetch($sql, [$userId, $propertyId]);
    }
}