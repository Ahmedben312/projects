<?php
session_start();

if(!isset($_SESSION['tasks'])) {
    $_SESSION['tasks'] = [];
}

if(isset($_POST['add_task'])) {
    $task = trim($_POST['new_task']);
    if(!empty($task)) {
        $_SESSION['tasks'][] = [
            'task' => $task,
            'completed' => false
        ];
    }
}

if(isset($_GET['complete'])) {
    $index = $_GET['complete'];
    if(isset($_SESSION['tasks'][$index])) {
        $_SESSION['tasks'][$index]['completed'] = true;
    }
}

if(isset($_GET['delete'])) {
    $index = $_GET['delete'];
    if(isset($_SESSION['tasks'][$index])) {
        array_splice($_SESSION['tasks'], $index, 1);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>To-Do List</title>
</head>
<body>
    <h2>To-Do List</h2>
    <form method="post">
        <input type="text" name="new_task" placeholder="Enter new task" required>
        <button type="submit" name="add_task">Add Task</button>
    </form>

    <ul>
        <?php foreach($_SESSION['tasks'] as $index => $task): ?>
            <li>
                <?php if($task['completed']): ?>
                    <del><?php echo htmlspecialchars($task['task']); ?></del>
                <?php else: ?>
                    <?php echo htmlspecialchars($task['task']); ?>
                    <a href="?complete=<?php echo $index; ?>">✓ Complete</a>
                <?php endif; ?>
                <a href="?delete=<?php echo $index; ?>" style="color: red;">✗ Delete</a>
            </li>
        <?php endforeach; ?>
    </ul>
</body>
</html>