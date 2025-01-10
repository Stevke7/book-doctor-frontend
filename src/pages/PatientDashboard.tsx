// components/appointments/Calendar.tsx
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Avatar from '@mui/material/Avatar';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useAuth} from "../context/AuthContext.tsx";
import { appointmentService} from "../services/appointmentService.ts";
import AppointmentList from "../components/AppointmentList.tsx";
import Logout from "../components/Logout.tsx";
import EventDialog from "../components/Dialog.tsx";

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

const PatientDashboard = () => {
    const [date, setDate] = useState<Value>(new Date());
    const [events, setEvents] = useState<Appointment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<{ startStr: string; endStr: string }>({ startStr: '', endStr: '' });



    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleEventSelect = (info) => {
        setSelectedSlot(info);
        setIsModalOpen(true);
    };

    const handleAddEvent = () => {
        if (eventTitle.trim()) {
            setEvents([
                ...events,
                {
                    title: eventTitle,
                    start: selectedSlot.startStr,
                    end: selectedSlot.endStr,
                },
            ]);
            setEventTitle('');
            setIsModalOpen(false);
        }
    };

    const formatDateTimeForDisplay = (datetime: string) => {
        const [date, time] = datetime.split('T'); // Separate date and time
        const formattedTime = time.split('+')[0].slice(0, 5); // Remove timezone and seconds
        return `${date} at ${formattedTime}`; // Combine date and formatted time
    };

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
            console.log("TRYING TO BOOK APPOINTMENT", appointmentDate);

            const response = await appointmentService.bookAppointment(appointmentDate);
            console.log('Booking response',response);
            await handleDateChange(date);
            setSelectedTime('');
        } catch ( error) {
            console.error('Error in handleBookAppointment:', error);
        }
    };

    return (

        <div className="flex w-full flex-row gap-4 py-4 px-4">
            <div className="flex flex-col  rounded-md w-1/4 gap-4 px-12 py-10 justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 items-center justify-center">
                        <Avatar sx={{width: 54, height: 54}}></Avatar>
                        <p className="font-semibold text-2xl">{user?.name}</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-3/4 flex flex-row bg-gray-200 items-start justify-start gap-6 rounded-md px-4 py-2">
                            <PermIdentityIcon className="text-sky-400"/>
                            <p className="font-medium text-lg text-sky-400">All Cases</p>
                        </div>
                        <div className="w-3/4 flex flex-row bg-gray-200 items-start justify-start gap-6 rounded-md px-4 py-2">
                            <PermIdentityIcon className="text-sky-400"/>
                            <p className="font-medium text-lg text-sky-400">Appointments</p>
                        </div>
                    </div>

                </div>
                <Logout/>
            </div>
            <div className=" flex flex-col w-3/4 rounded-md py-10 px-8 h-screen gap-6">
                <div className="flex flex-col w-full bg-cyan-100 p-4 rounded-md h-1/2">
                    <FullCalendar
                        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                        initialView="dayGridMonth"
                        selectable={true}
                        select={handleEventSelect}
                        events={events}
                        height="100%"
                    />
                    <EventDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedSlot={selectedSlot} handleAddEvent={handleAddEvent} eventTitle={eventTitle} setEventTitle={setEventTitle} />


                </div>
                <div className="flex flex-row w-full bg-cyan-100 p-6 rounded-md gap-6">
                    <div className="w-3/4">
                        {loading ? (
                            <div>Loading appointments...</div>
                        ) : (


                            <div className="w-full flex flex-col gap-4">
                                <h3 className="text-xl font-bold">Available Time Slots</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                                {timeSlots.map((time) => (
                                                     <button
                                                         key={time}
                                                         onClick={() => setSelectedTime(time)}
                                                         className={`p-2 rounded shadow-sm ${
                                                             isTimeSlotAvailable(time)
                                                                 ? selectedTime === time
                                                                     ? 'bg-blue-500 text-white'
                                                                     : 'bg-white hover:bg-blue-200'
                                                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                         }`}
                                                         disabled={!isTimeSlotAvailable(time)}
                                                     >
                                                         {time}
                                                     </button>
                                                ))}
                                        </div>
                                {selectedTime && (<button onClick={handleBookAppointment}
                                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Book Appointment for {selectedTime}</button>)}
                            </div>
                        )}
                    </div>
                    <AppointmentList />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;