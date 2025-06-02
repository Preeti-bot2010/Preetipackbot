import { apiRequest } from "./queryClient";

interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
  worksheets: {
    customers: string;
    orders: string;
    products: string;
  };
}

export class GoogleSheetsIntegration {
  private config: GoogleSheetsConfig | null = null;

  async initialize(): Promise<void> {
    try {
      const response = await apiRequest("GET", "/api/business");
      const businessSettings = await response.json();
      this.config = businessSettings.googleSheetsConfig;
    } catch (error) {
      console.error("Failed to initialize Google Sheets config:", error);
    }
  }

  async syncCustomerData(customerData: any): Promise<boolean> {
    if (!this.config) {
      await this.initialize();
    }

    try {
      const response = await apiRequest("POST", "/api/sync-google-sheets", {
        type: "customer",
        data: customerData,
        worksheet: this.config?.worksheets.customers
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Failed to sync customer data to Google Sheets:", error);
      return false;
    }
  }

  async syncOrderData(orderData: any): Promise<boolean> {
    if (!this.config) {
      await this.initialize();
    }

    try {
      const response = await apiRequest("POST", "/api/sync-google-sheets", {
        type: "order",
        data: orderData,
        worksheet: this.config?.worksheets.orders
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Failed to sync order data to Google Sheets:", error);
      return false;
    }
  }

  async syncProductData(productData: any): Promise<boolean> {
    if (!this.config) {
      await this.initialize();
    }

    try {
      const response = await apiRequest("POST", "/api/sync-google-sheets", {
        type: "product",
        data: productData,
        worksheet: this.config?.worksheets.products
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Failed to sync product data to Google Sheets:", error);
      return false;
    }
  }

  async getCustomerData(mobileNumber: string): Promise<any> {
    // This would fetch data from Google Sheets API
    // For now, we'll use our local API
    try {
      const response = await apiRequest("GET", `/api/customers/mobile/${mobileNumber}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      return null;
    }
  }
}

export const googleSheets = new GoogleSheetsIntegration();
