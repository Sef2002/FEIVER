// src/booking/SelectTimeSlot.tsx
import { useEffect, useState } from 'react';
import { useBookingContext } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Slot = {
  label: string;
  value: string;
};

const SelectTimeSlot = () => {
  const navigate = useNavigate();
  const {
    selectedDate,
    selectedService,
    selectedBarber,
    setSelectedTime,
    selectedTime,
  } = useBookingContext();

  const [perfectSlots, setPerfectSlots] = useState<Slot[]>([]);
  const [otherSlots, setOtherSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDate || !selectedService || !selectedBarber) return;

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          'https://tjysjdbdwxhjwxuhthzh.supabase.co/functions/v1/dynamic-slots',
          {
            barber_id: selectedBarber.id,
            service_id: selectedService.id,
            date: selectedDate,
          }
        );

        const { perfect = [], other = [] } = response.data;
        setPerfectSlots(perfect);
        setOtherSlots(other);
      } catch (error) {
        console.error('Errore durante il recupero degli slot:', error);
        setPerfectSlots([]);
        setOtherSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedService, selectedBarber]);

  const handleSelect = (time: string) => {
    setSelectedTime(time);
    navigate('/riepilogo');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Seleziona un orario per il {selectedDate}
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Caricamento degli orari disponibili...</p>
      ) : (
        <>
          {perfectSlots.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Orari Perfetti</h3>
              <div className="flex flex-wrap gap-2">
                {perfectSlots.map((slot) => (
                  <TimeSlotButton
                    key={slot.value}
                    label={slot.label}
                    isSelected={selectedTime === slot.value}
                    isPerfect
                    onClick={() => handleSelect(slot.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {otherSlots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-yellow-700">Altri Orari Disponibili</h3>
              <div className="flex flex-wrap gap-2">
                {otherSlots.map((slot) => (
                  <TimeSlotButton
                    key={slot.value}
                    label={slot.label}
                    isSelected={selectedTime === slot.value}
                    isPerfect={false}
                    onClick={() => handleSelect(slot.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {perfectSlots.length === 0 && otherSlots.length === 0 && (
            <p className="text-center text-red-500 mt-8">
              Nessun orario disponibile per questa data.
            </p>
          )}
        </>
      )}
    </div>
  );
};

type TimeSlotButtonProps = {
  label: string;
  isSelected: boolean;
  isPerfect: boolean;
  onClick: () => void;
};

const TimeSlotButton = ({
  label,
  isSelected,
  isPerfect,
  onClick,
}: TimeSlotButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border-2 text-sm font-primary transition-all duration-300 ${
        isSelected
          ? 'bg-gold text-black border-gold shadow-lg'
          : isPerfect
          ? 'bg-green-100 border-green-600 text-green-800'
          : 'bg-white border-gray-400 text-gray-800 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
};

export default SelectTimeSlot;