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
  setDateWithSlots: React.Dispatch<
    React.SetStateAction<DateWithSlots>
  >;
};

export function DatePicker({
  dates,
  setDateWithSlots,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Find the first available date from the dates prop
  const firstAvailableDate = React.useMemo(
    () => (dates && dates.length > 0 ? dates[0].date : new Date()),
    [dates]
  );

  const [date, setDate] = React.useState<Date>(firstAvailableDate);

  // Set the initial dateWithSlots when component mounts
  React.useEffect(() => {
    const initialDateWithSlots = dates.find((d) =>
      isSameDay(d.date, firstAvailableDate)
    );
    if (initialDateWithSlots) {
      setDateWithSlots(initialDateWithSlots);
    }
  }, [dates, firstAvailableDate, setDateWithSlots]);

  const [month, setMonth] = React.useState<Date>(
    firstAvailableDate
      ? startOfMonth(firstAvailableDate)
      : startOfMonth(new Date())
  );
  const formattedStringDate = date ? format(date, 'yyyy-MM-dd') : '';

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
            {date ? format(date, 'PPP') : <span>Select a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            <input
              type="hidden"
              name="date"
              value={formattedStringDate}
            />
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
            onSelect={(selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
                // Find the corresponding DateWithSlots and update parent state
                const selectedDateWithSlots = dates.find((d) =>
                  isSameDay(d.date, selectedDate)
                );
                if (selectedDateWithSlots) {
                  setDateWithSlots(selectedDateWithSlots);
                }
              }
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
            datesWithSlots={dates}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
