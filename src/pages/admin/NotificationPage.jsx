import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotificationPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem('notifications') || '[]')
  )

  const persist = (updated) => {
    setItems(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const markAllRead = () => persist(items.map(n => ({ ...n, read: true })))

  const markRead = (id) =>
    persist(items.map(n => n.id === id ? { ...n, read: true } : n))

  const handleView = (n) => {
    markRead(n.id)
    navigate(n.link)
  }

  const unread = items.filter(n => !n.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Notification</h1>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">No notifications</div>
        ) : (
          <ul>
            {items.map(n => (
              <li
                key={n.id}
                className={`flex items-start gap-4 px-6 py-4 border-b border-gray-50 last:border-0 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
              >
                {/* Unread dot */}
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-gray-200'}`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="cursor-pointer"
                      onClick={() => markRead(n.id)}
                    >
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                      {!n.read && (
                        <span className="text-xs text-blue-500 font-medium">New</span>
                      )}
                      {n.link && (
                        <button
                          onClick={() => handleView(n)}
                          className="text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
