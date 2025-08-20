import { Service } from '@prisma/client';
import { EmployeeWithRelations, Period } from '../../utils/types';
import { calculateScheduleAvailability } from '../../utils/schedule-availability';
import {
  createDateCollection,
  pushToDateCollection,
} from '../../utils/date-collection';
import {
  createDate,
  addSlotToDate,
  DateWithSlots,
} from '../../utils/date';
import { Slot } from '../../utils/slot';
import { eachDayOfInterval } from 'date-fns';

export interface BookingIntegrationResult {
  periods: Period[];
  dateCollection: ReturnType<typeof createDateCollection>;
  availableSlots: Slot[];
  totalSlots: number;
}
export function runCompleteBookingProcess(
  employee: EmployeeWithRelations,
  service: Service,
  startDate: Date,
  endDate: Date
): BookingIntegrationResult {
  // Step 1: Calculate availability periods
  const periods = calculateScheduleAvailability(
    employee,
    service,
    startDate,
    endDate
  );

  // Step 2: Create date collection
  const dateCollection = createDateCollection();

  // Step 3: Generate slots for each day
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  days.forEach((date) => {
    const dayPeriods = periods.filter(
      (period: Period) =>
        period.start.toDateString() === date.toDateString()
    );

    if (dayPeriods.length > 0) {
      const dateWithSlots = createDate(date);

      dayPeriods.forEach((period: Period) => {
        // Generate 30-minute slots within the period
        const slots = generateSlotsFromPeriod(
          period,
          employee,
          service
        );
        slots.forEach((slot) => addSlotToDate(dateWithSlots, slot));
      });

      pushToDateCollection(dateCollection, dateWithSlots);
    }
  });

  // Step 4: Get available slots
  const availableSlots = dateCollection.dates.flatMap(
    (date: DateWithSlots) =>
      date.slots.filter((slot: Slot) => slot.employees.length > 0)
  );

  return {
    periods,
    dateCollection,
    availableSlots,
    totalSlots: availableSlots.length,
  };
}

function generateSlotsFromPeriod(
  period: Period,
  employee: EmployeeWithRelations,
  service: Service
): Slot[] {
  const slots: Slot[] = [];
  const slotDurationMinutes = service.duration; // minutes
  let cursor = new Date(period.start);

  while (cursor <= period.end) {
    const next = new Date(
      cursor.getTime() + slotDurationMinutes * 60 * 1000
    );
    // Since period.end is the latest allowed START time, include when cursor <= end
    slots.push({ time: new Date(cursor), employees: [employee] });
    cursor = next;
  }

  return slots;
}
