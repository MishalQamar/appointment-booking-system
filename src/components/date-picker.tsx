'use client';

import * as React from 'react';
import {
  format,
  startOfDay,
  startOfMonth,
  isBefore,
  isSameDay,
} from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateWithSlots } from '@/features/bookings/utils/date';

type DatePickerProps = {
  dates: DateWithSlots[];
};

export function DatePicker({ dates }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [month, setMonth] = React.useState<Date>(
    startOfMonth(new Date())
  );

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full pl-3 text-left font-normal border-gray-200 hover:border-orange-500 focus:border-orange-500 h-12',
              !date && 'text-muted-foreground'
            )}
          >
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          side="bottom"
          avoidCollisions={false}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            month={month}
            onMonthChange={(newMonth) => {
              // Only allow navigation to current month or future months
              const currentMonth = startOfMonth(new Date());
              if (newMonth >= currentMonth) {
                setMonth(newMonth);
              }
            }}
            fromDate={startOfDay(new Date())}
            disabled={(date) => {
              const isDateAvailable = dates.some((availableDate) =>
                isSameDay(availableDate.date, date)
              );

              return !isDateAvailable; // Disable if date not found
            }}
            captionLayout="label"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
