import { BookRepository } from "../repositories/BookRepository";
import {
  IBook,
  BookCreateInput,
  BookUpdateInput,
  FilterOptions,
  PaginatedResult,
} from "../types";

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async createBook(data: BookCreateInput): Promise<IBook> {
    const bookData = {
      ...data,
      genre: Array.isArray(data.genre) ? data.genre : [data.genre],
    };
    return await this.bookRepository.create(bookData);
  }

  async getBookById(id: string): Promise<IBook | null> {
    return await this.bookRepository.findById(id);
  }

  async getAllBooks(filter: FilterOptions = {}): Promise<IBook[]> {
    return await this.bookRepository.findAll(this.buildFilter(filter));
  }

  async getPaginatedBooks(
    filter: FilterOptions = {}
  ): Promise<PaginatedResult<IBook>> {
    return await this.bookRepository.paginate(this.buildFilter(filter), filter);
  }

  async searchBooks(query: string, filter: FilterOptions = {}): Promise<PaginatedResult<IBook>> {
    const searchQuery = {
      ...this.buildFilter(filter),
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ],
    };
    return await this.bookRepository.paginate(searchQuery, filter);
  }

  async updateBook(id: string, data: BookUpdateInput): Promise<IBook | null> {
    const updateData: any = { ...data };
    if (updateData.genre && typeof updateData.genre === "string") {
      updateData.genre = [updateData.genre];
    }
    return await this.bookRepository.update(id, updateData);
  }

  async updateBookCopies(id: string, change: number): Promise<IBook | null> {
    return await this.bookRepository.update(id, { $inc: { copiesAvailable: change } });
  }

  async deleteBook(id: string): Promise<IBook | null> {
    return await this.bookRepository.delete(id);
  }

  async getBookStats() {
    const totalBooks = await this.bookRepository.count();
    const totalCopies = await this.bookRepository.aggregate([
      { $group: { _id: null, total: { $sum: "$totalCopies" } } },
    ]);
    const availableCopies = await this.bookRepository.aggregate([
      { $group: { _id: null, total: { $sum: "$copiesAvailable" } } },
    ]);

    return {
      totalBooks,
      totalCopies: totalCopies[0]?.total || 0,
      availableCopies: availableCopies[0]?.total || 0,
      borrowedCopies:
        (totalCopies[0]?.total || 0) - (availableCopies[0]?.total || 0),
    };
  }

  async getGenres(): Promise<string[]> {
    const books = await this.bookRepository.findAll();
    const genres = new Set<string>();

    books.forEach((book) => {
      if (Array.isArray(book.genre)) {
        book.genre.forEach((genre) => genres.add(genre));
      }
    });

    return Array.from(genres);
  }

  private buildFilter(filter: FilterOptions): any {
    const query: any = {};

    if (filter.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: "i" } },
        { author: { $regex: filter.search, $options: "i" } },
        { isbn: { $regex: filter.search, $options: "i" } },
      ];
    }

    if (filter.genre) {
      query.genre = filter.genre;
    }

    return query;
  }
}