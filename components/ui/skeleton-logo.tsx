export function SkeletonLogo() {
  return (
    <div className="flex items-center justify-center p-4 mx-2 animate-pulse">
      <div className="bg-gray-300 rounded-lg h-12 md:h-16 w-32"></div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 rounded-lg h-48 w-full mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  )
}

export function SkeletonTestimonial() {
  return (
    <div className="animate-pulse bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  )
}

