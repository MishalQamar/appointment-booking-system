import { resend } from '@/lib/resend';
import EmailAppointmentConfirmation from '@/emails/appointments/email-appointment-confirmation';
import { Appointment, Service } from '@prisma/client';

type SerializedAppointment = Omit<
  Appointment,
  'date' | 'startsAt' | 'endsAt' | 'createdAt' | 'updatedAt'
> & {
  date: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
};

type SerializedService = Omit<Service, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export const sendAppointmentConfirmationEmail = async (
  appointment: SerializedAppointment,
  service: SerializedService
) => {
  // Convert ISO strings back to Date objects for the email template
  const appointmentWithDates: Appointment = {
    ...appointment,
    date: new Date(appointment.date),
    startsAt: new Date(appointment.startsAt),
    endsAt: new Date(appointment.endsAt),
    createdAt: new Date(appointment.createdAt),
    updatedAt: new Date(appointment.updatedAt),
  };

  const serviceWithDates: Service = {
    ...service,
    createdAt: new Date(service.createdAt),
    updatedAt: new Date(service.updatedAt),
  };

  return await resend.emails.send({
    from: 'no-reply@app.qamar-mishal.uk',
    to: appointment.email,
    subject: 'Appointment Confirmation',
    react: (
      <EmailAppointmentConfirmation
        appointment={appointmentWithDates}
        service={serviceWithDates}
      />
    ),
  });
};
