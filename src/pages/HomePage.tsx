import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
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
            style={{ backgroundImage: "url('/assets/background.png')" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold mb-2 fade-in" style={{ '--delay': '100ms' } as React.CSSProperties}>
              UNIQUE<br />STYLE
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-4 max-w-xl fade-in" style={{ '--delay': '200ms' } as React.CSSProperties}>
              Ci dedichiamo ogni giorno a valorizzare ogni sfumatura del tuo stile.
            </p>
            <div className="w-20 h-[1px] bg-gold mb-8"></div>
            <div className="flex flex-wrap gap-4 fade-in" style={{ '--delay': '300ms' } as React.CSSProperties}>
              <a href="#" className="btn btn-primary">PRENOTA ORA</a>
              <Link to="/servizi" className="btn btn-outline">SCOPRI I SERVIZI</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="fade-in">
              <h2 className="section-title">La Nostra Storia</h2>
              <p className="text-gray-300 mb-8">
                Nel Centro Commerciale di Caravaggio, in Via Treviglio 25, Unique Style è il punto di riferimento per chi desidera un'esperienza esclusiva, dove la cura del capello si unisce al relax e all'eleganza.
              </p>
              <p className="text-gray-300 mb-8">
                Ogni servizio è studiato per valorizzare la tua immagine con trattamenti di alta qualità, dalle colorazioni raffinate ai tagli su misura, fino ai rituali di benessere che rigenerano e illuminano la chioma. Il nostro team di hairstylist esperti ti guiderà nella scelta del look perfetto, con attenzione ai dettagli e un approccio innovativo.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 fade-in">
              <div className="space-y-4">
                <img 
                  src="/assets/story1.png" 
                  alt="Unique Style al lavoro" 
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <img 
                  src="/assets/story2.png" 
                  alt="Strumenti professionali" 
                  className="w-full h-48 sm:h-80 object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="/assets/story3.png" 
                  alt="Cliente durante un taglio" 
                  className="w-full h-60 sm:h-80 object-cover"
                />
                <img 
                  src="/assets/story4.png" 
                  alt="Dettaglio di servizio" 
                  className="w-full h-48 sm:h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Servizi Premium</h5>
            <h2 className="section-title">I Nostri Servizi</h2>
            <div className="w-20 h-[2px] bg-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Taglio Donna',
                description: 'Taglio personalizzato per valorizzare il tuo stile e la natura dei tuoi capelli.',
                price: 'da €35'
              },
              {
                title: 'Piega',
                description: 'Piega professionale per un look perfetto, dalla classica alla più elaborata.',
                price: 'da €25'
              },
              {
                title: 'Colorazione',
                description: 'Servizio di colorazione completo con prodotti professionali per un risultato duraturo.',
                price: 'da €45'
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="bg-black p-8 border border-gray-800 hover:border-gold transition-all fade-in"
                style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
              >
                <h3 className="text-2xl font-heading mb-4 text-white">{service.title}</h3>
                <p className="text-gray-400 mb-6 h-24">{service.description}</p>
                <div className="flex justify-between items-end">
                  <span className="text-gold text-2xl font-heading">{service.price}</span>
                  <Link to="/servizi" className="flex items-center text-gold hover:text-white transition-colors">
                    <span className="mr-2">Dettagli</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 fade-in">
            <Link to="/servizi" className="btn btn-outline">VEDI TUTTI I SERVIZI</Link>
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
                alt="Unique Style al lavoro" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img 
                src="/assets/photo2.png" 
                alt="Cliente soddisfatto" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img 
                src="/assets/photo3.png" 
                alt="Taglio moderno" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img 
                src="/assets/photo4.png" 
                alt="Dettaglio taglio" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <img 
                src="/assets/photo5.png" 
                alt="Interno del negozio" 
                className="w-full h-full object-cover"
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
              Non lasciare al caso il tuo look. Prenota ora un appuntamento con i nostri esperti hairstylist e goditi un'esperienza di styling premium.
            </p>
            <a href="#" className="btn btn-primary text-lg px-8 py-3">PRENOTA ORA</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;