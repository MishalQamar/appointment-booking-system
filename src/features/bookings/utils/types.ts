import { Prisma } from '@prisma/client';

export type Period = {
  start: Date;
  end: Date;
};

export type EmployeeWithMetaData = Prisma.EmployeeGetPayload<{
  include: {
    schedule: true;
    scheduleExculsion: true;
    appointments: true;
  };
}>;

// Alias used by some utils (e.g., slots) expecting EmployeeWithRelations
// Keep in sync with EmployeeWithMetaData to satisfy structural typing
export type EmployeeWithRelations = EmployeeWithMetaData;
