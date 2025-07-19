import React, { useEffect } from 'react';
import { ArrowRight, MapPin, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        if (isVisible) {
          el.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Load Treatwell widget script
    const script = document.createElement('script');
    script.src = 'https://widget.treatwell.com/js/widget-loader.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up script
      const existingScript = document.querySelector('script[src="https://widget.treatwell.com/js/widget-loader.min.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <main>
      {/* Hero Section - UNCHANGED */}
      <section className="h-screen relative flex items-center">
        <div className="absolute inset-0 bg-black">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-50"
            style={{ backgroundImage: "url('/assets/background.png')" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold mb-4 fade-in" style={{ '--delay': '100ms' } as React.CSSProperties}>
              FEIVER<br />
              <span className="text-gold">PARRUCCHIERI</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 max-w-2xl fade-in" style={{ '--delay': '200ms' } as React.CSSProperties}>
              Innovazione e creatività nel cuore di Milano. Alket e il suo team ti offrono un'esperienza unica con i migliori prodotti e le tecniche più avanzate.
            </p>
            <div className="flex items-center gap-6 mb-8 fade-in" style={{ '--delay': '250ms' } as React.CSSProperties}>
              <div className="flex items-center gap-2 text-gold">
                <MapPin size={18} />
                <span className="text-sm">Via G. Mazzini, 11, 24047 Treviglio BG</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <Clock size={18} />
                <span className="text-sm">5 min dalla stazione centrale di Treviglio</span>
              </div>
            </div>
            <div className="w-20 h-[1px] bg-gold mb-8"></div>
            <div className="flex flex-wrap gap-4 fade-in" style={{ '--delay': '300ms' } as React.CSSProperties}>
              <Link to="/prenota/servizio" className="btn btn-primary">PRENOTA ORA</Link>
              <Link to="/servizi" className="btn btn-outline">SCOPRI I SERVIZI</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - UPDATED TO WHITE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <div className="text-center md:text-left mb-8">
                <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">
                  Chi Siamo
                </h5>
                <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-black">
                  LA NOSTRA STORIA
                </h2>
                <div className="w-20 h-[2px] bg-gold mx-auto md:mx-0"></div>
              </div>
              
              <div className="space-y-6 text-gray-600 font-primary leading-relaxed">
                <p>
                  Nel 2021, Feivèr apre il suo primo salone nel cuore di Treviglio (BG), precisamente in Via San Martino, una delle vie più frequentate e conosciute dai cittadini. È una vera e propria boutique del capello che prende forma dalla passione e dalla dedizione dei suoi titolari.
                </p>
                <p>
                  Dopo tre anni di attività, Alket riceve un'interessante proposta d'acquisto e, con grande coraggio, apre il salone in Via Giuseppe Mazzini 11, sempre nella città di Treviglio. Qui, Alket continua a portare avanti la sua passione per i tagli e barba, offrendo ai clienti un'esperienza unica e prodotti di qualità.
                </p>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Award className="text-gold flex-shrink-0" size={20} />
                  <span className="text-sm text-gray-700 font-primary font-medium">Prodotti Nashi, Redken, Wella</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Award className="text-gold flex-shrink-0" size={20} />
                  <span className="text-sm text-gray-700 font-primary font-medium">Sistema Nano Hairdreams</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 fade-in">
              <div className="space-y-4">
                <img 
                  src="/assets/story1.png" 
                  alt="Feiver Parrucchieri - Ambiente elegante" 
                  className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
                />
                <img 
                  src="/assets/story2.png" 
                  alt="Prodotti professionali" 
                  className="w-full h-48 sm:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="/assets/story3.png" 
                  alt="Alket al lavoro" 
                  className="w-full h-60 sm:h-80 object-cover rounded-lg shadow-md"
                />
                <img 
                  src="/assets/story4.png" 
                  alt="Dettaglio servizio" 
                  className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatwell Embed */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">
              Prenota Online
            </h5>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-black">
              FEIVER SU TREATWELL
            </h2>
            <div className="w-20 h-[2px] bg-gold mx-auto mb-6"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto font-primary">
              Prenota direttamente online i nostri servizi attraverso la piattaforma Treatwell
            </p>
          </div>

          <div className="max-w-6xl mx-auto fade-in">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
              <div
                className="treatwell-widget"
                data-url="https://www.treatwell.it/salone/feiver/"
                data-type="booking"
                data-theme="minimal"
                data-locale="it"
                style={{ minHeight: '800px', width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview - UPDATED TO WHITE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">
              Il Nostro Lavoro
            </h5>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-black">
              GALLERIA
            </h2>
            <div className="w-20 h-[2px] bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in">
            <div className="col-span-2 row-span-2">
              <img 
                src="/assets/photo1.png" 
                alt="Feiver Parrucchieri - Lavoro professionale" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </div>
            <div>
              <img 
                src="/assets/photo2.png" 
                alt="Cliente soddisfatto" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </div>
            <div>
              <img 
                src="/assets/photo3.png" 
                alt="Taglio moderno" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </div>
            <div>
              <img 
                src="/assets/photo4.png" 
                alt="Dettaglio colorazione" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </div>
            <div>
              <img 
                src="/assets/photo5.png" 
                alt="Ambiente del salone" 
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </div>
          </div>

          <div className="text-center mt-12 fade-in">
            <Link to="/galleria" className="bg-gold text-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-opacity-90 shadow-lg hover:shadow-xl inline-block">
              SFOGLIA LA GALLERIA
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action - UNCHANGED (keeps the black background with image overlay) */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-black">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-30"
            style={{ backgroundImage: "url('/assets/photo6.png')" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6">Prenota Il Tuo Appuntamento</h2>
            <p className="text-lg text-gray-300 mb-8">
              Affidati all'esperienza di Alket e del suo team. Prenota ora per un'esperienza di bellezza unica nel cuore di Milano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prenota/servizio" className="btn btn-primary text-lg px-8 py-3">PRENOTA ORA</Link>
              <a href="tel:0297383541" className="btn btn-outline text-lg px-8 py-3">CHIAMA ORA</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;