/* SelectTimeSlot.tsx
   versione edge-function ready
*/
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

interface SlotsResponse {
  perfect_slots: string[]; // ["10:00", ...]
  other_slots: string[];
}

/* ---------- COMPONENTI UI INLINE ---------- */
// … SectionHeader, TimeSlotButton, InputField invariati …

/* ---------- PAGINA ---------- */
const SelectTimeSlot = () => {
  const navigate = useNavigate();

  /* --- state & localStorage ------------------------------------------------- */
  const selectedBarber: Barber | 'any' = JSON.parse(
    localStorage.getItem('selectedBarber') || '"any"',
  );
  const storedServiceId = localStorage.getItem('selectedServiceId');

  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [perfectSlots, setPerfectSlots] = useState<{ label: string; value: string }[]>([]);
  const [otherSlots, setOtherSlots] = useState<{ label: string; value: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    email: '',
    birthdate: '',
  });

  /* ------------------------------------------------------------------------
     1.  FETCH SERVIZIO
  ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!storedServiceId) {
      navigate('/prenota/servizio');
      return;
    }

    supabase
      .from('services')
      .select('id, name, price, duration_min')
      .eq('id', storedServiceId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('Service fetch error', error);
          navigate('/prenota/servizio');
        } else {
          setService(data as Service);
        }
      })
      .finally(() => setLoading(false));
  }, [storedServiceId, navigate]);

  /* ------------------------------------------------------------------------
     2.  FETCH SLOT DALLA EDGE FUNCTION
  ------------------------------------------------------------------------ */
  async function fetchSlotsFromEdge(
    dateISO: string,
    serviceId: string,
    barberId: string | null,
  ) {
    const { data, error } = await supabase.functions.invoke<SlotsResponse>('dynamic-slots', {
      body: {
        date: dateISO,
        service_id: serviceId,
        barber_id: barberId, // null = "qualsiasi staff"
        business_id: '268e0ae9-c539-471c-b4c2-1663cf598436',
      },
    });

    if (error) throw error;
    return data!;
  }

  useEffect(() => {
    if (!service) return;

    const dateISO = format(date, 'yyyy-MM-dd');
    const barberId = selectedBarber === 'any' ? null : selectedBarber.id;

    fetchSlotsFromEdge(dateISO, service.id, barberId)
      .then((res) => {
        setPerfectSlots(res.perfect_slots.map((t) => ({ label: t, value: t })));
        setOtherSlots(res.other_slots.map((t) => ({ label: t, value: t })));
      })
      .catch((err) => {
        console.error('Edge function error', err);
        setPerfectSlots([]);
        setOtherSlots([]);
      });
  }, [date, service, selectedBarber]);

  /* ------------------------------------------------------------------------
     3.  CHECK CONCORRENZA  (stessa di prima – opzionale ma consigliata)
  ------------------------------------------------------------------------ */
  const checkIfSlotAvailable = async (
    barberId: string,
    dateStr: string,
    time: string,
    duration: number,
  ) => {
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

    return !(appointments || []).some((a) => {
      const start = toMinutes(a.appointment_time);
      const end = start + a.duration_min;
      return slotStart < end && slotEnd > start;
    });
  };

  /* ------------------------------------------------------------------------
     4.  SUBMIT PRENOTAZIONE  (identico a prima salvo → business_id obbligatorio)
  ------------------------------------------------------------------------ */
  const handleSubmit = async () => {
    if (!selectedTime || !customerData.name || !customerData.phone || !service) {
      alert('Compila tutti i campi obbligatori.');
      return;
    }

    setSubmitting(true);
    const dateStr = format(date, 'yyyy-MM-dd');
    const barberId = selectedBarber === 'any' ? null : selectedBarber.id;

    try {
      if (barberId) {
        const ok = await checkIfSlotAvailable(barberId, dateStr, selectedTime, service.duration_min);
        if (!ok) {
          alert("L'orario selezionato non è più disponibile. Riprova.");
          setSubmitting(false);
          return;
        }
      }

      /* --- rubrica / contacts ------------------------------------------------ */
      let customerId: string | null = null;
      if (customerData.phone) {
        const { data: existing } = await supabase
          .from('rubrica') // usa “contacts” se il tuo schema è diverso
          .select('id')
          .eq('customer_phone', customerData.phone)
          .single();

        if (existing) {
          await supabase
            .from('rubrica')
            .update({
              customer_name: customerData.name,
              customer_email: customerData.email || null,
              customer_birthdate: customerData.birthdate || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);
          customerId = existing.id;
        } else {
          const { data: newC } = await supabase
            .from('rubrica')
            .insert({
              customer_name: customerData.name,
              customer_phone: customerData.phone,
              customer_email: customerData.email || null,
              customer_birthdate: customerData.birthdate || null,
            })
            .select('id')
            .single();
          customerId = newC?.id ?? null;
        }
      }

      /* --- appuntamento ----------------------------------------------------- */
      const { error: insertError } = await supabase.from('appointments').insert({
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
        appointment_status: 'in attesa',
        business_id: '268e0ae9-c539-471c-b4c2-1663cf598436',
        paid: false,
        payment_method: null,
      });

      if (insertError) {
        console.error(insertError);
        alert('Errore durante la creazione dell’appuntamento.');
        return;
      }

      /* --- redirect success -------------------------------------------------- */
      localStorage.setItem('customerName', customerData.name);
      localStorage.setItem('selectedTime', selectedTime);
      localStorage.setItem('selectedDate', dateStr);
      localStorage.setItem('selectedService', JSON.stringify(service));
      navigate('/prenota/successo');
    } catch (err) {
      console.error('Booking error', err);
      alert('Errore durante la prenotazione. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------
     5.  RENDER (identico a prima)
  ------------------------------------------------------------------------ */
  if (loading)
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
        <p className="mt-4 text-gray-600 font-primary">Caricamento…</p>
      </main>
    );

  if (!service)
    return (
      <main className="pt-24 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 font-primary">Servizio non trovato</p>
      </main>
    );

  /* --------------------------- UI JSX invariato --------------------------- */
  return (
    <main className="pt-24 bg-white min-h-screen">
      {/* … tutto il markup identico al tuo file originale … */}
    </main>
  );
};

export default SelectTimeSlot;