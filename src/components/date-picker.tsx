'use client';

import * as React from 'react';
import {
  format,
  isSameDay,
  startOfMonth,
  addYears,
  addMonths,
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
  const [month, setMonth] = React.useState<Date>(() => {
    // Ensure we start with current month or later, never past months
    const currentMonth = startOfMonth(new Date());
    const firstAvailableMonth = firstAvailableDate
      ? startOfMonth(firstAvailableDate)
      : currentMonth;

    return firstAvailableMonth >= currentMonth
      ? firstAvailableMonth
      : currentMonth;
  });

  // Set the initial dateWithSlots when component mounts
  React.useEffect(() => {
    const initialDateWithSlots = dates.find((d) =>
      isSameDay(d.date, firstAvailableDate)
    );
    if (initialDateWithSlots) {
      setDateWithSlots(initialDateWithSlots);
    }
  }, [dates, firstAvailableDate, setDateWithSlots]);

  const formattedStringDate = date ? format(date, 'yyyy-MM-dd') : '';

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full pl-3 text-left font-normal bg-white border-blue-grey-200 hover:border-purple-500 focus:border-purple-500 hover:bg-white focus:bg-white h-12',
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
              // Only allow navigation to current month or future months, but not beyond 3 months
              const currentMonth = startOfMonth(new Date());
              const maxMonth = startOfMonth(addMonths(new Date(), 2));

              // Prevent navigation to past months
              if (newMonth >= currentMonth && newMonth <= maxMonth) {
                setMonth(newMonth);
              }
            }}
            disabled={(date) => {
              const isDateAvailable = dates.some((availableDate) =>
                isSameDay(availableDate.date, date)
              );
              return !isDateAvailable;
            }}
            captionLayout="label"
            datesWithSlots={dates}
            currentMonth={month}
            maxMonth={addMonths(new Date(), 2)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
