export class ChatAI {
  private static getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  static generateWelcomeMessage(): string {
    const welcomeMessages = [
      "Welcome to SweetBox! 🍭 I'm here to help you create the perfect sweet boxes for any occasion. Let's get started!",
      "Hello! 🎉 Welcome to SweetBox Premium. I can help you find the perfect sweet treats. What would you like today?",
      "Hi there! 🌟 Ready to explore our delicious collection of sweet boxes? I'm here to assist you!"
    ];
    return this.getRandomResponse(welcomeMessages);
  }

  static generateCustomerRecognitionMessage(customerName: string, lastOrder?: string): string {
    if (lastOrder) {
      return `Great to see you back, ${customerName}! 🎉 You last ordered our ${lastOrder}. Ready to explore more delicious options?`;
    }
    return `Welcome back, ${customerName}! 🎉 It's wonderful to see you again. What can I help you with today?`;
  }

  static generateProductIntroMessage(): string {
    return "Here are our popular sweet box varieties: 🍬";
  }

  static generateCustomizationMessage(productName: string): string {
    return `Excellent choice! Let's customize your ${productName}: ✨`;
  }

  static generateOrderSummaryMessage(): string {
    return "Perfect! Here's your order summary: 📋";
  }

  static generateContactMessage(): string {
    return "Need help or have questions? We're here for you! 💬";
  }

  static generateHelpMessage(): string {
    const helpMessages = [
      "I'm here to help! You can browse our products, place orders, check your order history, or contact our support team. What would you like to do?",
      "Let me assist you! I can show you our sweet box collection, help with customization, or answer any questions you might have.",
      "How can I help you today? I can guide you through our products, take your order, or provide support. Just let me know!"
    ];
    return this.getRandomResponse(helpMessages);
  }

  static generateErrorMessage(): string {
    const errorMessages = [
      "I'm sorry, I didn't quite understand that. Could you please try again or use one of the quick action buttons below?",
      "I'm having trouble processing your request. Please try rephrasing or use the suggested options.",
      "Sorry about that! Let me help you in a different way. You can use the quick actions below or try asking again."
    ];
    return this.getRandomResponse(errorMessages);
  }

  static getQuickActions(context: string): string[] {
    switch (context) {
      case "welcome":
        return ["📚 View Catalog", "📦 My Orders", "💬 Support"];
      case "products":
        return ["🍫 Chocolates", "🍯 Traditional", "🍬 Candy", "🥜 Dry Fruits"];
      case "customization":
        return ["📏 Change Size", "✨ Lamination", "🔢 Quantity", "💰 Calculate Price"];
      case "order":
        return ["✅ Confirm", "✏️ Edit", "💰 Check Price", "📞 Call Support"];
      default:
        return ["📚 View Catalog", "📦 My Orders", "✨ Custom Box", "💬 Support"];
    }
  }

  static processUserMessage(message: string, context: any): {
    intent: string;
    entities: any;
    response: string;
    actions: string[];
  } {
    const lowercaseMessage = message.toLowerCase();
    
    // Simple intent recognition
    if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
      return {
        intent: "greeting",
        entities: {},
        response: this.generateWelcomeMessage(),
        actions: this.getQuickActions("welcome")
      };
    }
    
    if (lowercaseMessage.includes("product") || lowercaseMessage.includes("catalog") || lowercaseMessage.includes("show")) {
      return {
        intent: "view_products",
        entities: {},
        response: this.generateProductIntroMessage(),
        actions: this.getQuickActions("products")
      };
    }
    
    if (lowercaseMessage.includes("order") && lowercaseMessage.includes("my")) {
      return {
        intent: "view_orders",
        entities: {},
        response: "Let me show you your recent orders. 📦",
        actions: ["📦 Recent Orders", "🔍 Search Orders", "📞 Support"]
      };
    }
    
    if (lowercaseMessage.includes("help") || lowercaseMessage.includes("support")) {
      return {
        intent: "help",
        entities: {},
        response: this.generateHelpMessage(),
        actions: this.getQuickActions("default")
      };
    }
    
    if (lowercaseMessage.includes("price") || lowercaseMessage.includes("cost")) {
      return {
        intent: "price_inquiry",
        entities: {},
        response: "I can help you calculate the price for any of our products. Which item are you interested in?",
        actions: ["💰 Calculate Price", "📚 View Products", "💬 Support"]
      };
    }
    
    // Phone number detection
    const phoneRegex = /(\+91|91)?[\s-]?[6-9]\d{9}/;
    if (phoneRegex.test(message)) {
      return {
        intent: "phone_number",
        entities: { phone: message.match(phoneRegex)?.[0] },
        response: "Thank you for providing your mobile number! Let me check if you're an existing customer.",
        actions: ["✅ Continue", "📚 View Products"]
      };
    }
    
    // Default response
    return {
      intent: "unknown",
      entities: {},
      response: this.generateErrorMessage(),
      actions: this.getQuickActions("default")
    };
  }
}
