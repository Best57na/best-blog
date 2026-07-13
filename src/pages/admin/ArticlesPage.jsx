import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Pencil, Trash2, Plus, Search, ChevronDown } from 'lucide-react'

const API_URL = 'https://blog-post-project-api.vercel.app/posts'
const CATEGORIES = ['Cat', 'General', 'Inspiration', 'Adventure', 'Culture', 'Food', 'Tips']

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(API_URL, { params: { limit: 100 } })
        setArticles(res.data.posts || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || a.category === categoryFilter
    return matchSearch && matchCategory
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Article management</h1>
        <Link
          to="/admin/articles/create"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} />
          Create article
        </Link>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer bg-white"
            >
              <option value="">Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer bg-white"
            >
              <option value="">Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Article title</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-28">Category</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-28">Status</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-sm text-gray-400">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-sm text-gray-400">No articles found</td>
              </tr>
            ) : (
              filtered.map(a => (
                <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className="block max-w-xs truncate">{a.title}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.category}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                      Published
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        to={`/admin/articles/${a.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <Link
                        to={`/admin/articles/${a.id}/delete`}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
