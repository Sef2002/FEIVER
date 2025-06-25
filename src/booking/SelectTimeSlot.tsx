import { useEffect, useState } from "react";
import { fetchDynamicSlots } from "@/services/fetchDynamicSlots";

export default function SelectTimeSlot() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSlots() {
      setLoading(true);
      try {
        const response = await fetchDynamicSlots({
          date: "2025-06-25",
          service_id: "id-servizio",
          barber_id: null,
          business_id: "id-business",
        });
        setSlots(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSlots();
  }, []);

  return (
    <div>
      {loading && <p>Caricamento slot...</p>}
      {!loading && slots.length === 0 && <p>Nessuno slot disponibile.</p>}
      {!loading &&
        slots.map((slot, idx) => (
          <div key={idx}>{slot.time}</div>
        ))}
    </div>
  );
}