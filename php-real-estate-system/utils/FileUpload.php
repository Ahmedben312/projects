<?php
// utils/FileUpload.php

class FileUpload {
    private $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
    private $max_size = 5 * 1024 * 1024; // 5MB

    public function upload($file, $directory, $filename = null) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error.');
        }

        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowed_extensions)) {
            throw new Exception('Invalid file type.');
        }

        if ($file['size'] > $this->max_size) {
            throw new Exception('File too large.');
        }

        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $filename = $filename ?: uniqid() . '.' . $extension;
        $destination = $directory . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Failed to move uploaded file.');
        }

        return $filename;
    }

    public function uploadPropertyImage($file) {
        $directory = UPLOAD_PATH . 'properties/';
        return $this->upload($file, $directory);
    }

    public function uploadProfileImage($file) {
        $directory = UPLOAD_PATH . 'profiles/';
        return $this->upload($file, $directory);
    }

    public function delete($filepath) {
        if (file_exists($filepath)) {
            unlink($filepath);
        }
    }
}