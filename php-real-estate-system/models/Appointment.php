<?php
// models/Appointment.php

class Appointment {
    private $db;
    private $table = 'appointments';

    public function __construct($db) {
        $this->db = $db;
    }

    public function create($data) {
        $sql = "INSERT INTO {$this->table} (user_id, property_id, agent_id, appointment_date, message) 
                VALUES (?, ?, ?, ?, ?)";
        return $this->db->query($sql, [
            $data['user_id'],
            $data['property_id'],
            $data['agent_id'],
            $data['appointment_date'],
            $data['message']
        ]);
    }

    public function getByUser($userId) {
        $sql = "SELECT a.*, p.title as property_title, u.name as agent_name 
                FROM {$this->table} a 
                JOIN properties p ON a.property_id = p.id 
                JOIN users u ON a.agent_id = u.id 
                WHERE a.user_id = ? 
                ORDER BY a.appointment_date DESC";
        return $this->db->fetchAll($sql, [$userId]);
    }

    public function getByAgent($agentId) {
        $sql = "SELECT a.*, p.title as property_title, u.name as user_name, u.email as user_email 
                FROM {$this->table} a 
                JOIN properties p ON a.property_id = p.id 
                JOIN users u ON a.user_id = u.id 
                WHERE a.agent_id = ? 
                ORDER BY a.appointment_date DESC";
        return $this->db->fetchAll($sql, [$agentId]);
    }

    public function updateStatus($appointmentId, $status) {
        $sql = "UPDATE {$this->table} SET status = ? WHERE id = ?";
        return $this->db->query($sql, [$status, $appointmentId]);
    }

    public function checkAvailability($agentId, $dateTime) {
        $sql = "SELECT id FROM {$this->table} WHERE agent_id = ? AND appointment_date = ? AND status != 'cancelled'";
        return $this->db->fetch($sql, [$agentId, $dateTime]);
    }
}