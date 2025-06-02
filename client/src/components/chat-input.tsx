import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  disabled?: boolean;
  quickActions?: string[];
}

export function ChatInput({ 
  onSendMessage, 
  onQuickAction, 
  disabled = false,
  quickActions = ["📚 View Catalog", "📦 My Orders", "✨ Custom Box", "💬 Support"]
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              className="w-full bg-gray-100 border-0 rounded-full px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 bg-gray-100 border-0 rounded-full text-gray-600 hover:bg-gray-200"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              className="w-10 h-10 bg-pink-500 hover:bg-pink-600 rounded-full text-white shadow-lg"
              onClick={handleSend}
              disabled={!message.trim() || disabled}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-3 overflow-x-auto scrollbar-hide">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex-shrink-0 bg-pink-50 text-pink-500 border-pink-200 px-3 py-1 rounded-full text-xs font-medium hover:bg-pink-500 hover:text-white transition-colors"
              onClick={() => onQuickAction?.(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
