export default function Loading() {
  return (
    <div className="min-h-screen bg-blue-grey-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-blue-grey-900 font-medium">Loading...</p>
      </div>
    </div>
  );
}
