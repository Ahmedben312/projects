import React, { useState, useEffect } from "react";

import bookService from "../services/bookService";
import borrowService, { BorrowRecord } from "../services/borrowService";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import {
  BookOpen,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Book } from "../services/bookService";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
  });
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [recentBorrows, setRecentBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.role === "admin" || user?.role === "librarian") {
        const [booksResponse, usersResponse, borrowsResponse, overdueResponse] =
          await Promise.all([
            bookService.getAllBooks(),
            userService.getUsers(),
            borrowService.getAllBorrowRecordsPopulated(),
            borrowService.getOverdueRecords(),
          ]);

        const recentBooksData = await bookService.getAllBooks();

        setStats({
          totalBooks: booksResponse.length,
          totalUsers: usersResponse.data.length,
          borrowedBooks: borrowsResponse.filter(
            (r: BorrowRecord) => r.status === "borrowed"
          ).length,
          overdueBooks: overdueResponse.length,
        });

        setRecentBooks(recentBooksData.slice(0, 5));
        setRecentBorrows(borrowsResponse.slice(0, 5));
      } else if (user?.role === "member") {
        // Members use their own endpoints
        const [myBorrowings, borrowHistory] = await Promise.all([
          borrowService.getMyBorrowings(),
          borrowService.getMyBorrowHistory(),
        ]);

        const overdueCount = myBorrowings.filter(
          (r: BorrowRecord) =>
            r.status === "borrowed" && new Date(r.dueDate) < new Date()
        ).length;

        setStats({
          totalBooks: 0,
          totalUsers: 0,
          borrowedBooks: myBorrowings.length,
          overdueBooks: overdueCount,
        });

        setRecentBorrows(borrowHistory.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">{trend}</span>
          <span className="text-gray-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}! Here's what's happening in your library.
        </p>
      </div>

      {user?.role === "admin" || user?.role === "librarian" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={BookOpen}
              title="Total Books"
              value={stats.totalBooks}
              color="bg-blue-500"
              trend="+12%"
            />
            <StatCard
              icon={Users}
              title="Total Users"
              value={stats.totalUsers}
              color="bg-green-500"
              trend="+5%"
            />
            <StatCard
              icon={Clock}
              title="Borrowed Books"
              value={stats.borrowedBooks}
              color="bg-yellow-500"
            />
            <StatCard
              icon={AlertTriangle}
              title="Overdue Books"
              value={stats.overdueBooks}
              color="bg-red-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recently Added Books
              </h3>
              <div className="space-y-4">
                {recentBooks.map((book) => (
                  <div
                    key={book._id}
                    className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {book.copiesAvailable} available
                    </div>
                  </div>
                ))}
                {recentBooks.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No recent books
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Borrows
              </h3>
              <div className="space-y-4">
                {recentBorrows.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {record.book?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        by {record.user?.name}
                      </p>
                    </div>
                    <div
                      className={`text-sm ${
                        new Date(record.dueDate) < new Date() &&
                        record.status === "borrowed"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      Due: {new Date(record.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {recentBorrows.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No recent borrows
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={BookOpen}
              title="Books Borrowed"
              value={stats.borrowedBooks}
              color="bg-blue-500"
            />
            <StatCard
              icon={AlertTriangle}
              title="Overdue Books"
              value={stats.overdueBooks}
              color="bg-red-500"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              My Recent Borrows
            </h3>
            <div className="space-y-4">
              {recentBorrows.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {record.book?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      by {record.book?.author}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        new Date(record.dueDate) < new Date() &&
                        record.status === "borrowed"
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      Due: {new Date(record.dueDate).toLocaleDateString()}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        record.status === "borrowed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
              {recentBorrows.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  You haven't borrowed any books yet
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
