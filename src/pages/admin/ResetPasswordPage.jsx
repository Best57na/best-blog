import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { X } from 'lucide-react'
import { API_BASE } from '../../utils/api'

function ConfirmDialog({ onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Confirm password change</h2>
        <p className="text-sm text-gray-500 mb-6">Are you sure you want to change your password?</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Resetting…' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}

    if (!form.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
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

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setShowDialog(true)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE}/auth/reset-password`, {
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setShowDialog(false)
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password changed successfully')
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to change password. Please try again.'
      setShowDialog(false)
      setErrors({ currentPassword: msg })
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
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

      {showDialog && (
        <ConfirmDialog
          onConfirm={handleConfirm}
          onCancel={() => setShowDialog(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
