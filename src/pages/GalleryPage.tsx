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
    // Trigger once for elements in initial view
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryItems = [
    { id: 1, category: 'haircuts', image: '/assets/proof1.png', title: 'Taglio Moderno' },
    { id: 2, category: 'beards', image: '/assets/proof2.png', title: 'Barba Definita' },
    { id: 3, category: 'haircuts', image: '/assets/proof3.png', title: 'Taglio Business' },
    { id: 4, category: 'salon', image: '/assets/proof4.png', title: 'Il Nostro Spazio' },
    { id: 5, category: 'beards', image: '/assets/proof5.png', title: 'Rifinitura Barba' },
    { id: 6, category: 'haircuts', image: '/assets/proof6.png', title: 'Stile Elegante' },
    { id: 7, category: 'salon', image: '/assets/proof1.png', title: 'Strumenti Professionali' },
    { id: 8, category: 'haircuts', image: '/assets/proof2.png', title: 'Taglio Classico' },
    { id: 9, category: 'beards', image: '/assets/proof3.png', title: 'Barba Lunga' },
    { id: 10, category: 'salon', image: '/assets/proof4.png', title: 'Ambiente Elegante' },
    { id: 11, category: 'haircuts', image: '/assets/proof5.png', title: 'Sfumatura Precisa' },
    { id: 12, category: 'beards', image: '/assets/proof6.png', title: 'Rasatura Tradizionale' }
  ];

  const filteredGallery = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Il Nostro Lavoro</h5>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6">GALLERIA</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Sfoglia la nostra galleria per vedere esempi del nostro lavoro e dell'ambiente elegante che ti aspetta presso il nostro salone.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Filter */}
      <section className="py-8 bg-black border-b border-gray-800">
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

      {/* Gallery Grid */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden fade-in"
                style={{ '--delay': `${index * 50}ms` } as React.CSSProperties}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-xl font-heading text-white">{item.title}</h3>
                    <div className="w-10 h-[2px] bg-gold mt-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Instagram</h5>
            <h2 className="text-4xl font-heading font-bold mb-6">SEGUICI SU INSTAGRAM</h2>
            <p className="text-lg text-gray-300">
              Seguici sul nostro profilo Instagram per vedere i nostri ultimi lavori, promozioni speciali e molto altro.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 fade-in">
            {['/assets/proof1.png', '/assets/proof2.png', '/assets/proof3.png', '/assets/proof4.png', '/assets/proof5.png', '/assets/proof6.png'].map((image, index) => (
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
                  <span className="text-white text-xl">@barbiere</span>
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-8 fade-in">
            <a href="#" className="btn btn-outline">SEGUICI</a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-4xl font-heading font-bold mb-6">Diventa Anche Tu Un Nostro Cliente</h2>
            <p className="text-lg text-gray-300 mb-8">
              Ti è piaciuto quello che hai visto? Prenota il tuo appuntamento oggi stesso per un'esperienza di barbiere senza pari.
            </p>
            <a href="#" className="btn btn-primary text-lg px-8 py-3">PRENOTA ORA</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GalleryPage;