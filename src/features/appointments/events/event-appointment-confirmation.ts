import { inngest } from '@/lib/inngest';
import { sendAppointmentConfirmationEmail } from '../emails/send-appointment-confirmation-email';

export type AppointmentConfirmationEvent = {
  data: {
    appointmentEmail: string;
    appointmentName: string;
    serviceName: string;
    appointmentTime: string;
    appointmentDate: string;
    appointmentDuration: number;
    appointmentPrice: number;
  };
};

export const appointmentConfirmationEvent = inngest.createFunction(
  { id: 'appointment-confirmation' },
  { event: 'app/appointment.appointment-created' },
  async ({ event }) => {
    const result = await sendAppointmentConfirmationEmail(event.data);

    return { event, body: result };
  }
);
