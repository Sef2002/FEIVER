import React, { useEffect } from 'react';
import { Scissors, Palette, Sparkles, Droplets, Heart, Clock, Star, Award } from 'lucide-react';

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

  const serviceCategories = [
    {
      title: 'Taglio',
      icon: <Scissors className="text-gold" size={28} />,
      services: [
        { name: 'Taglio Donna', description: 'Tagli personalizzati che seguono gli ultimi trend', price: 'da €40', duration: '45 min' },
        { name: 'Taglio Uomo', description: 'Stili moderni e classici per ogni personalità', price: 'da €30', duration: '30 min' },
        { name: 'Taglio Bambino', description: 'Tagli delicati e divertenti per i più piccoli', price: '€25', duration: '25 min' },
        { name: 'Consulenza Taglio', description: 'Analisi del viso e consigli personalizzati', price: '€20', duration: '20 min' }
      ]
    },
    {
      title: 'Colore',
      icon: <Palette className="text-gold" size={28} />,
      services: [
        { name: 'Colorazione Base', description: 'Colore uniforme con prodotti Nashi, Redken e Wella', price: 'da €50', duration: '90 min' },
        { name: 'Ritocco Ricrescita', description: 'Mantenimento del colore perfetto', price: 'da €35', duration: '60 min' },
        { name: 'Correzione Colore', description: 'Servizio specializzato per correggere colorazioni', price: 'da €90', duration: '180 min' },
        { name: 'Colore Fantasia', description: 'Colori vivaci e creativi per look unici', price: 'da €70', duration: '120 min' }
      ]
    },
    {
      title: 'Colpi di Sole',
      icon: <Sparkles className="text-gold" size={28} />,
      services: [
        { name: 'Meches Classiche', description: 'Tecnica tradizionale per schiariture naturali', price: 'da €60', duration: '120 min' },
        { name: 'Balayage', description: 'Tecnica moderna per sfumature naturali', price: 'da €80', duration: '150 min' },
        { name: 'Shatush', description: 'Effetto degradé per un look solare', price: 'da €70', duration: '120 min' },
        { name: 'Babylights', description: 'Riflessi sottili per un effetto naturale', price: 'da €75', duration: '135 min' }
      ]
    },
    {
      title: 'Piega',
      icon: <Droplets className="text-gold" size={28} />,
      services: [
        { name: 'Piega Classica', description: 'Styling professionale con phon e spazzola', price: '€25', duration: '30 min' },
        { name: 'Piega Riccia', description: 'Ricci definiti e voluminosi', price: '€30', duration: '40 min' },
        { name: 'Piega Liscia', description: 'Capelli perfettamente lisci e lucenti', price: '€28', duration: '35 min' },
        { name: 'Styling Evento', description: 'Acconciature eleganti per occasioni speciali', price: 'da €45', duration: '60 min' }
      ]
    },
    {
      title: 'Trattamenti per Cute e Capello',
      icon: <Heart className="text-gold" size={28} />,
      services: [
        { name: 'Sistema Nano Hairdreams', description: 'Tecnologia innovativa per extension naturali', price: 'da €150', duration: '180 min' },
        { name: 'Trattamento Ricostruttivo', description: 'Riparazione intensiva per capelli danneggiati', price: '€45', duration: '45 min' },
        { name: 'Trattamento Idratante', description: 'Nutrimento profondo per capelli secchi', price: '€35', duration: '30 min' },
        { name: 'Trattamento Anticaduta', description: 'Cura specifica per rinforzare i capelli', price: '€40', duration: '40 min' },
        { name: 'Peeling del Cuoio Capelluto', description: 'Purificazione profonda della cute', price: '€30', duration: '25 min' }
      ]
    }
  ];

  const brands = [
    { name: 'Nashi', description: 'Prodotti naturali di alta qualità' },
    { name: 'Redken', description: 'Innovazione e scienza per i capelli' },
    { name: 'Wella', description: 'Tradizione e professionalità' }
  ];

  return (
    <main className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2 font-primary font-medium">I Nostri Servizi</h5>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 text-black">SERVIZI INNOVATIVI</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-primary">
              Pietro e il suo team offrono servizi per capelli a tutto tondo: tagli, pieghe, colore e trattamenti specializzati 
              con prodotti di alta qualità e tecniche all'avanguardia.
            </p>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="space-y-16">
            {serviceCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="fade-in">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gold">
                  {category.icon}
                  <h2 className="text-3xl font-heading font-bold text-black">{category.title}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <div 
                      key={serviceIndex} 
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gold"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-heading font-semibold text-black">{service.name}</h3>
                        <span className="text-gold font-heading font-bold text-lg">{service.price}</span>
                      </div>
                      <p className="text-gray-600 mb-3 font-primary text-sm leading-relaxed">{service.description}</p>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gold" />
                        <span className="text-sm text-gray-500 font-primary">{service.duration}</span>
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-heading font-bold mb-4 text-black">Marche e Prodotti</h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-primary">
              Utilizziamo esclusivamente prodotti di alta qualità delle migliori marche professionali
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brands.map((brand, index) => (
              <div key={index} className="fade-in text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gold transition-all">
                <Award className="text-gold mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-heading font-semibold mb-2 text-black">{brand.name}</h3>
                <p className="text-gray-600 font-primary">{brand.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fade-in p-8 bg-gray-50 rounded-lg border border-gray-100 hover:border-gold transition-all">
              <Clock className="text-gold mb-4" size={32} />
              <h3 className="text-2xl font-heading font-semibold mb-4 text-black">Su Appuntamento</h3>
              <p className="text-gray-600 mb-6 font-primary">
                Per garantire un servizio personalizzato e di qualità, lavoriamo esclusivamente su appuntamento. 
                Prenota in anticipo per assicurarti il tuo posto.
              </p>
            </div>
            <div className="fade-in p-8 bg-gray-50 rounded-lg border border-gray-100 hover:border-gold transition-all">
              <Star className="text-gold mb-4" size={32} />
              <h3 className="text-2xl font-heading font-semibold mb-4 text-black">Ambiente Unico</h3>
              <p className="text-gray-600 mb-6 font-primary">
                Il nostro salone luminoso, dagli arredi curati nei minimi dettagli, 
                crea un ambiente unico ed elegante per la tua esperienza di bellezza.
              </p>
            </div>
            <div className="fade-in p-8 bg-gray-50 rounded-lg border border-gray-100 hover:border-gold transition-all">
              <Award className="text-gold mb-4" size={32} />
              <h3 className="text-2xl font-heading font-semibold mb-4 text-black">Tecnologia Avanzata</h3>
              <p className="text-gray-600 mb-6 font-primary">
                Siamo specializzati nell'innovativo sistema "nano" Hairdreams per extension 
                e trattamenti che rispettano la naturalezza dei tuoi capelli.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-4xl font-heading font-bold mb-6 text-white">Pronto per un'Esperienza Unica?</h2>
            <p className="text-lg text-gray-300 mb-8 font-primary">
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