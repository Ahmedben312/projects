<?php
class Post {
    private $conn;
    private $table = 'posts';

    public $id;
    public $title;
    public $content;
    public $excerpt;
    public $featured_image;
    public $author_id;
    public $category_id;
    public $status;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all posts with pagination - FIXED VERSION
    public function getPosts($page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        
        $query = "SELECT p.*, u.username as author_name, c.name as category_name 
                 FROM " . $this->table . " p
                 LEFT JOIN users u ON p.author_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.status = 'published'
                 ORDER BY p.created_at DESC 
                 LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt;
    }

    // Get single post
    public function getPost($id) {
        $query = "SELECT p.*, u.username as author_name, c.name as category_name 
                 FROM " . $this->table . " p
                 LEFT JOIN users u ON p.author_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Search posts - FIXED VERSION
    public function search($keyword, $page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        $searchTerm = "%$keyword%";
        
        $query = "SELECT p.*, u.username as author_name, c.name as category_name 
                 FROM " . $this->table . " p
                 LEFT JOIN users u ON p.author_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.status = 'published' AND 
                       (p.title LIKE :keyword OR p.content LIKE :keyword OR p.excerpt LIKE :keyword)
                 ORDER BY p.created_at DESC 
                 LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':keyword', $searchTerm);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt;
    }

    // Get posts by category - FIXED VERSION
    public function getPostsByCategory($category_id, $page = 1, $limit = 10) {
        $offset = ($page - 1) * $limit;
        
        $query = "SELECT p.*, u.username as author_name, c.name as category_name 
                 FROM " . $this->table . " p
                 LEFT JOIN users u ON p.author_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.status = 'published' AND p.category_id = :category_id
                 ORDER BY p.created_at DESC 
                 LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt;
    }

    // Create new post
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                 SET title=:title, content=:content, excerpt=:excerpt, 
                     featured_image=:featured_image, author_id=:author_id, 
                     category_id=:category_id, status=:status";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":excerpt", $this->excerpt);
        $stmt->bindParam(":featured_image", $this->featured_image);
        $stmt->bindParam(":author_id", $this->author_id);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":status", $this->status);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    // Update post
    public function update() {
        $query = "UPDATE " . $this->table . " 
                 SET title=:title, content=:content, excerpt=:excerpt, 
                     featured_image=:featured_image, category_id=:category_id, 
                     status=:status, updated_at=CURRENT_TIMESTAMP
                 WHERE id=:id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":excerpt", $this->excerpt);
        $stmt->bindParam(":featured_image", $this->featured_image);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }

    // Delete post
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }
}
?>