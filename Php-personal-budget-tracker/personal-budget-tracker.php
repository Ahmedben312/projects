<?php
session_start();

class BudgetTracker {
    private $data_file = 'budget_data.json';
    
    public function __construct() {
        if(!file_exists($this->data_file)) {
            file_put_contents($this->data_file, json_encode(['transactions' => []]));
        }
    }
    
    private function getData() {
        return json_decode(file_get_contents($this->data_file), true);
    }
    
    private function saveData($data) {
        file_put_contents($this->data_file, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    public function addTransaction($type, $category, $amount, $description, $date) {
        $data = $this->getData();
        
        $transaction = [
            'id' => uniqid(),
            'type' => $type,
            'category' => $category,
            'amount' => floatval($amount),
            'description' => htmlspecialchars($description),
            'date' => $date
        ];
        
        $data['transactions'][] = $transaction;
        $this->saveData($data);
        
        return $transaction;
    }
    
    public function getTransactions() {
        $data = $this->getData();
        return $data['transactions'];
    }
    
    public function deleteTransaction($id) {
        $data = $this->getData();
        $data['transactions'] = array_filter($data['transactions'], function($transaction) use ($id) {
            return $transaction['id'] !== $id;
        });
        $this->saveData($data);
    }
    
    public function getFinancialSummary() {
        $transactions = $this->getTransactions();
        $income = 0;
        $expenses = 0;
        
        foreach($transactions as $transaction) {
            if($transaction['type'] === 'income') {
                $income += $transaction['amount'];
            } else {
                $expenses += $transaction['amount'];
            }
        }
        
        return [
            'income' => $income,
            'expenses' => $expenses,
            'balance' => $income - $expenses
        ];
    }
    
    public function getCategorySummary() {
        $transactions = $this->getTransactions();
        $categories = [];
        
        foreach($transactions as $transaction) {
            $category = $transaction['category'];
            if(!isset($categories[$category])) {
                $categories[$category] = 0;
            }
            
            if($transaction['type'] === 'income') {
                $categories[$category] += $transaction['amount'];
            } else {
                $categories[$category] -= $transaction['amount'];
            }
        }
        
        return $categories;
    }
}

$budget = new BudgetTracker();
$message = "";

// Handle form submissions
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    if(isset($_POST['add_transaction'])) {
        $budget->addTransaction(
            $_POST['type'],
            $_POST['category'],
            $_POST['amount'],
            $_POST['description'],
            $_POST['date']
        );
        $message = "Transaction added successfully!";
    }
}

if(isset($_GET['delete'])) {
    $budget->deleteTransaction($_GET['delete']);
    $message = "Transaction deleted successfully!";
}

$transactions = $budget->getTransactions();
$summary = $budget->getFinancialSummary();
$categories = $budget->getCategorySummary();

// Sort transactions by date (newest first)
usort($transactions, function($a, $b) {
    return strtotime($b['date']) - strtotime($a['date']);
});
?>

<!DOCTYPE html>
<html>
<head>
    <title>Personal Budget Tracker</title>
    <style>
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .summary-cards { display: flex; gap: 20px; margin: 20px 0; }
        .card { flex: 1; padding: 20px; border-radius: 5px; text-align: center; }
        .income { background: #e8f5e8; border: 1px solid #4CAF50; }
        .expenses { background: #ffe8e8; border: 1px solid #f44336; }
        .balance { background: #e8f4fd; border: 1px solid #2196F3; }
        .transaction-form { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        .transaction { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
        .income-transaction { border-left: 4px solid #4CAF50; }
        .expense-transaction { border-left: 4px solid #f44336; }
        .positive { color: #4CAF50; }
        .negative { color: #f44336; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Personal Budget Tracker</h1>
        
        <?php if($message): ?>
            <div style="background: #d4edda; color: #155724; padding: 10px; margin: 10px 0;">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>

        <!-- Financial Summary -->
        <div class="summary-cards">
            <div class="card income">
                <h3>Total Income</h3>
                <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">
                    $<?php echo number_format($summary['income'], 2); ?>
                </p>
            </div>
            <div class="card expenses">
                <h3>Total Expenses</h3>
                <p style="font-size: 24px; font-weight: bold; color: #f44336;">
                    $<?php echo number_format($summary['expenses'], 2); ?>
                </p>
            </div>
            <div class="card balance">
                <h3>Balance</h3>
                <p style="font-size: 24px; font-weight: bold; color: #2196F3;">
                    $<?php echo number_format($summary['balance'], 2); ?>
                </p>
            </div>
        </div>

        <!-- Add Transaction Form -->
        <div class="transaction-form">
            <h3>Add New Transaction</h3>
            <form method="post">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div>
                        <label>Type:</label>
                        <select name="type" required>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div>
                        <label>Category:</label>
                        <input type="text" name="category" placeholder="e.g., Salary, Food, Rent" required>
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input type="number" name="amount" step="0.01" min="0.01" required>
                    </div>
                    <div>
                        <label>Date:</label>
                        <input type="date" name="date" value="<?php echo date('Y-m-d'); ?>" required>
                    </div>
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" name="description" placeholder="Transaction description" style="width: 100%;">
                </div>
                <button type="submit" name="add_transaction" style="margin-top: 10px;">Add Transaction</button>
            </form>
        </div>

        <!-- Transactions List -->
        <h3>Recent Transactions</h3>
        <?php if(empty($transactions)): ?>
            <p>No transactions yet. Add your first transaction above!</p>
        <?php else: ?>
            <?php foreach($transactions as $transaction): ?>
                <div class="transaction <?php echo $transaction['type'] . '-transaction'; ?>">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong><?php echo htmlspecialchars($transaction['category']); ?></strong>
                            - <?php echo htmlspecialchars($transaction['description']); ?>
                            <br>
                            <small><?php echo date('M j, Y', strtotime($transaction['date'])); ?></small>
                        </div>
                        <div>
                            <span class="<?php echo $transaction['type'] === 'income' ? 'positive' : 'negative'; ?>">
                                <?php echo $transaction['type'] === 'income' ? '+' : '-'; ?>
                                $<?php echo number_format($transaction['amount'], 2); ?>
                            </span>
                            <a href="?delete=<?php echo $transaction['id']; ?>" 
                               onclick="return confirm('Delete this transaction?')" 
                               style="color: red; margin-left: 10px;">Delete</a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>

        <!-- Category Summary -->
        <h3>Category Summary</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <?php foreach($categories as $category => $amount): ?>
                <div style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                    <strong><?php echo htmlspecialchars($category); ?></strong><br>
                    <span class="<?php echo $amount >= 0 ? 'positive' : 'negative'; ?>">
                        $<?php echo number_format(abs($amount), 2); ?>
                    </span>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>
</html>