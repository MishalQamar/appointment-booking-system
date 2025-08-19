import { Slot } from './slot';

export interface DateWithSlots {
  date: Date;
  slots: Slot[];
}

export function createDate(date: Date): DateWithSlots {
  return {
    date,
    slots: []
  };
}

export function addSlotToDate(dateWithSlots: DateWithSlots, slot: Slot): void {
  dateWithSlots.slots.push(slot);
}

export function containsSlot(dateWithSlots: DateWithSlots, time: string): boolean {
  return dateWithSlots.slots.some(slot => 
    slot.time.toTimeString().slice(0, 5) === time
  );
}

export function getSlotsCount(dateWithSlots: DateWithSlots): number {
  return dateWithSlots.slots.length;
}

export function hasSlots(dateWithSlots: DateWithSlots): boolean {
  return dateWithSlots.slots.length > 0;
}
