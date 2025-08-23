import { resend } from '@/lib/resend';
import EmailAppointmentConfirmation from '@/emails/appointments/email-appointment-confirmation';

export const sendAppointmentConfirmationEmail = async (data: {
  email: string;
  name: string;
  serviceName: string;
  time: string;
  date: string;
  duration: number;
  price: string;
}) => {
  return await resend.emails.send({
    from: 'no-reply@app.qamar-mishal.uk',
    to: data.email,
    subject: 'Appointment Confirmation',
    react: <EmailAppointmentConfirmation appointmentData={data} />,
  });
};
