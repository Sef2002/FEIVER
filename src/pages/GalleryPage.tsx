import React, { useState, useEffect } from 'react';

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const scrollToBooking = () => {
    // Navigate to home page and then scroll to booking section
    window.location.href = '/#prenota-online';
  };

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

  const galleryItems = [
    { id: 1, category: 'haircuts', image: '/assets/photo1.png', title: 'Taglio Moderno' },
    { id: 2, category: 'color', image: '/assets/photo2.png', title: 'Colorazione Innovativa' },
    { id: 3, category: 'haircuts', image: '/assets/photo3.png', title: 'Taglio Trendy' },
    { id: 4, category: 'salon', image: '/assets/photo4.png', title: 'Il Nostro Ambiente' },
    { id: 5, category: 'color', image: '/assets/photo5.png', title: 'Balayage Naturale' },
    { id: 6, category: 'haircuts', image: '/assets/photo6.png', title: 'Stile Elegante' },
    { id: 7, category: 'salon', image: '/assets/photo1.png', title: 'Strumenti Professionali' },
    { id: 8, category: 'haircuts', image: '/assets/photo2.png', title: 'Taglio Personalizzato' },
    { id: 9, category: 'color', image: '/assets/photo3.png', title: 'Meches Perfette' },
    { id: 10, category: 'salon', image: '/assets/photo4.png', title: 'Ambiente Luminoso' },
    { id: 11, category: 'treatments', image: '/assets/photo5.png', title: 'Sistema Nano Hairdreams' },
    { id: 12, category: 'treatments', image: '/assets/photo6.png', title: 'Trattamento Ricostruttivo' }
  ];

  const filteredGallery = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10 fade-in">
            <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">Il Nostro Lavoro</h5>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 text-black">GALLERIA</h1>
            <div className="w-20 h-[2px] bg-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-primary">
              Scopri i nostri lavori e l'ambiente elegante di Feivèr Barber. 
              Ogni creazione racconta la nostra passione per l'innovazione e la bellezza.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Filter */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-center space-x-2 sm:space-x-6 overflow-x-auto pb-2">
            {['all', 'haircuts', 'color', 'treatments', 'salon'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 rounded-lg uppercase tracking-wider text-sm font-primary font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-gold text-black shadow-lg' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {category === 'all' ? 'Tutti' : 
                  category === 'haircuts' ? 'Tagli' : 
                  category === 'color' ? 'Colori' :
                  category === 'treatments' ? 'Trattamenti' : 'Salone'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 fade-in"
                style={{ '--delay': `${index * 50}ms` } as React.CSSProperties}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-xl font-heading font-semibold text-white mb-2">{item.title}</h3>
                    <div className="w-10 h-[2px] bg-gold"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12 fade-in">
            <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">Social Media</h5>
            <h2 className="text-4xl font-heading font-bold mb-6 text-black">SEGUICI SU INSTAGRAM</h2>
            <div className="w-20 h-[2px] bg-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 font-primary">
              Seguici sul nostro profilo Instagram per vedere i nostri ultimi lavori, 
              le novità del salone e le tendenze più attuali.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 fade-in">
            {['/assets/photo1.png', '/assets/photo2.png', '/assets/photo3.png', '/assets/photo4.png', '/assets/photo5.png', '/assets/photo6.png'].map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <img 
                  src={image}
                  alt={`Feiver Instagram ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
                <a 
                  href="#" 
                  className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                >
                  <span className="text-white text-sm font-primary font-semibold">@feiver_barber</span>
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-8 fade-in">
            <a href="#" className="bg-gold text-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-opacity-90 shadow-lg hover:shadow-xl">SEGUICI</a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-4xl font-heading font-bold mb-6 text-black">Vuoi Essere Il Prossimo?</h2>
            <p className="text-lg text-gray-600 mb-8 font-primary">
              Ti è piaciuto quello che hai visto? Prenota il tuo appuntamento con Alket e il suo team 
              per un'esperienza di bellezza unica nel cuore di Treviglio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={scrollToBooking} className="bg-gold text-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-opacity-90 shadow-lg hover:shadow-xl">PRENOTA ORA</button>
              <a href="tel:3427575655" className="bg-white text-black border-2 border-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-gray-50 hover:border-gold">CHIAMA ORA</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GalleryPage;