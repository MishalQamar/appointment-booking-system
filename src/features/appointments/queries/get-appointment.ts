import prisma from '@/lib/primsa';

export const getAppointment = async (appointmentId: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      employee: true,
      service: true,
    },
  });

  if (!appointment) {
    return null;
  }

  return appointment;
};
