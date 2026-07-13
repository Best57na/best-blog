import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function CreateArticlePage() {
  return (
    <div>
      <Link to="/admin/articles" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={15} />
        Article management
      </Link>
      <div className="bg-white rounded-xl p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Create article</h1>
        <p className="text-sm text-gray-400">Coming soon</p>
      </div>
    </div>
  )
}
