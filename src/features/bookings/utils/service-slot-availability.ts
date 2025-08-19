import { 
  isWithinInterval, 
  subMinutes, 
  isBefore,
  isAfter
} from 'date-fns';
import { EmployeeWithRelations, Service, Period } from './types';
import { generateSlotRange } from './slot-range-generator';
import { calculateScheduleAvailability } from './schedule-availability';
import { eachDateInCollection } from './date-collection';
import { addEmployeeToSlot, hasEmployees } from './slot';

export function calculateServiceSlotAvailability(
  employees: EmployeeWithRelations[], 
  service: Service,
  startsAt: Date, 
  endsAt: Date
) {
  // Generate all possible slots
  const range = generateSlotRange(startsAt, endsAt, service.duration);

  // For each employee, calculate their availability
  employees.forEach(employee => {
    const periods = calculateScheduleAvailability(employee, service, startsAt, endsAt);

    const periodsWithoutAppointments = removeAppointments(periods, employee, service);

    // Add employee to slots that fall within their available periods
    periodsWithoutAppointments.forEach(period => {
      addAvailableEmployeeForPeriod(range, period, employee);
    });
  });

  // Remove empty slots
  return removeEmptySlots(range);
}

function removeAppointments(periods: Period[], employee: EmployeeWithRelations, service: Service): Period[] {
  let result = [...periods];

  // Get non-cancelled appointments
  const appointments = employee.appointments.filter(app => !app.cancelledAt);

  appointments.forEach(appointment => {
    result = result.flatMap(period => {
      // Fixed 15-minute buffer (more realistic)
      const bufferMinutes = 15;
      const exclusionStart = subMinutes(appointment.startDate, bufferMinutes);
      const exclusionEnd = appointment.endDate;

      // If period doesn't overlap with appointment, keep it
      if (
        isBefore(period.end, exclusionStart) ||
        isAfter(period.start, exclusionEnd)
      ) {
        return [period];
      }

      // Split period around appointment
      const splitPeriods: Period[] = [];

      // Add part before appointment
      if (isBefore(period.start, exclusionStart)) {
        splitPeriods.push({
          start: period.start,
          end: exclusionStart
        });
      }

      // Add part after appointment
      if (isAfter(period.end, exclusionEnd)) {
        splitPeriods.push({
          start: exclusionEnd,
          end: period.end
        });
      }

      return splitPeriods;
    });
  });

  return result;
}

function addAvailableEmployeeForPeriod(range: any, period: Period, employee: EmployeeWithRelations): void {
  eachDateInCollection(range, date => {
    date.slots.forEach(slot => {
      if (isWithinInterval(slot.time, period)) {
        addEmployeeToSlot(slot, employee);
      }
    });
  });
}

function removeEmptySlots(range: any): any {
  range.dates = range.dates.filter((date: any) => {
    // Filter out slots with no employees
    date.slots = date.slots.filter((slot: any) => hasEmployees(slot));
    return date.slots.length > 0; // Keep only dates with available slots
  });
  
  return range;
}
