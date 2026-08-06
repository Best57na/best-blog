import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { ImageIcon } from 'lucide-react'
import { API_BASE } from '../../utils/api'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export default function EditArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', category_id: '', description: '', content: '', image: null })
  const [imageFile, setImageFile] = useState(null) // { file, preview }
  const [errors, setErrors] = useState({})
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/posts/${id}`),
      axios.get(`${API_BASE}/categories`),
    ])
      .then(([postRes, categoriesRes]) => {
        const post = postRes.data
        const cats = categoriesRes.data.categories || []
        setCategories(cats)
        const matchedCategory = cats.find(c => c.name === post.category)
        setForm({
          title: post.title || '',
          category_id: matchedCategory ? String(matchedCategory.id) : '',
          description: post.description || '',
          content: post.content || '',
          image: post.image || null,
        })
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.')
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('File too large. Maximum size is 5 MB.')
      return
    }

    setImageFile({ file, preview: URL.createObjectURL(file) })
  }

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.category_id) e.category_id = 'Category is required'
    if (!form.content.trim()) e.content = 'Content is required'
    return e
  }

  // status_id: 1 = draft, 2 = publish
  const save = async (statusId) => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setIsSaving(true)

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('category_id', form.category_id)
    formData.append('description', form.description)
    formData.append('content', form.content)
    formData.append('status_id', statusId)
    formData.append('image', form.image || '')
    if (imageFile) formData.append('imageFile', imageFile.file)

    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE}/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success(statusId === 1 ? 'Article saved as draft' : 'Article published successfully')
      navigate('/admin/articles')
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save article. Please try again.'
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = (field) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 transition-colors placeholder-gray-300 dark:placeholder-gray-500 ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-gray-300'
    }`

  if (loading) {
    return <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">Loading...</div>
  }

  if (notFound) {
    return (
      <div>
        <Link to="/admin/articles" className="text-sm text-[#5C9DFF] hover:underline mb-4 block">
          Article management
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-sm text-gray-400 dark:text-gray-500">
          Article not found.
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Link to="/admin/articles" className="text-sm text-[#5C9DFF] hover:underline mb-4 block">
        Article management
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit article</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => save(1)}
            disabled={isSaving}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving…' : 'Save as draft'}
          </button>
          <button
            onClick={() => save(2)}
            disabled={isSaving}
            className="px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full text-sm font-medium hover:bg-gray-700 dark:hover:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Publishing…' : 'Save and publish'}
          </button>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col gap-5">

        {/* Thumbnail */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Thumbnail image</p>
          <div className="flex items-start gap-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-56 h-40 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-gray-300 dark:hover:border-gray-500 transition-colors flex-shrink-0"
            >
              {imageFile ? (
                <img src={imageFile.preview} alt="thumbnail" className="w-full h-full object-cover" />
              ) : form.image ? (
                <img src={form.image} alt="thumbnail" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={28} className="text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Upload thumbnail image
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageChange} className="hidden" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
          <div className="relative max-w-sm">
            <select
              value={form.category_id}
              onChange={e => setField('category_id', e.target.value)}
              className={`w-full appearance-none border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors cursor-pointer bg-white dark:bg-gray-700 ${
                errors.category_id ? 'border-red-400 focus:ring-red-200 text-gray-700 dark:text-gray-200' : 'border-gray-200 dark:border-gray-600 focus:ring-gray-300 text-gray-700 dark:text-gray-200'
              }`}
            >
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="Article title"
            className={inputClass('title')}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Introduction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Introduction{' '}
            <span className="text-gray-400 dark:text-gray-500 font-normal">(max 120 letters)</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => {
              if (e.target.value.length <= 120) setField('description', e.target.value)
            }}
            placeholder="Introduction"
            rows={4}
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-100 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-300 dark:placeholder-gray-500"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-0.5">{form.description.length}/120</p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Content</label>
          <textarea
            value={form.content}
            onChange={e => setField('content', e.target.value)}
            placeholder="Content"
            rows={14}
            className={inputClass('content') + ' resize-none'}
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
        </div>

      </div>
    </div>
  )
}
