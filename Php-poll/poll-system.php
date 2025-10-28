<?php
session_start();

$poll_file = 'poll.json';

// Initialize poll data
$default_poll = [
    'question' => 'What is your favorite programming language?',
    'options' => [
        'PHP' => 0,
        'JavaScript' => 0,
        'Python' => 0,
        'Java' => 0,
        'C#' => 0
    ],
    'voted_ips' => []
];

if(!file_exists($poll_file)) {
    file_put_contents($poll_file, json_encode($default_poll));
}

$poll_data = json_decode(file_get_contents($poll_file), true);
$message = "";

// Handle voting
if(isset($_POST['vote']) && !isset($_SESSION['voted'])) {
    $selected_option = $_POST['poll_option'];
    
    if(isset($poll_data['options'][$selected_option])) {
        $poll_data['options'][$selected_option]++;
        $poll_data['voted_ips'][] = $_SERVER['REMOTE_ADDR'];
        file_put_contents($poll_file, json_encode($poll_data));
        $_SESSION['voted'] = true;
        $message = "Thank you for voting!";
    }
}

$total_votes = array_sum($poll_data['options']);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Voting System</title>
    <style>
        .poll-option { margin: 10px 0; }
        .result-bar { 
            background: #4CAF50; 
            height: 20px; 
            margin: 5px 0;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <h2>Online Poll</h2>
    
    <h3><?php echo $poll_data['question']; ?></h3>
    
    <?php if($message): ?>
        <p style="color: green;"><?php echo $message; ?></p>
    <?php endif; ?>

    <?php if(!isset($_SESSION['voted'])): ?>
        <form method="post">
            <?php foreach($poll_data['options'] as $option => $votes): ?>
                <div class="poll-option">
                    <input type="radio" name="poll_option" value="<?php echo $option; ?>" required>
                    <?php echo $option; ?>
                </div>
            <?php endforeach; ?>
            <button type="submit" name="vote">Vote</button>
        </form>
    <?php endif; ?>

    <h3>Results (Total Votes: <?php echo $total_votes; ?>)</h3>
    <?php foreach($poll_data['options'] as $option => $votes): ?>
        <div>
            <strong><?php echo $option; ?>:</strong>
            <?php echo $votes; ?> votes
            (<?php echo $total_votes > 0 ? round(($votes / $total_votes) * 100, 1) : 0; ?>%)
            <div class="result-bar" style="width: <?php echo $total_votes > 0 ? ($votes / $total_votes) * 100 : 0; ?>%"></div>
        </div>
    <?php endforeach; ?>

    <?php if(isset($_SESSION['voted'])): ?>
        <p><em>You have already voted. Thank you!</em></p>
    <?php endif; ?>
</body>
</html>