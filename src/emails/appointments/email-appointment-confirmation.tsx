import { Appointment, Service } from '@prisma/client';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
  Hr,
  Button,
  Tailwind,
} from '@react-email/components';
import { format } from 'date-fns';

interface EmailAppointmentConfirmationProps {
  appointment: Appointment;
  service: Service;
}

const EmailAppointmentConfirmation = ({
  appointment,
  service,
}: EmailAppointmentConfirmationProps) => {
  const durationMinutes = Math.round(
    (appointment.endsAt.getTime() - appointment.startsAt.getTime()) /
      (1000 * 60)
  );

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="bg-white mx-auto py-5 mb-16">
            <Section className="text-center py-8 bg-orange-500 text-white">
              <Heading
                className="text-white text-3xl font-bold m-0 mb-2"
                style={{ fontFamily: 'cursive' }}
              >
                NEW LOOK
              </Heading>
              <Text className="text-white text-base m-0 opacity-80">
                Hair Salon
              </Text>
            </Section>

            <Section className="px-6 py-8">
              <Heading className="text-gray-900 text-2xl font-bold m-0 mb-4 text-center">
                Appointment Confirmed!
              </Heading>
              <Text className="text-gray-700 text-base leading-6 m-0 mb-4">
                Hi {appointment.name},
              </Text>
              <Text className="text-gray-700 text-base leading-6 m-0 mb-4">
                Your appointment has been successfully booked. Here
                are the details:
              </Text>

              <Section className="bg-gray-50 p-6 rounded-lg my-6">
                <Text className="text-gray-500 text-sm font-bold m-0 mb-1 uppercase">
                  Service:
                </Text>
                <Text className="text-gray-900 text-base m-0 mb-4 font-medium">
                  {service.title}
                </Text>

                <Text className="text-gray-500 text-sm font-bold m-0 mb-1 uppercase">
                  Date:
                </Text>
                <Text className="text-gray-900 text-base m-0 mb-4 font-medium">
                  {format(appointment.startsAt, 'EEEE, MMMM d, yyyy')}
                </Text>

                <Text className="text-gray-500 text-sm font-bold m-0 mb-1 uppercase">
                  Time:
                </Text>
                <Text className="text-gray-900 text-base m-0 mb-4 font-medium">
                  {format(appointment.startsAt, 'h:mm a')} (
                  {durationMinutes} minutes)
                </Text>

                <Text className="text-gray-500 text-sm font-bold m-0 mb-1 uppercase">
                  Price:
                </Text>
                <Text className="text-gray-900 text-base m-0 mb-4 font-medium">
                  £{(service.price / 100).toFixed(2)}
                </Text>
              </Section>

              <Hr className="border-gray-200 my-6" />

              <Text className="text-gray-700 text-base leading-6 m-0 mb-4">
                Please arrive 5 minutes before your appointment time.
                If you need to make any changes, please contact us as
                soon as possible.
              </Text>

              <Section className="text-center my-8">
                <Button
                  className="bg-orange-500 rounded-lg text-white text-base font-bold no-underline text-center inline-block py-3 px-6"
                  href="mailto:bookings@newlook.com"
                >
                  Contact Us
                </Button>
              </Section>

              <Text className="text-gray-500 text-sm text-center m-0 mt-8 italic">
                Thank you for choosing NEW LOOK! We look forward to
                seeing you.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailAppointmentConfirmation;
