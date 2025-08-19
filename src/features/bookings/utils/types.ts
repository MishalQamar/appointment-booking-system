import {
  Employee,
  Schedule,
  ScheduleExculsion,
  Appointment,
} from '@prisma/client';

export interface Period {
  start: Date;
  end: Date;
}

export type EmployeeWithRelations = Employee & {
  schedules: Schedule[];
  scheduleExclusions: ScheduleExculsion[];
  appointments: Appointment[];
};
