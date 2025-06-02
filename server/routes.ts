import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertOrderSchema, insertChatSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Customer routes
  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      
      // Check if customer already exists
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

  app.get("/api/customers/mobile/:mobileNumber", async (req, res) => {
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

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
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

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.get("/api/orders/customer/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders = await storage.getOrdersByCustomer(customerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:orderId", async (req, res) => {
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

  app.patch("/api/orders/:orderId/status", async (req, res) => {
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

  // Chat session routes
  app.get("/api/chat/session/:sessionId", async (req, res) => {
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

  app.post("/api/chat/session", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.patch("/api/chat/session/:sessionId", async (req, res) => {
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

  // Business settings routes
  app.get("/api/business", async (req, res) => {
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

  // Price calculation endpoint
  app.post("/api/calculate-price", async (req, res) => {
    try {
      const { productId, size, lamination, quantity } = req.body;
      
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const sizeData = product.sizes[size as keyof typeof product.sizes];
      const laminationData = product.laminations[lamination as keyof typeof product.laminations];
      
      if (!sizeData || !laminationData) {
        return res.status(400).json({ error: "Invalid size or lamination option" });
      }
      
      const unitPrice = sizeData.price + laminationData.price;
      const subtotal = unitPrice * quantity;
      
      const businessSettings = await storage.getBusinessSettings();
      const deliveryCharges = parseFloat(businessSettings?.deliveryCharges || "50");
      
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

  // Google Sheets integration endpoint
  app.post("/api/sync-google-sheets", async (req, res) => {
    try {
      const { type, data } = req.body;
      
      // This would integrate with Google Sheets API
      // For now, just return success
      res.json({ 
        success: true, 
        message: `${type} data synced to Google Sheets`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync with Google Sheets" });
    }
  });

  // AI Chat response endpoint
  app.post("/api/chat/response", async (req, res) => {
    try {
      const { message, sessionId, customerId } = req.body;
      
      // This would integrate with AI/NLP service
      // For now, return a simple response
      const responses = [
        "I'd be happy to help you with your sweet box selection! 🍭",
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

  const httpServer = createServer(app);
  return httpServer;
}
