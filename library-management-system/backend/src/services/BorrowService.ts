import { BaseRepository } from "../repositories/BaseRepository";
import BorrowRecord, { IBorrowRecordDocument } from "../models/BorrowRecord";
import { BookService } from "./BookService";
import { UserService } from "./UserService";
import { IBorrowRecord } from "../types";

export class BorrowService {
  private borrowRepository: BaseRepository<IBorrowRecordDocument>;
  private bookService: BookService;
  private userService: UserService;

  constructor() {
    this.borrowRepository = new BaseRepository<IBorrowRecordDocument>(
      BorrowRecord
    );
    this.bookService = new BookService();
    this.userService = new UserService();
  }

  async borrowBook(bookId: string, userId: string): Promise<IBorrowRecord> {
    const book = await this.bookService.getBookById(bookId);
    if (!book) throw new Error("Book not found");
    if (book.copiesAvailable < 1) throw new Error("No copies available");

    const user = await this.userService.getUserById(userId);
    if (!user) throw new Error("User not found");
    if (user.borrowedBooks.length >= 5)
      throw new Error("Maximum borrowing limit reached");

    const existingBorrow = await this.borrowRepository.findOne({
      bookId,
      userId,
      status: "borrowed",
    } as any);
    if (existingBorrow) throw new Error("Book already borrowed by user");

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowRecord = await this.borrowRepository.create({
      bookId,
      userId,
      borrowDate: new Date(),
      dueDate,
      status: "borrowed",
      renewalCount: 0,
    } as Partial<IBorrowRecordDocument>);

    await this.bookService.updateBookCopies(bookId, -1);
    await this.userService.addBorrowedBook(userId, bookId);

    return borrowRecord;
  }

  async returnBook(borrowRecordId: string): Promise<IBorrowRecord | null> {
    const borrowRecord = await this.borrowRepository.findById(borrowRecordId);
    if (!borrowRecord) throw new Error("Borrow record not found");

    const updatedRecord = await this.borrowRepository.update(borrowRecordId, {
      returnDate: new Date(),
      status: "returned",
    } as Partial<IBorrowRecordDocument>);

    await this.bookService.updateBookCopies(borrowRecord.bookId.toString(), 1);
    await this.userService.removeBorrowedBook(
      borrowRecord.userId.toString(),
      borrowRecord.bookId.toString()
    );

    return updatedRecord;
  }

  async renewBook(borrowRecordId: string): Promise<IBorrowRecord | null> {
    const borrowRecord = await this.borrowRepository.findById(borrowRecordId);
    if (!borrowRecord) throw new Error("Borrow record not found");

    if (borrowRecord.renewalCount >= 2) {
      throw new Error("Maximum renewal limit reached");
    }

    const newDueDate = new Date(borrowRecord.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    return this.borrowRepository.update(borrowRecordId, {
      dueDate: newDueDate,
      renewalCount: borrowRecord.renewalCount + 1,
    } as Partial<IBorrowRecordDocument>);
  }

  async getOverdueRecords(): Promise<IBorrowRecord[]> {
    return await this.borrowRepository.findAll({
      status: "borrowed",
      dueDate: { $lt: new Date() },
    } as any);
  }

  async getUserBorrowHistory(userId: string): Promise<IBorrowRecord[]> {
    return await this.borrowRepository.findAll({
      userId,
    } as any);
  }

  async getBookBorrowHistory(bookId: string): Promise<IBorrowRecord[]> {
    return await this.borrowRepository.findAll({
      bookId,
    } as any);
  }

  async getAllBorrowRecords(): Promise<IBorrowRecord[]> {
    return await this.borrowRepository.findAll({});
  }

  async getAllBorrowRecordsPopulated(): Promise<any[]> {
    const records = await this.borrowRepository.findAll({});
    const populatedRecords = await Promise.all(
      records.map(async (record) => {
        const book = await this.bookService.getBookById(
          record.bookId.toString()
        );
        const user = await this.userService.getUserById(
          record.userId.toString()
        );
        return {
          ...record.toObject(),
          book: book
            ? { title: book.title, author: book.author, id: (book as any)._id }
            : null,
          user: user ? { name: user.name } : null,
        };
      })
    );
    return populatedRecords;
  }

  async getUserBorrowHistoryPopulated(userId: string): Promise<any[]> {
    const records = await this.borrowRepository.findAll({
      userId,
    } as any);
    const populatedRecords = await Promise.all(
      records.map(async (record) => {
        const book = await this.bookService.getBookById(
          record.bookId.toString()
        );
        return {
          ...record.toObject(),
          id: record._id.toString(),
          book: book
            ? {
                id: (book as any)._id.toString(),
                title: book.title,
                author: book.author,
                coverImage: book.coverImage,
              }
            : null,
        };
      })
    );
    return populatedRecords;
  }
}
