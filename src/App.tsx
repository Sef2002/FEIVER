import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner'; // ✅ IMPORTED

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ShopPage from './shop/pages/ShopPage';

import SelectService from './booking/SelectService';
import SelectBarber from './booking/SelectBarber';
import SelectTimeSlot from './booking/SelectTimeSlot';
import BookingSuccess from './booking/BookingSuccess';

import { CartProvider } from './shop/context/CartContext'; // ✅ IMPORTED

function App() {
  return (
    <CartProvider> {/* ✅ WRAPS the entire app with cart logic */}
      <Router>
        <div className="font-primary bg-black text-white min-h-screen">
          <Navbar />
          <Routes>
            {/* Website pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/servizi" element={<ServicesPage />} />
            <Route path="/galleria" element={<GalleryPage />} />
            <Route path="/shop" element={<ShopPage />} />

            {/* Booking flow */}
            <Route path="/prenota/servizio" element={<SelectService />} />
            <Route path="/prenota/barbiere" element={<SelectBarber />} />
            <Route path="/prenota/orario" element={<SelectTimeSlot />} />
            <Route path="/prenota/successo" element={<BookingSuccess />} />
          </Routes>
          <Footer />
          <CookieBanner /> {/* ✅ ADDED */}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;