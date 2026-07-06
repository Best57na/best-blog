import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { NavBar, Footer } from '../components/Sections'

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PostPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://blog-post-project-api.vercel.app/posts/${postId}`
        )
        setPost(response.data)
      } catch {
        navigate('/404')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postId, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  if (!post) return null

  return (
    <div>
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1 cursor-pointer transition-colors"
        >
          ← Back
        </button>

        <span
          className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4"
          style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}
        >
          {post.category}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
            T
          </div>
          <span className="text-gray-600 font-medium">{post.author}</span>
          <span>|</span>
          <span>{formatDate(post.date)}</span>
          <span>|</span>
          <span>{post.likes} likes</span>
        </div>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-72 md:h-96 object-cover rounded-2xl mb-8"
        />

        <div className="markdown">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </main>
      <Footer />
    </div>
  )
}
