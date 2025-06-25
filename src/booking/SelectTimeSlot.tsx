// src/booking/SelectTimeSlot.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Slot {
  time: string;
  perfect: boolean;
}

const SelectTimeSlot = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const serviceId = localStorage.getItem('selectedServiceId');
  const barber = JSON.parse(localStorage.getItem('selectedBarber') || '"any"');
  const selectedDate = localStorage.getItem('selectedDate');
  const customerName = localStorage.getItem('customerName');
  const customerPhone = localStorage.getItem('customerPhone');

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      const response = await fetch('/functions/v1/dynamic-slots', {
        method: 'POST',
        body: JSON.stringify({
          serviceId,
          barberId: barber === 'any' ? null : barber.id,
          date: selectedDate,
        }),
      });
      const data = await response.json();
      setSlots(data);
      setLoading(false);
    };

    fetchSlots();
  }, [serviceId, barber, selectedDate]);

  const handleBooking = async () => {
    if (!selectedTime) return alert('Seleziona un orario');
    if (!serviceId || !selectedDate || !customerName || !customerPhone) return alert('Dati incompleti');

    const appointmentData = {
      service_id: serviceId,
      barber_id: barber === 'any' ? null : barber.id,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      duration_min: null, // opzionale: puoi calcolare la durata
      customer_name: customerName,
      customer_phone: customerPhone,
      business_id: '268e0ae9-c539-471c-b4c2-1663cf598436',
    };

    const { error } = await supabase.from('appointments').insert([appointmentData]);
    if (error) {
      console.error('Errore durante la prenotazione:', error);
      return alert('Errore nella prenotazione');
    }

    localStorage.setItem('selectedTime', selectedTime);
    navigate('/prenota/successo');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Scegli l'orario</h1>

      {loading ? (
        <p className="text-center">Caricamento slot...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => setSelectedTime(slot.time)}
              className={`p-3 rounded border text-center text-sm ${
                selectedTime === slot.time
                  ? 'bg-black text-white'
                  : slot.perfect
                  ? 'bg-green-100 hover:bg-green-200'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={handleBooking}
          disabled={!selectedTime}
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          Conferma Prenotazione
        </button>
      </div>
    </div>
  );
};

export default SelectTimeSlot;