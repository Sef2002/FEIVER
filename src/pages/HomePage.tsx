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

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="h-screen relative flex items-center">
        <div className="absolute inset-0 bg-black">
          <div 
            className="absolute inset-0 bg-center bg-cover opacity-50"
            style={{ backgroundImage: "url('/assets/background2.png')" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold mb-4 fade-in" style={{ '--delay': '100ms' } as React.CSSProperties}>
              SEVENTYFOUR<br />
              <span className="text-gold">PARRUCCHIERI</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 max-w-2xl fade-in" style={{ '--delay': '200ms' } as React.CSSProperties}>
              Innovazione e creatività nel cuore di Milano. Pietro e il suo team ti offrono un'esperienza unica con i migliori prodotti e le tecniche più avanzate.
            </p>
            <div className="flex items-center gap-6 mb-8 fade-in" style={{ '--delay': '250ms' } as React.CSSProperties}>
              <div className="flex items-center gap-2 text-gold">
                <MapPin size={18} />
                <span className="text-sm">Via Giuseppe Bardelli, 12 - Milano</span>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <Clock size={18} />
                <span className="text-sm">1 min dalla stazione Lambrate</span>
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

      {/* About Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h2 className="section-title">La Nostra Storia</h2>
              <p className="text-gray-300 mb-6">
                Seventyfour Parrucchieri sorge in Via Giuseppe Bardelli 12 a Milano, nel vibrante e sempre attivo quartiere residenziale tra Città Studi e Lambrate, a soli un minuto a piedi dalla stazione ferroviaria.
              </p>
              <p className="text-gray-300 mb-6">
                Pietro, il titolare, insieme al suo intero staff si prende cura con amore e dedizione della sua clientela proponendo servizi innovativi e creativi, colori alla moda e tagli che seguono sempre gli ultimi trend.
              </p>
              <p className="text-gray-300 mb-8">
                Il nostro ambiente luminoso, dagli arredi curati nei minimi dettagli, crea un'atmosfera unica ed elegante dove ogni cliente può rilassarsi e godersi un'esperienza di bellezza completa.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Award className="text-gold flex-shrink-0" size={20} />
                  <span className="text-sm text-gray-300">Prodotti Nashi, Redken, Wella</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="text-gold flex-shrink-0" size={20} />
                  <span className="text-sm text-gray-300">Sistema Nano Hairdreams</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 fade-in">
              <div className="space-y-4">
                <img 
                  src="/assets/story1.png" 
                  alt="Seventyfour Parrucchieri - Ambiente elegante" 
                  className="w-full h-48 sm:h-64 object-cover rounded-lg"
                />
                <img 
                  src="/assets/story2.png" 
                  alt="Prodotti professionali" 
                  className="w-full h-48 sm:h-80 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="/assets/story3.png" 
                  alt="Pietro al lavoro" 
                  className="w-full h-60 sm:h-80 object-cover rounded-lg"
                />
                <img 
                  src="/assets/story4.png" 
                  alt="Dettaglio servizio" 
                  className="w-full h-48 sm:h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Servizi Specializzati</h5>
            <h2 className="section-title">I Nostri Servizi</h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Servizi per capelli a tutto tondo: tagli, pieghe, colore e trattamenti specializzati per la chioma
            </p>
            <div className="w-20 h-[2px] bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Taglio & Piega',
                description: 'Tagli che seguono gli ultimi trend e pieghe professionali per valorizzare il tuo stile naturale.',
                image: '/assets/piega.png'
              },
              {
                title: 'Colore Innovativo',
                description: 'Colori alla moda con prodotti Nashi, Redken e Wella per risultati straordinari e duraturi.',
                image: '/assets/colorazione.png'
              },
              {
                title: 'Sistema Nano Hairdreams',
                description: 'Tecnologia innovativa per extension e trattamenti avanzati che rispettano la naturalezza dei capelli.',
                image: '/assets/extention.png'
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-lg fade-in"
                style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
              >
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-heading mb-3 text-white">{service.title}</h3>
                  <p className="text-gray-200 mb-4 text-sm leading-relaxed">{service.description}</p>
                  <Link to="/servizi" className="flex items-center text-gold hover:text-white transition-colors group">
                    <span className="mr-2">Scopri di più</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Il Nostro Lavoro</h5>
            <h2 className="section-title">Galleria</h2>
            <div className="w-20 h-[2px] bg-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in">
            <div className="col-span-2 row-span-2">
              <img 
                src="/assets/photo1.png" 
                alt="Seventyfour Parrucchieri - Lavoro professionale" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src="/assets/photo2.png" 
                alt="Cliente soddisfatto" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src="/assets/photo3.png" 
                alt="Taglio moderno" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src="/assets/photo4.png" 
                alt="Dettaglio colorazione" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <img 
                src="/assets/photo5.png" 
                alt="Ambiente del salone" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="text-center mt-12 fade-in">
            <Link to="/galleria" className="btn btn-outline">SFOGLIA LA GALLERIA</Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
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
              Affidati all'esperienza di Pietro e del suo team. Prenota ora per un'esperienza di bellezza unica nel cuore di Milano.
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