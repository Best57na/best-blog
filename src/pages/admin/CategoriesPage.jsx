import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Search, Pencil, Trash2, X, Plus } from 'lucide-react'
import { API_BASE } from '../../utils/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

function CategoryDialog({ title, form, errors, onChange, onClose, onSave, saveLabel, isSaving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => onChange('name', e.target.value)}
              placeholder="Category name"
              className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 transition-colors placeholder-gray-300 dark:placeholder-gray-500 ${
                errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-gray-300'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 rounded-full hover:bg-gray-700 dark:hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '' })
  const [createErrors, setCreateErrors] = useState({})

  const [editItem, setEditItem] = useState(null)
  const [editForm, setEditForm] = useState({ name: '' })
  const [editErrors, setEditErrors] = useState({})

  const loadCategories = () => {
    setLoading(true)
    axios.get(`${API_BASE}/categories`)
      .then(res => setCategories(res.data.categories || []))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCategories() }, [])

  const filtered = useMemo(
    () => categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search]
  )

  // Create
  const openCreate = () => {
    setCreateForm({ name: '' })
    setCreateErrors({})
    setCreateOpen(true)
  }

  const saveCreate = async () => {
    if (!createForm.name.trim()) {
      setCreateErrors({ name: 'Name is required' })
      return
    }
    setIsSaving(true)
    try {
      await axios.post(`${API_BASE}/categories`, { name: createForm.name.trim() }, { headers: authHeaders() })
      setCreateOpen(false)
      loadCategories()
      toast.success('Category created successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category')
    } finally {
      setIsSaving(false)
    }
  }

  // Edit
  const openEdit = (cat) => {
    setEditItem(cat)
    setEditForm({ name: cat.name })
    setEditErrors({})
  }

  const saveEdit = async () => {
    if (!editForm.name.trim()) {
      setEditErrors({ name: 'Name is required' })
      return
    }
    setIsSaving(true)
    try {
      await axios.put(`${API_BASE}/categories/${editItem.id}`, { name: editForm.name.trim() }, { headers: authHeaders() })
      setEditItem(null)
      loadCategories()
      toast.success('Category updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete
  const deleteCategory = async (id) => {
    setIsSaving(true)
    try {
      await axios.delete(`${API_BASE}/categories/${id}`, { headers: authHeaders() })
      setConfirmDeleteId(null)
      loadCategories()
      toast.success('Category deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Category management</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-full hover:bg-gray-700 dark:hover:bg-white transition-colors cursor-pointer"
        >
          <Plus size={15} />
          Create category
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Category name</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No categories found</td>
              </tr>
            ) : (
              filtered.map(cat => (
                <tr key={cat.id} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full"
                      style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}
                    >
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(cat.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
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

      {/* Create dialog */}
      {createOpen && (
        <CategoryDialog
          title="Create category"
          form={createForm}
          errors={createErrors}
          isSaving={isSaving}
          onChange={(field, value) => {
            setCreateForm(prev => ({ ...prev, [field]: value }))
            if (field === 'name') setCreateErrors({})
          }}
          onClose={() => setCreateOpen(false)}
          onSave={saveCreate}
          saveLabel="Create"
        />
      )}

      {/* Edit dialog */}
      {editItem && (
        <CategoryDialog
          title="Edit category"
          form={editForm}
          errors={editErrors}
          isSaving={isSaving}
          onChange={(field, value) => {
            setEditForm(prev => ({ ...prev, [field]: value }))
            if (field === 'name') setEditErrors({})
          }}
          onClose={() => setEditItem(null)}
          onSave={saveEdit}
          saveLabel="Save changes"
        />
      )}

      {/* Delete confirmation dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete category</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCategory(confirmDeleteId)}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
