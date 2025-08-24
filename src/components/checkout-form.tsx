'use client';

import { createAppointment } from '@/features/appointments/actions/create-appointment';
import { EMPTY_ACTION_STATE } from '@/features/appointments/utils/to-action-state';
import { DatePicker } from './date-picker';

import { DateWithSlots } from '@/features/bookings/utils/date';
import { Employee, Service } from '@prisma/client';
import { format } from 'date-fns';

import { useActionState, useState, useRef } from 'react';
import { SubmitButton } from './submit-button';

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
  const [errors, setErrors] = useState<{
    date?: string;
    slot?: string;
    name?: string;
    email?: string;
  }>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const selectedSlotTime = dateWithSlots.slots.find(
    (slot) => slot.time.toISOString() === selectedSlot
  );
  const [actionState, action] = useActionState(
    createAppointment,
    EMPTY_ACTION_STATE
  );
  console.log(actionState);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!dateWithSlots) {
      newErrors.date = 'Please select a date';
    }

    if (!selectedSlot) {
      newErrors.slot = 'Please select a time slot';
    }

    const name = nameRef.current?.value || '';
    const email = emailRef.current?.value || '';

    if (!name || name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (!email || email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (formData: FormData) => {
    if (validateForm()) {
      action(formData);
    }
  };

  return (
    <form action={handleSubmit} noValidate>
      {/* Error Display */}
      {actionState.status === 'ERROR' && (
        <div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
        <h2 className="text-lg font-semibold text-blue-grey-900 mb-3">
          1. When for
        </h2>
        <div className="bg-white border border-blue-grey-200 rounded-lg shadow-sm">
          <DatePicker
            dates={dates}
            setDateWithSlots={setDateWithSlots}
          />
        </div>
        {errors.date && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.date}
          </p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-blue-grey-900 mb-3">
          2. Choose a slot
        </h2>
        <div className="bg-white border border-blue-grey-200 rounded-lg p-4 shadow-sm">
          <div className="text-center text-blue-grey-600">
            <div className="text-base font-medium mb-3">
              AVAILABLE SLOT
            </div>
            <fieldset>
              <legend className="sr-only">Select a time slot</legend>
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
                      checked={
                        selectedSlot === slot.time.toISOString()
                      }
                      onChange={(e) =>
                        setSelectedSlot(e.target.value)
                      }
                      className="sr-only"
                      aria-describedby={
                        errors.slot ? 'slot-error' : undefined
                      }
                    />
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-colors block w-full text-center ${
                        selectedSlot === slot.time.toISOString()
                          ? 'bg-purple-600 text-white border-2 border-purple-700'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                      }`}
                    >
                      {format(slot.time, 'h:mm')}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
        {errors.slot && (
          <p
            className="mt-2 text-sm text-red-600"
            role="alert"
            id="slot-error"
          >
            {errors.slot}
          </p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-blue-grey-900 mb-3">
          3. Your details and book
        </h2>
        <div className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-blue-grey-700 mb-2"
            >
              Your name{' '}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              name="name"
              className={`w-full text-sm bg-white border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                errors.name
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-blue-grey-200 focus:border-purple-500'
              }`}
              placeholder="Enter your name"
              required
              aria-describedby={
                errors.name ? 'name-error' : undefined
              }
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p
                className="mt-1 text-sm text-red-600"
                role="alert"
                id="name-error"
              >
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-grey-700 mb-2"
            >
              Your email{' '}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              className={`w-full text-sm bg-white border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                errors.email
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-blue-grey-200 focus:border-purple-500'
              }`}
              placeholder="Enter your email"
              required
              aria-describedby={
                errors.email ? 'email-error' : undefined
              }
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p
                className="mt-1 text-sm text-red-600"
                role="alert"
                id="email-error"
              >
                {errors.email}
              </p>
            )}
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

          <SubmitButton
            label="BOOK APPOINTMENT"
            variant="default"
            size="lg"
          />
        </div>
      </div>
    </form>
  );
};
