import Link from 'next/link';
import { homePath } from '@/paths';

export default function EmployeeNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Employee Not Found
        </h1>
        <p className="text-slate-600 mb-8">
          The employee you&apos;re looking for doesn&apos;t exist or
          has been removed.
        </p>
        <Link
          href={homePath()}
          className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
