import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Scissors, Phone, Mail, MapPin } from 'lucide-react';

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr;
  };

  return (
    <main className="pt-24 bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6 text-black">
                PRENOTAZIONE CONFERMATA!
              </h1>
              <div className="w-20 h-[2px] bg-gold mx-auto mb-6"></div>
              {customerName && (
                <p className="text-xl text-gray-600 font-primary">
                  Grazie <span className="font-semibold text-black">{customerName}</span>, 
                  la tua prenotazione è stata confermata con successo.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Details */}
      {appointmentInfo && (
        <section className="pb-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200 shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-black mb-2">
                  Dettagli del Tuo Appuntamento
                </h2>
                <div className="w-16 h-[2px] bg-gold mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Date & Time */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <Calendar className="text-gold mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-heading font-semibold text-black mb-1">Data</h3>
                      <p className="text-gray-600 font-primary">
                        {formatDate(appointmentInfo.selectedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <Clock className="text-gold mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-heading font-semibold text-black mb-1">Orario</h3>
                      <p className="text-gray-600 font-primary">
                        {formatTime(appointmentInfo.selectedTime)}
                      </p>
                    </div>
                  </div>

                  {/* Service */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <Scissors className="text-gold mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-heading font-semibold text-black mb-1">Servizio</h3>
                      <p className="text-gray-600 font-primary">
                        {appointmentInfo.service?.name}
                      </p>
                      {appointmentInfo.service?.price && (
                        <p className="text-gold font-heading font-bold mt-1">
                          €{appointmentInfo.service.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Barber */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <User className="text-gold mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-heading font-semibold text-black mb-1">Barbiere</h3>
                      <p className="text-gray-600 font-primary">
                        {appointmentInfo.barber === 'any' || !appointmentInfo.barber?.name
                          ? 'Primo staff disponibile'
                          : appointmentInfo.barber.name
                        }
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-heading font-semibold text-black mb-1">Stato</h3>
                      <p className="text-green-600 font-primary font-semibold">
                        Confermato
                      </p>
                      <p className="text-sm text-gray-500 font-primary mt-1">
                        In attesa di pagamento
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  {appointmentInfo.service?.duration_min && (
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                      <Clock className="text-gold mt-1 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="font-heading font-semibold text-black mb-1">Durata</h3>
                        <p className="text-gray-600 font-primary">
                          {appointmentInfo.service.duration_min} minuti
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section className="pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-black mb-2">
              Informazioni Importanti
            </h2>
            <div className="w-16 h-[2px] bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-heading font-semibold text-black mb-4">
                Contatti del Salone
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="text-gold flex-shrink-0" size={18} />
                  <div>
                    <p className="text-gray-600 font-primary">
                      <a href="tel:0297383541" className="hover:text-gold transition-colors">
                        02 9738 3541
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gold flex-shrink-0" size={18} />
                  <div>
                    <p className="text-gray-600 font-primary">
                      <a href="mailto:info@seventyfourparrucchieri.it" className="hover:text-gold transition-colors">
                        info@seventyfourparrucchieri.it
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-gold mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-gray-600 font-primary">
                      Via Giuseppe Bardelli, 12<br />
                      20131 Milano MI
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-heading font-semibold text-black mb-4">
                Note Importanti
              </h3>
              <div className="space-y-3 text-gray-600 font-primary text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ti consigliamo di arrivare 5 minuti prima dell'orario prenotato</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p>In caso di ritardo superiore a 15 minuti, potremmo dover riprogrammare l'appuntamento</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p>Per cancellazioni o modifiche, contattaci almeno 24 ore prima</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p>Il pagamento può essere effettuato in contanti o carta al termine del servizio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-heading font-bold mb-6 text-black">
              Cosa Fare Ora?
            </h2>
            <p className="text-gray-600 font-primary mb-8">
              La tua prenotazione è confermata. Puoi tornare alla home page o contattarci per qualsiasi domanda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-gold text-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-opacity-90 shadow-lg hover:shadow-xl"
              >
                TORNA ALLA HOME
              </button>
              <a
                href="tel:0297383541"
                className="bg-white text-black border-2 border-black px-8 py-3 rounded-lg font-heading font-bold text-lg transition-all duration-300 hover:bg-gray-50 hover:border-gold"
              >
                CHIAMA IL SALONE
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingSuccess;