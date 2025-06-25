import React, { useEffect } from 'react';
import { Award, Clock, Star } from 'lucide-react';

const ServicesPage: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        if (isVisible) {
          setTimeout(() => {
            el.classList.add('active');
          }, index * 100);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      category: 'Servizi Donna',
      items: [
        { name: 'Taglio Donna', description: 'Tagli personalizzati che seguono gli ultimi trend', price: 'da €40' },
        { name: 'Piega Professionale', description: 'Piega con prodotti premium per un look impeccabile', price: 'da €30' },
        { name: 'Colorazione Completa', description: 'Colori alla moda con prodotti Nashi, Redken e Wella', price: 'da €60' },
        { name: 'Trattamenti Specializzati', description: 'Trattamenti intensivi per la cura e il benessere dei capelli', price: 'da €35' }
      ]
    },
    {
      category: 'Servizi Uomo',
      items: [
        { name: 'Taglio Classico', description: 'Taglio tradizionale con tecniche moderne', price: '€30' },
        { name: 'Taglio Trendy', description: 'Stili contemporanei e alla moda', price: '€35' },
        { name: 'Taglio + Barba', description: 'Servizio completo per un look curato', price: '€45' },
        { name: 'Trattamento Capelli', description: 'Cura specifica per capelli maschili', price: '€25' }
      ]
    },
    {
      category: 'Colorazioni Innovative',
      items: [
        { name: 'Colore Base', description: 'Colorazione uniforme con prodotti premium', price: 'da €50' },
        { name: 'Meches/Colpi di Sole', description: 'Tecniche di schiaritura per effetti naturali', price: 'da €70' },
        { name: 'Balayage', description: 'Tecnica moderna per sfumature naturali', price: 'da €80' },
        { name: 'Correzione Colore', description: 'Servizio specializzato per correggere colorazioni', price: 'da €90' }
      ]
    },
    {
      category: 'Trattamenti Speciali',
      items: [
        { name: 'Sistema Nano Hairdreams', description: 'Tecnologia innovativa per extension naturali', price: 'da €150' },
        { name: 'Trattamento Ricostruttivo', description: 'Riparazione intensiva per capelli danneggiati', price: '€45' },
        { name: 'Trattamento Idratante', description: 'Nutrimento profondo per capelli secchi', price: '€35' },
        { name: 'Consulenza Personalizzata', description: 'Analisi completa e consigli su misura', price: '€20' }
      ]
    }
  ];

  const brands = [
    { name: 'Nashi', description: 'Prodotti naturali di alta qualità' },
    { name: 'Redken', description: 'Innovazione e scienza per i capelli' },
    { name: 'Wella', description: 'Tradizione e professionalità' }
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">I Nostri Servizi</h5>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6">SERVIZI INNOVATIVI</h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Pietro e il suo team offrono servizi per capelli a tutto tondo: tagli, pieghe, colore e trattamenti specializzati 
              con prodotti di alta qualità e tecniche all'avanguardia.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {services.map((category, idx) => (
              <div key={idx} className="fade-in">
                <h2 className="text-3xl font-heading text-gold mb-8 pb-2 border-b border-gold">
                  {category.category}
                </h2>
                <div className="space-y-0">
                  {category.items.map((service, index) => (
                    <div key={index} className="service-item">
                      <div>
                        <h3 className="text-xl font-heading mb-1">{service.name}</h3>
                        <p className="text-gray-400 text-sm">{service.description}</p>
                      </div>
                      <div className="text-gold text-xl font-heading ml-4">
                        {service.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-heading font-bold mb-4">Marche e Prodotti</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Utilizziamo esclusivamente prodotti di alta qualità delle migliori marche professionali
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brands.map((brand, index) => (
              <div key={index} className="fade-in text-center p-8 border border-gray-800 hover:border-gold transition-all">
                <Award className="text-gold mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-heading mb-2">{brand.name}</h3>
                <p className="text-gray-400">{brand.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fade-in p-8 border border-gray-800 hover:border-gold transition-all">
              <Clock className="text-gold mb-4" size={32} />
              <h3 className="text-2xl font-heading mb-4">Su Appuntamento</h3>
              <p className="text-gray-400 mb-6">
                Per garantire un servizio personalizzato e di qualità, lavoriamo esclusivamente su appuntamento. 
                Prenota in anticipo per assicurarti il tuo posto.
              </p>
            </div>
            <div className="fade-in p-8 border border-gray-800 hover:border-gold transition-all">
              <Star className="text-gold mb-4" size={32} />
              <h3 className="text-2xl font-heading mb-4">Ambiente Unico</h3>
              <p className="text-gray-400 mb-6">
                Il nostro salone luminoso, dagli arredi curati nei minimi dettagli, 
                crea un ambiente unico ed elegante per la tua esperienza di bellezza.
              </p>
            </div>
            <div className="fade-in p-8 border border-gray-800 hover:border-gold transition-all">
              <Award className="text-gold mb-4" size={32} />
              <h3 className="text-2xl font-heading mb-4">Tecnologia Avanzata</h3>
              <p className="text-gray-400 mb-6">
                Siamo specializzati nell'innovativo sistema "nano" Hairdreams per extension 
                e trattamenti che rispettano la naturalezza dei tuoi capelli.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-4xl font-heading font-bold mb-6">Pronto per un'Esperienza Unica?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Prenota il tuo appuntamento con Pietro e il suo team. Scopri perché siamo il punto di riferimento 
              per la bellezza nel quartiere tra Città Studi e Lambrate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/prenota/servizio" className="btn btn-primary text-lg px-8 py-3">PRENOTA ORA</a>
              <a href="tel:0297383541" className="btn btn-outline text-lg px-8 py-3">CHIAMA ORA</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;