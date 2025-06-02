import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Edit } from "lucide-react";

interface OrderSummaryProps {
  product: any;
  customization: any;
  pricing: any;
  onConfirmOrder?: () => void;
  onEdit?: () => void;
}

export function OrderSummary({
  product,
  customization,
  pricing,
  onConfirmOrder,
  onEdit,
}: OrderSummaryProps) {
  const generateOrderId = () => {
    return `SB${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  };

  const getEstimatedDelivery = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-IN', { 
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className="bg-white rounded-lg p-3 border border-pink-200 mt-3">
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-lg"
        />
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-800">{product.name}</p>
          <p className="text-xs text-gray-500">
            {customization.size?.charAt(0).toUpperCase() + customization.size?.slice(1)} ({product.sizes[customization.size]?.pieces}pc) • {customization.lamination?.charAt(0).toUpperCase() + customization.lamination?.slice(1)} Lamination
          </p>
          <p className="text-xs text-pink-500 font-semibold">
            Qty: {customization.quantity} • ₹{pricing.total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="border-t pt-2 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-mono text-xs">{generateOrderId()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated Delivery:</span>
          <span className="text-xs">{getEstimatedDelivery()}, 3-6 PM</span>
        </div>
      </div>

      <div className="flex space-x-2 mt-3">
        <Button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 rounded-lg transition-colors"
          onClick={onConfirmOrder}
        >
          <Check className="w-3 h-3 mr-1" />
          Confirm Order
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3 text-xs py-2 rounded-lg"
          onClick={onEdit}
        >
          <Edit className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}
