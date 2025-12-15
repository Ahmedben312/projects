import React from "react";
import { Book } from "../../types";

export interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
  onBorrow?: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onBorrow,
}) => {
  const genres = Array.isArray(book.genre) ? book.genre : [book.genre];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {book.coverImage && (
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-1">By {book.author}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {genres.map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Published: {book.publicationYear} • ISBN: {book.isbn}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span
              className={`font-medium ${
                book.copiesAvailable > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {book.copiesAvailable} of {book.totalCopies} available
            </span>
          </div>
          <div className="flex gap-2">
            {onBorrow && book.copiesAvailable > 0 && (
              <button
                onClick={() => onBorrow(book.id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Borrow
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(book)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(book.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
