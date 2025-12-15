import { BaseRepository } from "../repositories/BaseRepository";
import User, { IUserDocument } from "../models/User";
import {
  IUser,
  UserCreateInput,
  UserUpdateInput,
  FilterOptions,
  PaginatedResult,
  UserRole,
} from "../types";

export class UserService {
  private userRepository: BaseRepository<IUserDocument>;

  constructor() {
    this.userRepository = new BaseRepository<IUserDocument>(User);
  }

  async createUser(userData: UserCreateInput): Promise<IUser> {
    const existingUser = await this.userRepository.findOne({
      $or: [{ email: userData.email }, { membershipId: userData.membershipId }],
    });

    if (existingUser) {
      throw new Error("User with this email or membership ID already exists");
    }

    return this.userRepository.create(userData);
  }

  async getUsers(
    filterOptions: FilterOptions = {}
  ): Promise<PaginatedResult<IUser>> {
    return this.userRepository.paginate({}, filterOptions);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findOne({ email });
  }

  async updateUser(
    id: string,
    updateData: UserUpdateInput
  ): Promise<IUser | null> {
    return this.userRepository.update(id, updateData as Partial<IUserDocument>);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return this.userRepository.delete(id);
  }

  async addBorrowedBook(userId: string, bookId: string): Promise<IUser | null> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedBorrowedBooks = [...user.borrowedBooks, bookId];
    return this.updateUser(userId, { borrowedBooks: updatedBorrowedBooks });
  }

  async removeBorrowedBook(
    userId: string,
    bookId: string
  ): Promise<IUser | null> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");

    const updatedBorrowedBooks = user.borrowedBooks.filter(
      (id) => id !== bookId
    );
    return this.updateUser(userId, { borrowedBooks: updatedBorrowedBooks });
  }

  async changeUserRole(userId: string, role: UserRole): Promise<IUser | null> {
    return this.updateUser(userId, { role });
  }
}