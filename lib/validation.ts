import { z } from 'zod';

// User registration validation
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  masterPassword: z.string().min(8, 'Master password must be at least 8 characters'),
});

// User login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  masterPassword: z.string().min(1, 'Master password is required'),
});

// Password entry validation
export const passwordEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  username: z.string().max(100, 'Username too long'),
  password: z.string().min(1, 'Password is required'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().max(500, 'Notes too long').optional(),
  category: z.string().max(50, 'Category name too long').optional(),
});

// Category validation
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
});

// Password generator validation
export const passwordGeneratorSchema = z.object({
  length: z.number().min(4).max(128),
  includeUppercase: z.boolean(),
  includeLowercase: z.boolean(),
  includeNumbers: z.boolean(),
  includeSymbols: z.boolean(),
  excludeSimilar: z.boolean(),
});