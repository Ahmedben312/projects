const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/library_management";

// Define schemas directly for seeding
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    membershipId: String,
    phone: String,
    address: String,
    isActive: Boolean,
    borrowedBooks: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const BookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    isbn: String,
    genre: [String],
    publicationYear: Number,
    publisher: String,
    copiesAvailable: Number,
    totalCopies: Number,
    description: String,
    language: String,
    pages: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const Book = mongoose.model("Book", BookSchema);

const demoUsers = [
  {
    name: "Admin User",
    email: "admin@library.com",
    password: "admin123",
    role: "admin",
    membershipId: "ADM001",
    phone: "+1234567890",
    address: "123 Library Street, Book City",
    isActive: true,
    borrowedBooks: [],
  },
  {
    name: "Librarian User",
    email: "librarian@library.com",
    password: "lib123",
    role: "librarian",
    membershipId: "LIB001",
    phone: "+1234567891",
    address: "456 Library Avenue, Book Town",
    isActive: true,
    borrowedBooks: [],
  },
  {
    name: "Member User",
    email: "member@library.com",
    password: "member123",
    role: "member",
    membershipId: "MEM001",
    phone: "+1234567892",
    address: "789 Reader Road, Book Village",
    isActive: true,
    borrowedBooks: [],
  },
];

const demoBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    genre: ["Fiction", "Classic"],
    publicationYear: 1925,
    publisher: "Scribner",
    copiesAvailable: 3,
    totalCopies: 5,
    description: "A classic novel of the Jazz Age",
    language: "English",
    pages: 180,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    genre: ["Fiction", "Classic"],
    publicationYear: 1960,
    publisher: "J.B. Lippincott & Co.",
    copiesAvailable: 2,
    totalCopies: 4,
    description: "A novel about racial inequality and moral growth",
    language: "English",
    pages: 281,
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: ["Fiction", "Dystopian", "Science Fiction"],
    publicationYear: 1949,
    publisher: "Secker & Warburg",
    copiesAvailable: 4,
    totalCopies: 4,
    description: "A dystopian social science fiction novel",
    language: "English",
    pages: 328,
  },
];

async function seedDatabase() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Existing data cleared");

    // Hash passwords and create users
    console.log("👥 Creating demo users...");
    const usersWithHashedPasswords = await Promise.all(
      demoUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create books
    console.log("📚 Creating demo books...");
    const createdBooks = await Book.insertMany(demoBooks);
    console.log(`✅ Created ${createdBooks.length} books`);

    console.log("🎉 Database seeded successfully!");
    console.log("");
    console.log("📋 Demo Credentials:");
    console.log("====================");
    demoUsers.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log("---");
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

seedDatabase();
