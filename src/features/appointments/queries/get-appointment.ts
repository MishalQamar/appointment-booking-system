import prisma from '@/lib/primsa';

export const getAppointment = async (appointmentId: string) => {
  try {
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
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
};
