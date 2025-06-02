import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductGalleryProps {
  products: any[];
  onSelectProduct?: (product: any) => void;
}

export function ProductGallery({ products, onSelectProduct }: ProductGalleryProps) {
  return (
    <div className="mt-3">
      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className="bg-white rounded-lg p-2 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            onClick={() => onSelectProduct?.(product)}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-20 object-cover rounded-md"
            />
            <p className="text-xs font-medium text-gray-800 mt-1 line-clamp-1">
              {product.name}
            </p>
            <p className="text-xs text-pink-500 font-semibold">
              ₹{product.basePrice}
            </p>
          </Card>
        ))}
      </div>

      <Button
        className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs py-2 rounded-lg transition-colors"
        onClick={() => {/* Show all products */}}
      >
        View All Products (24+)
        <span className="ml-1">→</span>
      </Button>
    </div>
  );
}
