import { useEffect, useState } from "react";
import { fetchProducts } from "../utils/shopApi";
import { Product } from "../types/product";
import ProductCard from "../components/ProductCard";

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <main className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10 fade-in">
            <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">
              Prodotti Professionali
            </h5>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 text-black">
              SHOP
            </h1>
            <div className="w-20 h-[2px] bg-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-primary">
              Scopri la nostra selezione di prodotti professionali per la cura dei tuoi capelli.
              Qualità garantita per risultati eccezionali a casa come in salone.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Showcase - Nashi */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="fade-in">
                <img 
                  src="/assets/nashi.png" 
                  alt="Nashi - Prodotti professionali per capelli"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="fade-in space-y-6">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-black mb-4">
                    NASHI ARGAN
                  </h2>
                  <div className="w-16 h-[2px] bg-gold mb-6"></div>
                </div>
                <p className="text-gray-600 font-primary leading-relaxed">
                  Nashi Argan è una linea di prodotti professionali per capelli che utilizza 
                  l'olio di Argan puro del Marocco. Ogni prodotto è formulato per nutrire, 
                  proteggere e valorizzare la bellezza naturale dei tuoi capelli.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-gray-700 font-primary">100% Olio di Argan puro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-gray-700 font-primary">Formulazioni professionali</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <span className="text-gray-700 font-primary">Risultati visibili dal primo utilizzo</span>
                  </div>
                </div>
                <div className="pt-4">
                  <button className="bg-gold text-black px-6 py-3 rounded-lg font-heading font-bold transition-all duration-300 hover:bg-opacity-90 shadow-lg hover:shadow-xl">
                    SCOPRI LA LINEA NASHI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-center space-x-2 sm:space-x-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 rounded-lg uppercase tracking-wider text-sm font-primary font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-gold text-black shadow-lg' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {category === 'all' ? 'Tutti i Prodotti' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="fade-in" style={{ '--delay': `${index * 50}ms` } as React.CSSProperties}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-black mb-2">
                  Nessun prodotto trovato
                </h3>
                <p className="text-gray-600 font-primary">
                  Non ci sono prodotti disponibili in questa categoria al momento.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-heading font-bold mb-4 text-black">Perché Scegliere i Nostri Prodotti</h2>
            <div className="w-20 h-[2px] bg-gold mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto font-primary">
              Selezioniamo solo i migliori prodotti professionali per garantirti risultati eccezionali
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Qualità Professionale',
                description: 'Prodotti utilizzati dai migliori saloni e parrucchieri professionisti'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Risultati Immediati',
                description: 'Formula avanzata per risultati visibili fin dalla prima applicazione'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Cura Naturale',
                description: 'Ingredienti naturali che rispettano e nutrono i tuoi capelli'
              }
            ].map((feature, index) => (
              <div key={index} className="fade-in text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gold transition-all">
                <div className="text-gold mx-auto mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-black">{feature.title}</h3>
                <p className="text-gray-600 font-primary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto fade-in">
            <h2 className="text-4xl font-heading font-bold mb-6 text-black">Hai Bisogno di Consigli?</h2>
            <p className="text-lg text-gray-600 mb-8 font-primary">
              Alket e il suo team sono a tua disposizione per guidarti nella scelta dei prodotti più adatti alle tue esigenze.
              Contattaci per una consulenza personalizzata.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:3427575655" className="bg-gold text-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-opacity-90 shadow-lg hover:shadow-xl">
                CHIAMA ORA
              </a>
              <a href="/prenota/servizio" className="bg-white text-black border-2 border-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-gray-50 hover:border-gold">
                PRENOTA CONSULENZA
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ShopPage;