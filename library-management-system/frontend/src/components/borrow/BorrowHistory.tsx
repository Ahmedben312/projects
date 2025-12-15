import React from 'react';
import { BorrowRecord } from '../../types';
import { Calendar, Clock, RefreshCw, CheckCircle } from 'lucide-react';

interface BorrowHistoryProps {
  records: BorrowRecord[];
  onReturn?: (recordId: string) => void;
  onRenew?: (recordId: string) => void;
  currentUserRole: string;
}

const BorrowHistory: React.FC<BorrowHistoryProps> = ({ 
  records, 
  onReturn, 
  onRenew,
  currentUserRole 
}) => {
  const canManage = ['admin', 'librarian'].includes(currentUserRole);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrowed': return 'bg-blue-100 text-blue-800';
      case 'returned': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No borrow records found</div>
        <p className="text-gray-400 mt-2">No books have been borrowed yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Renewals
              </th>
              {canManage && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {record.book?.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    by {record.book?.author}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {record.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {record.user?.membershipId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 mb-1">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(record.borrowDate).toLocaleDateString()}
                  </div>
                  <div className={`flex items-center text-sm ${
                    isOverdue(record.dueDate) && record.status === 'borrowed' 
                      ? 'text-red-600 font-medium' 
                      : 'text-gray-500'
                  }`}>
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {new Date(record.dueDate).toLocaleDateString()}
                    {isOverdue(record.dueDate) && record.status === 'borrowed' && (
                      <span className="ml-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Overdue
                      </span>
                    )}
                  </div>
                  {record.returnDate && (
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Returned: {new Date(record.returnDate).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.renewalCount} time(s)
                </td>
                {canManage && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {record.status === 'borrowed' && onReturn && (
                      <button
                        onClick={() => onReturn(record._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Return
                      </button>
                    )}
                    {record.status === 'borrowed' && onRenew && record.renewalCount < 2 && (
                      <button
                        onClick={() => onRenew(record._id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Renew
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowHistory;
