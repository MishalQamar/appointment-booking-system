import { checkoutPath, homePath } from '@/paths';
import { ServiceCard } from '@/components/service-card';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEmployeeWithServices } from '@/features/employee/queries/get-employee-services';

type EmployeePageProps = {
  params: Promise<{
    employeeId: string;
  }>;
};

export default async function EmployeePage({
  params,
}: EmployeePageProps) {
  try {
    // First, we extract the employeeId from the params object, which is a Promise.
    const { employeeId } = await params;

    console.log('🔍 Looking for employee with ID:', employeeId);

    // Next, we fetch the employee data along with their services using the provided employeeId.
    // The function getEmployeeWithServices returns either an employee object (with services) or null if not found.
    const employeeWithServices = await getEmployeeWithServices(
      employeeId
    );

    console.log(
      '📋 Employee found:',
      employeeWithServices ? 'Yes' : 'No'
    );

    // If no employee is found (employeeWithServices is null), we call notFound() to show a 404 page.
    if (!employeeWithServices) {
      console.log('❌ Employee not found, calling notFound()');
      notFound();
    }

    // We then destructure the services and the rest of the employee data for use in the component.
    const { services, ...employee } = employeeWithServices;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-black text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center space-x-4">
              <Link
                href={homePath()}
                className="text-white hover:text-gray-300 transition-colors flex items-center"
              >
                ← Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-white">
                Book with {employee.name}
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Employee Profile */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Image
                    src={
                      employee.profilePictureUrl ??
                      '/default-avatar.png'
                    }
                    alt={employee.name}
                    className="rounded-full size-16 object-cover ring-2 ring-gray-100"
                    width={64}
                    height={64}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black mb-2">
                    {employee.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Professional Service Provider
                  </p>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">
                Available Services
              </h3>

              {services && services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      href={checkoutPath(employee.id, service.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-black mb-2">
                    No Services Available
                  </h4>
                  <p className="text-gray-600">
                    This professional doesn&apos;t have any services
                    available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('❌ Error in EmployeePage:', error);
    throw error; // Re-throw to let Next.js handle it
  }
}
