import React, { useState, useEffect } from 'react';

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    { id: 2, category: 'beards', image: '/assets/photo2.png', title: 'Barba Definita' },
    { id: 3, category: 'salon', image: '/assets/photo4.png', title: 'Il Nostro Spazio' },
    { id: 4, category: 'beards', image: '/assets/photo5.png', title: 'Rifinitura Barba' },
    { id: 5, category: 'haircuts', image: '/assets/photo6.png', title: 'Stile Elegante' },
    { id: 6, category: 'salon', image: '/assets/photo1.png', title: 'Strumenti Professionali' },
    { id: 7, category: 'haircuts', image: '/assets/photo2.png', title: 'Taglio Classico' },
    { id: 8, category: 'beards', image: '/assets/photo4.png', title: 'Barba Lunga' },
    { id: 9, category: 'salon', image: '/assets/photo5.png', title: 'Ambiente Elegante' },
    { id: 10, category: 'haircuts', image: '/assets/photo6.png', title: 'Sfumatura Precisa' },
    { id: 11, category: 'beards', image: '/assets/photo1.png', title: 'Rasatura Tradizionale' },
    { id: 12, category: 'salon', image: '/assets/photo2.png', title: 'Dettagli Premium' }
  ];

  const filteredGallery = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <main className="pt-24 min-h-screen">
      {/* Hero Section - Compact */}
      <section className="py-8 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Il Nostro Lavoro</h5>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">GALLERIA</h1>
            <p className="text-base text-gray-300 max-w-2xl mx-auto">
              Sfoglia la nostra galleria per vedere esempi del nostro lavoro e dell'ambiente elegante che ti aspetta presso il nostro salone.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Filter - Compact */}
      <section className="py-4 bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-center space-x-2 sm:space-x-6 overflow-x-auto pb-2">
            {['all', 'haircuts', 'beards', 'salon'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 uppercase tracking-wider text-sm transition-all ${
                  selectedCategory === category 
                    ? 'bg-gold text-black' 
                    : 'bg-transparent text-white hover:text-gold'
                }`}
              >
                {category === 'all' ? 'Tutti' : 
                  category === 'haircuts' ? 'Tagli' : 
                  category === 'beards' ? 'Barbe' : 'Salone'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Optimized for viewport */}
      <section className="py-8 bg-black flex-1">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredGallery.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden fade-in"
                style={{ '--delay': `${index * 30}ms` } as React.CSSProperties}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-3 sm:p-4 w-full">
                    <h3 className="text-sm sm:text-base font-heading text-white">{item.title}</h3>
                    <div className="w-8 h-[2px] bg-gold mt-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section - Compact */}
      <section className="py-12 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-8 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Instagram</h5>
            <h2 className="text-3xl font-heading font-bold mb-4">SEGUICI SU INSTAGRAM</h2>
            <p className="text-base text-gray-300">
              Seguici sul nostro profilo Instagram per vedere i nostri ultimi lavori, promozioni speciali e molto altro.
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 fade-in mb-6">
            {['/assets/photo1.png', '/assets/photo2.png', '/assets/photo4.png', '/assets/photo5.png', '/assets/photo6.png', '/assets/photo1.png'].map((image, index) => (
              <div key={index} className="group relative overflow-hidden">
                <img 
                  src={image}
                  alt={`Instagram ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
                <a 
                  href="#" 
                  className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                >
                  <span className="text-white text-sm sm:text-base">@uniquestyle</span>
                </a>
              </div>
            ))}
          </div>
          
          <div className="fade-in">
            <a href="#" className="btn btn-outline">SEGUICI</a>
          </div>
        </div>
      </section>

      {/* Call to Action - Compact */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-3xl font-heading font-bold mb-4">Diventa Anche Tu Un Nostro Cliente</h2>
            <p className="text-base text-gray-300 mb-6">
              Ti è piaciuto quello che hai visto? Prenota il tuo appuntamento oggi stesso per un'esperienza senza pari.
            </p>
            <a href="#" className="btn btn-primary text-lg px-8 py-3">PRENOTA ORA</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GalleryPage;