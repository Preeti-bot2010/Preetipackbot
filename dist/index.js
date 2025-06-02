// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  customers = /* @__PURE__ */ new Map();
  products = /* @__PURE__ */ new Map();
  orders = /* @__PURE__ */ new Map();
  chatSessions = /* @__PURE__ */ new Map();
  businessSettings;
  currentCustomerId = 1;
  currentProductId = 1;
  currentChatSessionId = 1;
  currentOrderId = 1;
  constructor() {
    this.initializeDefaultData();
  }
  initializeDefaultData() {
    this.businessSettings = {
      id: 1,
      name: "SweetBox Premium",
      phone: "+91 98765 12345",
      address: "MG Road, Bangalore - 560001",
      email: "orders@sweetboxpremium.com",
      deliveryCharges: "50.00",
      minOrderAmount: "200.00",
      workingHours: {
        start: "09:00",
        end: "21:00",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      googleSheetsConfig: {
        spreadsheetId: process.env.GOOGLE_SHEETS_ID || "",
        apiKey: process.env.GOOGLE_SHEETS_API_KEY || "",
        worksheets: {
          customers: "Customers",
          orders: "Orders",
          products: "Products"
        }
      }
    };
    const sampleProducts = [
      {
        name: "Premium Chocolate Box",
        description: "Handcrafted premium chocolates made with finest Belgian cocoa. Perfect for gifting on special occasions.",
        category: "chocolate",
        basePrice: "599.00",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sizes: {
          small: { pieces: 12, price: 399 },
          medium: { pieces: 24, price: 599 },
          large: { pieces: 36, price: 899 }
        },
        laminations: {
          matte: { price: 30 },
          glossy: { price: 50 }
        },
        inStock: true,
        popularity: 95
      },
      {
        name: "Traditional Mithai Box",
        description: "Authentic Indian sweets including laddu, barfi, and gulab jamun made with pure ghee and traditional recipes.",
        category: "traditional",
        basePrice: "399.00",
        imageUrl: "https://images.unsplash.com/photo-1606471191009-d5d2593f9bb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sizes: {
          small: { pieces: 8, price: 299 },
          medium: { pieces: 16, price: 399 },
          large: { pieces: 24, price: 599 }
        },
        laminations: {
          matte: { price: 25 },
          glossy: { price: 40 }
        },
        inStock: true,
        popularity: 88
      },
      {
        name: "Mixed Candy Collection",
        description: "Colorful assorted candies and gummies in festive arrangement. Perfect for children's parties and celebrations.",
        category: "candy",
        basePrice: "249.00",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sizes: {
          small: { pieces: 20, price: 199 },
          medium: { pieces: 40, price: 249 },
          large: { pieces: 60, price: 349 }
        },
        laminations: {
          matte: { price: 20 },
          glossy: { price: 35 }
        },
        inStock: true,
        popularity: 72
      },
      {
        name: "Premium Dry Fruits Box",
        description: "Elegant selection of premium dry fruits and nuts including almonds, cashews, pistachios, and dates.",
        category: "dry-fruits",
        basePrice: "799.00",
        imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sizes: {
          small: { pieces: 250, price: 599 },
          medium: { pieces: 500, price: 799 },
          large: { pieces: 1e3, price: 1299 }
        },
        laminations: {
          matte: { price: 40 },
          glossy: { price: 60 }
        },
        inStock: true,
        popularity: 85
      },
      {
        name: "Festive Special Box",
        description: "Special festive collection combining chocolates, traditional sweets, and dry fruits for celebrations.",
        category: "festive",
        basePrice: "899.00",
        imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sizes: {
          small: { pieces: 20, price: 699 },
          medium: { pieces: 35, price: 899 },
          large: { pieces: 50, price: 1199 }
        },
        laminations: {
          matte: { price: 50 },
          glossy: { price: 75 }
        },
        inStock: true,
        popularity: 92
      },
      {
        name: "Corporate Gift Box",
        description: "Professional packaging with premium assortment suitable for corporate gifting and business occasions.",
        category: "corporate",
        basePrice: "1299.00",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sizes: {
          small: { pieces: 30, price: 999 },
          medium: { pieces: 50, price: 1299 },
          large: { pieces: 75, price: 1799 }
        },
        laminations: {
          matte: { price: 60 },
          glossy: { price: 80 }
        },
        inStock: true,
        popularity: 78
      },
      {
        name: "Wedding Collection Box",
        description: "Elegant wedding-themed sweet collection with traditional motifs and premium packaging for special occasions.",
        category: "wedding",
        basePrice: "1599.00",
        imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sizes: {
          small: { pieces: 40, price: 1199 },
          medium: { pieces: 60, price: 1599 },
          large: { pieces: 100, price: 2299 }
        },
        laminations: {
          matte: { price: 75 },
          glossy: { price: 100 }
        },
        inStock: true,
        popularity: 89
      },
      {
        name: "Kids Special Fun Box",
        description: "Colorful and fun collection designed specifically for children with cartoon-themed packaging and kid-friendly sweets.",
        category: "kids",
        basePrice: "349.00",
        imageUrl: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sizes: {
          small: { pieces: 15, price: 249 },
          medium: { pieces: 25, price: 349 },
          large: { pieces: 40, price: 499 }
        },
        laminations: {
          matte: { price: 25 },
          glossy: { price: 45 }
        },
        inStock: true,
        popularity: 76
      }
    ];
    sampleProducts.forEach((product) => {
      this.createProduct(product);
    });
  }
  async getCustomerByMobile(mobileNumber) {
    return Array.from(this.customers.values()).find((c) => c.mobileNumber === mobileNumber);
  }
  async createCustomer(customer) {
    const id = this.currentCustomerId++;
    const newCustomer = {
      ...customer,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      lastOrderAt: null
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }
  async updateCustomer(id, updates) {
    const customer = this.customers.get(id);
    if (!customer) return void 0;
    const updatedCustomer = { ...customer, ...updates };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }
  async getAllProducts() {
    return Array.from(this.products.values()).sort((a, b) => b.popularity - a.popularity);
  }
  async getProductById(id) {
    return this.products.get(id);
  }
  async getProductsByCategory(category) {
    return Array.from(this.products.values()).filter((p) => p.category === category);
  }
  async createProduct(product) {
    const id = this.currentProductId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  async updateProduct(id, updates) {
    const product = this.products.get(id);
    if (!product) return void 0;
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async createOrder(order) {
    const orderId = `SB${(/* @__PURE__ */ new Date()).getFullYear()}${String(this.currentOrderId++).padStart(3, "0")}`;
    const newOrder = {
      ...order,
      id: this.currentOrderId,
      orderId,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.orders.set(orderId, newOrder);
    const customer = this.customers.get(order.customerId);
    if (customer) {
      customer.lastOrderAt = /* @__PURE__ */ new Date();
      this.customers.set(customer.id, customer);
    }
    return newOrder;
  }
  async getOrdersByCustomer(customerId) {
    return Array.from(this.orders.values()).filter((o) => o.customerId === customerId);
  }
  async getOrderById(orderId) {
    return this.orders.get(orderId);
  }
  async updateOrderStatus(orderId, status) {
    const order = this.orders.get(orderId);
    if (!order) return void 0;
    order.status = status;
    this.orders.set(orderId, order);
    return order;
  }
  async getChatSession(sessionId) {
    return this.chatSessions.get(sessionId);
  }
  async createChatSession(session) {
    const id = this.currentChatSessionId++;
    const newSession = {
      ...session,
      id,
      lastActivity: /* @__PURE__ */ new Date()
    };
    this.chatSessions.set(session.sessionId, newSession);
    return newSession;
  }
  async updateChatSession(sessionId, updates) {
    const session = this.chatSessions.get(sessionId);
    if (!session) return void 0;
    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: /* @__PURE__ */ new Date()
    };
    this.chatSessions.set(sessionId, updatedSession);
    return updatedSession;
  }
  async getBusinessSettings() {
    return this.businessSettings;
  }
  async updateBusinessSettings(settings) {
    this.businessSettings = { ...this.businessSettings, ...settings };
    return this.businessSettings;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  address: text("address"),
  preferences: jsonb("preferences").$type(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastOrderAt: timestamp("last_order_at")
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull(),
  sizes: jsonb("sizes").$type().notNull(),
  laminations: jsonb("laminations").$type().notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  popularity: integer("popularity").default(0).notNull()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  items: jsonb("items").$type().notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryCharges: decimal("delivery_charges", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  estimatedDelivery: timestamp("estimated_delivery"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deliveryAddress: text("delivery_address"),
  notes: text("notes")
});
var chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  sessionId: text("session_id").notNull().unique(),
  messages: jsonb("messages").$type().notNull().default([]),
  currentContext: jsonb("current_context").$type(),
  lastActivity: timestamp("last_activity").defaultNow().notNull()
});
var businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  deliveryCharges: decimal("delivery_charges", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }).notNull(),
  workingHours: jsonb("working_hours").$type().notNull(),
  googleSheetsConfig: jsonb("google_sheets_config").$type()
});
var insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  lastOrderAt: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderId: true,
  createdAt: true
});
var insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  lastActivity: true
});
var insertBusinessSettingsSchema = createInsertSchema(businessSettings).omit({
  id: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const existing = await storage.getCustomerByMobile(customerData.mobileNumber);
      if (existing) {
        return res.json(existing);
      }
      const customer = await storage.createCustomer(customerData);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });
  app2.get("/api/customers/mobile/:mobileNumber", async (req, res) => {
    try {
      const customer = await storage.getCustomerByMobile(req.params.mobileNumber);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products2;
      if (category) {
        products2 = await storage.getProductsByCategory(category);
      } else {
        products2 = await storage.getAllProducts();
      }
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });
  app2.get("/api/orders/customer/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders2 = await storage.getOrdersByCustomer(customerId);
      res.json(orders2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:orderId", async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  app2.patch("/api/orders/:orderId/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.orderId, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });
  app2.get("/api/chat/session/:sessionId", async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Chat session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat session" });
    }
  });
  app2.post("/api/chat/session", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });
  app2.patch("/api/chat/session/:sessionId", async (req, res) => {
    try {
      const updates = req.body;
      const session = await storage.updateChatSession(req.params.sessionId, updates);
      if (!session) {
        return res.status(404).json({ error: "Chat session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to update chat session" });
    }
  });
  app2.get("/api/business", async (req, res) => {
    try {
      const settings = await storage.getBusinessSettings();
      if (!settings) {
        return res.status(404).json({ error: "Business settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch business settings" });
    }
  });
  app2.post("/api/calculate-price", async (req, res) => {
    try {
      const { productId, size, lamination, quantity } = req.body;
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const sizeData = product.sizes[size];
      const laminationData = product.laminations[lamination];
      if (!sizeData || !laminationData) {
        return res.status(400).json({ error: "Invalid size or lamination option" });
      }
      const unitPrice = sizeData.price + laminationData.price;
      const subtotal = unitPrice * quantity;
      const businessSettings2 = await storage.getBusinessSettings();
      const deliveryCharges = parseFloat(businessSettings2?.deliveryCharges || "50");
      const total = subtotal + deliveryCharges;
      res.json({
        unitPrice,
        subtotal,
        deliveryCharges,
        total,
        breakdown: {
          basePrice: sizeData.price,
          laminationPrice: laminationData.price,
          quantity
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate price" });
    }
  });
  app2.post("/api/sync-google-sheets", async (req, res) => {
    try {
      const { type, data } = req.body;
      res.json({
        success: true,
        message: `${type} data synced to Google Sheets`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync with Google Sheets" });
    }
  });
  app2.post("/api/chat/response", async (req, res) => {
    try {
      const { message, sessionId, customerId } = req.body;
      const responses = [
        "I'd be happy to help you with your sweet box selection! \u{1F36D}",
        "Let me show you our most popular products. Which category interests you most?",
        "Would you like to see our premium chocolate collection or traditional mithai boxes?",
        "I can help you customize your order with different sizes and lamination options.",
        "Would you like me to calculate the total price for your order?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      res.json({
        response: randomResponse,
        suggestions: [
          "View Products",
          "Check Orders",
          "Contact Support",
          "Custom Box"
        ]
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate response" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
