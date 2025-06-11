import { supabase } from './supabase';

export async function getAvailableTimeSlots(barberId: string, date: string, duration: number) {
  try {
    const weekday = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const { data: availabilities, error: availError } = await supabase
      .from('barbers_availabilities')
      .select('start_time, end_time')
      .eq('barber_id', barberId)
      .eq('weekday', weekday);

    if (availError || !availabilities?.length) {
      return { perfect: [], other: [] };
    }

    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('appointment_time, duration_min')
      .eq('appointment_date', date)
      .eq('barber_id', barberId)
      .order('appointment_time', { ascending: true });

    if (apptError) {
      return { perfect: [], other: [] };
    }

    const busyBlocks = (appointments || []).map((appt) => {
      const start = toMinutes(appt.appointment_time);
      const end = start + (appt.duration_min || 0);
      return { start, end };
    });

    const perfect: { label: string; value: string }[] = [];
    const other: { label: string; value: string }[] = [];

    for (const { start_time, end_time } of availabilities) {
      let current = toMinutes(start_time);
      const end = toMinutes(end_time);

      const localBusy = busyBlocks
        .filter(b => b.start >= current && b.end <= end)
        .sort((a, b) => a.start - b.start);

      // Add dummy blocks for easier edge handling
      localBusy.unshift({ start: current, end: current });
      localBusy.push({ start: end, end: end });

      for (let i = 0; i < localBusy.length - 1; i++) {
        const gapStart = localBusy[i].end;
        const gapEnd = localBusy[i + 1].start;
        const gap = gapEnd - gapStart;

        // Suggest perfect slot
        if (gap === duration) {
          const label = fromMinutes(gapStart);
          perfect.push({ label, value: label });
        }

        // Fill gap with as many standard slots as fit
        let slotStart = gapStart;
        while (slotStart + duration <= gapEnd) {
          const label = fromMinutes(slotStart);
          const alreadyPerfect = perfect.find(p => p.value === label);
          if (!alreadyPerfect) other.push({ label, value: label });
          slotStart += duration;
        }
      }
    }

    return { perfect, other };
  } catch (error) {
    console.error('Error getting available time slots:', error);
    return { perfect: [], other: [] };
  }
}

function toMinutes(timeString: string): number {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}