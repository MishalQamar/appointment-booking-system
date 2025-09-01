'use client';

import { createAppointment } from '@/features/appointments/actions/create-appointment';
import { EMPTY_ACTION_STATE } from '@/features/appointments/utils/to-action-state';
import { DatePicker } from './date-picker';

import { DateWithSlots } from '@/features/bookings/utils/date';
import { Employee, Service } from '@prisma/client';
import { format } from 'date-fns';

import { useActionState, useState } from 'react';
import { SubmitButton } from './submit-button';
import { FieldError } from './field-error';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';

export const CheckoutForm = ({
  dates,
  employee,
  service,
}: {
  dates: DateWithSlots[];
  employee: Employee | null;
  service: Service;
}) => {
  const [dateWithSlots, setDateWithSlots] = useState(dates[0]);
  const [actionState, action] = useActionState(
    createAppointment,
    EMPTY_ACTION_STATE
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    actionState.payload?.get('slot')?.toString() || ''
  );
  const selectedSlotTime = dateWithSlots.slots.find(
    (slot) => slot.time.toISOString() === selectedSlot
  );

  return (
    <form action={action}>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-blue-grey-900 mb-3">
          1. When for
        </h2>
        <div className="bg-white border border-blue-grey-200 rounded-lg shadow-sm">
          <DatePicker
            dates={dates}
            setDateWithSlots={setDateWithSlots}
          />
        </div>
        <FieldError actionState={actionState} name="date" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-blue-grey-900 mb-3">
          2. Choose a slot
        </h2>
        <div className="bg-white border border-blue-grey-200 rounded-lg p-4 shadow-sm">
          <div className="block text-sm font-medium text-blue-grey-700 mb-3">
            Available Slots
          </div>
          <RadioGroup.Root
            name="slot"
            value={selectedSlot}
            onValueChange={(v) => setSelectedSlot(v)}
            className="grid grid-cols-3 gap-2"
          >
            {dateWithSlots.slots.map((slot) => (
              <RadioGroup.Item
                key={slot.time.toISOString()}
                value={slot.time.toISOString()}
                className={`
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600
                  
            
                  
                  px-4 py-2 rounded-full  text-xs font-medium transition-colors block w-full text-center cursor-pointer ${
                    selectedSlot === slot.time.toISOString()
                      ? 'bg-purple-600 text-white border-2 border-purple-700'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                  }`}
              >
                {format(slot.time, 'h:mm')}
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <FieldError actionState={actionState} name="slot" />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-blue-grey-900 mb-3">
          3. Your details and book
        </h2>
        <div className="bg-white border border-blue-grey-200 rounded-lg p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-medium text-blue-grey-700 mb-2"
              >
                <svg
                  className="w-4 h-4 text-blue-grey-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Your name{' '}
                <span
                  className="text-red-500 font-bold"
                  aria-label="required"
                >
                  *
                </span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                className="w-full text-sm bg-white border border-blue-grey-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter your name"
                defaultValue={
                  actionState.payload?.get('name')?.toString() ?? ''
                }
              />
              <FieldError actionState={actionState} name="name" />
            </div>
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-blue-grey-700 mb-2"
              >
                <svg
                  className="w-4 h-4 text-blue-grey-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Your email{' '}
                <span
                  className="text-red-500 font-bold"
                  aria-label="required"
                >
                  *
                </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full text-sm bg-white border border-blue-grey-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter your email"
                defaultValue={
                  actionState.payload?.get('email')?.toString() ?? ''
                }
              />
              <FieldError actionState={actionState} name="email" />
            </div>
          </div>

          <input
            type="hidden"
            name="employeeId"
            value={
              employee?.id ||
              selectedSlotTime?.employees?.[0]?.id ||
              ''
            }
          />
          <input type="hidden" name="serviceId" value={service.id} />

          <div className="mt-6 pt-6 border-t border-blue-grey-100">
            <SubmitButton
              label="BOOK APPOINTMENT"
              variant="default"
              size="lg"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
