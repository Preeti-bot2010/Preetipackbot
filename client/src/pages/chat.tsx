import { useChat } from "@/hooks/use-chat";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { ChatAI } from "@/lib/chat-ai";
import { nanoid } from "nanoid";

export default function ChatPage() {
  const sessionId = nanoid();
  
  const {
    messages,
    context,
    isTyping,
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
  } = useChat({ sessionId });

  const handleCall = (phone?: string) => {
    if (phone) {
      window.open(`tel:${phone}`, "_self");
    }
  };

  const handleViewLocation = (address?: string) => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://maps.google.com?q=${encodedAddress}`, "_blank");
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "📚 View Catalog":
        showProductGallery();
        break;
      case "📦 My Orders":
        sendMessage("Show my orders");
        break;
      case "✨ Custom Box":
        sendMessage("I want to create a custom box");
        break;
      case "💬 Support":
        showContactInfo();
        break;
      default:
        sendMessage(action.replace(/[📚📦✨💬]\s*/, ""));
    }
  };

  const quickActions = ChatAI.getQuickActions(context.step);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Sweet Pattern Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #F8BBD9 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #FFE5CC 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      <ChatHeader
        businessName={businessSettings?.name || "SweetBox Chat"}
        phone={businessSettings?.phone}
        onCall={() => handleCall(businessSettings?.phone)}
        onMenu={() => {}}
      />

      <main className="pt-20 pb-32">
        <div className="max-w-md mx-auto bg-white shadow-2xl min-h-[calc(100vh-128px)]">
          <ChatMessages
            ref={messagesEndRef}
            messages={messages}
            isTyping={isTyping}
            onSelectProduct={selectProduct}
            onUpdateCustomization={updateCustomization}
            onCalculatePrice={calculatePrice}
            onAddToCart={addToCart}
            onConfirmOrder={confirmOrder}
            onCall={handleCall}
            onViewLocation={handleViewLocation}
          />
        </div>
      </main>

      <ChatInput
        onSendMessage={sendMessage}
        onQuickAction={handleQuickAction}
        quickActions={quickActions}
      />
    </div>
  );
}
