import { Request, Response } from "express";
import { BorrowService } from "../services/BorrowService";

const borrowService = new BorrowService();

export const BorrowController = {
  async getAllBorrowRecords(req: Request, res: Response) {
    try {
      const records = await borrowService.getAllBorrowRecords();
      res.json({ data: records });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAllBorrowRecordsPopulated(req: Request, res: Response) {
    try {
      const records = await borrowService.getAllBorrowRecordsPopulated();
      res.json({ data: records });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async borrowBook(req: Request, res: Response) {
    try {
      const { bookId, userId } = req.body;
      const borrowRecord = await borrowService.borrowBook(bookId, userId);
      res.status(201).json(borrowRecord);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async returnBook(req: Request, res: Response) {
    try {
      const borrowRecord = await borrowService.returnBook(req.params.id);
      res.json(borrowRecord);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async renewBook(req: Request, res: Response) {
    try {
      const borrowRecord = await borrowService.renewBook(req.params.id);
      res.json(borrowRecord);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getOverdueRecords(req: Request, res: Response) {
    try {
      const records = await borrowService.getOverdueRecords();
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserBorrowHistory(req: Request, res: Response) {
    try {
      const records = await borrowService.getUserBorrowHistory(
        req.params.userId
      );
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getBookBorrowHistory(req: Request, res: Response) {
    try {
      const records = await borrowService.getBookBorrowHistory(
        req.params.bookId
      );
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getMyBorrowings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const records = await borrowService.getUserBorrowHistoryPopulated(userId);
      const activeBorrowings = records.filter(
        (record: any) => record.status === "borrowed"
      );
      res.json(activeBorrowings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getMyBorrowHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const records = await borrowService.getUserBorrowHistoryPopulated(userId);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
