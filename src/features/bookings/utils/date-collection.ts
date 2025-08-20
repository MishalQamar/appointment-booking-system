import { DateWithSlots } from './date';
import { hasEmployees } from './slot';

/**
 * Represents a collection of dates with their associated time slots
 * Used to manage multiple dates (e.g., a week, month, or date range)
 */
export interface DateCollection {
  dates: DateWithSlots[]; // Array of dates, each with their own slots
}

/**
 * Creates a new empty collection of dates
 * @returns A new DateCollection with empty dates array
 */
export function createDateCollection(): DateCollection {
  return { dates: [] };
}

/**
 * Adds a date with slots to the collection
 * @param collection - The date collection to add to
 * @param dateWithSlots - The date with its slots to add
 */
export function pushToDateCollection(
  collection: DateCollection,
  dateWithSlots: DateWithSlots
): void {
  collection.dates.push(dateWithSlots);
}

/**
 * Finds the first date in the collection that has at least one slot
 * Useful for showing the earliest available booking date
 * @param collection - The date collection to search in
 * @returns The first date with slots, or undefined if no dates have slots
 */
export function firstAvailableDate(
  collection: DateCollection
): DateWithSlots | undefined {
  return collection.dates.find((date) => date.slots.length >= 1);
}

/**
 * Filters the collection to only include dates that have available slots
 * A slot is considered available if it has at least one employee assigned
 * @param collection - The date collection to filter
 * @returns Array of dates that have available slots with employees
 */
export function hasSlotsInCollection(
  collection: DateCollection
): DateWithSlots[] {
  return collection.dates.filter(
    (date) => !date.slots.every((slot) => !hasEmployees(slot))
  );
}

/**
 * Returns all dates in the collection
 * @param collection - The date collection to get dates from
 * @returns Array of all dates in the collection
 */
export function getDates(
  collection: DateCollection
): DateWithSlots[] {
  return collection.dates;
}

/**
 * Filters the date collection based on a custom condition
 * @param collection - The date collection to filter
 * @param predicate - Function that returns true for dates to keep
 * @returns A new DateCollection containing only the filtered dates
 */
export function filterDateCollection(
  collection: DateCollection,
  predicate: (date: DateWithSlots) => boolean
): DateCollection {
  const filtered = createDateCollection();
  collection.dates
    .filter(predicate)
    .forEach((date) => pushToDateCollection(filtered, date));
  return filtered;
}

/**
 * Executes a callback function for each date in the collection
 * Useful for performing operations on all dates (e.g., logging, processing)
 * @param collection - The date collection to iterate over
 * @param callback - Function to execute for each date
 */
export function eachDateInCollection(
  collection: DateCollection,
  callback: (date: DateWithSlots) => void
): void {
  collection.dates.forEach(callback);
}
