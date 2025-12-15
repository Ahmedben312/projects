// /backend/src/repositories/BaseRepository.ts
import mongoose, { Document, Model } from 'mongoose';
import { FilterOptions, PaginatedResult } from '../types';

export class BaseRepository<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: any): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async findAll(filter: any = {}): Promise<T[]> {
    return await this.model.find(filter);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter: any = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async paginate(
    filter: any = {},
    options: FilterOptions = {}
  ): Promise<PaginatedResult<T>> {
    const { sort, limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;

    const total = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = await this.model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return await this.model.aggregate(pipeline);
  }
}