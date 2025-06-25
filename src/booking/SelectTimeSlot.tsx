import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// ⚠️ PASSA QUESTI COME PROPS dal componente padre (vengono scelti dallo user negli step precedenti)
interface Props {
  service_id: string;
  barber_id: string;
  requested_date: string; // formato YYYY-MM-DD
  requested_time?: string; // es. "14:00" (opzionale)
  business_id?: string; // opzionale, ma noi lo forziamo sotto
}

interface Slot {
  label: string;
  value: string;
}

export default function SelectTimeSlot({
  service_id,
  barber_id,
  requested_date,
  requested_time,
  business_id = "268e0ae9-c539-471c-b4c2-1663cf598436"
}: Props) {
  const [perfect, setPerfect] = useState<Slot[]>([]);
  const [other, setOther] = useState<Slot[]>([]);
  const [bestMatch, setBestMatch] = useState<Slot | null>(null);

  // Utils
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const fromMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!service_id || !barber_id || !requested_date) {
      console.warn("Missing required props:", { service_id, barber_id, requested_date });
      return;
    }

    const loadSlots = async () => {
      // 1. Get service duration
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("duration_min")
        .eq("id", service_id)
        .eq("business_id", business_id)
        .single();

      if (serviceError || !service?.duration_min) {
        console.error("Errore nel servizio:", serviceError);
        return;
      }

      const duration = service.duration_min;

      // 2. Get weekday from date
      const weekday = new Date(requested_date).toLocaleDateString("en-US", {
        weekday: "long"
      }).toLowerCase();

      // 3. Get barber availability
      const { data: availabilities, error: availError } = await supabase
        .from("barbers_availabilities")
        .select("start_time, end_time")
        .eq("barber_id", barber_id)
        .eq("weekday", weekday)
        .eq("business_id", business_id);

      if (availError || !availabilities?.length) {
        console.warn("No availability");
        return;
      }

      // 4. Get appointments for that day
      const { data: appointments } = await supabase
        .from("appointments")
        .select("appointment_time, duration_min")
        .eq("appointment_date", requested_date)
        .eq("barber_id", barber_id)
        .eq("business_id", business_id)
        .order("appointment_time", { ascending: true });

      const busyBlocks = appointments?.map(appt => {
        const start = toMinutes(appt.appointment_time);
        return { start, end: start + appt.duration_min };
      }) ?? [];

      const perfectSlots: Slot[] = [];
      const otherSlots: Slot[] = [];

      for (const { start_time, end_time } of availabilities) {
        const start = toMinutes(start_time);
        const end = toMinutes(end_time);

        const localBusy = busyBlocks
          .filter(b => b.start >= start && b.end <= end)
          .sort((a, b) => a.start - b.start);

        localBusy.unshift({ start, end: start });
        localBusy.push({ start: end, end });

        for (let i = 0; i < localBusy.length - 1; i++) {
          const gapStart = localBusy[i].end;
          const gapEnd = localBusy[i + 1].start;
          const gap = gapEnd - gapStart;

          if (gap === duration) {
            const label = fromMinutes(gapStart);
            perfectSlots.push({ label, value: label });
          }

          let slotStart = gapStart;
          while (slotStart + duration <= gapEnd) {
            const label = fromMinutes(slotStart);
            if (!perfectSlots.find(p => p.value === label)) {
              otherSlots.push({ label, value: label });
            }
            slotStart += duration;
          }
        }
      }

      setPerfect(perfectSlots);
      setOther(otherSlots);

      // 🎯 Best match
      if (requested_time) {
        const requestedMin = toMinutes(requested_time);
        const maxDistance = 30;

        const validPerfect = perfectSlots.filter(slot => {
          const diff = Math.abs(toMinutes(slot.value) - requestedMin);
          return diff <= maxDistance;
        });

        if (validPerfect.length > 0) {
          const closest = validPerfect.reduce((prev, curr) => {
            const prevDiff = Math.abs(toMinutes(prev.value) - requestedMin);
            const currDiff = Math.abs(toMinutes(curr.value) - requestedMin);
            return currDiff < prevDiff ? curr : prev;
          });
          setBestMatch({ ...closest });
        } else {
          const all = [...perfectSlots, ...otherSlots];
          if (all.length > 0) {
            const closest = all.reduce((prev, curr) => {
              const prevDiff = Math.abs(toMinutes(prev.value) - requestedMin);
              const currDiff = Math.abs(toMinutes(curr.value) - requestedMin);
              return currDiff < prevDiff ? curr : prev;
            });
            setBestMatch({ ...closest });
          }
        }
      }
    };

    loadSlots();
  }, [service_id, barber_id, requested_date, requested_time, business_id]);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Orari perfetti</h2>
      <div className="flex flex-wrap gap-2">
        {perfect.map(slot => (
          <button key={slot.value} className="border px-3 py-1 rounded hover:bg-gray-100">
            {slot.label}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-4">Altri orari</h2>
      <div className="flex flex-wrap gap-2">
        {other.map(slot => (
          <button key={slot.value} className="border px-3 py-1 rounded hover:bg-gray-100">
            {slot.label}
          </button>
        ))}
      </div>

      {bestMatch && (
        <div className="mt-4 text-green-600">
          <strong>Consigliato:</strong> {bestMatch.label}
        </div>
      )}
    </div>
  );
}