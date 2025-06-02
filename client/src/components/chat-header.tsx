import { Phone, MoreVertical, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  businessName: string;
  phone?: string;
  onCall?: () => void;
  onMenu?: () => void;
}

export function ChatHeader({ businessName, phone, onCall, onMenu }: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
            <Gift className="text-pink-500 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">{businessName}</h1>
            <div className="flex items-center text-white/80 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Online now
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {phone && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white hover:bg-white/10"
              onClick={onCall}
            >
              <Phone className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/90 hover:text-white hover:bg-white/10"
            onClick={onMenu}
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
