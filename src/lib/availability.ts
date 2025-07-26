// src/lib/availability.ts
import { supabase } from './supabase';

export async function getAvailableTimeSlots(
  barberId: string,
  date: string,
  duration: number
) {
  /* --------------------------------------------------
   * 1. Ricava weekday (es. 'wednesday')
   * ------------------------------------------------*/
  const weekday = new Date(date)
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();

  /* --------------------------------------------------
   * 2. Fetch disponibilità (start_time, end_time)
   * ------------------------------------------------*/
  const { data: availabilities, error: availErr } = await supabase
    .from('barbers_availabilities')
    .select('start_time, end_time')
    .eq('barber_id', barberId)
    .eq('weekday', weekday);

  // If no availability or query error, just return empty slots without logging anything
  if (availErr || !availabilities?.length) {
    return { perfect: [], other: [] };
  }

  /* --------------------------------------------------
   * 3. Fetch appuntamenti esistenti per il giorno
   * ------------------------------------------------*/
  const { data: appointments, error: apptErr } = await supabase
    .from('appointments')
    .select('appointment_time, duration_min')
    .eq('appointment_date', date)
    .eq('barber_id', barberId)
    .order('appointment_time', { ascending: true });

  if (apptErr) {
    return { perfect: [], other: [] };
  }

  /* --------------------------------------------------
   * 4. Trasforma appuntamenti in blocchi minuteria
   * ------------------------------------------------*/
  const busyBlocks = (appointments || []).map((appt) => {
    const start = toMinutes(appt.appointment_time);
    const end = start + appt.duration_min;
    return { start, end };
  });

  const perfect: { label: string; value: string }[] = [];
  const other: { label: string; value: string }[] = [];

  /* --------------------------------------------------
   * 5. Per ogni fascia di disponibilità, genera slot
   * ------------------------------------------------*/
  for (const { start_time, end_time } of availabilities) {
    const availStart = toMinutes(start_time);
    const availEnd = toMinutes(end_time);

    const localBusy = busyBlocks
      .filter((b) => !(b.end <= availStart || b.start >= availEnd))
      .sort((a, b) => a.start - b.start);

    localBusy.unshift({ start: availStart, end: availStart });
    localBusy.push({ start: availEnd, end: availEnd });

    for (let i = 0; i < localBusy.length - 1; i++) {
      const gapStart = Math.max(localBusy[i].end, availStart);
      const gapEnd = Math.min(localBusy[i + 1].start, availEnd);
      const gap = gapEnd - gapStart;

      if (gap < duration) continue;

      if (gap === duration) {
        const label = fromMinutes(gapStart);
        perfect.push({ label, value: label });
      }

      let slotStart = gapStart;
      while (slotStart + duration <= gapEnd) {
        const label = fromMinutes(slotStart);
        if (!perfect.find((p) => p.value === label) && !other.find((o) => o.value === label)) {
          other.push({ label, value: label });
        }
        slotStart += duration;
      }
    }
  }

  return { perfect, other };
}

/* --------------------------------------------------
 * Helpers
 * ------------------------------------------------*/
function toMinutes(timeString: string): number {
  const [h, m] = timeString.split(':').map(Number);
  return h * 60 + m;
}

function fromMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}