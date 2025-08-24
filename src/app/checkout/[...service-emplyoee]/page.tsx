import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEmployee } from '@/features/employee/queries/get-employee';
import { getService } from '@/features/services/get-service';

import { calculateServiceSlotAvailability } from '@/features/bookings/utils';
import { getEmployeesWithMetadata } from '@/features/employee/queries/get-employees-with-metadata';
import { addMonths, startOfDay } from 'date-fns';
import { CheckoutForm } from '@/components/checkout-form';

type CheckoutPageProps = {
  params: Promise<{
    'service-emplyoee': string[];
  }>;
};

export default async function CheckoutPage({
  params,
}: CheckoutPageProps) {
  const { 'service-emplyoee': segments } = await params;

  let serviceId: string;
  let employeeId: string | null = null;

  if (segments.length === 1) {
    serviceId = segments[0];
  } else if (segments.length === 2) {
    [serviceId, employeeId] = segments;
  } else {
    notFound();
  }

  // Fetch data based on what we have
  const [service, employee, employees] = await Promise.all([
    getService(serviceId),
    employeeId ? getEmployee(employeeId) : Promise.resolve(null),
    getEmployeesWithMetadata(),
  ]);

  if (!service) {
    notFound();
  }

  const availability = calculateServiceSlotAvailability(
    employee
      ? employees.filter((e) => e.id === employee.id)
      : employees,
    service,
    startOfDay(new Date()),
    addMonths(new Date(), 1)
  );

  return (
    <div className="min-h-screen bg-blue-grey-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 transition-colors mr-4"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-blue-grey-900">
              BOOK APPOINTMENT
            </h1>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-grey-900 mb-3">
              Here&apos;s what you&apos;re booking
            </h2>
            <div className="flex space-x-3 bg-white border border-blue-grey-200 rounded-lg p-4 shadow-sm">
              {employee ? (
                <Image
                  src={
                    employee.profilePictureUrl ??
                    '/default-avatar.png'
                  }
                  alt={employee.name}
                  width={56}
                  height={56}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="rounded-lg size-14 bg-blue-grey-200" />
              )}
              <div className="w-full flex justify-between items-center">
                <div>
                  <div className="font-bold text-blue-grey-900 text-base">
                    {service.title}
                  </div>
                  <div className="text-blue-grey-600 text-sm">
                    {service.duration} minutes
                  </div>
                  <div className="text-blue-grey-500 text-sm">
                    {employee?.name ?? 'Any employee'}
                  </div>
                </div>
                <div className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                  £{(service.price / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <CheckoutForm
            dates={availability.dates}
            employee={employee}
            service={service}
          />
        </div>
      </div>
    </div>
  );
}
