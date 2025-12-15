// /backend/src/repositories/BookRepository.ts
import BookModel, { IBookDocument } from '../models/Book';
import { BaseRepository } from './BaseRepository';

export class BookRepository extends BaseRepository<IBookDocument> {
  constructor() {
    super(BookModel);
  }
}