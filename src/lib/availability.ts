// src/lib/availability.ts
import { supabase } from './supabase';

// Utility to convert HH:MM to minutes
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Utility to convert minutes to HH:MM
function fromMinutes(mins: number): string {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
}

export async function getAvailableTimeSlots(barberId: string, date: string, duration: number) {
  const weekday = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  // 1. Fetch availabilities for that weekday
  const { data: availabilities, error: availError } = await supabase
    .from('barbers_availabilities')
    .select('start_time, end_time')
    .eq('barber_id', barberId)
    .eq('weekday', weekday);

  if (availError || !availabilities?.length) {
    console.error('No availability for this day:', availError);
    return [];
  }

  // 2. Fetch appointments for that barber/date
  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select('appointment_time, duration_min')
    .eq('appointment_date', date)
    .eq('barber_id', barberId)
    .order('appointment_time', { ascending: true });

  if (apptError) {
    console.error('Error fetching appointments:', apptError);
    return [];
  }

  const busyBlocks = appointments.map((appt) => {
    const start = toMinutes(appt.appointment_time);
    const end = start + appt.duration_min;
    return { start, end };
  });

  const slots: { label: string; value: string }[] = [];

  for (const { start_time, end_time } of availabilities) {
    let current = toMinutes(start_time);
    const end = toMinutes(end_time);

    // Sort existing appointments for comparison
    const localBusy = busyBlocks.filter(b => b.start >= current && b.end <= end);
    localBusy.push({ start: end, end }); // add virtual end
    localBusy.sort((a, b) => a.start - b.start);

    for (const block of localBusy) {
      while (current + duration <= block.start) {
        const label = fromMinutes(current);
        slots.push({ label, value: label });
        current += duration; // move forward by service duration
      }
      current = Math.max(current, block.end);
    }
  }

  return slots;
}
