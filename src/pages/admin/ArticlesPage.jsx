import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { Pencil, Trash2, Plus, Search, ChevronDown } from 'lucide-react'
import { API_BASE } from '../../utils/api'

function StatusBadge({ status }) {
  return status === 'publish' ? (
    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
      Published
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />
      Draft
    </span>
  )
}

function SelectFilter({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer bg-white"
      >
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadArticles = () => {
    setLoading(true)
    axios.get(`${API_BASE}/posts`, { params: { limit: 100 } })
      .then(res => setArticles(res.data.posts || []))
      .catch(() => toast.error('Failed to load articles'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadArticles() }, [])

  const categories = useMemo(
    () => [...new Set(articles.map(a => a.category))].sort(),
    [articles]
  )

  const filtered = useMemo(() =>
    articles.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
      const matchStatus = !statusFilter || a.status === statusFilter
      const matchCategory = !categoryFilter || a.category === categoryFilter
      return matchSearch && matchStatus && matchCategory
    }),
    [articles, search, statusFilter, categoryFilter]
  )

  const deleteArticle = async (id) => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setArticles(prev => prev.filter(a => a.id !== id))
      toast.success('Article deleted')
    } catch {
      toast.error('Failed to delete article')
    } finally {
      setIsDeleting(false)
      setConfirmDeleteId(null)
    }
  }

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

          <SelectFilter value={statusFilter} onChange={setStatusFilter}>
            <option value="">Status</option>
            <option value="publish">Published</option>
            <option value="draft">Draft</option>
          </SelectFilter>

          <SelectFilter value={categoryFilter} onChange={setCategoryFilter}>
            <option value="">Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectFilter>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Article title</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-28">Category</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-32">Status</th>
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
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                    <span className="block truncate">{a.title}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        to={`/admin/articles/${a.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(a.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete article</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteArticle(confirmDeleteId)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
