import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { NavBar, Footer } from './components/Sections'
import { HeroSection } from './components/Sections'
import ArticleSection from './components/ArticleSection'
import PostPage from './pages/PostPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function HomePage() {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  )
}

export default App
