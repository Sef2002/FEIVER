import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-heading mb-4 text-white">SEVENTYFOUR PARRUCCHIERI</h4>
            <p className="text-gray-400 mb-6">
              Nel vibrante quartiere tra Città Studi e Lambrate, Pietro e il suo team offrono servizi innovativi e creativi in un ambiente luminoso ed elegante.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 border border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-heading mb-4 text-white">ORARI</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Lunedì</span>
                <span>10:00 - 19:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Martedì</span>
                <span>10:00 - 19:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Mercoledì</span>
                <span>10:00 - 19:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Giovedì</span>
                <span>10:00 - 19:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Venerdì</span>
                <span>10:00 - 19:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Sabato</span>
                <span>09:00 - 18:00</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Domenica</span>
                <span>Chiuso</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-heading mb-4 text-white">CONTATTI</h4>
            <div className="space-y-4 text-gray-400">
              <p className="flex items-start gap-3">
                <MapPin className="text-gold mt-1 flex-shrink-0" size={18} />
                <span>
                  <span className="text-gold block mb-1">Indirizzo</span>
                  Via Giuseppe Bardelli, 12<br />
                  20131 Milano MI<br />
                  <span className="text-sm text-gray-500">A 1 minuto dalla stazione Lambrate</span>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-gold flex-shrink-0" size={18} />
                <span>
                  <span className="text-gold block mb-1">Telefono</span>
                  <a href="tel:0297383541" className="hover:text-gold transition-colors">02 9738 3541</a>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="text-gold flex-shrink-0" size={18} />
                <span>
                  <span className="text-gold block mb-1">Email</span>
                  <a href="mailto:info@seventyfourparrucchieri.it" className="hover:text-gold transition-colors">info@seventyfourparrucchieri.it</a>
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Seventyfour Parrucchieri. Tutti i diritti riservati.</p>
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