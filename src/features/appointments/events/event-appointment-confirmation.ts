import { inngest } from '@/lib/inngest';
import { sendAppointmentConfirmationEmail } from '../emails/send-appointment-confirmation-email';
import { Appointment, Service } from '@prisma/client';

export type AppointmentConfirmationEvent = {
  data: {
    appointment: Appointment;
    service: Service;
  };
};

export const appointmentConfirmationEvent = inngest.createFunction(
  { id: 'appointment-confirmation' },
  { event: 'app/appointment.appointment-created' },
  async ({ event }) => {
    const { appointment, service } = event.data;

    const result = await sendAppointmentConfirmationEmail(
      appointment,
      service
    );

    return { event, body: result };
  }
);
