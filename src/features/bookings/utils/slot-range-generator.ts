import { eachDayOfInterval, eachMinuteOfInterval, startOfDay, endOfDay } from 'date-fns';
import { createDate, addSlotToDate } from './date';
import { createSlot } from './slot';
import { createDateCollection, pushToDateCollection } from './date-collection';

export function generateSlotRange(startsAt: Date, endsAt: Date, interval: number) {
  const collection = createDateCollection();

  // Get all days in the range
  const days = eachDayOfInterval({
    start: startsAt,
    end: endsAt
  });

  days.forEach(day => {
    const dateWithSlots = createDate(day);

    // Generate time slots for this day
    const times = eachMinuteOfInterval({
      start: startOfDay(day),
      end: endOfDay(day)
    }, { step: interval });

    times.forEach(time => {
      const slot = createSlot(time);
      addSlotToDate(dateWithSlots, slot);
    });

    pushToDateCollection(collection, dateWithSlots);
  });

  return collection;
}
