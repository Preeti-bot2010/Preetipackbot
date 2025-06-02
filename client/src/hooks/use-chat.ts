import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage, ChatContext, PriceCalculation } from "@/types/chat";
import { ChatAI } from "@/lib/chat-ai";
import { googleSheets } from "@/lib/google-sheets";

interface UseChatOptions {
  sessionId: string;
  customerId?: number;
}

export function useChat({ sessionId, customerId }: UseChatOptions) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [context, setContext] = useState<ChatContext>({
    step: "welcome",
    selectedProducts: [],
    customization: {},
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      type: "bot",
      content: ChatAI.generateWelcomeMessage(),
      timestamp: new Date().toISOString(),
    };

    const mobileRequestMessage: ChatMessage = {
      id: `mobile-${Date.now()}`,
      type: "bot",
      content: "Could you please share your mobile number so I can provide personalized service? 📱",
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage, mobileRequestMessage]);
  }, []);

  // Fetch chat session
  const { data: chatSession } = useQuery({
    queryKey: ["/api/chat/session", sessionId],
    enabled: !!sessionId,
  });

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  // Fetch business settings
  const { data: businessSettings } = useQuery({
    queryKey: ["/api/business"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat/response", {
        message,
        sessionId,
        customerId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Add bot response
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: "bot",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    },
  });

  // Calculate price mutation
  const calculatePriceMutation = useMutation({
    mutationFn: async (params: {
      productId: number;
      size: string;
      lamination: string;
      quantity: number;
    }) => {
      const response = await apiRequest("POST", "/api/calculate-price", params);
      return response.json();
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      // Sync to Google Sheets
      googleSheets.syncOrderData(order);
      
      // Show order confirmation
      const confirmationMessage: ChatMessage = {
        id: `order-${Date.now()}`,
        type: "bot",
        content: `🎉 Order confirmed! Your order ID is ${order.orderId}. Expected delivery: Tomorrow, 3-6 PM`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, confirmationMessage]);
      
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });

  // Send message function
  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Process message with AI
    const aiResult = ChatAI.processUserMessage(content, context);
    
    // Handle different intents
    if (aiResult.intent === "phone_number" && aiResult.entities.phone) {
      try {
        setIsTyping(true);
        
        // Check for existing customer
        const customer = await googleSheets.getCustomerData(aiResult.entities.phone);
        
        if (customer) {
          const recognitionMessage: ChatMessage = {
            id: `recognition-${Date.now()}`,
            type: "bot",
            content: ChatAI.generateCustomerRecognitionMessage(customer.name, "Premium Chocolate Box"),
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, recognitionMessage]);
          setContext(prev => ({ ...prev, customer, step: "products" }));
        } else {
          // New customer registration
          const registrationMessage: ChatMessage = {
            id: `registration-${Date.now()}`,
            type: "bot",
            content: "Welcome! I'd love to learn your name so I can provide better service. What should I call you?",
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, registrationMessage]);
          setContext(prev => ({ ...prev, step: "registration", customization: { ...prev.customization, phone: aiResult.entities.phone } }));
        }
        
        setIsTyping(false);
        return;
      } catch (error) {
        console.error("Error processing phone number:", error);
      }
    }

    if (aiResult.intent === "view_products") {
      showProductGallery();
      return;
    }

    // Default AI response
    setIsTyping(true);
    setTimeout(() => {
      sendMessageMutation.mutate(content);
    }, 1000);
  }, [context, sendMessageMutation]);

  // Show product gallery
  const showProductGallery = useCallback(() => {
    const productMessage: ChatMessage = {
      id: `products-${Date.now()}`,
      type: "bot",
      content: ChatAI.generateProductIntroMessage(),
      timestamp: new Date().toISOString(),
      metadata: {
        productGallery: products.slice(0, 4), // Show first 4 products
      },
    };
    setMessages(prev => [...prev, productMessage]);
    setContext(prev => ({ ...prev, step: "products" }));
  }, [products]);

  // Select product
  const selectProduct = useCallback((product: any) => {
    const customizationMessage: ChatMessage = {
      id: `customization-${Date.now()}`,
      type: "bot",
      content: ChatAI.generateCustomizationMessage(product.name),
      timestamp: new Date().toISOString(),
      metadata: {
        customization: {
          product,
          selectedSize: "medium",
          selectedLamination: "glossy",
          quantity: 1,
        },
      },
    };
    setMessages(prev => [...prev, customizationMessage]);
    setContext(prev => ({
      ...prev,
      step: "customization",
      customization: {
        productId: product.id,
        size: "medium",
        lamination: "glossy",
        quantity: 1,
      },
    }));
  }, []);

  // Update customization
  const updateCustomization = useCallback((updates: Partial<ChatContext["customization"]>) => {
    setContext(prev => ({
      ...prev,
      customization: { ...prev.customization, ...updates },
    }));
  }, []);

  // Calculate price
  const calculatePrice = useCallback(async () => {
    if (!context.customization.productId || !context.customization.size || !context.customization.lamination || !context.customization.quantity) {
      return null;
    }

    try {
      const result = await calculatePriceMutation.mutateAsync({
        productId: context.customization.productId,
        size: context.customization.size,
        lamination: context.customization.lamination,
        quantity: context.customization.quantity,
      });
      return result as PriceCalculation;
    } catch (error) {
      console.error("Error calculating price:", error);
      return null;
    }
  }, [context.customization, calculatePriceMutation]);

  // Add to cart
  const addToCart = useCallback(async () => {
    const price = await calculatePrice();
    if (!price || !context.customization.productId) return;

    const product = products.find(p => p.id === context.customization.productId);
    if (!product) return;

    const orderSummaryMessage: ChatMessage = {
      id: `order-summary-${Date.now()}`,
      type: "bot",
      content: ChatAI.generateOrderSummaryMessage(),
      timestamp: new Date().toISOString(),
      metadata: {
        orderSummary: {
          product,
          customization: context.customization,
          pricing: price,
        },
      },
    };

    setMessages(prev => [...prev, orderSummaryMessage]);
    setContext(prev => ({ ...prev, step: "order_summary", pendingOrder: { product, customization: context.customization, pricing: price } }));
  }, [context.customization, products, calculatePrice]);

  // Confirm order
  const confirmOrder = useCallback(async () => {
    if (!context.pendingOrder || !context.customer) return;

    const orderData = {
      customerId: context.customer.id,
      items: [{
        productId: context.pendingOrder.product.id,
        productName: context.pendingOrder.product.name,
        size: context.customization.size!,
        lamination: context.customization.lamination!,
        quantity: context.customization.quantity!,
        unitPrice: context.pendingOrder.pricing.unitPrice,
        totalPrice: context.pendingOrder.pricing.subtotal,
      }],
      subtotal: context.pendingOrder.pricing.subtotal.toString(),
      deliveryCharges: context.pendingOrder.pricing.deliveryCharges.toString(),
      total: context.pendingOrder.pricing.total.toString(),
      status: "confirmed",
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      deliveryAddress: context.customer.address || "",
    };

    createOrderMutation.mutate(orderData);
  }, [context, createOrderMutation]);

  // Show contact info
  const showContactInfo = useCallback(() => {
    const contactMessage: ChatMessage = {
      id: `contact-${Date.now()}`,
      type: "bot",
      content: ChatAI.generateContactMessage(),
      timestamp: new Date().toISOString(),
      metadata: {
        contact: businessSettings,
      },
    };
    setMessages(prev => [...prev, contactMessage]);
  }, [businessSettings]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return {
    messages,
    context,
    isTyping,
    products,
    businessSettings,
    messagesEndRef,
    sendMessage,
    selectProduct,
    updateCustomization,
    calculatePrice,
    addToCart,
    confirmOrder,
    showProductGallery,
    showContactInfo,
    isCalculatingPrice: calculatePriceMutation.isPending,
    isCreatingOrder: createOrderMutation.isPending,
  };
}
