import { Request, Response } from "express";
import { BookService } from "../services/BookService";
import { FilterOptions } from "../types";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const filter: FilterOptions = req.query;
    const books = await new BookService().getPaginatedBooks(filter);
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const filter: FilterOptions = req.query;
    const books = await new BookService().getPaginatedBooks(filter);
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await new BookService().getBookById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await new BookService().createBook(req.body);
    res.status(201).json(book);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await new BookService().updateBook(req.params.id, req.body);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await new BookService().deleteBook(req.params.id);
    if (book) {
      res.json({ message: "Book removed successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookStats = async (req: Request, res: Response) => {
  try {
    const stats = await new BookService().getBookStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await new BookService().getGenres();
    res.json(genres);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getBooks,
  searchBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookStats,
  getGenres,
};
