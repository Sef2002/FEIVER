import { Product } from "../types/product";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:border-gold transition-all duration-300">
      {product.image_url && (
        <div className="relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-heading font-bold text-black group-hover:text-gold transition-colors mb-2">
            {product.name}
          </h3>
          {product.category && (
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-primary font-medium">
              {product.category}
            </span>
          )}
        </div>
        
        {product.description && (
          <p className="text-gray-600 font-primary text-sm leading-relaxed line-clamp-3">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="text-2xl font-heading font-bold text-gold">
              €{product.price.toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 font-primary">
                Disponibile ({product.stock} pz)
              </span>
            ) : (
              <span className="text-xs text-red-500 font-primary">
                Esaurito
              </span>
            )}
          </div>
          
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className="flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-lg font-primary font-semibold transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Aggiungi</span>
          </button>
        </div>
      </div>
    </div>
  );
}