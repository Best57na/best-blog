import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { NavBar, Footer } from '../components/Sections'

export default function AccountLayout() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) navigate('/login', { replace: true })
  }, [])

  if (!token) return null

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-gray-900 flex flex-col">
      <NavBar />
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
