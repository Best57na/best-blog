import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Search, Pencil, Trash2, X } from 'lucide-react'

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Highlight', description: 'Featured and trending articles' },
  { id: '2', name: 'Adventure', description: 'Travel adventures and explorations' },
  { id: '3', name: 'Culture', description: 'Cultural experiences and traditions' },
  { id: '4', name: 'Food', description: 'Local cuisine and food guides' },
  { id: '5', name: 'Tips', description: 'Travel tips and recommendations' },
]

function getCategories() {
  const stored = localStorage.getItem('adminCategories')
  if (stored) return JSON.parse(stored)
  localStorage.setItem('adminCategories', JSON.stringify(DEFAULT_CATEGORIES))
  return DEFAULT_CATEGORIES
}

function saveCategories(cats) {
  localStorage.setItem('adminCategories', JSON.stringify(cats))
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(getCategories)
  const [search, setSearch] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [editErrors, setEditErrors] = useState({})

  const filtered = useMemo(
    () => categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search]
  )

  const openEdit = (cat) => {
    setEditItem(cat)
    setEditForm({ name: cat.name, description: cat.description })
    setEditErrors({})
  }

  const saveEdit = () => {
    if (!editForm.name.trim()) {
      setEditErrors({ name: 'Name is required' })
      return
    }
    const updated = categories.map(c =>
      c.id === editItem.id
        ? { ...c, name: editForm.name.trim(), description: editForm.description.trim() }
        : c
    )
    saveCategories(updated)
    setCategories(updated)
    setEditItem(null)
    toast.success('Category updated successfully')
  }

  const deleteCategory = (id) => {
    const updated = categories.filter(c => c.id !== id)
    saveCategories(updated)
    setCategories(updated)
    setConfirmDeleteId(null)
    toast.success('Category deleted')
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Category management</h1>

      <div className="bg-white rounded-xl overflow-hidden">
        {/* Search bar */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Category name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Description</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-10 text-sm text-gray-400">No categories found</td>
              </tr>
            ) : (
              filtered.map(cat => (
                <tr key={cat.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full"
                      style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}
                    >
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{cat.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(cat.id)}
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

      {/* Edit dialog */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">Edit category</h3>
              <button
                onClick={() => setEditItem(null)}
                className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => {
                    setEditForm(prev => ({ ...prev, name: e.target.value }))
                    setEditErrors({})
                  }}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 transition-colors ${
                    editErrors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-300'
                  }`}
                />
                {editErrors.name && <p className="text-xs text-red-500 mt-1">{editErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setEditItem(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete category</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCategory(confirmDeleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
