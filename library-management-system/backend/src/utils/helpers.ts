import { UserRole } from '../types';

export const generateMembershipId = (): string => {
  const prefix = 'MEM';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateISBN = (isbn: string): boolean => {
  // Basic ISBN validation (can be enhanced for ISBN-10/ISBN-13)
  const isbnRegex = /^(?:\d{9}[\dXx]|\d{13})$/;
  return isbnRegex.test(isbn.replace(/[-]/g, ''));
};

export const calculateDueDate = (days: number = 14): Date => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
};

export const isOverdue = (dueDate: Date): boolean => {
  return new Date() > dueDate;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const hasPermission = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};
