import { z } from "zod";

export const productSchema = z.object({
  brandId: z.string().min(1, "Brand is required"),
  category: z.enum(["SMARTPHONE", "POWER_BANK"]),
  model: z.string().min(1, "Model name is required").max(120),
  shortDesc: z.string().min(1, "Short description is required").max(160),
  fullDesc: z.string().min(1, "Full description is required"),
  ram: z.string().max(40).optional().or(z.literal("")),
  storage: z.string().max(40).optional().or(z.literal("")),
  color: z.string().max(60).optional().or(z.literal("")),
  specs: z.string().optional().or(z.literal("")),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  easyBuy: z.boolean().default(false),
  visible: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export const settingsSchema = z.object({
  businessName: z.string().min(1),
  ceoName: z.string().min(1),
  ceoPublicName: z.string().min(1),
  phone: z.string().min(7),
  whatsapp: z.string().min(7),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().or(z.literal("")),
  city: z.string().min(1),
  country: z.string().min(1),
  mapUrl: z.string().url().optional().or(z.literal("")),
  openingTime: z.string().min(1),
  closingTime: z.string().min(1),
  tiktokUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  shopVideoUrl: z.string().url().optional().or(z.literal("")),
  moniepointAccountNumber: z.string().optional().or(z.literal("")),
  moniepointAccountName: z.string().optional().or(z.literal("")),
  opayAccountNumber: z.string().optional().or(z.literal("")),
  opayAccountName: z.string().optional().or(z.literal("")),
  easyBuyDescription: z.string().optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
