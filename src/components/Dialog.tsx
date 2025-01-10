import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

interface EventDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSlot: { startStr: string; endStr: string };
    handleAddEvent: () => void;
    eventTitle: string;
    setEventTitle: React.Dispatch<React.SetStateAction<string>>;
}

const EventDialog: React.FC<EventDialogProps> = ({ isOpen, onClose, selectedSlot, handleAddEvent, eventTitle, setEventTitle }) => {
    const formatDateTimeForDisplay = (datetime: string) => {
        const [date, time] = datetime?.split('T');
        const formattedTime = time?.split('+')[0].slice(0, 5);
        return `${date} at ${formattedTime}`;
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Add Event</DialogTitle>
            <DialogContent>
                <p>
                    Selected Time:{" "}
                    <strong>
                        {formatDateTimeForDisplay(selectedSlot?.startStr)}
                    </strong>
                </p>
                <TextField
                    label="Event Title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        handleAddEvent();
                        onClose();
                    }}
                    color="primary"
                >
                    Add Event
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventDialog;