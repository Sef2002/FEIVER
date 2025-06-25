import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAvailableTimeSlots } from '../lib/availability';

const SelectTimeSlot = () => { 
  const navigate = useNavigate();
  const selectedBarber = JSON.parse(localStorage.getItem('selectedBarber') || '"any"');
  const storedServiceId = localStorage.getItem('selectedServiceId');

  const [date, setDate] = useState(new Date());
  const [perfectSlots, setPerfectSlots] = useState<{ label: string; value: string }[]>([]);
  const [otherSlots, setOtherSlots] = useState<{ label: string; value: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState(30); // default fallback

  useEffect(() => {
    if (!storedServiceId) return;

    const fetchServiceDuration = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('duration_min')
        .eq('id', storedServiceId)
        .single();

      if (!error && data?.duration_min) {
        setDuration(data.duration_min);
      }
    };

    fetchServiceDuration();
  }, [storedServiceId]);

  useEffect(() => {
    if (!storedServiceId || !selectedBarber || selectedBarber === 'any') {
      setPerfectSlots([]);
      setOtherSlots([]);
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    getAvailableTimeSlots(selectedBarber.id, dateStr, duration).then((result) => {
      setPerfectSlots(result.perfect);
      setOtherSlots(result.other);
    });
  }, [date, duration]);

  const checkIfSlotAvailable = async (barberId: string, dateStr: string, time: string, duration: number) => {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('appointment_time, duration_min')
      .eq('appointment_date', dateStr)
      .eq('barber_id', barberId);

    if (error) return false;

    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const slotStart = toMinutes(time);
    const slotEnd = slotStart + duration;

    return !(appointments || []).some(appt => {
      const start = toMinutes(appt.appointment_time);
      const end = start + appt.duration_min;
      return slotStart < end && slotEnd > start;
    });
  };

  const handleSubmit = async () => {
    if (!selectedTime || !name || !phone || !storedServiceId) {
      return alert('Compila tutti i campi.');
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    const barberId = selectedBarber === 'any' ? null : selectedBarber.id;

    if (barberId) {
      const isAvailable = await checkIfSlotAvailable(barberId, dateStr, selectedTime, duration);
      if (!isAvailable) return alert("L'orario selezionato non è più disponibile. Riprova.");
    }

    const { error } = await supabase.from('appointments').insert({
      appointment_date: dateStr,
      appointment_time: `${selectedTime}:00`,
      duration_min: duration,
      customer_name: name,
      customer_phone,
      barber_id: barberId,
      service_id: storedServiceId,
    });

    if (error) {
      console.error(error);
      alert('Errore durante la prenotazione.');
    } else {
      localStorage.setItem('customerName', name);
      localStorage.setItem('selectedTime', selectedTime);
      localStorage.setItem('selectedDate', dateStr);
      navigate('/prenota/successo');
    }
  };

  return (
    <main className="pt-24 bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">Prenota il tuo appuntamento</h5>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-black">SCEGLI L'ORARIO</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-primary">
              Seleziona la data e l'orario che preferisci per il tuo appuntamento. Inserisci i tuoi dati per completare la prenotazione.
            </p>
          </div>
        </div>
      </section>

      {/* Date Selection */}
      <section className="pb-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-black mb-4">Seleziona la Data</h2>
              <div className="w-20 h-[2px] bg-gold mx-auto mb-6"></div>
              
              <div className="inline-block bg-white border-2 border-black rounded-lg p-4">
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date!)}
                  dateFormat="dd/MM/yyyy"
                  className="text-black font-primary text-lg text-center bg-transparent border-none outline-none cursor-pointer"
                  calendarClassName="border-2 border-black"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time Slots Selection */}
      <section className="pb-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Perfect Slots */}
            {perfectSlots.length > 0 && (
              <div className="mb-12">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-heading font-bold text-black mb-2">ORARI CONSIGLIATI</h2>
                  <div className="w-20 h-[2px] bg-gold mx-auto"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {perfectSlots.map((slot) => (
                    <button
                      key={slot.value}
                      className={`p-4 border-2 rounded-lg font-primary font-semibold transition-all duration-300 ${
                        selectedTime === slot.value 
                          ? 'border-gold bg-gold text-black' 
                          : 'border-black text-black hover:border-gold hover:bg-gold hover:text-black'
                      }`}
                      onClick={() => setSelectedTime(slot.value)}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Other Slots */}
            {(otherSlots.length > 0 || perfectSlots.length === 0) && (
              <div className="mb-12">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-heading font-bold text-black mb-2">
                    {perfectSlots.length > 0 ? 'ALTRI ORARI DISPONIBILI' : 'ORARI DISPONIBILI'}
                  </h2>
                  <div className="w-20 h-[2px] bg-gold mx-auto"></div>
                </div>
                
                {otherSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {otherSlots.map((slot) => (
                      <button
                        key={slot.value}
                        className={`p-4 border-2 rounded-lg font-primary font-semibold transition-all duration-300 ${
                          selectedTime === slot.value 
                            ? 'border-gold bg-gold text-black' 
                            : 'border-black text-black hover:border-gold hover:bg-gold hover:text-black'
                        }`}
                        onClick={() => setSelectedTime(slot.value)}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-600 font-primary text-lg">Nessun orario disponibile per questa data</p>
                      <p className="text-gray-500 font-primary text-sm mt-2">Prova a selezionare una data diversa</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Information Form */}
      <section className="pb-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-black mb-2">I Tuoi Dati</h2>
              <div className="w-20 h-[2px] bg-gold mx-auto mb-6"></div>
              <p className="text-gray-600 font-primary">
                Inserisci i tuoi dati per completare la prenotazione
              </p>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-8 space-y-6">
              <div>
                <label className="block text-black font-primary font-semibold mb-2">
                  Nome e Cognome *
                </label>
                <input
                  type="text"
                  placeholder="Inserisci il tuo nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-black font-primary focus:border-gold focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-black font-primary font-semibold mb-2">
                  Numero di Telefono *
                </label>
                <input
                  type="tel"
                  placeholder="Inserisci il tuo numero di telefono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-black font-primary focus:border-gold focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedTime || !name || !phone}
                  className={`w-full py-4 rounded-lg font-primary font-bold text-lg transition-all duration-300 ${
                    selectedTime && name && phone
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  CONFERMA PRENOTAZIONE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-heading font-bold mb-4 text-black">Hai bisogno di aiuto?</h3>
            <p className="text-gray-600 font-primary mb-6">
              Per qualsiasi domanda o per modificare la tua prenotazione, non esitare a contattarci.
            </p>
            <a 
              href="tel:0363660248" 
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-primary font-semibold hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Chiamaci: 0363 660248
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SelectTimeSlot; 