<!DOCTYPE html>
<html>
<head>
    <title>Contact Form</title>
</head>
<body>
    <h2>Contact Us</h2>
    
    <?php
    $message = "";
    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        $name = htmlspecialchars($_POST['name']);
        $email = htmlspecialchars($_POST['email']);
        $subject = htmlspecialchars($_POST['subject']);
        $message_content = htmlspecialchars($_POST['message']);
        
        // Basic validation
        if(empty($name) || empty($email) || empty($message_content)) {
            $message = "<p style='color: red;'>Please fill in all required fields.</p>";
        } elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $message = "<p style='color: red;'>Please enter a valid email address.</p>";
        } else {
            // Simulate sending email
            $to = "your-email@example.com";
            $headers = "From: $email";
            $full_message = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message_content";
            
            // In a real application, you would use mail() function
            $message = "<p style='color: green;'>Thank you for your message, $name! We'll get back to you soon.</p>";
        }
    }
    ?>

    <?php echo $message; ?>
    
    <form method="post">
        <p>
            <label>Name:*</label><br>
            <input type="text" name="name" value="<?php echo isset($_POST['name']) ? $_POST['name'] : ''; ?>" required>
        </p>
        <p>
            <label>Email:*</label><br>
            <input type="email" name="email" value="<?php echo isset($_POST['email']) ? $_POST['email'] : ''; ?>" required>
        </p>
        <p>
            <label>Subject:</label><br>
            <input type="text" name="subject" value="<?php echo isset($_POST['subject']) ? $_POST['subject'] : ''; ?>">
        </p>
        <p>
            <label>Message:*</label><br>
            <textarea name="message" rows="5" required><?php echo isset($_POST['message']) ? $_POST['message'] : ''; ?></textarea>
        </p>
        <button type="submit">Send Message</button>
    </form>
</body>
</html>