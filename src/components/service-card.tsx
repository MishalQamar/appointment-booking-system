import { Service } from '@prisma/client';
import Link from 'next/link';

type ServiceProps = {
  service: Service;
  href: string;
};

export function ServiceCard({ service, href }: ServiceProps) {
  return (
    <Link
      href={href}
      className="bg-white border border-blue-grey-200 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center text-center hover:border-purple-500 hover:shadow-md transition-all duration-200"
    >
      <div className="text-base font-bold text-blue-grey-900 mb-2">
        {service.title}
      </div>

      <div className="bg-purple-600 text-white px-3 py-1 rounded-full font-bold text-sm mb-2">
        £{(service.price / 100).toFixed(2)}
      </div>
      <div className="text-xs text-blue-grey-600">
        {service.duration} minutes
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-3 h-3 text-purple-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <button className="bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold hover:bg-purple-700 transition-colors">
          BOOK NOW
        </button>
      </div>
    </Link>
  );
}
