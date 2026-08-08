import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useTheme } from './lib/theme'
import { NavBar, Footer } from './components/Sections'
import { HeroSection } from './components/Sections'
import ArticleSection from './components/ArticleSection'
import PostPage from './pages/PostPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import AITravelSuitePage from './pages/AITravelSuitePage'
import AccountLayout from './pages/AccountLayout'
import AdminLayout from './pages/admin/AdminLayout'
import ArticlesPage from './pages/admin/ArticlesPage'
import CategoriesPage from './pages/admin/CategoriesPage'
import ProfilePage from './pages/admin/ProfilePage'
import NotificationPage from './pages/admin/NotificationPage'
import ResetPasswordPage from './pages/admin/ResetPasswordPage'
import CreateArticlePage from './pages/admin/CreateArticlePage'
import EditArticlePage from './pages/admin/EditArticlePage'
import './App.css'

function HomePage() {
  return (
    <div className="min-h-screen bg-stone-200 dark:bg-gray-900">
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </div>
  )
}

function App() {
  const { theme } = useTheme()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ai-travel-suite" element={<AITravelSuitePage />} />
        <Route element={<AccountLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/articles" replace />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/create" element={<CreateArticlePage />} />
          <Route path="articles/:id/edit" element={<EditArticlePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" richColors theme={theme} />
    </BrowserRouter>
  )
}

export default App
