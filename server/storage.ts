import { 
  customers, products, orders, chatSessions, businessSettings,
  type Customer, type InsertCustomer,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type ChatSession, type InsertChatSession,
  type BusinessSettings, type InsertBusinessSettings
} from "@shared/schema";

export interface IStorage {
  // Customer operations
  getCustomerByMobile(mobileNumber: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer | undefined>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByCustomer(customerId: number): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | undefined>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | undefined>;
  
  // Chat session operations
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(sessionId: string, updates: Partial<InsertChatSession>): Promise<ChatSession | undefined>;
  
  // Business settings
  getBusinessSettings(): Promise<BusinessSettings | undefined>;
  updateBusinessSettings(settings: InsertBusinessSettings): Promise<BusinessSettings>;
}

export class MemStorage implements IStorage {
  private customers: Map<number, Customer> = new Map();
  private products: Map<number, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private businessSettings: BusinessSettings | undefined;
  private currentCustomerId = 1;
  private currentProductId = 1;
  private currentChatSessionId = 1;
  private currentOrderId = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize business settings
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

    // Initialize sample products
    const sampleProducts: InsertProduct[] = [
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
          large: { pieces: 1000, price: 1299 }
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

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  async getCustomerByMobile(mobileNumber: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(c => c.mobileNumber === mobileNumber);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.currentCustomerId++;
    const newCustomer: Customer = {
      ...customer,
      id,
      createdAt: new Date(),
      lastOrderAt: null,
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...updates };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => b.popularity - a.popularity);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const orderId = `SB${new Date().getFullYear()}${String(this.currentOrderId++).padStart(3, '0')}`;
    const newOrder: Order = {
      ...order,
      id: this.currentOrderId,
      orderId,
      createdAt: new Date(),
    };
    this.orders.set(orderId, newOrder);
    
    // Update customer's last order time
    const customer = this.customers.get(order.customerId);
    if (customer) {
      customer.lastOrderAt = new Date();
      this.customers.set(customer.id, customer);
    }
    
    return newOrder;
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.customerId === customerId);
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    return this.orders.get(orderId);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    
    order.status = status;
    this.orders.set(orderId, order);
    return order;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const id = this.currentChatSessionId++;
    const newSession: ChatSession = {
      ...session,
      id,
      lastActivity: new Date(),
    };
    this.chatSessions.set(session.sessionId, newSession);
    return newSession;
  }

  async updateChatSession(sessionId: string, updates: Partial<InsertChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { 
      ...session, 
      ...updates, 
      lastActivity: new Date() 
    };
    this.chatSessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async getBusinessSettings(): Promise<BusinessSettings | undefined> {
    return this.businessSettings;
  }

  async updateBusinessSettings(settings: InsertBusinessSettings): Promise<BusinessSettings> {
    this.businessSettings = { ...this.businessSettings!, ...settings };
    return this.businessSettings;
  }
}

export const storage = new MemStorage();
