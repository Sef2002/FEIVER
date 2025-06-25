import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';

/* ---------- TIPI ---------- */
interface Barber {
  id: string;
  name: string;
  role?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  email?: string | null;
}

/* ---------- COMPONENTI UI INLINE ---------- */
const SectionHeader = ({ title }: { title: string }) => (
  <div className="text-center">
    <h2 className="text-2xl font-heading font-bold text-black mb-2">{title}</h2>
    <div className="w-20 h-[2px] bg-gold mx-auto" />
  </div>
);

const BarberCard = ({
  barber,
  onSelect,
}: {
  barber: Barber | 'any';
  onSelect: (b: Barber | 'any') => void;
}) => (
  <button
    onClick={() => onSelect(barber)}
    className="group bg-white border-2 border-black rounded-lg p-6 text-left transition-all duration-300 hover:border-gold hover:shadow-lg w-full"
  >
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {barber !== 'any' && barber.avatar_url ? (
          <img 
            src={barber.avatar_url} 
            alt={barber.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-gold transition-colors"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 group-hover:bg-gold transition-colors flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-600 group-hover:text-black transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-xl font-heading font-bold text-black group-hover:text-gold transition-colors">
            {barber === 'any' ? 'Qualsiasi staff disponibile' : barber.name}
          </h3>
          {barber !== 'any' && barber.role && (
            <p className="text-gray-600 font-primary">
              {barber.role}
            </p>
          )}
          {barber === 'any' && (
            <p className="text-gray-600 font-primary">
              Il primo barbiere disponibile per il tuo orario
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm font-primary">
          {barber !== 'any' && barber.phone && (
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Disponibile
            </span>
          )}
          {barber === 'any' && (
            <span className="bg-black text-white px-3 py-1 rounded-full font-bold">
              Raccomandato
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
const SelectBarber = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* fetch */
  useEffect(() => {
    const fetchBarbers = async () => {
      const { data, error } = await supabase.from('barbers').select('*');
      if (!error && data) setBarbers(data as Barber[]);
      setLoading(false);
    };
    fetchBarbers();
  }, []);

  /* selezione */
  const handleSelect = (barber: Barber | 'any') => {
    localStorage.setItem('selectedBarber', JSON.stringify(barber));
    navigate('/prenota/orario');
  };

  /* loader */
  if (loading) {
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600 font-primary">Caricamento barbieri…</p>
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
            SCEGLI IL BARBIERE
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-primary">
            Seleziona il barbiere che preferisci o lascia che sia il primo disponibile 
            a prendersi cura di te con la massima professionalità.
          </p>
        </div>
      </section>

      {/* Barbieri */}
      <section className="pb-20 bg-white container mx-auto px-4 md:px-8 max-w-4xl space-y-12">
        <div className="space-y-6">
          <SectionHeader title="Il Nostro Team" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opzione "Qualsiasi" sempre per prima */}
            <BarberCard barber="any" onSelect={handleSelect} />
            
            {/* Barbieri specifici */}
            {barbers.map((barber) => (
              <BarberCard key={barber.id} barber={barber} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SelectBarber;