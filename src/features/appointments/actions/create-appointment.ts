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
import { inngest } from '@/lib/inngest';

const createAppointmentSchema = z.object({
  employeeId: z.string(),
  serviceId: z.string(),
  slot: z.string().min(1, 'Please select a time slot'),
  name: z
    .string()
    .min(1, 'Please enter your name')
    .max(191, 'Name is too long (maximum 191 characters)'),
  email: z
    .string()
    .min(1, 'Please enter your email')
    .email('Please enter a valid email address')
    .max(191, 'Email is too long (maximum 191 characters)'),
  date: z
    .string()
    .min(1, 'Please select a date')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date'),
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
    });

    if (!service) {
      return toActionState('ERROR', 'Service not found');
    }

    const startsAt = new Date(data.slot);
    const endsAt = new Date(
      startsAt.getTime() + service.duration * 60 * 1000
    );
    const date = new Date(data.date);

    // Check if the appointment is in the past
    if (startsAt <= new Date()) {
      return toActionState(
        'ERROR',
        'Cannot book appointments in the past. Please select a future time.'
      );
    }

    // Check for appointment collision first
    const conflictingAppointment = await prisma.appointment.findFirst(
      {
        where: {
          employeeId: data.employeeId,
          startsAt: { lt: endsAt },
          endsAt: { gt: startsAt },
          cancelledAt: null,
        },
      }
    );

    if (conflictingAppointment) {
      return toActionState(
        'ERROR',
        'This time slot is no longer available. Please select a different time.'
      );
    }

    // Create the appointment
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

    await inngest.send({
      name: 'app/appointment.appointment-created',
      data: {
        appointment: {
          ...appointment,
          date: appointment.date.toISOString(),
          startsAt: appointment.startsAt.toISOString(),
          endsAt: appointment.endsAt.toISOString(),
        },
        service: {
          ...service,
        },
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(appointmentPath(appointment.id));
};
