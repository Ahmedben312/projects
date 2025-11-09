<?php
// models/Property.php

class Property {
    private $db;
    private $table = 'properties';

    public function __construct($db) {
        $this->db = $db;
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (title, description, price, type, bedrooms, bathrooms, area, address, city, state, zip_code, country, latitude, longitude, agent_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        return $this->db->query($sql, [
            $data['title'],
            $data['description'],
            $data['price'],
            $data['type'],
            $data['bedrooms'],
            $data['bathrooms'],
            $data['area'],
            $data['address'],
            $data['city'],
            $data['state'],
            $data['zip_code'],
            $data['country'],
            $data['latitude'],
            $data['longitude'],
            $data['agent_id']
        ]);
    }

    public function findById($id) {
        $sql = "SELECT p.*, u.name as agent_name, u.email as agent_email, u.phone as agent_phone 
                FROM {$this->table} p 
                LEFT JOIN users u ON p.agent_id = u.id 
                WHERE p.id = ?";
        return $this->db->fetch($sql, [$id]);
    }

    public function search($filters = [], $page = 1, $perPage = 9) {
        $conditions = ["p.status = 'available'"];
        $params = [];

        // Keyword search using FULLTEXT
        if (!empty($filters['keyword'])) {
            $conditions[] = "MATCH(p.title, p.description, p.address, p.city, p.state, p.country) AGAINST(?)";
            $params[] = $filters['keyword'];
        }

        // Type filter
        if (!empty($filters['type'])) {
            $conditions[] = "p.type = ?";
            $params[] = $filters['type'];
        }

        // Price range
        if (!empty($filters['min_price'])) {
            $conditions[] = "p.price >= ?";
            $params[] = $filters['min_price'];
        }
        if (!empty($filters['max_price'])) {
            $conditions[] = "p.price <= ?";
            $params[] = $filters['max_price'];
        }

        // Bedrooms and bathrooms
        if (!empty($filters['bedrooms'])) {
            $conditions[] = "p.bedrooms >= ?";
            $params[] = $filters['bedrooms'];
        }
        if (!empty($filters['bathrooms'])) {
            $conditions[] = "p.bathrooms >= ?";
            $params[] = $filters['bathrooms'];
        }

        // Location
        if (!empty($filters['city'])) {
            $conditions[] = "p.city = ?";
            $params[] = $filters['city'];
        }

        $where = implode(' AND ', $conditions);
        $offset = ($page - 1) * $perPage;

        // Count total
        $countSql = "SELECT COUNT(*) as total FROM {$this->table} p WHERE {$where}";
        $total = $this->db->fetch($countSql, $params)['total'];

        // Get properties with images
        $sql = "SELECT p.*, u.name as agent_name, pi.image_path 
                FROM {$this->table} p 
                LEFT JOIN users u ON p.agent_id = u.id 
                LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = 1 
                WHERE {$where} 
                ORDER BY p.created_at DESC 
                LIMIT {$offset}, {$perPage}";

        $properties = $this->db->fetchAll($sql, $params);

        return [
            'properties' => $properties,
            'total' => $total,
            'page' => $page,
            'perPage' => $perPage,
            'totalPages' => ceil($total / $perPage)
        ];
    }

    public function getFeatured($limit = 6, $userId = null) {
        // Ensure limit is an integer to prevent SQL injection
        $limit = (int) $limit;

        $sql = "SELECT p.*, u.name as agent_name, pi.image_path, 
                       (CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END) as is_favorited
                FROM {$this->table} p 
                LEFT JOIN users u ON p.agent_id = u.id 
                LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = 1 
                LEFT JOIN favorites f ON p.id = f.property_id AND f.user_id = ?
                WHERE p.status = 'available' 
                ORDER BY p.created_at DESC 
                LIMIT {$limit}";
        return $this->db->fetchAll($sql, [$userId]);
    }

    public function getByAgent($agentId) {
        $sql = "SELECT p.*, pi.image_path 
                FROM {$this->table} p 
                LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = 1 
                WHERE p.agent_id = ? AND p.status = 'available' 
                ORDER BY p.created_at DESC";
        return $this->db->fetchAll($sql, [$agentId]);
    }

    public function updateStatus($id, $status) {
        $sql = "UPDATE {$this->table} SET status = ? WHERE id = ?";
        return $this->db->query($sql, [$status, $id]);
    }
}