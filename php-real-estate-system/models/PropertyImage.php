<?php
// models/PropertyImage.php

class PropertyImage {
    private $db;
    private $table = 'property_images';

    public function __construct($db) {
        $this->db = $db;
    }

    public function addImages($propertyId, $images) {
        foreach ($images as $image) {
            $sql = "INSERT INTO {$this->table} (property_id, image_path) VALUES (?, ?)";
            $this->db->query($sql, [$propertyId, $image]);
        }
    }

    public function getByProperty($propertyId) {
        $sql = "SELECT * FROM {$this->table} WHERE property_id = ? ORDER BY is_primary DESC, id ASC";
        return $this->db->fetchAll($sql, [$propertyId]);
    }

    public function setPrimary($imageId, $propertyId) {
        // First, set all images to not primary
        $sql = "UPDATE {$this->table} SET is_primary = 0 WHERE property_id = ?";
        $this->db->query($sql, [$propertyId]);

        // Then set the selected image as primary
        $sql = "UPDATE {$this->table} SET is_primary = 1 WHERE id = ? AND property_id = ?";
        return $this->db->query($sql, [$imageId, $propertyId]);
    }

    public function delete($imageId) {
        $sql = "DELETE FROM {$this->table} WHERE id = ?";
        return $this->db->query($sql, [$imageId]);
    }
}