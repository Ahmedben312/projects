<?php
$message = "";

if(isset($_POST['upload'])) {
    $target_dir = "uploads/";
    
    // Create uploads directory if it doesn't exist
    if(!is_dir($target_dir)) {
        mkdir($target_dir, 0755, true);
    }
    
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Check if file already exists
    if(file_exists($target_file)) {
        $message = "Sorry, file already exists.";
        $uploadOk = 0;
    }

    // Check file size (5MB limit)
    if($_FILES["fileToUpload"]["size"] > 5000000) {
        $message = "Sorry, your file is too large.";
        $uploadOk = 0;
    }

    // Allow certain file formats
    $allowed_types = ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'txt'];
    if(!in_array($fileType, $allowed_types)) {
        $message = "Sorry, only JPG, JPEG, PNG, GIF, PDF & TXT files are allowed.";
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if($uploadOk == 0) {
        $message = "Sorry, your file was not uploaded.";
    } else {
        if(move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            $message = "The file ". htmlspecialchars(basename($_FILES["fileToUpload"]["name"])). " has been uploaded.";
        } else {
            $message = "Sorry, there was an error uploading your file.";
        }
    }
}

// Get list of uploaded files
$uploaded_files = [];
if(is_dir('uploads/')) {
    $files = scandir('uploads/');
    $uploaded_files = array_diff($files, ['.', '..']);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>File Upload System</title>
</head>
<body>
    <h2>File Upload System</h2>
    
    <?php if($message): ?>
        <p style="color: <?php echo strpos($message, 'error') !== false ? 'red' : 'green'; ?>">
            <?php echo $message; ?>
        </p>
    <?php endif; ?>

    <form method="post" enctype="multipart/form-data">
        Select file to upload:
        <input type="file" name="fileToUpload" id="fileToUpload" required>
        <button type="submit" name="upload">Upload File</button>
    </form>

    <h3>Uploaded Files:</h3>
    <?php if(empty($uploaded_files)): ?>
        <p>No files uploaded yet.</p>
    <?php else: ?>
        <ul>
            <?php foreach($uploaded_files as $file): ?>
                <li>
                    <?php echo htmlspecialchars($file); ?>
                    <a href="uploads/<?php echo urlencode($file); ?>" target="_blank">View</a>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
</body>
</html>