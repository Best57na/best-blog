import { useState, useRef } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Camera, User } from 'lucide-react'
import { API_BASE } from '../../utils/api'

export default function ProfilePage() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const [form, setForm] = useState({
    name: currentUser.name || '',
    username: currentUser.username || '',
    email: currentUser.email || '',
  })
  const [avatarFile, setAvatarFile] = useState(null) // { file, preview }
  const [avatarPreview, setAvatarPreview] = useState(currentUser.profilePic || null)
  const [isSaving, setIsSaving] = useState(false)
  const fileRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.username.trim()) return

    setIsSaving(true)
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('username', form.username)
    if (avatarFile) formData.append('avatarFile', avatarFile)

    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.put(`${API_BASE}/profiles/me`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      localStorage.setItem('currentUser', JSON.stringify(data))
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const initials = form.name
    ? form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : form.username?.[0]?.toUpperCase() || 'U'

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors'

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white rounded-xl p-8 max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-2">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group flex-shrink-0"
              onClick={() => fileRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  {initials
                    ? <span className="text-xl font-bold text-gray-600">{initials}</span>
                    : <User size={32} className="text-gray-400" />
                  }
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Upload image
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 py-2.5 px-6 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors cursor-pointer self-start disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
