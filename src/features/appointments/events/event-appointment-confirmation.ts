import { inngest } from '@/lib/inngest';
import { sendAppointmentConfirmationEmail } from '../emails/send-appointment-confirmation-email';

export const appointmentConfirmationEvent = inngest.createFunction(
  { id: 'appointment-confirmation' },
  { event: 'app/appointment.appointment-created' },
  async ({ event }) => {
    const result = await sendAppointmentConfirmationEmail(event.data);

    return { event, body: result };
  }
);
