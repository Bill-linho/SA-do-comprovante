import { z } from 'zod';
export const registerSchema = z.object({ body: z.object({
  name: z.string().trim().min(3).max(120),
  cpf: z.string().regex(/^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/, 'CPF inválido.'),
  phone: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(72)
}) });
export const loginSchema = z.object({ body: z.object({
  email: z.string().email(), password: z.string().min(1)
}) });
export const productSchema = z.object({ body: z.object({
  name: z.string().min(2).max(120), description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')), price: z.coerce.number().positive(),
  categoryId: z.coerce.number().int().positive(), available: z.boolean().optional()
}) });
export const reservationSchema = z.object({ body: z.object({
  dateTime: z.string().datetime(), people: z.coerce.number().int().min(1).max(30),
  tableId: z.coerce.number().int().positive().optional(), notes: z.string().max(500).optional()
}) });
export const orderSchema = z.object({ body: z.object({
  tableId: z.coerce.number().int().positive(), notes: z.string().max(500).optional(),
  items: z.array(z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().int().min(1).max(50), notes: z.string().max(300).optional() })).min(1)
}) });
