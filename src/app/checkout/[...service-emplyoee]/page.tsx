import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEmployee } from '@/features/employee/get-employee';
import { getService } from '@/features/services/get-service';
import { DatePicker } from '@/components/date-picker';

type CheckoutPageProps = {
  params: Promise<{
    'service-emplyoee': string[];
  }>;
};

export default async function CheckoutPage({
  params,
}: CheckoutPageProps) {
  const { 'service-emplyoee': segments } = await params;

  // Destructure the segments based on URL pattern
  let serviceId: string;
  let employeeId: string | null = null;

  if (segments.length === 1) {
    // Pattern: /checkout/service-id
    serviceId = segments[0];
  } else if (segments.length === 2) {
    // Pattern: /checkout/service-id/employee-id (actual URL structure)
    [serviceId, employeeId] = segments;
  } else {
    // Invalid URL pattern
    notFound();
  }

  // Fetch data based on what we have
  const [service, employee] = await Promise.all([
    getService(serviceId),
    employeeId ? getEmployee(employeeId) : null,
  ]);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-700 transition-colors mr-4"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-black">
              BOOK APPOINTMENT
            </h1>
          </div>

          <form className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-black mb-3">
                Here&apos;s what you&apos;re booking
              </h2>
              <div className="flex space-x-3 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
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
                  <div className="rounded-lg size-14 bg-slate-200" />
                )}
                <div className="w-full flex justify-between items-center">
                  <div>
                    <div className="font-bold text-black text-base">
                      {service.title}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {service.duration} minutes
                    </div>
                    <div className="text-gray-500 text-sm">
                      {employee?.name ?? 'Any employee'}
                    </div>
                  </div>
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    £{(service.price / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">
                1. When for
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg  shadow-sm">
                <DatePicker />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black mb-3">
                2. Choose a slot
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-center text-gray-600">
                  <div className="text-base font-medium mb-3">
                    AVAILABLE SLOT
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-orange-500 text-white px-3 py-2 rounded-full text-xs font-medium hover:bg-orange-600 transition-colors">
                      11:30 AM
                    </button>
                    <button className="bg-white text-black border border-gray-200 px-3 py-2 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors">
                      12:00 PM
                    </button>
                    <button className="bg-white text-black border border-gray-200 px-3 py-2 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors">
                      2:30 PM
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
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
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-base bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                >
                  BOOK APPOINTMENT
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
