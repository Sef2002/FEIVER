import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex justify-between items-center bg-[#1b1b1b] rounded-[40px] px-8 py-4">
          <NavLink to="/" className="text-2xl font-heading text-white">
            <img src="/assets/logo.png" alt="Bato's Logo" className="h-12" />
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `nav-link ${isActive ? 'active' : ''} text-sm tracking-wider`
              }
            >
              HOME
            </NavLink>
            <NavLink 
              to="/servizi" 
              className={({isActive}) => 
                `nav-link ${isActive ? 'active' : ''} text-sm tracking-wider`
              }
            >
              SERVIZI
            </NavLink>
            <NavLink 
              to="/galleria" 
              className={({isActive}) => 
                `nav-link ${isActive ? 'active' : ''} text-sm tracking-wider`
              }
            >
              GALLERIA
            </NavLink>
            <NavLink 
              to="/contatti" 
              className={({isActive}) => 
                `nav-link ${isActive ? 'active' : ''} text-sm tracking-wider`
              }
            >
              CONTATTI
            </NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/shop" className="btn btn-outline text-sm">SHOP</NavLink>
            <a href="#" className="btn btn-primary text-sm">PRENOTA</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-95 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } pt-20`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-8">
          <NavLink 
            to="/" 
            className="text-xl font-heading text-white hover:text-gold transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            HOME
          </NavLink>
          <NavLink 
            to="/servizi" 
            className="text-xl font-heading text-white hover:text-gold transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            SERVIZI
          </NavLink>
          <NavLink 
            to="/galleria" 
            className="text-xl font-heading text-white hover:text-gold transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            GALLERIA
          </NavLink>
          <NavLink 
            to="/contatti" 
            className="text-xl font-heading text-white hover:text-gold transition-colors py-2"
            onClick={() => setIsOpen(false)}
          >
            CONTATTI
          </NavLink>
          <div className="flex flex-col space-y-4 pt-6">
            <NavLink to="/shop" className="btn btn-outline text-center" onClick={() => setIsOpen(false)}>SHOP</NavLink>
            <a href="#" className="btn btn-primary text-center" onClick={() => setIsOpen(false)}>PRENOTA</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;