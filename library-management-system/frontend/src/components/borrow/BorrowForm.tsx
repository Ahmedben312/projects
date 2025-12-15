import React, { useState, useEffect } from "react";
import { Book, User } from "../../types";
import bookService from "../../services/bookService";
import { userService } from "../../services/userService";

interface BorrowFormProps {
  onSubmit: (data: { bookId: string; userId: string }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const BorrowForm: React.FC<BorrowFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    bookId: "",
    userId: "",
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksResponse, usersResponse] = await Promise.all([
        bookService.getAllBooks(),
        userService.getUsers(),
      ]);
      setBooks(booksResponse.filter((book) => book.copiesAvailable > 0));
      setUsers(
        usersResponse.data.filter(
          (user) => user.role === "member" && user.isActive
        )
      );
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.bookId && formData.userId) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Book *
          </label>
          <select
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a book</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} by {book.author} ({book.copiesAvailable} available)
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Only books with available copies are shown
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Member *
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a member</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.membershipId}) - {user.borrowedBooks.length}
                /5 books borrowed
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Only active members with less than 5 borrowed books are shown
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.bookId || !formData.userId}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {isSubmitting ? "Processing..." : "Borrow Book"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BorrowForm;
