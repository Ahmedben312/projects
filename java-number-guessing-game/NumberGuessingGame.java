import java.util.Random;
import java.util.Scanner;

public class NumberGuessingGame {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        
        int numberToGuess = random.nextInt(100) + 1;
        int attempts = 0;
        int maxAttempts = 10;
        boolean hasWon = false;
        
        System.out.println("=== Number Guessing Game ===");
        System.out.println("I'm thinking of a number between 1 and 100.");
        System.out.println("You have " + maxAttempts + " attempts to guess it!");
        
        while(attempts < maxAttempts && !hasWon) {
            System.out.print("\nAttempt " + (attempts + 1) + " - Enter your guess: ");
            int guess = scanner.nextInt();
            attempts++;
            
            if(guess == numberToGuess) {
                hasWon = true;
                System.out.println("🎉 Congratulations! You guessed it in " + attempts + " attempts!");
            } else if(guess < numberToGuess) {
                System.out.println("Too low! Try again.");
            } else {
                System.out.println("Too high! Try again.");
            }
        }
        
        if(!hasWon) {
            System.out.println("\n😞 Game Over! The number was: " + numberToGuess);
        }
        
        scanner.close();
    }
}