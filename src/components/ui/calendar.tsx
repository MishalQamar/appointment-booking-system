'use client';

import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
} from 'react-day-picker';
import { startOfMonth, isSameMonth } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { DateWithSlots } from '@/features/bookings/utils/date';
import pluralize from 'pluralize';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  datesWithSlots,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  datesWithSlots?: DateWithSlots[];
}) {
  // Force captionLayout to always be "label" to remove dropdowns
  const forcedCaptionLayout = 'label';
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2 [--cell-size:--spacing(12)]',
        className
      )}
      captionLayout={forcedCaptionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'flex gap-4 flex-col md:flex-row relative',
          defaultClassNames.months
        ),
        month: cn(
          'flex flex-col w-full gap-4',
          defaultClassNames.month
        ),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none text-gray-400',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none text-black',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'absolute bg-popover inset-0 opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'select-none font-bold text-black text-lg',
          defaultClassNames.caption_label
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-black flex-1 font-normal text-sm select-none',
          defaultClassNames.weekday
        ),
        week: cn('flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'select-none w-(--cell-size)',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'text-[0.8rem] select-none text-muted-foreground',
          defaultClassNames.week_number
        ),
        day: cn(
          'relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-none [&:last-child[data-selected=true]_button]:rounded-none group/day aspect-square select-none !rounded-none',
          defaultClassNames.day
        ),
        range_start: cn(
          '!rounded-none',
          defaultClassNames.range_start
        ),
        range_middle: cn(
          '!rounded-none',
          defaultClassNames.range_middle
        ),
        range_end: cn('!rounded-none', defaultClassNames.range_end),
        today: cn(
          'bg-orange-100 text-black data-[selected=true]:rounded-none !rounded-none',
          defaultClassNames.today
        ),
        outside: cn(
          'text-gray-400 aria-selected:text-gray-400 !rounded-none',
          defaultClassNames.outside
        ),
        disabled: cn(
          'text-gray-400 opacity-50 !rounded-none',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                className={cn('size-4', className)}
                {...props}
              />
            );
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('size-4', className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon
              className={cn('size-4', className)}
              {...props}
            />
          );
        },
        PreviousMonthButton: ({
          className,
          ...buttonProps
        }: React.ComponentProps<typeof Button>) => {
          // Get the current month from the calendar context
          const currentDisplayMonth =
            (buttonProps as { displayMonth?: Date }).displayMonth ||
            (props as { month?: Date }).month ||
            new Date();
          const today = new Date();

          // Disable the button if we're at current month or earlier
          const isDisabled =
            isSameMonth(currentDisplayMonth, startOfMonth(today)) ||
            currentDisplayMonth < startOfMonth(today);

          return (
            <Button
              variant={buttonVariant}
              className={cn(
                'size-(--cell-size) p-0 select-none',
                isDisabled && 'opacity-50 cursor-not-allowed',
                className
              )}
              disabled={isDisabled}
              {...buttonProps}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
          );
        },
        DayButton: ({ ...buttonProps }) => (
          <CalendarDayButton
            {...buttonProps}
            datesWithSlots={datesWithSlots}
          />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  datesWithSlots,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  datesWithSlots?: DateWithSlots[];
}) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  // Get the number of slots for this date
  const slotsCount =
    datesWithSlots?.find(
      (dateWithSlots) =>
        dateWithSlots.date.toDateString() === day.date.toDateString()
    )?.slots?.length || 0;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'data-[selected-single=true]:bg-orange-400 data-[selected-single=true]:text-white data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-orange-400 data-[range-start=true]:text-white data-[range-end=true]:bg-orange-400 data-[range-end=true]:text-white group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 hover:bg-orange-100 hover:text-black flex aspect-square size-auto w-full h-full min-w-(--cell-size) min-h-(--cell-size) flex-col gap-1 leading-none font-medium group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-none data-[range-end=true]:rounded-none data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-none data-[range-start=true]:rounded-none [&>span]:text-xs [&>span]:opacity-70 border border-gray-200 hover:border-gray-300 !rounded-none',
        defaultClassNames.day,
        className
      )}
      {...props}
    >
      {/* Date number */}
      <span>{day.date.getDate()}</span>

      {/* Number of slots below the date - only show for available dates */}
      {!modifiers.disabled ? (
        <span className="text-[0.6rem] opacity-60">
          {slotsCount} {pluralize('slot', slotsCount)}
        </span>
      ) : (
        <span className="text-[0.6rem] opacity-0">&nbsp;</span>
      )}
    </Button>
  );
}

export { Calendar, CalendarDayButton };
