import { 
  eachDayOfInterval, 
  subMinutes, 
  startOfDay, 
  endOfHour,
  isAfter, 
  isBefore, 
  isWithinInterval
} from 'date-fns';
import { EmployeeWithRelations, Service, Period } from './types';

export function calculateScheduleAvailability(
  employee: EmployeeWithRelations, 
  service: Service,
  startsAt: Date, 
  endsAt: Date
): Period[] {
  let periods: Period[] = [];

  // Get all days in the range
  const days = eachDayOfInterval({ start: startsAt, end: endsAt });

  days.forEach(date => {
    const dayPeriods = addAvailabilityFromSchedule(employee, service, date);
    periods = periods.concat(dayPeriods);
  });

  // Subtract schedule exclusions
  employee.scheduleExclusions.forEach(exclusion => {
    periods = subtractScheduleExclusion(periods, exclusion);
  });

  // Exclude time that has passed today
  periods = excludeTimePassedToday(periods);

  return periods;
}

function addAvailabilityFromSchedule(employee: EmployeeWithRelations, service: Service, date: Date): Period[] {
  // Don't add availability for past dates
  if (isBefore(date, startOfDay(new Date()))) {
    return [];
  }

  // Find schedule for this date
  const schedule = employee.schedules.find(s => {
    if (!s.startDate || !s.endDate) return false;
    return isAfter(date, s.startDate) && isBefore(date, s.endDate);
  });

  if (!schedule) {
    return [];
  }

  // Get working hours for this day
  const workingHours = getWorkingHoursForDate(schedule, date);
  if (!workingHours) {
    return [];
  }

  // Create period for available time
  const periodStart = setTimeFromString(date, workingHours.startsAt);
  const periodEnd = subMinutes(
    setTimeFromString(date, workingHours.endsAt),
    service.duration
  );

  return [{ start: periodStart, end: periodEnd }];
}

function getWorkingHoursForDate(schedule: any, date: Date): { startsAt: string; endsAt: string } | null {
  const dayOfWeek = date.getDay();
  
  const hoursMap: Record<number, { start: string | null; end: string | null }> = {
    0: { start: schedule.sundayStartsAt, end: schedule.sundayEndsAt },
    1: { start: schedule.mondayStartsAt, end: schedule.mondayEndsAt },
    2: { start: schedule.tuesdayStartsAt, end: schedule.tuesdayEndsAt },
    3: { start: schedule.wednesdayStartsAt, end: schedule.wednesdayEndsAt },
    4: { start: schedule.thursdayStartsAt, end: schedule.thursdayEndsAt },
    5: { start: schedule.fridayStartsAt, end: schedule.fridayEndsAt },
    6: { start: schedule.saturdayStartsAt, end: schedule.saturdayEndsAt }
  };

  const hours = hoursMap[dayOfWeek];
  if (!hours.start || !hours.end) return null;

  return { startsAt: hours.start, endsAt: hours.end };
}

function setTimeFromString(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}

function subtractScheduleExclusion(periods: Period[], exclusion: any): Period[] {
  return periods.flatMap(period => {
    // If period doesn't overlap with exclusion, keep it
    if (
      isBefore(period.end, exclusion.startDate) ||
      isAfter(period.start, exclusion.endDate)
    ) {
      return [period];
    }

    // Split period around exclusion
    const result: Period[] = [];

    // Add part before exclusion
    if (isBefore(period.start, exclusion.startDate)) {
      result.push({
        start: period.start,
        end: exclusion.startDate
      });
    }

    // Add part after exclusion
    if (isAfter(period.end, exclusion.endDate)) {
      result.push({
        start: exclusion.endDate,
        end: period.end
      });
    }

    return result;
  });
}

function excludeTimePassedToday(periods: Period[]): Period[] {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfHour(now);

  return periods.flatMap(period => {
    // If period is not today, keep it
    if (!isWithinInterval(period.start, { start: todayStart, end: todayEnd })) {
      return [period];
    }

    // If period is today but in the future, keep it
    if (isAfter(period.start, now)) {
      return [period];
    }

    // Period is in the past, remove it
    return [];
  });
}
