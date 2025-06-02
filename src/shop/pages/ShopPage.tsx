import { useEffect, useState } from "react";
import { fetchProducts } from "../utils/shopApi";
import { Product } from "../types/product";
import ProductCard from "../components/ProductCard";

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

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
              <ProductCard key={product.id} product={product} index={index} />
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