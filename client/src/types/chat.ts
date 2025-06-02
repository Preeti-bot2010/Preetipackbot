export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: string;
  metadata?: {
    productGallery?: any[];
    customization?: any;
    orderSummary?: any;
    contact?: any;
  };
}

export interface ChatContext {
  step: string;
  selectedProducts: any[];
  customization: {
    productId?: number;
    size?: string;
    lamination?: string;
    quantity?: number;
  };
  pendingOrder?: any;
  customer?: any;
}

export interface PriceCalculation {
  unitPrice: number;
  subtotal: number;
  deliveryCharges: number;
  total: number;
  breakdown: {
    basePrice: number;
    laminationPrice: number;
    quantity: number;
  };
}
