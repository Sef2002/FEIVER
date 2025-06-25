import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Slot = {
  label: string;
  value: string;
};

type Props = {
  business_id: string;
  barber_id: string;
  service_id: string;
  requested_date: string; // es: "2025-06-25"
  requested_time?: string; // es: "14:00"
};

export default function SelectTimeSlot(props: Props) {
  const { business_id, barber_id, service_id, requested_date, requested_time } = props;

  const [perfectSlots, setPerfectSlots] = useState<Slot[]>([]);
  const [otherSlots, setOtherSlots] = useState<Slot[]>([]);
  const [bestMatch, setBestMatch] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const fromMinutes = (min: number) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };

    const fetchSlots = async () => {
      setLoading(true);

      const weekday = new Date(requested_date)
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      // Step 1: get service duration
      const { data: service } = await supabase
        .from("services")
        .select("duration_min")
        .eq("id", service_id)
        .eq("business_id", business_id)
        .single();

      if (!service?.duration_min) return setLoading(false);
      const duration = service.duration_min;

      // Step 2: get availabilities
      const { data: availabilities } = await supabase
        .from("barbers_availabilities")
        .select("start_time, end_time")
        .eq("barber_id", barber_id)
        .eq("weekday", weekday)
        .eq("business_id", business_id);

      if (!availabilities?.length) return setLoading(false);

      // Step 3: get appointments
      const { data: appointments } = await supabase
        .from("appointments")
        .select("appointment_time, duration_min")
        .eq("appointment_date", requested_date)
        .eq("barber_id", barber_id)
        .eq("business_id", business_id)
        .order("appointment_time", { ascending: true });

      const busyBlocks = appointments?.map((appt) => {
        const start = toMinutes(appt.appointment_time);
        return { start, end: start + appt.duration_min };
      }) || [];

      // Step 4: build gaps
      const perfect: Slot[] = [];
      const other: Slot[] = [];

      for (const { start_time, end_time } of availabilities) {
        const start = toMinutes(start_time);
        const end = toMinutes(end_time);

        const localBusy = busyBlocks
          .filter((b) => b.start >= start && b.end <= end)
          .sort((a, b) => a.start - b.start);

        localBusy.unshift({ start, end: start });
        localBusy.push({ start: end, end });

        for (let i = 0; i < localBusy.length - 1; i++) {
          const gapStart = localBusy[i].end;
          const gapEnd = localBusy[i + 1].start;
          const gap = gapEnd - gapStart;

          if (gap === duration) {
            const label = fromMinutes(gapStart);
            perfect.push({ label, value: label });
          }

          let slotStart = gapStart;
          while (slotStart + duration <= gapEnd) {
            const label = fromMinutes(slotStart);
            if (!perfect.find((p) => p.value === label)) {
              other.push({ label, value: label });
            }
            slotStart += duration;
          }
        }
      }

      // Step 5: best match logic
      let best: Slot | null = null;

      if (requested_time) {
        const reqMin = toMinutes(requested_time);
        const maxDiff = 30;

        const validPerfect = perfect.filter(
          (slot) => Math.abs(toMinutes(slot.value) - reqMin) <= maxDiff
        );

        if (validPerfect.length > 0) {
          best = validPerfect.reduce((prev, curr) => {
            const prevDiff = Math.abs(toMinutes(prev.value) - reqMin);
            const currDiff = Math.abs(toMinutes(curr.value) - reqMin);
            return currDiff < prevDiff ? curr : prev;
          });
        } else {
          const all = [...perfect, ...other];
          if (all.length > 0) {
            best = all.reduce((prev, curr) => {
              const prevDiff = Math.abs(toMinutes(prev.value) - reqMin);
              const currDiff = Math.abs(toMinutes(curr.value) - reqMin);
              return currDiff < prevDiff ? curr : prev;
            });
          }
        }
      }

      setPerfectSlots(perfect);
      setOtherSlots(other);
      setBestMatch(best);
      setLoading(false);
    };

    fetchSlots();
  }, [business_id, barber_id, service_id, requested_date, requested_time]);

  if (loading) return <p>Caricamento slot...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Orari disponibili</h2>

      {perfectSlots.length > 0 && (
        <div>
          <h3 className="font-medium">Perfetti</h3>
          <div className="flex flex-wrap gap-2">
            {perfectSlots.map((slot) => (
              <button key={slot.value} className="border p-2 rounded">
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {otherSlots.length > 0 && (
        <div>
          <h3 className="font-medium">Altri</h3>
          <div className="flex flex-wrap gap-2">
            {otherSlots.map((slot) => (
              <button key={slot.value} className="border p-2 rounded text-gray-500">
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {bestMatch && (
        <div className="mt-4">
          <p>
            <strong>Consigliato:</strong> {bestMatch.label}
          </p>
        </div>
      )}
    </div>
  );
}