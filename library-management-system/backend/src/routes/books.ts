import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBookStats,
  getGenres,
} from '../controllers/BookController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

router.get('/', getBooks);
router.get('/stats', getBookStats);
router.get('/genres', getGenres);
router.get('/:id', getBookById);

router.post(
  '/',
  authenticate,
  authorize([UserRole.Admin, UserRole.Librarian]),
  createBook
);
router.put(
  '/:id',
  authenticate,
  authorize([UserRole.Admin, UserRole.Librarian]),
  updateBook
);
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.Admin, UserRole.Librarian]),
  deleteBook
);

export default router;