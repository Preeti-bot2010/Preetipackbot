import { forwardRef } from "react";
import { ChatMessage } from "@/types/chat";
import { ProductGallery } from "./product-gallery";
import { CustomizationWizard } from "./customization-wizard";
import { OrderSummary } from "./order-summary";
import { ContactCard } from "./contact-card";
import { Bot, User } from "lucide-react";
import { format } from "date-fns";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSelectProduct?: (product: any) => void;
  onUpdateCustomization?: (updates: any) => void;
  onCalculatePrice?: () => Promise<any>;
  onAddToCart?: () => void;
  onConfirmOrder?: () => void;
  onCall?: (phone: string) => void;
  onViewLocation?: (address: string) => void;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({
    messages,
    isTyping,
    onSelectProduct,
    onUpdateCustomization,
    onCalculatePrice,
    onAddToCart,
    onConfirmOrder,
    onCall,
    onViewLocation,
  }, ref) => {
    const formatTime = (timestamp: string) => {
      return format(new Date(timestamp), "p");
    };

    return (
      <div className="px-4 py-4 space-y-4 min-h-[calc(100vh-160px)]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 animate-in slide-in-from-bottom-2 duration-300 ${
              message.type === "user" ? "justify-end" : ""
            }`}
          >
            {message.type === "bot" && (
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-sm ${
                message.type === "user"
                  ? "bg-pink-500 text-white rounded-[18px_18px_4px_18px] ml-auto"
                  : "bg-gray-100 text-gray-800 rounded-[18px_18px_18px_4px]"
              } p-3`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {/* Product Gallery */}
              {message.metadata?.productGallery && (
                <ProductGallery
                  products={message.metadata.productGallery}
                  onSelectProduct={onSelectProduct}
                />
              )}

              {/* Customization Wizard */}
              {message.metadata?.customization && (
                <CustomizationWizard
                  product={message.metadata.customization.product}
                  selectedSize={message.metadata.customization.selectedSize}
                  selectedLamination={message.metadata.customization.selectedLamination}
                  quantity={message.metadata.customization.quantity}
                  onUpdateCustomization={onUpdateCustomization}
                  onCalculatePrice={onCalculatePrice}
                  onAddToCart={onAddToCart}
                />
              )}

              {/* Order Summary */}
              {message.metadata?.orderSummary && (
                <OrderSummary
                  product={message.metadata.orderSummary.product}
                  customization={message.metadata.orderSummary.customization}
                  pricing={message.metadata.orderSummary.pricing}
                  onConfirmOrder={onConfirmOrder}
                  onEdit={() => {}}
                />
              )}

              {/* Contact Card */}
              {message.metadata?.contact && (
                <ContactCard
                  businessSettings={message.metadata.contact}
                  onCall={onCall}
                  onViewLocation={onViewLocation}
                />
              )}

              <span className={`text-xs mt-2 block ${
                message.type === "user" ? "text-white/80" : "text-gray-500"
              }`}>
                {formatTime(message.timestamp)}
              </span>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-white w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-2 animate-in fade-in duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-white w-4 h-4" />
            </div>
            <div className="bg-gray-100 rounded-[18px_18px_18px_4px] p-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={ref} />
      </div>
    );
  }
);

ChatMessages.displayName = "ChatMessages";
