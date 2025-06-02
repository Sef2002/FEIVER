import { Product } from "@/shop/types/product";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover rounded"
        />
      )}
      <div className="mt-2">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="text-lg font-bold mt-1">€{product.price.toFixed(2)}</p>
        <button
          className="mt-2 px-4 py-2 bg-black text-white rounded hover:opacity-90 flex items-center gap-2"
          onClick={() => addToCart(product)}
        >
          <ShoppingCart size={16} />
          Aggiungi
        </button>
      </div>
    </div>
  );
}