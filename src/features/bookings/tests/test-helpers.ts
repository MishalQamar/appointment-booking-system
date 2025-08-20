import { Service } from '@prisma/client';
import { EmployeeWithMetaData } from '../utils';

export function createTestEmployee(
  name: string = 'Alice',
  workingHours: { start: string; end: string } = {
    start: '09:00',
    end: '17:00',
  }
): EmployeeWithMetaData {
  return {
    id: `emp-${name.toLowerCase()}`,
    name,
    profilePictureUrl: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    schedule: [
      {
        id: 'schedule-1',
        employeeId: `emp-${name.toLowerCase()}`,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        mondayStartsAt: workingHours.start,
        mondayEndsAt: workingHours.end,
        tuesdayStartsAt: workingHours.start,
        tuesdayEndsAt: workingHours.end,
        wednesdayStartsAt: workingHours.start,
        wednesdayEndsAt: workingHours.end,
        thursdayStartsAt: workingHours.start,
        thursdayEndsAt: workingHours.end,
        fridayStartsAt: workingHours.start,
        fridayEndsAt: workingHours.end,
        saturdayStartsAt: null,
        saturdayEndsAt: null,
        sundayStartsAt: null,
        sundayEndsAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    scheduleExculsion: [],
    appointments: [],
  };
}

export function createTestService(
  name: string = 'Hair Cut',
  duration: number = 30,
  price: number = 50
): Service {
  return {
    id: `service-${name.toLowerCase().replace(' ', '-')}`,
    title: name,
    duration,
    price,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };
}

export function createEmployeeWithExclusions(
  exclusions: Array<{ start: string; end: string; date?: Date }>
): EmployeeWithMetaData {
  const employee = createTestEmployee();

  employee.scheduleExculsion = exclusions.map((exclusion, index) => {
    const base = exclusion.date || new Date('2024-01-15');
    return {
      id: `exclusion-${index}`,
      employeeId: employee.id,
      startDate: setTime(base, exclusion.start),
      endDate: setTime(base, exclusion.end),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };
  });

  return employee;
}

export function createEmployeeWithAppointments(
  appointments: Array<{
    start: string;
    end: string;
    date?: Date;
    serviceId?: string;
  }>
): EmployeeWithMetaData {
  const employee = createTestEmployee();

  employee.appointments = appointments.map((appointment, index) => ({
    id: `appointment-${index}`,
    employeeId: employee.id,
    serviceId: appointment.serviceId || 'service-1',
    startDate: setTime(
      appointment.date || new Date('2024-01-15'),
      appointment.start
    ),
    endDate: setTime(
      appointment.date || new Date('2024-01-15'),
      appointment.end
    ),
    cancelledAt: null,
    name: 'Test Customer',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }));

  return employee;
}

function setTime(date: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}
