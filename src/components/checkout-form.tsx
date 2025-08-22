'use client';

import { createAppointment } from '@/features/appointments/actions/create-appointment';
import { EMPTY_ACTION_STATE } from '@/features/appointments/utils/to-action-state';
import { DatePicker } from './date-picker';

import { DateWithSlots } from '@/features/bookings/utils/date';
import { Employee, Service } from '@prisma/client';
import { format } from 'date-fns';

import { useActionState, useState } from 'react';

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
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const selectedSlotTime = dateWithSlots.slots.find(
    (slot) => slot.time.toISOString() === selectedSlot
  );
  const [actionState, action] = useActionState(
    createAppointment,
    EMPTY_ACTION_STATE
  );
  console.log(actionState);

  return (
    <form action={action}>
      {/* Error Display */}
      {actionState.status === 'ERROR' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 font-medium">
              {actionState.message}
            </p>
          </div>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-black mb-3">
          1. When for
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <DatePicker
            dates={dates}
            setDateWithSlots={setDateWithSlots}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-black mb-3">
          2. Choose a slot
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-center text-gray-600">
            <div className="text-base font-medium mb-3">
              AVAILABLE SLOT
            </div>
            <div className="grid grid-cols-3 gap-2">
              {dateWithSlots.slots.map((slot) => (
                <label
                  key={slot.time.toISOString()}
                  className="flex items-center justify-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.time.toISOString()}
                    checked={selectedSlot === slot.time.toISOString()}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="sr-only"
                  />
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors block w-full text-center ${
                      selectedSlot === slot.time.toISOString()
                        ? 'bg-orange-600 text-white border-2 border-orange-700'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
                    }`}
                  >
                    {format(slot.time, 'h:mm')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-black mb-3">
          3. Your details and book
        </h2>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full text-sm bg-white border border-gray-200 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full text-sm bg-white border border-gray-200 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <input
            type="hidden"
            name="employeeId"
            value={
              employee
                ? employee.id
                : selectedSlotTime?.employees[0].id
            }
          />
          <input type="hidden" name="serviceId" value={service.id} />

          <button
            type="submit"
            className="w-full py-3 px-6 text-base bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
          >
            BOOK APPOINTMENT
          </button>
        </div>
      </div>
    </form>
  );
};
