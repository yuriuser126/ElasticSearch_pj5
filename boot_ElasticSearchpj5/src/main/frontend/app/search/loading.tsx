export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1 max-w-2xl h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="h-16 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="space-y-8">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block w-80 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </main>
    </div>
  )
}
