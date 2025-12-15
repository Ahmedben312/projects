import React from "react";
import BookCard from "./BookCard";
import { Book } from "../../types";

interface BookListProps {
  books: Book[];
  onBorrow?: (bookId: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBorrow }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          onBorrow={onBorrow ? () => onBorrow(book._id) : undefined}
        />
      ))}
    </div>
  );
};

export default BookList;
