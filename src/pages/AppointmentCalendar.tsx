// components/appointments/Calendar.tsx
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth} from "../context/AuthContext.tsx";
import { appointmentService} from "../services/appointmentService.ts";
import AppointmentList from "../components/AppointmentList.tsx";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Appointment {
    _id: string;
    datetime: string;
    status: 'FREE' | 'PENDING' | 'APPROVED' | 'REJECTED';
    patient?: {
        _id: string;
        name: string;
    };
    doctor: {
        _id: string;
        name: string;
    };
}

const AppointmentCalendar = () => {
    const [date, setDate] = useState<Value>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Vremena za zakazivanje (možeš prilagoditi)
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30'
    ];

    const handleDateChange = async (newDate: Value) => {
        setDate(newDate);
        if (newDate instanceof Date) {
            setLoading(true);
            try {
                const response = await appointmentService.getAppointmentsByDate(newDate);
                setAppointments(response);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const isTimeSlotAvailable = (time: string) => {
        if (!(date instanceof Date)) return false;

        const dateTime = new Date(date.setHours(
            parseInt(time.split(':')[0]),
            parseInt(time.split(':')[1])
        ));

        return !appointments.some(apt =>
            new Date(apt.datetime).getTime() === dateTime.getTime() &&
            apt.status !== 'FREE'
        );
    };

    const handleBookAppointment = async () => {
        if (!(date instanceof Date) || !selectedTime) return;

        try {
            const appointmentDate = new Date(date);
            const [hours, minutes] = selectedTime.split(':');

            appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            console.log("TRYIIIIIING TO BOOK APPOINTMMENT", appointmentDate);

            const response = await appointmentService.bookAppointment(appointmentDate);
            console.log('Booking response',response);
            await handleDateChange(date);
            setSelectedTime('');
        } catch ( error) {
            console.error('Error in handleBookAppointment:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        minDate={new Date()}
                        className="rounded-lg shadow"
                    />
                </div>
                <div>
                    {loading ? (
                        <div>Loading appointments...</div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Available Time Slots</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`p-2 rounded ${
                                            isTimeSlotAvailable(time)
                                                ? selectedTime === time
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-blue-100 hover:bg-blue-200'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!isTimeSlotAvailable(time)}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            {selectedTime && (
                                <button
                                    onClick={handleBookAppointment}
                                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                >
                                    Book Appointment for {selectedTime}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <AppointmentList />
            </div>
        </div>
    );
};

export default AppointmentCalendar;