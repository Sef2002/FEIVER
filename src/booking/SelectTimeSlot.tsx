import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAvailableTimeSlots } from '../lib/availability';

/* ---------- TIPI ---------- */
interface Service {
  id: string;
  name: string;
  price: number;
  duration_min: number;
}

interface Barber {
  id: string;
  name: string;
}

interface CustomerData {
  name: string;
  phone: string;
  email: string;
  birthdate: string;
}

/* ---------- COMPONENTI UI INLINE ---------- */
const SectionHeader = ({ title }: { title: string }) => (
  <div className="text-center">
    <h2 className="text-2xl font-heading font-bold text-black mb-2">{title}</h2>
    <div className="w-20 h-[2px] bg-gold mx-auto" />
  </div>
);

const TimeSlotButton = ({
  slot,
  isSelected,
  onClick,
  isPerfect = false,
}: {
  slot: { label: string; value: string };
  isSelected: boolean;
  onClick: () => void;
  isPerfect?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-lg border-2 text-sm font-primary transition-all duration-300 ${
      isSelected
        ? 'bg-gold text-black border-gold shadow-lg'
        : isPerfect
        ? 'bg-green-50 border-green-300 text-green-800 hover:bg-green-100 hover:border-green-400'
        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
    }`}
  >
    <div className="flex flex-col items-center">
      <span className="font-semibold">{slot.label}</span>
      {isPerfect && (
        <span className="text-xs text-green-600 mt-1">Perfetto</span>
      )}
    </div>
  </button>
);

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-heading font-semibold text-black">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 border-2 border-gray-300 rounded-lg font-primary text-black placeholder-gray-400 focus:border-gold focus:outline-none transition-colors"
      required={required}
    />
  </div>
);

/* ---------- PAGINA ---------- */
const SelectTimeSlot = () => {
  const navigate = useNavigate();
  
  // Recupera dati dalle sessioni precedenti
  const selectedBarber = JSON.parse(localStorage.getItem('selectedBarber') || '"any"');
  const storedServiceId = localStorage.getItem('selectedServiceId');

  // Stati
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState(new Date());
  const [perfectSlots, setPerfectSlots] = useState<{ label: string; value: string }[]>([]);
  const [otherSlots, setOtherSlots] = useState<{ label: string; value: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Dati cliente
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    email: '',
    birthdate: '',
  });

  // Fetch service data
  useEffect(() => {
    if (!storedServiceId) {
      navigate('/prenota/servizio');
      return;
    }

    const fetchService = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price, duration_min')
        .eq('id', storedServiceId)
        .maybeSingle(); 

      if (!error && data) {
        setService(data as Service);
      } else {
        console.error('Error fetching service:', error);
        navigate('/prenota/servizio');
      }
      setLoading(false);
    };

    fetchService();
  }, [storedServiceId, navigate]);

  // Fetch available time slots
  useEffect(() => {
    if (!service || !selectedBarber || selectedBarber === 'any') {
      setPerfectSlots([]);
      setOtherSlots([]);
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    getAvailableTimeSlots(selectedBarber.id, dateStr, service.duration_min).then((result) => {
      setPerfectSlots(result.perfect);
      setOtherSlots(result.other);
    });
  }, [date, service, selectedBarber]);

  // Verifica disponibilità slot
  const checkIfSlotAvailable = async (barberId: string, dateStr: string, time: string, duration: number) => {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('appointment_time, duration_min')
      .eq('appointment_date', dateStr)
      .eq('barber_id', barberId)
      .neq('appointment_status', 'cancellato');

    if (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }

    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const slotStart = toMinutes(time);
    const slotEnd = slotStart + duration;

    for (const appt of appointments || []) {
      const apptStart = toMinutes(appt.appointment_time);
      const apptEnd = apptStart + appt.duration_min;
      if (slotStart < apptEnd && slotEnd > apptStart) return false;
    }

    return true;
  };

  // Gestione invio form
  const handleSubmit = async () => {
    if (!selectedTime || !customerData.name || !customerData.phone || !service) {
      alert('Compila tutti i campi obbligatori.');
      return;
    }

    setSubmitting(true);

    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const barberId = selectedBarber === 'any' ? null : selectedBarber.id;

      // Verifica disponibilità se barbiere specifico
      if (barberId) {
        const isAvailable = await checkIfSlotAvailable(barberId, dateStr, selectedTime, service.duration_min);
        if (!isAvailable) {
          alert("L'orario selezionato non è più disponibile. Riprova.");
          setSubmitting(false);
          return;
        }
      }

      // Prima inserisci/aggiorna il contatto
      let customerId = null;
      if (customerData.phone) {
        const { data: existingContact, error: contactError } = await supabase
          .from('contacts')
          .select('id')
          .eq('customer_phone', customerData.phone)
          .single();

        if (existingContact) {
          // Aggiorna contatto esistente
          const { error: updateError } = await supabase
            .from('contacts')
            .update({
              customer_name: customerData.name,
              customer_email: customerData.email || null,
              customer_birthdate: customerData.birthdate || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingContact.id);

          if (!updateError) {
            customerId = existingContact.id;
          }
        } else {
          // Crea nuovo contatto
          const { data: newContact, error: insertError } = await supabase
            .from('contacts')
            .insert({
              customer_name: customerData.name,
              customer_phone: customerData.phone,
              customer_email: customerData.email || null,
              customer_birthdate: customerData.birthdate || null,
            })
            .select('id')
            .single();

          if (!insertError && newContact) {
            customerId = newContact.id;
          }
        }
      }

      // Inserisci l'appuntamento
      const appointmentData = {
        service_id: service.id,
        barber_id: barberId,
        customer_id: customerId,
        customer_name: customerData.name,
        customer_email: customerData.email || null,
        customer_phone: customerData.phone,
        customer_birthdate: customerData.birthdate || null,
        appointment_date: dateStr,
        appointment_time: `${selectedTime}:00`,
        duration_min: service.duration_min,
        appointment_status: 'in attesa' as const,
        paid: false,
        payment_method: null,
        business_id: '268e0ae9-c539-471c-b4c2-1663cf598436', // Aggiungere se necessario
      };

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentData);

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        alert('Errore durante la creazione dell\'appuntamento.');
        return;
      }

      // Salva dati per la pagina di successo
      localStorage.setItem('customerName', customerData.name);
      localStorage.setItem('selectedTime', selectedTime);
      localStorage.setItem('selectedDate', dateStr);
      localStorage.setItem('selectedService', JSON.stringify(service));

      navigate('/prenota/successo');
    } catch (error) {
      console.error('Error during booking:', error);
      alert('Errore durante la prenotazione. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600 font-primary">Caricamento…</p>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 font-primary">Servizio non trovato</p>
      </main>
    );
  }

  return (
    <main className="pt-24 bg-white min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h5 className="text-gray-600 tracking-widest uppercase mb-2 font-primary">
            Prenota il tuo servizio
          </h5>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-black">
            SCEGLI DATA E ORARIO
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-primary">
            Seleziona la data e l'orario che preferisci per il tuo appuntamento.
            Completa i tuoi dati per finalizzare la prenotazione.
          </p>
        </div>
      </section>

      {/* Riepilogo servizio */}
      <section className="pb-8 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <h3 className="font-heading font-bold text-black mb-2">Riepilogo Prenotazione</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-primary">
              <div>
                <span className="text-gray-600">Servizio:</span>
                <p className="font-semibold text-black">{service.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Durata:</span>
                <p className="font-semibold text-black">{service.duration_min} minuti</p>
              </div>
              <div>
                <span className="text-gray-600">Prezzo:</span>
                <p className="font-semibold text-gold">€{service.price}</p>
              </div>
              {selectedBarber !== 'any' && (
                <div>
                  <span className="text-gray-600">Barbiere:</span>
                  <p className="font-semibold text-black">{selectedBarber.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Selezione data e orario */}
      <section className="pb-12 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-8">
          <SectionHeader title="Seleziona Data e Orario" />
          
          {/* Date Picker */}
          <div className="text-center">
            <label className="block text-sm font-heading font-semibold text-black mb-3">
              Scegli la data
            </label>
            <div className="inline-block">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date!)}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                className="p-3 border-2 border-gray-300 rounded-lg font-primary text-black focus:border-gold focus:outline-none transition-colors text-center"
                calendarClassName="custom-datepicker"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-6">
            {perfectSlots.length > 0 && (
              <div>
                <h4 className="text-lg font-heading font-semibold text-black mb-4 text-center">
                  Orari Perfetti per il Tuo Servizio
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {perfectSlots.map((slot) => (
                    <TimeSlotButton
                      key={slot.value}
                      slot={slot}
                      isSelected={selectedTime === slot.value}
                      onClick={() => setSelectedTime(slot.value)}
                      isPerfect={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherSlots.length > 0 && (
              <div>
                <h4 className="text-lg font-heading font-semibold text-black mb-4 text-center">
                  Altri Orari Disponibili
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {otherSlots.map((slot) => (
                    <TimeSlotButton
                      key={slot.value}
                      slot={slot}
                      isSelected={selectedTime === slot.value}
                      onClick={() => setSelectedTime(slot.value)}
                    />
                  ))}
                </div>
              </div>
            )}

            {perfectSlots.length === 0 && otherSlots.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 font-primary">
                  Nessun orario disponibile per la data selezionata.
                  Prova con un'altra data.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dati cliente */}
      <section className="pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl space-y-8">
          <SectionHeader title="I Tuoi Dati" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Nome e Cognome"
              value={customerData.name}
              onChange={(value) => setCustomerData(prev => ({ ...prev, name: value }))}
              required={true}
              placeholder="Mario Rossi"
            />
            
            <InputField
              label="Telefono"
              type="tel"
              value={customerData.phone}
              onChange={(value) => setCustomerData(prev => ({ ...prev, phone: value }))}
              required={true}
              placeholder="+39 123 456 7890"
            />
            
            <InputField
              label="Email"
              type="email"
              value={customerData.email}
              onChange={(value) => setCustomerData(prev => ({ ...prev, email: value }))}
              placeholder="mario.rossi@email.com"
            />
            
            <InputField
              label="Data di Nascita"
              type="date"
              value={customerData.birthdate}
              onChange={(value) => setCustomerData(prev => ({ ...prev, birthdate: value }))}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleSubmit}
              disabled={!selectedTime || !customerData.name || !customerData.phone || submitting}
              className="bg-gold text-black px-8 py-4 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Prenotazione in corso...
                </span>
              ) : (
                'CONFERMA PRENOTAZIONE'
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SelectTimeSlot;