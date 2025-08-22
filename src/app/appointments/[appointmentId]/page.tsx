import { getAppointment } from '@/features/appointments/queries/get-appointment';

import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollRestore } from '@/components/scroll-restore';

type ConfirmationPageProps = {
  params: Promise<{
    appointmentId: string;
  }>;
};

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { appointmentId } = await params;

  if (!appointmentId) {
    notFound();
  }

  const appointment = await getAppointment(appointmentId);

  if (!appointment) {
    notFound();
  }

  // Calculate duration in minutes
  const durationMinutes = Math.round(
    (appointment.endsAt.getTime() - appointment.startsAt.getTime()) /
      (1000 * 60)
  );

  return (
    <>
      <ScrollRestore />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center mb-6">
              <Link
                href="/"
                className="text-orange-600 hover:text-orange-700 transition-colors mr-4 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Booking Confirmed
              </h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg
                    className="w-8 h-8 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Appointment Confirmed!
                </h2>
                <p className="text-gray-600">
                  Your booking has been successfully scheduled
                </p>
              </div>

              <div className="p-6 space-y-4">
                {/* Employee & Service Info */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                  <div className="relative">
                    <Image
                      src={
                        appointment.employee.profilePictureUrl ??
                        '/default-avatar.png'
                      }
                      alt={appointment.employee.name}
                      width={56}
                      height={56}
                      className="rounded-lg object-cover shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {appointment.service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {durationMinutes} minutes • with{' '}
                      {appointment.employee.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-orange-600">
                        £
                        {(appointment.service.price / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Confirmation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
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
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">
                        Confirmation Email Sent
                      </h3>
                      <p className="text-gray-600 text-sm">
                        We&apos;ve sent a confirmation email to{' '}
                        <span className="font-medium text-gray-900">
                          {appointment.email}
                        </span>
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Please check your inbox and spam folder
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appointment Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Appointment Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Date
                        </span>
                        <span className="font-medium text-gray-900 text-sm">
                          {format(
                            appointment.startsAt,
                            'EEEE, MMMM d'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Time
                        </span>
                        <span className="font-medium text-gray-900 text-sm">
                          {format(appointment.startsAt, 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Duration
                        </span>
                        <span className="font-medium text-gray-900 text-sm">
                          {durationMinutes} minutes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                      <svg
                        className="w-4 h-4 mr-2 text-orange-500"
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
                      Your Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Name
                        </span>
                        <span className="font-medium text-gray-900 text-sm">
                          {appointment.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Email
                        </span>
                        <span className="font-medium text-gray-900 text-xs">
                          {appointment.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          Booking ID
                        </span>
                        <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                          {appointment.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                    <svg
                      className="w-4 h-4 mr-2 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    What&apos;s Next?
                  </h3>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      Please arrive 5 minutes before your appointment
                      time
                    </p>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      Bring any relevant documents or information
                    </p>
                    <p className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      Contact us if you need to make changes
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <p className="text-xs text-gray-600">
                      Questions? Contact us at{' '}
                      <a
                        href="mailto:bookings@newlook.com"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        bookings@newlook.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
