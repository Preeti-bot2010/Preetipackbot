import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  address: text("address"),
  preferences: jsonb("preferences").$type<{
    favoriteProducts?: string[];
    allergies?: string[];
    preferredDeliveryTime?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastOrderAt: timestamp("last_order_at"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  sizes: jsonb("sizes").$type<{
    small: { pieces: number; price: number };
    medium: { pieces: number; price: number };
    large: { pieces: number; price: number };
  }>().notNull(),
  laminations: jsonb("laminations").$type<{
    matte: { price: number };
    glossy: { price: number };
  }>().notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  popularity: integer("popularity").default(0).notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  items: jsonb("items").$type<{
    productId: number;
    productName: string;
    size: string;
    lamination: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[]>().notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryCharges: decimal("delivery_charges", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  estimatedDelivery: timestamp("estimated_delivery"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  sessionId: text("session_id").notNull().unique(),
  messages: jsonb("messages").$type<{
    id: string;
    type: "user" | "bot";
    content: string;
    timestamp: string;
    metadata?: any;
  }[]>().notNull().default([]),
  currentContext: jsonb("current_context").$type<{
    step: string;
    selectedProducts?: any[];
    customization?: any;
    pendingOrder?: any;
  }>(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  deliveryCharges: decimal("delivery_charges", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }).notNull(),
  workingHours: jsonb("working_hours").$type<{
    start: string;
    end: string;
    days: string[];
  }>().notNull(),
  googleSheetsConfig: jsonb("google_sheets_config").$type<{
    spreadsheetId: string;
    apiKey: string;
    worksheets: {
      customers: string;
      orders: string;
      products: string;
    };
  }>(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  lastOrderAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderId: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  lastActivity: true,
});

export const insertBusinessSettingsSchema = createInsertSchema(businessSettings).omit({
  id: true,
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;

export type BusinessSettings = typeof businessSettings.$inferSelect;
export type InsertBusinessSettings = z.infer<typeof insertBusinessSettingsSchema>;
