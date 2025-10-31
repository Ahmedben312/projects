<?php
class ImageHandler {
    private $uploadDir = '../uploads/images/';
    private $thumbnailDir = '../uploads/thumbnails/';
    private $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    private $maxSize = 5 * 1024 * 1024; // 5MB

    public function uploadImage($file) {
        // Check for errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error: ' . $file['error']);
        }

        // Check file size
        if ($file['size'] > $this->maxSize) {
            throw new Exception('File size too large. Maximum size: 5MB');
        }

        // Get file extension
        $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        // Check file type
        if (!in_array($fileExt, $this->allowedTypes)) {
            throw new Exception('Invalid file type. Allowed types: ' . implode(', ', $this->allowedTypes));
        }

        // Generate unique filename
        $fileName = uniqid() . '_' . time() . '.' . $fileExt;
        $filePath = $this->uploadDir . $fileName;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            throw new Exception('Failed to move uploaded file');
        }

        // Create thumbnail
        $thumbnailPath = $this->createThumbnail($filePath, $fileName);

        return [
            'filename' => $fileName,
            'thumbnail' => $thumbnailPath
        ];
    }

    private function createThumbnail($sourcePath, $fileName) {
        list($width, $height, $type) = getimagesize($sourcePath);

        switch ($type) {
            case IMAGETYPE_JPEG:
                $source = imagecreatefromjpeg($sourcePath);
                break;
            case IMAGETYPE_PNG:
                $source = imagecreatefrompng($sourcePath);
                break;
            case IMAGETYPE_GIF:
                $source = imagecreatefromgif($sourcePath);
                break;
            default:
                throw new Exception('Unsupported image type');
        }

        // Calculate thumbnail dimensions (300x200)
        $thumbWidth = 300;
        $thumbHeight = 200;
        
        $thumbnail = imagecreatetruecolor($thumbWidth, $thumbHeight);
        
        // Preserve transparency for PNG and GIF
        if ($type == IMAGETYPE_PNG || $type == IMAGETYPE_GIF) {
            imagecolortransparent($thumbnail, imagecolorallocatealpha($thumbnail, 0, 0, 0, 127));
            imagealphablending($thumbnail, false);
            imagesavealpha($thumbnail, true);
        }

        imagecopyresampled($thumbnail, $source, 0, 0, 0, 0, 
                          $thumbWidth, $thumbHeight, $width, $height);

        $thumbnailPath = $this->thumbnailDir . 'thumb_' . $fileName;

        switch ($type) {
            case IMAGETYPE_JPEG:
                imagejpeg($thumbnail, $thumbnailPath, 85);
                break;
            case IMAGETYPE_PNG:
                imagepng($thumbnail, $thumbnailPath, 8);
                break;
            case IMAGETYPE_GIF:
                imagegif($thumbnail, $thumbnailPath);
                break;
        }

        imagedestroy($source);
        imagedestroy($thumbnail);

        return 'thumb_' . $fileName;
    }

    public function deleteImage($filename) {
        $imagePath = $this->uploadDir . $filename;
        $thumbPath = $this->thumbnailDir . 'thumb_' . $filename;

        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
        if (file_exists($thumbPath)) {
            unlink($thumbPath);
        }
    }
}
?>