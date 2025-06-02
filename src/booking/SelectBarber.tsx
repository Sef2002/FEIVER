// src/booking/SelectBarber.tsx
import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';

const SelectBarber = () => {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarbers = async () => {
      const { data, error } = await supabase.from('barbers').select('*');
      if (!error) setBarbers(data || []);
      setLoading(false);
    };
    fetchBarbers();
  }, []);

  const handleSelect = (barber: any | 'any') => {
    localStorage.setItem('selectedBarber', JSON.stringify(barber));
    navigate('/prenota/orario'); // ✅ Fix path to match routing
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Scegli il Barber</h1>

      {loading ? (
        <p className="text-center">Caricamento...</p>
      ) : (
        <div className="grid gap-4">
          <button
            onClick={() => handleSelect('any')}
            className="p-4 border rounded-lg shadow hover:bg-gray-50 text-left bg-[#5D4037] text-white"
          >
            Qualsiasi staff disponibile
          </button>

          {barbers.map((barber) => (
            <button
              key={barber.id}
              onClick={() => handleSelect(barber)}
              className="p-4 border rounded-lg shadow hover:bg-gray-50 text-left"
            >
              <h2 className="text-lg font-semibold">{barber.name}</h2>
              {barber.specialty && (
                <p className="text-sm text-gray-600">{barber.specialty}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectBarber;