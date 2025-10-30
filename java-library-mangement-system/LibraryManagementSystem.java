import java.io.*;
import java.util.*;

class Book implements Serializable {
    private String isbn;
    private String title;
    private String author;
    private boolean isAvailable;
    
    public Book(String isbn, String title, String author) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.isAvailable = true;
    }
    
    // Getters and setters
    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
    
    @Override
    public String toString() {
        return "ISBN: " + isbn + ", Title: " + title + ", Author: " + author + 
               ", Available: " + (isAvailable ? "Yes" : "No");
    }
}

class Member implements Serializable {
    private String memberId;
    private String name;
    private List<String> borrowedBooks;
    
    public Member(String memberId, String name) {
        this.memberId = memberId;
        this.name = name;
        this.borrowedBooks = new ArrayList<>();
    }
    
    public String getMemberId() { return memberId; }
    public String getName() { return name; }
    public List<String> getBorrowedBooks() { return borrowedBooks; }
    
    public void borrowBook(String isbn) {
        borrowedBooks.add(isbn);
    }
    
    public void returnBook(String isbn) {
        borrowedBooks.remove(isbn);
    }
}

public class LibraryManagementSystem {
    private Map<String, Book> books;
    private Map<String, Member> members;
    private static final String DATA_FILE = "library_data.ser";
    
    public LibraryManagementSystem() {
        books = new HashMap<>();
        members = new HashMap<>();
        loadData();
    }
    
    public void addBook(String isbn, String title, String author) {
        books.put(isbn, new Book(isbn, title, author));
        System.out.println("Book added successfully!");
        saveData();
    }
    
    public void addMember(String memberId, String name) {
        members.put(memberId, new Member(memberId, name));
        System.out.println("Member added successfully!");
        saveData();
    }
    
    public void borrowBook(String memberId, String isbn) {
        Member member = members.get(memberId);
        Book book = books.get(isbn);
        
        if(member == null) {
            System.out.println("Member not found!");
            return;
        }
        
        if(book == null) {
            System.out.println("Book not found!");
            return;
        }
        
        if(!book.isAvailable()) {
            System.out.println("Book is not available!");
            return;
        }
        
        book.setAvailable(false);
        member.borrowBook(isbn);
        System.out.println("Book borrowed successfully!");
        saveData();
    }
    
    public void returnBook(String memberId, String isbn) {
        Member member = members.get(memberId);
        Book book = books.get(isbn);
        
        if(member == null || book == null) {
            System.out.println("Invalid member or book!");
            return;
        }
        
        book.setAvailable(true);
        member.returnBook(isbn);
        System.out.println("Book returned successfully!");
        saveData();
    }
    
    public void displayBooks() {
        if(books.isEmpty()) {
            System.out.println("No books in library!");
            return;
        }
        System.out.println("\n=== Library Books ===");
        books.values().forEach(System.out::println);
    }
    
    private void saveData() {
        try(ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(DATA_FILE))) {
            oos.writeObject(books);
            oos.writeObject(members);
        } catch(IOException e) {
            System.out.println("Error saving data: " + e.getMessage());
        }
    }
    
    @SuppressWarnings("unchecked")
    private void loadData() {
        try(ObjectInputStream ois = new ObjectInputStream(new FileInputStream(DATA_FILE))) {
            books = (Map<String, Book>) ois.readObject();
            members = (Map<String, Member>) ois.readObject();
            System.out.println("Data loaded successfully!");
        } catch(FileNotFoundException e) {
            System.out.println("No existing data found. Starting fresh.");
        } catch(IOException | ClassNotFoundException e) {
            System.out.println("Error loading data: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        LibraryManagementSystem library = new LibraryManagementSystem();
        
        // Demo usage
        library.addBook("123", "Java Programming", "John Doe");
        library.addBook("456", "Data Structures", "Jane Smith");
        library.addMember("M001", "Alice");
        library.displayBooks();
        library.borrowBook("M001", "123");
        library.displayBooks();
    }
}