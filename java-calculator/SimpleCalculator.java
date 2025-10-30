import java.util.Scanner;

public class SimpleCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("=== Simple Calculator ===");
        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();
        
        System.out.print("Enter operator (+, -, *, /): ");
        char operator = scanner.next().charAt(0);
        
        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();
        
        double result = calculate(num1, num2, operator);
        System.out.println("Result: " + result);
        
        scanner.close();
    }
    
    public static double calculate(double num1, double num2, char operator) {
        switch(operator) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/': 
                if(num2 == 0) {
                    System.out.println("Error: Division by zero!");
                    return 0;
                }
                return num1 / num2;
            default:
                System.out.println("Invalid operator!");
                return 0;
        }
    }
}