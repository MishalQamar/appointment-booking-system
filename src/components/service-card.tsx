import { Service } from '@prisma/client';
import Link from 'next/link';

type ServiceProps = {
  service: Omit<Service, 'createdAt' | 'updatedAt'>;
  href: string;
};

export function ServiceCard({ service, href }: ServiceProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300"
    >
      <div className="space-y-3">
        {/* Header with name and price */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
              {service.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {service.duration} min
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              £{(service.price / 100).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        {/* Action button */}
        <div className="pt-1">
          <button className="w-full bg-purple-600 text-white py-1.5 px-3 rounded text-xs font-medium hover:bg-purple-700 transition-colors">
            Book
          </button>
        </div>
      </div>
    </Link>
  );
}
