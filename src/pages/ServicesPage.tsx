import React, { useEffect } from 'react';

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
    // Trigger once for elements in initial view
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      category: 'Taglio di Capelli',
      items: [
        { name: 'Taglio Classico', description: 'Taglio tradizionale con forbici e pettine', price: '€25' },
        { name: 'Taglio Moderno', description: 'Stile contemporaneo con tecniche avanzate', price: '€30' },
        { name: 'Taglio Fade', description: 'Sfumatura progressiva sui lati e sul retro', price: '€35' },
        { name: 'Taglio Premium', description: 'Consulenza, taglio e styling premium', price: '€45' }
      ]
    },
    {
      category: 'Servizi Barba',
      items: [
        { name: 'Rifinitura Barba', description: 'Modellatura e rifinitura della barba', price: '€15' },
        { name: 'Barba Completa', description: 'Rasatura, modellatura e trattamento con oli', price: '€20' },
        { name: 'Rasatura Tradizionale', description: 'Rasatura con asciugamano caldo e rasoio a mano libera', price: '€25' },
        { name: 'Trattamento Luxury', description: 'Rasatura premium con prodotti di alta gamma', price: '€35' }
      ]
    },
    {
      category: 'Pacchetti Combinati',
      items: [
        { name: 'Taglio & Barba', description: 'Combinazione di taglio capelli e servizio barba', price: '€40' },
        { name: 'Pacchetto VIP', description: 'Taglio, barba e trattamento viso completo', price: '€65' },
        { name: 'Padre & Figlio', description: 'Taglio per padre e figlio (sotto i 12 anni)', price: '€45' },
        { name: 'Sposo', description: 'Pacchetto completo per il giorno speciale', price: '€75' }
      ]
    },
    {
      category: 'Trattamenti Speciali',
      items: [
        { name: 'Colorazione', description: 'Colorazione professionale per capelli o barba', price: 'da €40' },
        { name: 'Trattamento Viso', description: 'Pulizia e idratazione profonda del viso', price: '€30' },
        { name: 'Massaggio Testa', description: 'Massaggio rilassante del cuoio capelluto', price: '€20' },
        { name: 'Maschera Nutriente', description: 'Trattamento intensivo per capelli o barba', price: '€25' }
      ]
    }
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">I Nostri Servizi</h5>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6">SERVIZI PREMIUM</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Esplora la nostra gamma completa di servizi di barberia, accuratamente progettati per offrire un'esperienza ineguagliabile e risultati impeccabili.
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

      {/* Additional Information */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fade-in p-8 border border-gray-800 hover:border-gold transition-all">
              <h3 className="text-2xl font-heading mb-4">Su Appuntamento</h3>
              <p className="text-gray-400 mb-6">
                Per garantire un servizio personalizzato e di qualità, lavoriamo esclusivamente su appuntamento. Prenota in anticipo per assicurarti il tuo posto.
              </p>
            </div>
            <div className="fade-in p-8 border border-gray-800 hover:border-gold transition-all">
              <h3 className="text-2xl font-heading mb-4">Prodotti Premium</h3>
              <p className="text-gray-400 mb-6">
                Utilizziamo solo prodotti di alta qualità, selezionati per le loro prestazioni superiori e formulazioni rispettose della pelle.
              </p>
            </div>
            <div className="fade-in p-8 border border-gray-800 hover:border-gold transition-all">
              <h3 className="text-2xl font-heading mb-4">Abbonamenti</h3>
              <p className="text-gray-400 mb-6">
                Offriamo piani di abbonamento mensili e trimestrali per chi desidera mantenere un look impeccabile con un risparmio sostanziale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-4xl font-heading font-bold mb-6">Pronto per un'Esperienza Premium?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Prenota il tuo appuntamento oggi stesso e scopri perché siamo il barbiere più rinomato della città.
            </p>
            <a href="#" className="btn btn-primary text-lg px-8 py-3">PRENOTA ORA</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;