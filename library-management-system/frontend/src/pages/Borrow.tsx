import React, { useState, useEffect } from "react";
import {
  Book,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface BorrowRecord {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
  } | null;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
  fineAmount?: number;
}

const Borrow: React.FC = () => {
  const { user } = useAuth();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  useEffect(() => {
    if (user?.role === "member") {
      fetchBorrows();
    }
  }, [user, activeTab]);

  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "active" ? "/borrow/my-borrowings" : "/borrow/history";

      const response = await api.get(endpoint);
      setBorrows(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch borrowings");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowId: string) => {
    if (!window.confirm("Are you sure you want to return this book?")) return;

    try {
      await api.post(`/borrow/${borrowId}/return`);
      fetchBorrows(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to return book");
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status === "borrowed";

    if (isOverdue) {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
          <AlertCircle size={12} />
          Overdue
        </span>
      );
    }

    switch (status) {
      case "borrowed":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            Active
          </span>
        );
      case "returned":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            <CheckCircle size={12} />
            Returned
          </span>
        );
      case "overdue":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
            <AlertCircle size={12} />
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  const calculateDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (user?.role !== "member") {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-500">
          This page is only accessible to members.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Borrowings</h1>
        <p className="text-gray-600 mt-2">
          Manage your borrowed books and view borrowing history
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "active"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Currently Borrowed
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Borrowing History
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : borrows.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Borrowings Found
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === "active"
              ? "You haven't borrowed any books yet. Browse our collection to find books you'd like to borrow."
              : "You don't have any borrowing history yet."}
          </p>
          {activeTab === "active" && (
            <a
              href="/books"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Book size={18} className="mr-2" />
              Browse Books
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrows
            .filter((borrow) => borrow.book)
            .map((borrow) => {
              const daysRemaining = calculateDaysRemaining(borrow.dueDate);
              const isOverdue =
                daysRemaining < 0 && borrow.status === "borrowed";

              return (
                <div
                  key={borrow.id}
                  className="bg-white rounded-xl shadow overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {/* Book Cover */}
                  <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    <Book className="h-24 w-24 text-blue-600" />
                  </div>

                  {/* Book Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {borrow.book!.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {borrow.book!.author}
                    </p>

                    {/* Status */}
                    <div className="flex items-center justify-between mb-4">
                      {getStatusBadge(borrow.status, borrow.dueDate)}
                      {isOverdue && borrow.fineAmount && (
                        <span className="text-sm font-semibold text-red-600">
                          Fine: ${borrow.fineAmount.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          Borrowed:{" "}
                          {new Date(borrow.borrowDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span
                          className={
                            isOverdue ? "text-red-600 font-semibold" : ""
                          }
                        >
                          Due: {new Date(borrow.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {borrow.returnDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            Returned:{" "}
                            {new Date(borrow.returnDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Days Remaining / Overdue */}
                    {borrow.status === "borrowed" && (
                      <div
                        className={`p-3 rounded-lg mb-4 ${
                          isOverdue
                            ? "bg-red-50 border border-red-200"
                            : "bg-blue-50 border border-blue-200"
                        }`}
                      >
                        <p
                          className={`text-sm font-medium ${
                            isOverdue ? "text-red-800" : "text-blue-800"
                          }`}
                        >
                          {isOverdue
                            ? `Overdue by ${Math.abs(daysRemaining)} day${
                                Math.abs(daysRemaining) !== 1 ? "s" : ""
                              }`
                            : `${daysRemaining} day${
                                daysRemaining !== 1 ? "s" : ""
                              } remaining`}
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    {borrow.status === "borrowed" && (
                      <button
                        onClick={() => handleReturnBook(borrow.id)}
                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                      >
                        Return Book
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Borrow;
