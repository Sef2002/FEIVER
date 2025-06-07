// src/booking/SelectService.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Service {
  id: number;
  name: string;
  description?: string;
  price?: number;
  duration_min?: number;
}

const SelectService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (!error) {
        setServices(data as Service[] ?? []);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const handleSelect = (service: Service) => {
    // Store only the ID, not the full object
    localStorage.setItem('selectedServiceId', service.id.toString());
    navigate('/prenota/barbiere');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Scegli il Servizio</h1>
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
              {service.description && (
                <p className="text-sm text-gray-600">{service.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-700 flex items-center space-x-4">
                {service.price !== undefined && (
                  <span>€{service.price}</span>
                )}
                {service.duration_min !== undefined && (
                  <span>{service.duration_min} min</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectService; 
