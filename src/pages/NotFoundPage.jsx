import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <p className="text-gray-400 dark:text-gray-500 text-sm max-w-xs">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-5 py-2 rounded-full bg-gray-900 dark:bg-gray-100 text-sm text-white dark:text-gray-900 cursor-pointer hover:bg-gray-700 dark:hover:bg-white transition-colors"
      >
        Back to Home
      </button>
    </div>
  )
}
