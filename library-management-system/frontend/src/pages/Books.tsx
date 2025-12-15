import React, { useState, useEffect } from "react";
import BookList from "../components/books/BookList";
import SearchBar from "../components/common/SearchBar";
import GenreFilter from "../components/books/GenreFilter";
import borrowService from "../services/borrowService";
import bookService from "../services/bookService";
import { useAuth } from "../context/AuthContext";
import { Book } from "../types";

const Books: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [genres, setGenres] = useState<string[]>(["all"]);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedGenre, allBooks]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      setAllBooks(response);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to fetch books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredBooks = allBooks;

    if (searchTerm) {
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== "all") {
      filteredBooks = filteredBooks.filter((book) =>
        book.genre.includes(selectedGenre)
      );
    }

    setBooks(filteredBooks);
  };

  const fetchGenres = async () => {
    try {
      const genresData = await bookService.getGenres();
      setGenres(["all", ...genresData]);
    } catch (err) {
      console.error("Error fetching genres:", err);
      setGenres([
        "all",
        "Fantasy",
        "Science Fiction",
        "Thriller",
        "Horror",
        "Romance",
        "Classic",
      ]);
    }
  };

  const handleBorrow = async (bookId: string) => {
    if (!user) {
      setError("Please login to borrow books");
      return;
    }

    if (user.role !== "member") {
      setError("Only members can borrow books");
      return;
    }

    try {
      await borrowService.createBorrowRecord({
        bookId,
        userId: user.id,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: "borrowed",
        renewalCount: 0,
      });
      setSuccessMessage("Book borrowed successfully!");
      setError("");
      fetchBooks();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to borrow book. Please try again."
      );
      console.error("Error borrowing book:", err);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Book Collection</h1>
        <p className="text-gray-600 mt-2">
          Browse and borrow from our extensive collection of books
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
          {successMessage}
        </div>
      )}

      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search books by title, author, or ISBN..."
        />

        {genres.length > 0 && (
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={handleGenreSelect}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Books Found
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedGenre !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No books available in the library yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {books.length} book{books.length !== 1 ? "s" : ""}
              {selectedGenre !== "all" ? ` in "${selectedGenre}"` : ""}
            </p>
          </div>

          <BookList books={books} onBorrow={handleBorrow} />
        </>
      )}
    </div>
  );
};

export default Books;
