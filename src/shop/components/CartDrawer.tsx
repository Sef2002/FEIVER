import React from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-200 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-heading font-bold text-black">Il tuo carrello</h2>
        <button onClick={onClose} className="text-black hover:text-gold transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-180px)]">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-primary">Il carrello è vuoto.</p>
            <p className="text-sm text-gray-400 font-primary mt-2">
              Aggiungi alcuni prodotti per iniziare!
            </p>
          </div>
        ) : (
          cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {product.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-20 h-20 object-cover rounded-lg shadow-sm" 
                />
              )}
              <div className="flex-1 space-y-2">
                <h3 className="font-heading font-semibold text-black text-sm leading-tight">
                  {product.name}
                </h3>
                {product.category && (
                  <span className="inline-block bg-white text-gray-600 px-2 py-1 rounded text-xs font-primary">
                    {product.category}
                  </span>
                )}
                <p className="text-gold font-heading font-bold">
                  €{(product.price * quantity).toFixed(2)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-black font-primary font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button
                    className="text-red-500 hover:text-red-600 transition-colors p-1"
                    onClick={() => removeFromCart(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-black font-heading font-semibold">Totale:</span>
            <span className="text-gold font-heading font-bold text-xl">€{cartTotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-gold text-black font-heading font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl">
            Procedi al Checkout
          </button>
          <p className="text-xs text-gray-500 text-center mt-2 font-primary">
            Spedizione gratuita per ordini superiori a €50
          </p>
        </div>
      )}
    </div>
  );
}