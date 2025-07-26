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

  if (availErr || !availabilities?.length) {
    console.error('No availability:', availErr);
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
    console.error('Appointment fetch error:', apptErr);
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

    /* 5a. Seleziona solo i blocchi che si sovrappongono
           (anche parzialmente) alla fascia */
    const localBusy = busyBlocks
      .filter((b) => !(b.end <= availStart || b.start >= availEnd)) // ← fix principale
      .sort((a, b) => a.start - b.start);

    /* 5b. Aggiungi blocchi fittizi per gestire bordi */
    localBusy.unshift({ start: availStart, end: availStart });
    localBusy.push({ start: availEnd, end: availEnd });

    /* 5c. Calcola spazi vuoti tra blocchi occupati */
    for (let i = 0; i < localBusy.length - 1; i++) {
      const gapStart = Math.max(localBusy[i].end, availStart);
      const gapEnd = Math.min(localBusy[i + 1].start, availEnd);
      const gap = gapEnd - gapStart;

      if (gap < duration) continue; // gap troppo piccolo

      /* Perfect slot (gap == duration) */
      if (gap === duration) {
        const label = fromMinutes(gapStart);
        perfect.push({ label, value: label });
      }

      /* Riempie il gap con slot regolari ogni `duration` minuti */
      let slotStart = gapStart;
      while (slotStart + duration <= gapEnd) {
        const label = fromMinutes(slotStart);

        /* Evita duplicati */
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