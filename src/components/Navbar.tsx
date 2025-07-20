import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../shop/context/CartContext';
import CartDrawer from '../shop/components/CartDrawer';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems } = useCart();

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('prenota-online');
    if (bookingSection) {
      bookingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false); // Close mobile menu if open
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-6'
      }`}>
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex justify-between items-center bg-white rounded-[40px] px-8 py-4 shadow-lg border border-gray-200">
            <NavLink to="/" className="flex items-center">
              <img 
                src="/assets/logo.png" 
                alt="Feivèr Logo" 
                className="h-10 w-auto"
              />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              <NavLink to="/" className={({ isActive }) => `nav-link-black ${isActive ? 'active' : ''} text-sm tracking-wider`}>HOME</NavLink>
              <button onClick={scrollToBooking} className="nav-link-black text-sm tracking-wider">SERVIZI</button>
              <NavLink to="/galleria" className={({ isActive }) => `nav-link-black ${isActive ? 'active' : ''} text-sm tracking-wider`}>GALLERIA</NavLink>
              <NavLink to="/contatti" className={({ isActive }) => `nav-link-black ${isActive ? 'active' : ''} text-sm tracking-wider`}>CONTATTI</NavLink>
            </div>

            {/* CTA Buttons + Cart */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/shop" className="btn btn-outline text-sm">SHOP</NavLink>
              <button onClick={scrollToBooking} className="btn btn-primary text-sm">PRENOTA</button>

              {/* Cart Icon */}
              <button
                className="relative text-black hover:text-gold transition-colors"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={24} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-black">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-white bg-opacity-95 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } pt-20`}>
          <div className="container mx-auto px-4 flex flex-col space-y-8">
            <NavLink
              to="/"
              className="text-xl font-heading text-black hover:text-gold transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              HOME
            </NavLink>
            <button
              onClick={scrollToBooking}
              className="text-xl font-heading text-black hover:text-gold transition-colors py-2 text-left"
            >
              SERVIZI
            </button>
            <NavLink
              to="/galleria"
              className="text-xl font-heading text-black hover:text-gold transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              GALLERIA
            </NavLink>
            <NavLink
              to="/contatti"
              className="text-xl font-heading text-black hover:text-gold transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              CONTATTI
            </NavLink>
            <div className="flex flex-col space-y-4 pt-6">
              <NavLink to="/shop" className="btn btn-outline text-center" onClick={() => setIsOpen(false)}>SHOP</NavLink>
              <button onClick={scrollToBooking} className="btn btn-primary text-center">PRENOTA</button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;