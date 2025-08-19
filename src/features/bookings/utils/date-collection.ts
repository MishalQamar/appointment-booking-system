import { DateWithSlots, createDate } from './date';
import { Slot, hasEmployees } from './slot';

export interface DateCollection {
  dates: DateWithSlots[];
}

export function createDateCollection(): DateCollection {
  return { dates: [] };
}

export function pushToDateCollection(collection: DateCollection, dateWithSlots: DateWithSlots): void {
  collection.dates.push(dateWithSlots);
}

export function firstAvailableDate(collection: DateCollection): DateWithSlots | undefined {
  return collection.dates.find(date => date.slots.length >= 1);
}

export function hasSlotsInCollection(collection: DateCollection): DateWithSlots[] {
  return collection.dates.filter(date => !date.slots.every(slot => !hasEmployees(slot)));
}

export function getDates(collection: DateCollection): DateWithSlots[] {
  return collection.dates;
}

export function filterDateCollection(collection: DateCollection, predicate: (date: DateWithSlots) => boolean): DateCollection {
  const filtered = createDateCollection();
  collection.dates.filter(predicate).forEach(date => pushToDateCollection(filtered, date));
  return filtered;
}

export function eachDateInCollection(collection: DateCollection, callback: (date: DateWithSlots) => void): void {
  collection.dates.forEach(callback);
}
