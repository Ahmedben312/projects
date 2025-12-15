import api from "./api";

export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string[];
  publicationYear: number;
  isbn: string;
  copiesAvailable: number;
  totalCopies: number;
  coverImage?: string;
  publisher?: string;
  description?: string;
  language?: string;
  pages?: number;
}

class BookService {
  async getAllBooks(): Promise<Book[]> {
    const response = await api.get("/books");
    return response.data.data.map((book: any) => ({
      ...book,
      _id: book._id,
    }));
  }

  async getBookById(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return {
      ...response.data,
      _id: response.data._id,
    };
  }

  async createBook(bookData: Partial<Book>): Promise<Book> {
    const response = await api.post("/books", bookData);
    return {
      ...response.data,
      _id: response.data._id,
    };
  }

  async updateBook(id: string, bookData: Partial<Book>): Promise<Book> {
    const response = await api.put(`/books/${id}`, bookData);
    return {
      ...response.data,
      _id: response.data._id,
    };
  }

  async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  }

  async getBookStats(): Promise<any> {
    const response = await api.get("/books/stats");
    return response.data;
  }

  async getGenres(): Promise<string[]> {
    const response = await api.get("/books/genres");
    return response.data;
  }
}

// Export as default
export default new BookService();
