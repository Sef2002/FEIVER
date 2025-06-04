// src/shop/checkout/Checkout.tsx

import React, { useState } from 'react';
import { useCart } from '@/shop/context/CartContext';

const Checkout: React.FC = () => {
  const { cartItems, totalPrice } = useCart();
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // This is where you’ll later create the Stripe session
    console.log('Checkout with:', customer);
    console.log('Cart:', cartItems);
  };

  return (
    <div className="container mx-auto py-20 px-4 grid md:grid-cols-2 gap-12">
      {/* Customer Info */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">I tuoi dati</h2>
        <input
          type="text"
          name="name"
          placeholder="Nome e Cognome"
          value={customer.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-700 bg-black text-white rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={customer.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-700 bg-black text-white rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefono"
          value={customer.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-700 bg-black text-white rounded"
        />
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Riepilogo Ordine</h2>
        <ul className="divide-y divide-gray-700">
          {cartItems.map(item => (
            <li key={item.id} className="py-4 flex justify-between">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">Quantità: {item.quantity}</p>
              </div>
              <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
        <div className="text-right text-xl font-bold">
          Totale: €{totalPrice.toFixed(2)}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-gold text-black py-3 rounded font-bold hover:opacity-90"
        >
          Procedi al Pagamento
        </button>
      </div>
    </div>
  );
};

export default Checkout;