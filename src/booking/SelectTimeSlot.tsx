import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAvailableTimeSlots } from '../lib/availability';

/* ─────────────────────────────────────────────── */

const SelectTimeSlot = () => {
  const navigate = useNavigate();

  // ID salvati negli step precedenti
  const selectedBarber   = JSON.parse(localStorage.getItem('selectedBarber') || '"any"');
  const storedServiceId  = localStorage.getItem('selectedServiceId');

  /* ─────── state ─────── */
  const [date,         setDate]         = useState<Date>(new Date());
  const [perfectSlots, setPerfectSlots] = useState<{ label: string; value: string }[]>([]);
  const [otherSlots,   setOtherSlots]   = useState<{ label: string; value: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState('');

  const [name,      setName]      = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [birthdate, setBirthdate] = useState('');      // facoltativo

  const [duration,  setDuration]  = useState(30);      // fallback

  /* ─────── recupera durata servizio ─────── */
  useEffect(() => {
    if (!storedServiceId) return;

    const fetchServiceDuration = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('duration_min')
        .eq('id', storedServiceId)
        .single();

      if (!error && data?.duration_min) setDuration(data.duration_min);
    };

    fetchServiceDuration();
  }, [storedServiceId]);

  /* ─────── recupera slot disponibili ─────── */
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
  }, [date, duration, selectedBarber, storedServiceId]);

  /* ─────── verifica sovrapposizione ─────── */
  const checkIfSlotAvailable = async (
    barberId: string,
    dateStr: string,
    time: string,
    duration: number
  ) => {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('appointment_time, duration_min')
      .eq('appointment_date', dateStr)
      .eq('barber_id', barberId);

    if (error) return false;

    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const start = toMin(time);
    const end   = start + duration;

    return !(appointments || []).some((a) => {
      const s = toMin(a.appointment_time);
      const e = s + a.duration_min;
      return start < e && end > s;
    });
  };

  /* ─────── submit booking ─────── */
  const handleSubmit = async () => {
    if (!selectedTime || !name || !phone || !email || !storedServiceId) {
      alert('Compila tutti i campi obbligatori.');
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    const barberId = selectedBarber === 'any' ? null : selectedBarber.id;

    if (barberId) {
      const ok = await checkIfSlotAvailable(barberId, dateStr, selectedTime, duration);
      if (!ok) {
        alert("L'orario selezionato non è più disponibile. Riprova.");
        return;
      }
    }

    const { error } = await supabase.from('appointments').insert({
      appointment_date: dateStr,
      appointment_time: `${selectedTime}:00`,
      duration_min:     duration,

      customer_name:      name,
      customer_phone:     phone,
      customer_email:     email,
      customer_birthdate: birthdate || null,

      barber_id:  barberId,
      service_id: storedServiceId,
    });

    if (error) {
      console.error(error);
      alert('Errore durante la prenotazione.');
      return;
    }

    // salva info per pagina “successo”
    localStorage.setItem('customerName',  name);
    localStorage.setItem('selectedTime',  selectedTime);
    localStorage.setItem('selectedDate',  dateStr);

    navigate('/prenota/successo');
  };

  /* ─────────────────────────────────────────────── */

  return (
    <main className="pt-24 bg-white min-h-screen">
      {/* …────────────────── HERO + DATE PICKER + SLOT LIST ────────────────── */}
      {/* (resto del JSX invariato, tagliato per brevità) */}

      {/*──────────────────  FORM DATI CLIENTE  ──────────────────*/}
      <section className="pb-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            {/* …titolo form… */}

            <div className="bg-white border-2 border-black rounded-lg p-8 space-y-6">
              {/* Nome */}
              <div>
                <label className="block font-semibold mb-2">Nome e Cognome *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4"
                />
              </div>

              {/* Telefono */}
              <div>
                <label className="block font-semibold mb-2">Numero di Telefono *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4"
                />
              </div>

              {/* Data di nascita (facoltativa) */}
              <div>
                <label className="block font-semibold mb-2">Data di nascita</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4"
                />
              </div>

              {/* Pulsante */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedTime || !name || !phone || !email}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                    selectedTime && name && phone && email
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
    </main>
  );
};

export default SelectTimeSlot;