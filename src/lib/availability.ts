import React, { useState, useEffect } from 'react';
import { getAvailableTimeSlots, AvailabilityResult } from './availability';

interface SelectTimeSlotProps {
  serviceId: string;
  barberId: string;
  date: string; // e.g. '2025-07-26'
  onSelect: (slot: string) => void;
}

export default function SelectTimeSlot({
  serviceId,
  barberId,
  date,
  onSelect,
}: SelectTimeSlotProps) {
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAvailableTimeSlots({ serviceId, barberId, date })
      .then((res) => {
        setAvailability(res);
      })
      .catch((err) => {
        console.error('Error fetching availability', err);
        setAvailability({ perfect: [], other: [] });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serviceId, barberId, date]);

  if (loading) {
    return <p>Caricamento orari...</p>;
  }

  if (
    !availability ||
    (availability.perfect.length === 0 && availability.other.length === 0)
  ) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Non ci sono orari disponibili per questa data.
      </p>
    );
  }

  return (
    <div className="time-slots-container">
      {availability.perfect.length > 0 && (
        <>
          <h3>Orari consigliati</h3>
          <div className="slots-grid">
            {availability.perfect.map((slot) => (
              <button
                key={slot}
                className="slot-button"
                onClick={() => onSelect(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </>
      )}

      {availability.other.length > 0 && (
        <>
          <h3>Altri orari</h3>
          <div className="slots-grid">
            {availability.other.map((slot) => (
              <button
                key={slot}
                className="slot-button"
                onClick={() => onSelect(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}