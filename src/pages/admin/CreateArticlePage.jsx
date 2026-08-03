import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ImageIcon } from 'lucide-react'
import axios from 'axios'
import { API_BASE } from '../../utils/api'

const CATEGORIES = [
  { id: 1, name: 'Highlight' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Culture' },
  { id: 4, name: 'Food' },
  { id: 5, name: 'Tips' },
]

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

function pushNotification(title, message, link) {
  const stored = JSON.parse(localStorage.getItem('notifications') || '[]')
  localStorage.setItem('notifications', JSON.stringify([{ id: Date.now(), title, message, read: false, link }, ...stored]))
}

export default function CreateArticlePage() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const fileRef = useRef(null)

  const [form, setForm] = useState({ title: '', category_id: '', description: '', content: '' })
  const [imageFile, setImageFile] = useState(null) // { file: File, preview: string }
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }))
  }

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!imageFile) e.image = 'Thumbnail image is required'
    if (!form.category_id) e.category_id = 'Category is required'
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.content.trim()) e.content = 'Content is required'
    return e
  }

  // status_id: 1 = draft, 2 = published
  const save = async (statusId) => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('category_id', form.category_id)
    formData.append('description', form.description)
    formData.append('content', form.content)
    formData.append('status_id', statusId)
    formData.append('imageFile', imageFile.file)

    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (statusId === 1) {
        toast.success('Create article and saved as draft', { description: 'You can publish article later' })
        pushNotification('Article saved as draft', `"${form.title}" has been saved as a draft.`, '/admin/articles')
      } else {
        toast.success('Create article and published', { description: 'Your article has been successfully published' })
        pushNotification('Article published', `"${form.title}" has been successfully published.`, '/admin/articles')
      }

      navigate('/admin/articles')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 transition-colors placeholder-gray-300 ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-gray-300'
    }`

  return (
    <div>
      <Link to="/admin/articles" className="text-sm text-[#5C9DFF] hover:underline mb-4 block">
        Article management
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Create article</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => save(1)}
            disabled={isLoading}
            className="px-5 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving…' : 'Save as draft'}
          </button>
          <button
            onClick={() => save(2)}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Publishing…' : 'Save and publish'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 flex flex-col gap-5">

        {/* Thumbnail */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Thumbnail image</p>
          <div className="flex items-start gap-4">
            <div
              onClick={() => fileRef.current?.click()}
              className={`w-56 h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer overflow-hidden transition-colors flex-shrink-0 ${
                errors.image ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {imageFile ? (
                <img src={imageFile.preview} alt="thumbnail" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={28} className="text-gray-300" />
              )}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Upload thumbnail image
              </button>
              <p className="text-xs text-gray-400">JPEG, PNG, GIF, WebP · Max 5 MB</p>
              {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageChange} className="hidden" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <div className="relative max-w-sm">
            <select
              value={form.category_id}
              onChange={e => setField('category_id', e.target.value)}
              className={`w-full appearance-none border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors cursor-pointer bg-white ${
                errors.category_id ? 'border-red-400 focus:ring-red-200 text-gray-700' : 'border-gray-200 focus:ring-gray-300 text-gray-500'
              }`}
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Author name</label>
          <input
            type="text"
            value={currentUser.name || currentUser.username || 'Author'}
            readOnly
            className="w-full max-w-sm border border-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Introduction <span className="text-gray-400 font-normal">(max 120 letters)</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => { if (e.target.value.length <= 120) setField('description', e.target.value) }}
            placeholder="Introduction"
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-300"
          />
          <p className="text-xs text-gray-400 text-right mt-0.5">{form.description.length}/120</p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
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
