import { useState } from 'react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const [form, setForm] = useState({
    name: currentUser.name || '',
    username: currentUser.username || '',
    email: currentUser.email || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.username.trim()) return

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const updatedUsers = users.map(u =>
      u.email === currentUser.email ? { ...u, name: form.name, username: form.username } : u
    )
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
    localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, name: form.name, username: form.username }))
    toast.success('Profile updated successfully')
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors'

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white rounded-xl p-8 max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            className="mt-2 py-2.5 px-6 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors cursor-pointer self-start"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}
