// src/booking/SelectService.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/* 👉 1. importa i componenti UI appena creati */
import {
  SelectServiceLayout,
  Service,
} from '@/components/services-ui'; // regola il path se diverso

const SelectService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /** 2. Fetch servizi da Supabase */
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*');
      if (!error && data) {
        // Assicurati che il campo `category` arrivi dal DB
        setServices(data as Service[]);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  /** 3. Callback di selezione */
  const handleSelect = (service: Service) => {
    localStorage.setItem('selectedServiceId', service.id.toString());
    navigate('/prenota/barbiere');
  };

  /** 4. Raggruppa per categoria (usa il campo `category` del DB) */
  const categories = services.reduce<Record<string, Service[]>>((acc, cur) => {
    const key = cur.category ?? 'Altri Servizi';
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});

  /** 5. Loading spinner + nuova UI */
  if (loading) {
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600 font-primary">Caricamento servizi...</p>
      </main>
    );
  }

  return <SelectServiceLayout categories={categories} onSelect={handleSelect} />;
};

export default SelectService;