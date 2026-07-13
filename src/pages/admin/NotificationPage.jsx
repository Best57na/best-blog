import { useState } from 'react'

export default function NotificationPage() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem('notifications') || '[]')
  )

  const markAllRead = () => {
    const updated = items.map(n => ({ ...n, read: true }))
    setItems(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const markRead = (id) => {
    const updated = items.map(n => n.id === id ? { ...n, read: true } : n)
    setItems(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
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
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-4 px-6 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-gray-200'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
                {!n.read && (
                  <span className="ml-auto text-xs text-blue-500 font-medium flex-shrink-0">New</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
