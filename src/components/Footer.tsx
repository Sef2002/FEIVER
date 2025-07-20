import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-heading mb-4 text-black">FEIVÈR PARRUCCHIERI</h4>
            <p className="text-gray-600 mb-6">
              Nel cuore di Treviglio, Alket e il suo team offrono servizi innovativi e creativi in un ambiente luminoso ed elegante.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/p/Feiv%C3%A8r-100075951261999/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/feiver_barber/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-heading mb-4 text-black">ORARI</h4>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Domenica</span>
                <span>Chiuso</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Lunedì</span>
                <span>Chiuso</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Martedì</span>
                <span>09:00 - 20:30</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Mercoledì</span>
                <span>09:00 - 20:30</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Giovedì</span>
                <span>09:00 - 20:30</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>Venerdì</span>
                <span>09:00 - 20:30</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Sabato</span>
                <span>09:00 - 20:00</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-heading mb-4 text-black">CONTATTI</h4>
            <div className="space-y-4 text-gray-600">
              <p className="flex items-start gap-3">
                <MapPin className="text-gold mt-1 flex-shrink-0" size={18} />
                <span>
                  <span className="text-gold block mb-1">Indirizzo</span>
                  Via G. Mazzini, 11<br />
                  24047 Treviglio BG<br />
                  <span className="text-sm text-gray-500">A 5 minuti dalla stazione centrale di Treviglio</span>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-gold flex-shrink-0" size={18} />
                <span>
                  <span className="text-gold block mb-1">Telefono</span>
                  <a href="tel:3427575655" className="hover:text-gold transition-colors">342 757 5655</a>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="text-gold flex-shrink-0" size={18} />
                <span>
                  <span className="text-gold block mb-1">Email</span>
                  <a href="mailto:info@feiver.it" className="hover:text-gold transition-colors">info@feiver.it</a>
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Feivèr Parrucchieri. Tutti i diritti riservati.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="hover:text-gold transition-colors mr-6">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Termini di Servizio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;