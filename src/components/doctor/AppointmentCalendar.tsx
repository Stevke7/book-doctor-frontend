import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AppointmentCalendarProps } from "../../types/appointment.types";
import { Circle } from "@mui/icons-material";

export const AppointmentCalendar = ({
	events,
	onSlotSelect,
}: AppointmentCalendarProps) => {
	const handleDateSelect = (info: any) => {
		onSlotSelect({
			start: info.start.toISOString(),
			end: info.end.toISOString(),
		});
	};

	console.log("DOCTOR CALENDAR EVENTS", events);

	return (
		<FullCalendar
			plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
			initialView="timeGridWeek"
			selectable={true}
			select={handleDateSelect}
			events={events}
			height="100%"
			eventMinHeight={50}
			eventContent={(eventInfo) => {
				return (
					<div
						className="flex flex-col gap-1 px-2 justify-start"
						style={{ color: eventInfo.event.extendedProps.fontColor }}
					>
						<div className="font-semibold">{eventInfo.event.title}</div>
						<div className="flex flex-row gap-2 items-center text-sm font-semibold">
							<Circle
								sx={{
									width: 8,
									height: 8,
									color: eventInfo.event.extendedProps.fontColor,
								}}
							/>
							{eventInfo.event.extendedProps.status}
						</div>
					</div>
				);
			}}
		/>
	);
};
