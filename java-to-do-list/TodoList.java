import java.util.ArrayList;
import java.util.Scanner;

public class TodoList {
    private static ArrayList<String> tasks = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);
    
    public static void main(String[] args) {
        boolean running = true;
        
        while(running) {
            displayMenu();
            int choice = scanner.nextInt();
            scanner.nextLine(); // consume newline
            
            switch(choice) {
                case 1: addTask(); break;
                case 2: viewTasks(); break;
                case 3: deleteTask(); break;
                case 4: running = false; break;
                default: System.out.println("Invalid choice!");
            }
        }
        System.out.println("Goodbye!");
    }
    
    private static void displayMenu() {
        System.out.println("\n=== To-Do List ===");
        System.out.println("1. Add Task");
        System.out.println("2. View Tasks");
        System.out.println("3. Delete Task");
        System.out.println("4. Exit");
        System.out.print("Choose an option: ");
    }
    
    private static void addTask() {
        System.out.print("Enter task: ");
        String task = scanner.nextLine();
        tasks.add(task);
        System.out.println("Task added successfully!");
    }
    
    private static void viewTasks() {
        if(tasks.isEmpty()) {
            System.out.println("No tasks found!");
            return;
        }
        System.out.println("\nYour Tasks:");
        for(int i = 0; i < tasks.size(); i++) {
            System.out.println((i + 1) + ". " + tasks.get(i));
        }
    }
    
    private static void deleteTask() {
        viewTasks();
        if(tasks.isEmpty()) return;
        
        System.out.print("Enter task number to delete: ");
        int taskNum = scanner.nextInt();
        scanner.nextLine();
        
        if(taskNum > 0 && taskNum <= tasks.size()) {
            tasks.remove(taskNum - 1);
            System.out.println("Task deleted successfully!");
        } else {
            System.out.println("Invalid task number!");
        }
    }
}