'use server';

import prisma from '@/lib/primsa';
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from '../utils/to-action-state';
import z from 'zod';
import { appointmentPath } from '@/paths';
import { redirect } from 'next/navigation';

const createAppointmentSchema = z.object({
  employeeId: z.string(),
  serviceId: z.string(),
  slot: z.string(),
  name: z.string(),
  email: z.string().email(),
  date: z.string(),
});

export const createAppointment = async (
  _actionState: ActionState,
  formData: FormData
) => {
  let appointment; // declare outside so it's accessible later

  try {
    const data = createAppointmentSchema.parse(
      Object.fromEntries(formData)
    );

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      select: { duration: true },
    });

    if (!service) {
      return toActionState('ERROR', 'Service not found');
    }

    const startsAt = new Date(data.slot);
    const endsAt = new Date(
      startsAt.getTime() + service.duration * 60 * 1000
    );
    const date = new Date(data.date);

    appointment = await prisma.appointment.create({
      data: {
        employeeId: data.employeeId,
        serviceId: data.serviceId,
        name: data.name,
        email: data.email,
        date,
        startsAt,
        endsAt,
      },
    });

    if (!appointment) {
      return toActionState('ERROR', 'Appointment not created');
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  // redirect happens here, outside of try/catch
  redirect(appointmentPath(appointment.id));
};
