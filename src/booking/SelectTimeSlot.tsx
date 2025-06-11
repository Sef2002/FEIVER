import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';
import { getAvailableTimeSlots, TimeSlot } from '../lib/availability';

const SelectTimeSlot = () => {
  const navigate = useNavigate();
  const selectedBarber = JSON.parse(localStorage.getItem('selectedBarber') || '"any"');
  const selectedServiceId = localStorage.getItem('selectedServiceId');

  const [date, setDate] = useState(new Date());
  const [recommended, setRecommended] = useState<TimeSlot[]>([]);
  const [others, setOthers] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!selectedServiceId) return;
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', selectedServiceId)
        .single();

      if (data) {
        setService(data);
        setDuration(data.duration_min);
      } else {
        console.error('Service not found:', error);
      }
    };

    fetchService();
  }, [selectedServiceId]);

  useEffect(() => {
    if (!duration || selectedBarber === 'any') {
      setRecommended([]);
      setOthers([]);
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    getAvailableTimeSlots(selectedBarber.id, dateStr, duration).then(
      ({ recommended, others }) => {
        setRecommended(recommended);
        setOthers(others);
      }
    );
  }, [date, duration]);

  const handleSubmit = async () => {
    if (!selectedTime || !name || !phone || !duration || !service) {
      alert('Compila tutti i campi.');
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    const { error } = await supabase.from('appointments').insert({
      appointment_date: dateStr,
      appointment_time: `${selectedTime}:00`,
      duration_min: duration,
      customer_name: name,
      phone,
      barber_id: selectedBarber === 'any' ? null : selectedBarber.id,
      service_id: service.id,
    });

    if (error) {
      console.error(error);
      alert('Errore durante la prenotazione.');
    } else {
      navigate('/prenota/successo');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Scegli l’orario</h1>

      <div className="mb-6 flex justify-center">
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date!)}
          dateFormat="dd/MM/yyyy"
          className="border rounded p-2 text-black"
        />
      </div>

      {recommended.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 font-semibold">ORARI CONSIGLIATI</p>
          <div className="grid grid-cols-3 gap-2">
            {recommended.map((slot) => (
              <button
                key={slot.value}
                className={`border rounded p-2 text-sm ${
                  selectedTime === slot.value ? 'bg-[#5D4037] text-white' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedTime(slot.value)}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        {others.length > 0 && (
          <p className="mb-2 font-semibold">ALTRI ORARI</p>
        )}
        <div className="grid grid-cols-3 gap-2">
          {others.map((slot) => (
            <button
              key={slot.value}
              className={`border rounded p-2 text-sm ${
                selectedTime === slot.value ? 'bg-[#5D4037] text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedTime(slot.value)}
            >
              {slot.label}
            </button>
          ))}
          {recommended.length === 0 && others.length === 0 && (
            <p className="col-span-3 text-center text-gray-500">Nessun orario disponibile</p>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2 text-black"
        />
        <input
          type="tel"
          placeholder="Telefono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded p-2 text-black"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-[#5D4037] text-white px-6 py-2 rounded shadow w-full"
      >
        Conferma Prenotazione
      </button>
    </div>
  );
};

export default SelectTimeSlot;
