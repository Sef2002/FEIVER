// src/booking/SelectService.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/* ---------- TIPI ---------- */
interface Service {
  id: number;
  name: string;
  description?: string | null;
  price?: number | null;
  duration_min?: number | null;
  category?: string | null;     // 👈  nuova colonna
}

/* ---------- COMPONENTI UI INLINE ---------- */
const SectionHeader = ({ title }: { title: string }) => (
  <div className="text-center">
    <h2 className="text-2xl font-heading font-bold text-black mb-2">{title}</h2>
    <div className="w-20 h-[2px] bg-gold mx-auto" />
  </div>
);

const ServiceCard = ({
  service,
  onSelect,
}: {
  service: Service;
  onSelect: (s: Service) => void;
}) => (
  <button
    onClick={() => onSelect(service)}
    className="group bg-white border-2 border-black rounded-lg p-6 text-left transition-all duration-300 hover:border-gold hover:shadow-lg"
  >
    <div className="space-y-4">
      <h3 className="text-xl font-heading font-bold text-black group-hover:text-gold transition-colors">
        {service.name}
      </h3>

      {service.description && (
        <p className="text-gray-600 font-primary leading-relaxed">
          {service.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm font-primary">
          {service.price !== null && service.price !== undefined && (
            <span className="bg-black text-white px-3 py-1 rounded-full font-bold">
              €{service.price}
            </span>
          )}
          {service.duration_min !== null && service.duration_min !== undefined && (
            <span className="text-gray-600 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {service.duration_min} min
            </span>
          )}
        </div>

        <div className="text-gold group-hover:translate-x-1 transition-transform">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </button>
);

/* ---------- PAGINA ---------- */
const SelectService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* fetch */
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', '268e0ae9-c539-471c-b4c2-1663cf598436');   // 🔍 filtro per business
      if (!error && data) setServices(data as Service[]);
      setLoading(false);
    };
    fetchServices();
  }, []);

  /* selezione */
  const handleSelect = (service: Service) => {
    localStorage.setItem('selectedServiceId', service.id.toString());
    navigate('/prenota/barbiere');
  };

  /* raggruppa per categoria */
  const categories = services.reduce<Record<string, Service[]>>((acc, cur) => {
    const key = cur.category || 'Altri Servizi';
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});

  /* loader */
  if (loading) {
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600 font-primary">Caricamento servizi…</p>
      </main>
    );
  }

  /* layout */
  return (
    <main className="pt-24 bg-white min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">
            Prenota il tuo servizio
          </h5>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-black">
            SCEGLI IL SERVIZIO
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-primary">
            Seleziona il servizio che desideri prenotare. I nostri esperti ti
            offriranno un&apos;esperienza personalizzata e di alta qualità.
          </p>
        </div>
      </section>

      {/* Categorie + card */}
      <section className="pb-20 bg-white container mx-auto px-4 md:px-8 max-w-4xl space-y-12">
        {Object.entries(categories).map(([title, list]) => (
          <div key={title} className="space-y-6">
            <SectionHeader title={title} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.map((service) => (
                <ServiceCard key={service.id} service={service} onSelect={handleSelect} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default SelectService;