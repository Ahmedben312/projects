import api from "./api";

export interface BorrowRecord {
  _id?: string;
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
  renewalCount: number;
}

class BorrowService {
  async getAllBorrowRecords(): Promise<BorrowRecord[]> {
    const response = await api.get("/borrow");
    return response.data.data.map((record: any) => ({
      ...record,
      id: record._id || record.id,
    }));
  }

  async getAllBorrowRecordsPopulated(): Promise<any[]> {
    const response = await api.get("/borrow/populated");
    return response.data.data.map((record: any) => ({
      ...record,
      id: record._id || record.id,
    }));
  }

  async getBorrowRecordById(id: string): Promise<BorrowRecord> {
    const response = await api.get(`/borrow/${id}`);
    return {
      ...response.data,
      id: response.data._id,
    };
  }

  async createBorrowRecord(data: Partial<BorrowRecord>): Promise<BorrowRecord> {
    const response = await api.post("/borrow", data);
    return {
      ...response.data,
      id: response.data._id,
    };
  }

  async updateBorrowRecord(
    id: string,
    data: Partial<BorrowRecord>
  ): Promise<BorrowRecord> {
    const response = await api.put(`/borrow/${id}`, data);
    return {
      ...response.data,
      id: response.data._id,
    };
  }

  async deleteBorrowRecord(id: string): Promise<void> {
    await api.delete(`/borrow/${id}`);
  }

  async getOverdueRecords(): Promise<BorrowRecord[]> {
    const response = await api.get("/borrow/overdue");
    return response.data.data.map((record: any) => ({
      ...record,
      id: record._id || record.id,
    }));
  }

  async getUserBorrowRecords(userId: string): Promise<BorrowRecord[]> {
    const response = await api.get(`/borrow/user/${userId}`);
    return response.data.map((record: any) => ({
      ...record,
      id: record._id || record.id,
    }));
  }

  async renewBorrowRecord(id: string): Promise<BorrowRecord> {
    const response = await api.put(`/borrow/${id}/renew`);
    return {
      ...response.data,
      id: response.data._id,
    };
  }

  async getMyBorrowings(): Promise<BorrowRecord[]> {
    const response = await api.get("/borrow/my-borrowings");
    return response.data.map((record: any) => ({
      ...record,
      id: record._id || record.id,
    }));
  }

  async getMyBorrowHistory(): Promise<BorrowRecord[]> {
    const response = await api.get("/borrow/history");
    return response.data.map((record: any) => ({
      ...record,
      id: record._id || record.id,
    }));
  }
}

// Export as default
export default new BorrowService();
