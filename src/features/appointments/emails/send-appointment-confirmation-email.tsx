import { resend } from '@/lib/resend';
import { Appointment, Service } from '@prisma/client';
import EmailAppointmentConfirmation from '@/emails/appointments/email-appointment-confirmation';

export const sendAppointmentConfirmationEmail = async (
  appointment: Appointment,
  service: Service
) => {
  return await resend.emails.send({
    from: 'no-reply@app.qamar-mishal.uk',
    to: appointment.email,
    subject: 'Appointment Confirmation',
    react: (
      <EmailAppointmentConfirmation
        appointment={appointment}
        service={service}
      />
    ),
  });
};
