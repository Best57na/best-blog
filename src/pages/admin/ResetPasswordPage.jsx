import { useState } from 'react'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const newErrors = {}

    if (!form.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    } else if (form.currentPassword !== currentUser.password) {
      newErrors.currentPassword = 'Current password is incorrect'
    }

    if (!form.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const updatedUsers = users.map(u =>
      u.email === currentUser.email ? { ...u, password: form.newPassword } : u
    )
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
    localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, password: form.newPassword }))

    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    toast.success('Password reset successfully')
  }

  const inputClass = (field) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-gray-300'
    }`

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Reset password</h1>
      <div className="bg-white rounded-xl p-8 max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
            <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} className={inputClass('currentPassword')} />
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} className={inputClass('newPassword')} />
            {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={inputClass('confirmPassword')} />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="mt-2 py-2.5 px-6 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors cursor-pointer self-start"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  )
}
