import React, { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

const ShopPage: React.FC = () => {
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

  const products = [
    {
      name: "Balsamo Idratante",
      description: "Balsamo professionale per capelli setosi",
      price: "26,00",
      image: "/assets/product1.png",
      category: "Balsamo"
    },
    {
      name: "Gel Modellante",
      description: "Gel a tenuta forte per styling duraturo",
      price: "24,00",
      image: "/assets/product2.png",
      category: "Styling"
    },
    {
      name: "Pomata Opaca",
      description: "Pomata modellante effetto opaco",
      price: "28,00",
      image: "/assets/product3.png",
      category: "Styling"
    },
    {
      name: "Shampoo Professionale",
      description: "Shampoo nutriente per capelli trattati",
      price: "22,00",
      image: "/assets/product4.png",
      category: "Shampoo"
    },
    {
      name: "Maschera Ristrutturante",
      description: "Trattamento intensivo per capelli danneggiati",
      price: "28,00",
      image: "/assets/product5.png",
      category: "Trattamenti"
    },
    {
      name: "Olio di Argan",
      description: "Olio nutriente per capelli secchi",
      price: "32,00",
      image: "/assets/product6.png",
      category: "Oli"
    }
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10 fade-in">
            <h5 className="text-gold tracking-widest uppercase mb-2">Prodotti Professionali</h5>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6">SHOP</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Scopri la nostra selezione di prodotti professionali per la cura dei tuoi capelli.
              Qualità garantita per risultati eccezionali.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden fade-in"
                style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="relative h-[400px] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="bg-[#1b1b1b] p-6 border-b border-l border-r border-gray-800 group-hover:border-gold transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-heading">{product.name}</h3>
                    <span className="text-gold font-heading">€{product.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gold text-sm">{product.category}</span>
                    <button className="btn btn-outline flex items-center gap-2 text-sm py-1">
                      <ShoppingCart size={16} />
                      Aggiungi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-4xl font-heading font-bold mb-6">Hai Bisogno di Consigli?</h2>
            <p className="text-lg text-gray-300 mb-8">
              I nostri esperti sono a tua disposizione per guidarti nella scelta dei prodotti più adatti alle tue esigenze.
            </p>
            <a href="#" className="btn btn-primary text-lg px-8 py-3">CONTATTACI</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ShopPage;