import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface CustomizationWizardProps {
  product: any;
  selectedSize: string;
  selectedLamination: string;
  quantity: number;
  onUpdateCustomization?: (updates: any) => void;
  onCalculatePrice?: () => Promise<any>;
  onAddToCart?: () => void;
}

export function CustomizationWizard({
  product,
  selectedSize,
  selectedLamination,
  quantity,
  onUpdateCustomization,
  onCalculatePrice,
  onAddToCart,
}: CustomizationWizardProps) {
  const [size, setSize] = useState(selectedSize);
  const [lamination, setLamination] = useState(selectedLamination);
  const [qty, setQty] = useState(quantity);
  const [pricing, setPricing] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Update parent when local state changes
  useEffect(() => {
    onUpdateCustomization?.({
      size,
      lamination,
      quantity: qty,
    });
  }, [size, lamination, qty, onUpdateCustomization]);

  // Calculate price when customization changes
  useEffect(() => {
    const calculatePrice = async () => {
      if (!onCalculatePrice) return;
      
      setIsCalculating(true);
      try {
        const result = await onCalculatePrice();
        setPricing(result);
      } catch (error) {
        console.error("Error calculating price:", error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculatePrice();
  }, [size, lamination, qty, onCalculatePrice]);

  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
  };

  const handleLaminationChange = (newLamination: string) => {
    setLamination(newLamination);
  };

  const handleQuantityChange = (change: number) => {
    const newQty = Math.max(1, qty + change);
    setQty(newQty);
  };

  return (
    <Card className="bg-white rounded-lg p-3 mt-3 space-y-3">
      {/* Size Selection */}
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">
          Box Size:
        </label>
        <div className="flex space-x-1">
          {Object.entries(product.sizes).map(([sizeKey, sizeData]: [string, any]) => (
            <Button
              key={sizeKey}
              variant={size === sizeKey ? "default" : "outline"}
              size="sm"
              className={`flex-1 text-xs py-1 px-2 ${
                size === sizeKey
                  ? "bg-pink-500 text-white"
                  : "bg-pink-50 text-pink-500 border-pink-200 hover:bg-pink-100"
              }`}
              onClick={() => handleSizeChange(sizeKey)}
            >
              {sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1)} ({sizeData.pieces}pc)
            </Button>
          ))}
        </div>
      </div>

      {/* Lamination Selection */}
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">
          Lamination:
        </label>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(product.laminations).map(([laminationType, laminationData]: [string, any]) => (
            <div
              key={laminationType}
              className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
                lamination === laminationType
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleLaminationChange(laminationType)}
            >
              <div className="w-full h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded mb-1"></div>
              <p className={`text-xs text-center font-medium ${
                lamination === laminationType ? "text-pink-500" : "text-gray-600"
              }`}>
                {laminationType.charAt(0).toUpperCase() + laminationType.slice(1)} (+₹{laminationData.price})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">
          Quantity:
        </label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 rounded-full"
            onClick={() => handleQuantityChange(-1)}
            disabled={qty <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-[3rem] text-center">
            {qty}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 rounded-full bg-pink-500 border-pink-500 text-white hover:bg-pink-600"
            onClick={() => handleQuantityChange(1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-green-50 rounded-lg p-2">
        {isCalculating ? (
          <div className="text-center text-sm text-gray-500">Calculating...</div>
        ) : pricing ? (
          <>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-800">₹{pricing.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Delivery:</span>
              <span>₹{pricing.deliveryCharges}</span>
            </div>
            <hr className="my-1" />
            <div className="flex justify-between items-center font-semibold text-pink-500">
              <span>Total:</span>
              <span>₹{pricing.total.toLocaleString()}</span>
            </div>
          </>
        ) : (
          <div className="text-center text-sm text-gray-500">Select options to see price</div>
        )}
      </div>

      {/* Add to Cart Button */}
      <Button
        className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg transition-colors"
        onClick={onAddToCart}
        disabled={!pricing || isCalculating}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Add to Order
      </Button>
    </Card>
  );
}
