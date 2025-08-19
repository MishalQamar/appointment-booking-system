import { EmployeeWithRelations } from './types';

export interface Slot {
  time: Date;
  employees: EmployeeWithRelations[];
}

export function createSlot(time: Date): Slot {
  return {
    time,
    employees: []
  };
}

export function addEmployeeToSlot(slot: Slot, employee: EmployeeWithRelations): void {
  slot.employees.push(employee);
}

export function hasEmployees(slot: Slot): boolean {
  return slot.employees.length > 0;
}

export function getEmployeeCount(slot: Slot): number {
  return slot.employees.length;
}
