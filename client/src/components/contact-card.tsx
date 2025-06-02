import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MapPin } from "lucide-react";

interface ContactCardProps {
  businessSettings: any;
  onCall?: (phone: string) => void;
  onViewLocation?: (address: string) => void;
}

export function ContactCard({ businessSettings, onCall, onViewLocation }: ContactCardProps) {
  if (!businessSettings) return null;

  return (
    <div className="space-y-2 mt-3">
      <Button
        variant="outline"
        className="w-full bg-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
        onClick={() => onCall?.(businessSettings.phone)}
      >
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Phone className="text-white w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Call Now</p>
          <p className="text-xs text-gray-500">{businessSettings.phone}</p>
        </div>
      </Button>

      <Button
        variant="outline"
        className="w-full bg-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
        onClick={() => onViewLocation?.(businessSettings.address)}
      >
        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="text-white w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Visit Store</p>
          <p className="text-xs text-gray-500">{businessSettings.address}</p>
        </div>
      </Button>
    </div>
  );
}
