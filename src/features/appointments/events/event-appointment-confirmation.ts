import { inngest } from '@/lib/inngest';
import { sendAppointmentConfirmationEmail } from '../emails/send-appointment-confirmation-email';

import { Appointment, Service } from '@prisma/client';

export type AppointmentConfirmationEvent = {
  data: {
    appointment: Omit<
      Appointment,
      'date' | 'startsAt' | 'endsAt' | 'createdAt' | 'updatedAt'
    > & {
      date: string;
      startsAt: string;
      endsAt: string;
    };
    service: Omit<Service, 'createdAt' | 'updatedAt'>;
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
