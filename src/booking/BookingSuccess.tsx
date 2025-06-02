// src/booking/BookingSuccess.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [appointmentInfo, setAppointmentInfo] = useState<any>(null);

  useEffect(() => {
    const name = localStorage.getItem('customerName');
    const service = JSON.parse(localStorage.getItem('selectedService') || '{}');
    const barber = JSON.parse(localStorage.getItem('selectedBarber') || '"any"');
    const selectedTime = localStorage.getItem('selectedTime');
    const selectedDate = localStorage.getItem('selectedDate');

    setCustomerName(name || '');
    setAppointmentInfo({
      service,
      barber,
      selectedTime,
      selectedDate,
    });

    // Clean up localStorage after displaying
    setTimeout(() => {
      localStorage.removeItem('customerName');
      localStorage.removeItem('selectedService');
      localStorage.removeItem('selectedBarber');
      localStorage.removeItem('selectedTime');
      localStorage.removeItem('selectedDate');
    }, 5000);
  }, []);

  return (
    <div className="max-w-xl mx-auto text-center py-20 px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Prenotazione completata!</h1>
      {customerName && (
        <p className="text-lg text-gray-700 mb-2">
          Grazie <span className="font-semibold">{customerName}</span> per la tua prenotazione.
        </p>
      )}
      {appointmentInfo && (
        <div className="text-gray-600 mb-6">
          <p><strong>Data:</strong> {appointmentInfo.selectedDate}</p>
          <p><strong>Ora:</strong> {appointmentInfo.selectedTime}</p>
          <p><strong>Servizio:</strong> {appointmentInfo.service?.name}</p>
          {appointmentInfo.barber !== 'any' && (
            <p><strong>Barbiere:</strong> {appointmentInfo.barber?.name}</p>
          )}
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="bg-[#5D4037] text-white px-6 py-2 rounded shadow hover:bg-[#4e342e]"
      >
        Torna alla Home
      </button>
    </div>
  );
};

export default BookingSuccess;