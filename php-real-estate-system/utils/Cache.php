<?php
// utils/Cache.php

class Cache {
    private $cache_path;

    public function __construct() {
        $this->cache_path = CACHE_PATH;
        if (!is_dir($this->cache_path)) {
            mkdir($this->cache_path, 0755, true);
        }
    }

    public function get($key) {
        $file = $this->cache_path . md5($key) . '.cache';
        if (file_exists($file) && (time() - filemtime($file) < 3600)) { // Cache for 1 hour
            return unserialize(file_get_contents($file));
        }
        return false;
    }

    public function set($key, $data) {
        $file = $this->cache_path . md5($key) . '.cache';
        file_put_contents($file, serialize($data));
    }

    public function delete($key) {
        $file = $this->cache_path . md5($key) . '.cache';
        if (file_exists($file)) {
            unlink($file);
        }
    }

    public function remember($key, $callback, $ttl = 3600) {
        $data = $this->get($key);
        if ($data === false) {
            $data = $callback();
            $this->set($key, $data);
        }
        return $data;
    }
}