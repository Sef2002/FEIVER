import { supabase } from "@/lib/supabaseClient"; // assicurati che il client sia configurato

function toMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export async function generateDynamicSlots({
  business_id,
  barber_id,
  requested_date,
  service_id,
  requested_time,
}: {
  business_id: string;
  barber_id: string;
  requested_date: string;
  service_id: string;
  requested_time?: string;
}) {
  const weekday = new Date(requested_date).toLocaleDateString("en-US", {
    weekday: "long",
  }).toLowerCase();

  // 1. Get duration
  const { data: service } = await supabase
    .from("services")
    .select("duration_min")
    .eq("id", service_id)
    .eq("business_id", business_id)
    .single();

  if (!service?.duration_min) return { perfect: [], other: [], best_match: null };

  const duration = service.duration_min;

  // 2. Get availability
  const { data: availabilities } = await supabase
    .from("barbers_availabilities")
    .select("start_time, end_time")
    .eq("barber_id", barber_id)
    .eq("weekday", weekday)
    .eq("business_id", business_id);

  if (!availabilities?.length) return { perfect: [], other: [], best_match: null };

  // 3. Get appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("appointment_time, duration_min")
    .eq("appointment_date", requested_date)
    .eq("barber_id", barber_id)
    .eq("business_id", business_id)
    .order("appointment_time", { ascending: true });

  const busyBlocks = (appointments ?? []).map((appt) => {
    const start = toMinutes(appt.appointment_time);
    return { start, end: start + appt.duration_min };
  });

  const perfect: any[] = [];
  const other: any[] = [];

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

  // 4. Matching
  let best_match: any = null;

  if (requested_time) {
    const requestedMin = toMinutes(requested_time);
    const maxDistance = 30;

    const validPerfect = perfect.filter((slot) => {
      const diff = Math.abs(toMinutes(slot.value) - requestedMin);
      return diff <= maxDistance;
    });

    if (validPerfect.length) {
      const closest = validPerfect.reduce((prev, curr) =>
        Math.abs(toMinutes(curr.value) - requestedMin) < Math.abs(toMinutes(prev.value) - requestedMin) ? curr : prev
      );
      best_match = { ...closest, is_perfect_match: true };
    } else {
      const all = [...perfect, ...other];
      if (all.length) {
        const closest = all.reduce((prev, curr) =>
          Math.abs(toMinutes(curr.value) - requestedMin) < Math.abs(toMinutes(prev.value) - requestedMin) ? curr : prev
        );
        best_match = { ...closest, is_perfect_match: false };
      }
    }
  }

  return { perfect, other, best_match };
}