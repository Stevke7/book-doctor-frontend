import {
	Container,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Chip,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Edit, Add } from "@mui/icons-material";
import Logout from "../components/Logout";
import Avatar from "@mui/material/Avatar";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useAuth } from "../context/AuthContext.tsx";

const DoctorDashboard = () => {
	const { user } = useAuth();
	const [selectedSlot, setSelectedSlot] = useState(null); // Single slot
	const [events, setEvents] = useState([]);

	const notify = (message) => toast(message);

	// Handle selecting a slot on the calendar
	const handleDateSelect = (info) => {
		const newSlot = {
			start: info.start.toISOString(),
			end: info.end.toISOString(),
		};

		setSelectedSlot(newSlot); // Store the single slot
		notify("Slot selected! Click Save to confirm.");
	};

	const handleSaveSlot = async () => {
		if (!selectedSlot) {
			notify("No slot selected!");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const response = await fetch("http://localhost:5000/api/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					datetime: selectedSlot.start,
					doctor: user._id,
				}),
			});

			if (response.ok) {
				const result = await response.json();
				setEvents((prevEvents) => [
					...prevEvents,
					{
						title: `Dr.${user?.name}`,
						start: selectedSlot.start,
						end: selectedSlot.end,
					},
				]);
				setSelectedSlot(null); // Clear the selection after saving
				notify("Slot saved successfully!");
			} else {
				notify("Failed to save the slot. Please try again.");
				console.error("Save slot failed:", await response.json());
			}
		} catch (error) {
			notify("An error occurred while saving the slot.");
			console.error("Error saving slot:", error);
		}
	};

	return (
		<div className="flex flex-col w-full gap-4">
			<Logout />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<div className="flex flex-row w-full">
				<div className="flex flex-col  rounded-md w-1/4 gap-4 px-12 py-10 justify-between">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2 items-center justify-center">
							<Avatar sx={{ width: 54, height: 54 }}></Avatar>
							<p className="font-semibold text-2xl">{user?.name}</p>
							<p className="font-medium text-xl">{user?.role}</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-3/4 rounded-md py-10 px-8 h-screen gap-6">
					<div className="flex flex-col w-full bg-cyan-100 p-4 rounded-md h-1/2">
						<FullCalendar
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							initialView="timeGridWeek"
							selectable={true}
							select={handleDateSelect}
							events={events}
							height="100%"
						/>
					</div>
					<div className="flex flex-row w-full bg-cyan-100 p-6 rounded-md gap-6 h-1/2">
						<Button
							variant="contained"
							color="primary"
							startIcon={<Add />}
							onClick={handleSaveSlot}
						>
							Save Slot
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DoctorDashboard;
