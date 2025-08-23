import { Inngest, EventSchemas } from 'inngest';
import { AppointmentConfirmationEvent } from '@/features/appointments/events/event-appointment-confirmation';

type Events = {
  'app/appointment.appointment-created': AppointmentConfirmationEvent;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'new-look-salon',
  schemas: new EventSchemas().fromRecord<Events>(),
});
