// src/booking/SelectService.tsx
import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';

const SelectService = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (!error) setServices(data || []);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const handleSelect = (service: any) => {
    localStorage.setItem('selectedService', JSON.stringify(service));
    navigate('/prenota/barbiere'); // ✅ Fixed to match route
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Seleziona un Servizio</h1>
      {loading ? (
        <p className="text-center">Caricamento...</p>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleSelect(service)}
              className="p-4 border rounded-lg shadow hover:bg-gray-50 text-left"
            >
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="text-sm text-gray-600">{service.description}</p>
              <p className="text-sm mt-1">
                ⏱ {service.duration_min} min &nbsp;&bull;&nbsp; 💶 {service.price}€
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectService;