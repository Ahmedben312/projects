<?php
// config/autoload.php

function classAutoloader($className) {
    $directories = [
        'classes/',
        'models/', 
        'utils/'
    ];
    
    foreach ($directories as $directory) {
        $file = __DIR__ . '/../' . $directory . $className . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
}

spl_autoload_register('classAutoloader');