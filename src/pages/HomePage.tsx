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
            style={{ backgroundImage: "url('/assets/background2.png')" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold mb-2 fade-in" style={{ '--delay': '100ms' } as React.CSSProperties}>
              UNIQUE STYLE
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-4 max-w-xl fade-in italic" style={{ '--delay': '200ms' } as React.CSSProperties}>
              "Unico: nel linguaggio filosofico l'individuo in quanto singolare. Irripetibile. Eccezionale. Non si può replicare"
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
                Nel cuore di Treviglio, in Via Roma 9, Unique Style è il punto di riferimento per chi desidera un'esperienza esclusiva, dove la cura del capello si unisce al relax e all'eleganza.
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
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Servizi Premium</h5>
            <h2 className="section-title">I Nostri Servizi</h2>
            <div className="w-20 h-[2px] bg-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Taglio/Piega',
                description: 'Dai forma al tuo stile con tagli personalizzati e pieghe professionali che valorizzano la tua bellezza naturale.',
                image: '/assets/photo1.png'
              },
              {
                title: 'Colore',
                description: 'Trasforma il tuo look con le nostre tecniche di colorazione avanzate e prodotti di alta qualità.',
                image: '/assets/photo2.png'
              },
              {
                title: 'Extention',
                description: 'Rigenera e nutri i tuoi capelli con i nostri trattamenti specializzati per una chioma sana e luminosa.',
                image: 'assets/colorazione.png'
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden fade-in"
                style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
              >
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-heading mb-2 text-white">{service.title}</h3>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <Link to="/servizi" className="flex items-center text-gold hover:text-white transition-colors">
                    <span className="mr-2">Scopri di più</span>
                    <ArrowRight size={16} />
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