import { ServiceCard } from '@/components/service-card';
import { getEmployees } from '@/features/employee/queries/get-employees';
import { getServices } from '@/features/services/queries/get-services';
import { checkoutPath, employeePath } from '@/paths';
import Image from 'next/image';
import Link from 'next/link';

// Force dynamic rendering to avoid database queries during build time
export const dynamic = 'force-dynamic';

export default async function Home() {
  let employees: Awaited<ReturnType<typeof getEmployees>> = [];
  let services: Awaited<ReturnType<typeof getServices>> = [];

  try {
    [employees, services] = await Promise.all([
      getEmployees(),
      getServices(),
    ]);
  } catch (error) {
    console.error('Error loading home page data:', error);
    // Continue with empty arrays to show the page structure
  }

  return (
    <div className="min-h-screen bg-blue-grey-50">
      <div className="container mx-auto px-4 py-6">
        <h1
          className="text-3xl font-bold text-blue-grey-900 mb-6 text-center"
          style={{ fontFamily: 'cursive' }}
        >
          NEW LOOK
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-grey-900 mb-4">
            Choose a professional
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {employees.map((employee) => (
              <Link
                key={employee.id}
                href={employeePath(employee.id)}
                className="bg-white border border-blue-grey-200 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center text-center hover:border-purple-500 hover:shadow-md transition-all duration-200"
              >
                <Image
                  src={
                    employee.profilePictureUrl ??
                    '/default-avatar.png'
                  }
                  alt={employee.name}
                  className="rounded-full size-12 object-cover ring-1 ring-blue-grey-100"
                  width={48}
                  height={48}
                />
                <div className="text-xs font-semibold mt-2 text-blue-grey-900">
                  {employee.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-grey-900 mb-4">
            Or, choose a service first
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                href={checkoutPath(service.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
