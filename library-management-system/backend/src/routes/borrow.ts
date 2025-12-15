import { Router } from "express";
import { BorrowController } from "../controllers/BorrowController";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize([UserRole.Admin, UserRole.Librarian]),
  BorrowController.getAllBorrowRecords
);
router.get(
  "/populated",
  authorize([UserRole.Admin, UserRole.Librarian]),
  BorrowController.getAllBorrowRecordsPopulated
);
router.post(
  "/",
  authorize([UserRole.Admin, UserRole.Librarian, UserRole.Member]),
  BorrowController.borrowBook
);
router.post(
  "/return/:id",
  authorize([UserRole.Admin, UserRole.Librarian, UserRole.Member]),
  BorrowController.returnBook
);
router.post(
  "/renew/:id",
  authorize([UserRole.Admin, UserRole.Librarian, UserRole.Member]),
  BorrowController.renewBook
);
router.get(
  "/overdue",
  authorize([UserRole.Admin, UserRole.Librarian]),
  BorrowController.getOverdueRecords
);
router.get(
  "/user/:userId",
  authorize([UserRole.Admin, UserRole.Librarian, UserRole.Member], true),
  BorrowController.getUserBorrowHistory
);
router.get(
  "/book/:bookId",
  authorize([UserRole.Admin, UserRole.Librarian]),
  BorrowController.getBookBorrowHistory
);

// User-specific endpoints
router.get(
  "/my-borrowings",
  authorize([UserRole.Member]),
  BorrowController.getMyBorrowings
);
router.get(
  "/history",
  authorize([UserRole.Member]),
  BorrowController.getMyBorrowHistory
);

export default router;
