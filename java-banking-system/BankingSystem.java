import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

class Transaction implements Serializable {
    private String type;
    private double amount;
    private LocalDateTime timestamp;
    
    public Transaction(String type, double amount) {
        this.type = type;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
    }
    
    @Override
    public String toString() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return timestamp.format(formatter) + " - " + type + ": $" + amount;
    }
}

class BankAccount implements Serializable {
    private String accountNumber;
    private String accountHolder;
    private double balance;
    private List<Transaction> transactionHistory;
    
    public BankAccount(String accountNumber, String accountHolder) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = 0.0;
        this.transactionHistory = new ArrayList<>();
    }
    
    public void deposit(double amount) {
        if(amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive!");
        }
        balance += amount;
        transactionHistory.add(new Transaction("DEPOSIT", amount));
    }
    
    public void withdraw(double amount) {
        if(amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive!");
        }
        if(amount > balance) {
            throw new IllegalArgumentException("Insufficient funds!");
        }
        balance -= amount;
        transactionHistory.add(new Transaction("WITHDRAWAL", amount));
    }
    
    public double getBalance() { return balance; }
    public String getAccountNumber() { return accountNumber; }
    public String getAccountHolder() { return accountHolder; }
    
    public void displayTransactionHistory() {
        System.out.println("\n=== Transaction History for " + accountNumber + " ===");
        if(transactionHistory.isEmpty()) {
            System.out.println("No transactions yet.");
        } else {
            transactionHistory.forEach(System.out::println);
        }
    }
}

public class BankingSystem {
    private Map<String, BankAccount> accounts;
    private static final String ACCOUNTS_FILE = "accounts.dat";
    
    public BankingSystem() {
        accounts = new HashMap<>();
        loadAccounts();
    }
    
    public void createAccount(String accountNumber, String accountHolder) {
        if(accounts.containsKey(accountNumber)) {
            System.out.println("Account already exists!");
            return;
        }
        accounts.put(accountNumber, new BankAccount(accountNumber, accountHolder));
        System.out.println("Account created successfully!");
        saveAccounts();
    }
    
    public void deposit(String accountNumber, double amount) {
        BankAccount account = accounts.get(accountNumber);
        if(account == null) {
            System.out.println("Account not found!");
            return;
        }
        try {
            account.deposit(amount);
            System.out.println("Deposit successful! New balance: $" + account.getBalance());
            saveAccounts();
        } catch(IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
    
    public void withdraw(String accountNumber, double amount) {
        BankAccount account = accounts.get(accountNumber);
        if(account == null) {
            System.out.println("Account not found!");
            return;
        }
        try {
            account.withdraw(amount);
            System.out.println("Withdrawal successful! New balance: $" + account.getBalance());
            saveAccounts();
        } catch(IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
    
    public void checkBalance(String accountNumber) {
        BankAccount account = accounts.get(accountNumber);
        if(account == null) {
            System.out.println("Account not found!");
            return;
        }
        System.out.println("Account: " + account.getAccountNumber());
        System.out.println("Holder: " + account.getAccountHolder());
        System.out.println("Balance: $" + account.getBalance());
    }
    
    public void showTransactionHistory(String accountNumber) {
        BankAccount account = accounts.get(accountNumber);
        if(account == null) {
            System.out.println("Account not found!");
            return;
        }
        account.displayTransactionHistory();
    }
    
    private void saveAccounts() {
        try(ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(ACCOUNTS_FILE))) {
            oos.writeObject(accounts);
        } catch(IOException e) {
            System.out.println("Error saving accounts: " + e.getMessage());
        }
    }
    
    @SuppressWarnings("unchecked")
    private void loadAccounts() {
        try(ObjectInputStream ois = new ObjectInputStream(new FileInputStream(ACCOUNTS_FILE))) {
            accounts = (Map<String, BankAccount>) ois.readObject();
        } catch(FileNotFoundException e) {
            // File doesn't exist yet, that's okay
        } catch(IOException | ClassNotFoundException e) {
            System.out.println("Error loading accounts: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        BankingSystem bank = new BankingSystem();
        Scanner scanner = new Scanner(System.in);
        
        // Demo usage
        bank.createAccount("ACC001", "John Doe");
        bank.deposit("ACC001", 1000);
        bank.withdraw("ACC001", 250);
        bank.checkBalance("ACC001");
        bank.showTransactionHistory("ACC001");
    }
}