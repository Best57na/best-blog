import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { FileText, Folder, User, Bell, Lock, ExternalLink, LogOut } from 'lucide-react'

function SidebarLink({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors ${
          isActive
            ? 'text-gray-900 font-semibold'
            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
        }`
      }
    >
      <Icon size={16} />
      {children}
    </NavLink>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  useEffect(() => {
    if (!currentUser) navigate('/login', { replace: true })
  }, [])

  if (!currentUser) return null

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-200">
      <aside className="w-44 shrink-0 sticky top-0 h-screen bg-white flex flex-col px-4 py-6 overflow-y-auto">
        <div className="mb-8 px-1">
          <p className="text-2xl font-bold text-gray-900 leading-none">hh.</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#F97316' }}>Admin panel</p>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          <SidebarLink to="/admin/articles" icon={FileText}>Article management</SidebarLink>
          <SidebarLink to="/admin/categories" icon={Folder}>Category management</SidebarLink>
          <SidebarLink to="/admin/profile" icon={User}>Profile</SidebarLink>
          <SidebarLink to="/admin/notification" icon={Bell}>Notification</SidebarLink>
          <SidebarLink to="/admin/reset-password" icon={Lock}>Reset password</SidebarLink>
        </nav>

        <div className="flex flex-col gap-0.5">
          <a
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ExternalLink size={16} />
            hh. website
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer w-full text-left"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
