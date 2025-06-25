import { useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAvailableTimeSlots } from '../lib/availability';

/* --------------------------------------------------
 * Types
 * ------------------------------------------------*/
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

/* --------------------------------------------------
 * UI helpers (unchanged)
 * ------------------------------------------------*/
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
      {isPerfect && <span className="text-xs text-green-600 mt-1">Perfetto</span>}
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

/* --------------------------------------------------
 * Helper: get or create contact without 406 errors
 * ------------------------------------------------*/
const getOrCreateContact = async (
  phone: string,
  name: string,
  email?: string,
  birthdate?: string
): Promise<string | null> => {
  // fetch at most 1 row to avoid PGRST116
  const { data: existing, error } = await supabase
    .from('contacts')
    .select('id')
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching contact:', error);
    return null;
  }

  if (existing) {
    // Update basic info (optional)
    await supabase
      .from('contacts')
      .update({
        customer_name: name,
        customer_email: email || null,
        customer_birthdate: birthdate || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    return existing.id as string;
  }

  // Create new contact
  const { data: newContact, error: insertErr } = await supabase
    .from('contacts')
    .insert({
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
      customer_birthdate: birthdate || null,
    })
    .select('id')
    .single();

  if (insertErr || !newContact) {
    console.error('Error creating contact:', insertErr);
    return null;
  }

  return newContact.id as string;
};

/* --------------------------------------------------
 * Page component
 * ------------------------------------------------*/
const SelectTimeSlot = () => {
  const navigate = useNavigate();
  const selectedBarber: Barber | 'any' = JSON.parse(
    localStorage.getItem('selectedBarber') || '"any"',
  );
  const storedServiceId = localStorage.getItem('selectedServiceId');

  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState(new Date());
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

  /* ----- Fetch service ----- */
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

  /* ----- Fetch slots whenever date/barber/service change ----- */
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

  /* ----- Slot availability check ----- */
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

    for (const appt of appointments || []) {
      const apptStart = toMinutes(appt.appointment_time);
      const apptEnd = apptStart + appt.duration_min;
      if (slotStart < apptEnd && slotEnd > apptStart) return false;
    }

    return true;
  };

  /* ----- Submit ----- */
  const handleSubmit = async () => {
    if (!selectedTime || !customerData.name || !customerData.phone || !service) {
      alert('Compila tutti i campi obbligatori.');
      return;
    }

    setSubmitting(true);

    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const barberId = selectedBarber === 'any' ? null : selectedBarber.id;

      // check availability if barber specific
      if (barberId) {
        const isAvailable = await checkIfSlotAvailable(
          barberId,
          dateStr,
          selectedTime,
          service.duration_min,
        );
        if (!isAvailable) {
          alert("L'orario selezionato non è più disponibile. Riprova.");
          setSubmitting(false);
          return;
        }
      }

      /* 1️⃣ get/create contact safely */
      const contactId = await getOrCreateContact(
        customerData.phone,
        customerData.name,
        customerData.email,
        customerData.birthdate,
      );

      if (!contactId) {
        alert('Errore nel creare o recuperare il contatto.');
        setSubmitting(false);
        return;
      }

      /* 2️⃣ insert appointment */
      const appointmentData = {
        service_id: service.id,
        barber_id: barberId,
        customer_id: contactId,
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
      };

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentData);

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        alert('Errore durante la creazione dell\'appuntamento.');
        return;
      }

      /* 3️⃣ store summary & redirect */
      localStorage.setItem('customerName', customerData.name);
      localStorage.setItem('selectedTime', selectedTime);
      localStorage.setItem('selectedDate', dateStr);
      localStorage.setItem('selectedService', JSON.stringify(service));

      navigate('/prenota/successo');
    } catch (err) {
      console.error('Error during booking:', err);
      alert('Errore durante la prenotazione. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ----- Loading / error UI logic stays the same (omitted for brevity) ----- */

  /* ... Rest of JSX unchanged ... */
};

export default SelectTimeSlot;
