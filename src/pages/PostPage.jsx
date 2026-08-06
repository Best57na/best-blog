import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { NavBar, Footer } from '../components/Sections'
import { SmilePlus, Copy, X } from 'lucide-react'
import { toast } from 'sonner'

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

function AuthDialog({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl px-10 py-10 max-w-sm w-full text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">Create an account to continue</h2>
        <Link to="/signup" className="block w-full py-3.5 bg-gray-900 text-white rounded-full font-medium text-sm text-center cursor-pointer hover:bg-gray-700 transition-colors mb-4">
          Create account
        </Link>
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="underline font-medium text-gray-900">Log in</Link>
        </p>
      </div>
    </div>
  )
}

function CommentAvatar({ name, avatar }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
      {avatar
        ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
        : <span className="text-xs font-bold text-gray-600">{initials}</span>
      }
    </div>
  )
}

export default function PostPage() {
  const { postId } = useParams()
  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const isLoggedIn = !!currentUser

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)

  const [liked, setLiked] = useState(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    return !!likedPosts[postId]
  })
  const [likeCount, setLikeCount] = useState(0)

  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('postComments') || '{}')
    return stored[postId] || []
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`https://best-blog-server.vercel.app/posts/${postId}`)
        setPost(res.data)
        setLikeCount(res.data.likes_count)
      } catch {
        navigate('/404')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postId, navigate])

  const requireAuth = () => { setShowDialog(true) }

  const handleLike = () => {
    if (!isLoggedIn) { requireAuth(); return }
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    if (liked) {
      delete likedPosts[postId]
      setLikeCount(c => c - 1)
    } else {
      likedPosts[postId] = true
      setLikeCount(c => c + 1)
    }
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    setLiked(prev => !prev)
  }

  const handleSend = () => {
    if (!isLoggedIn) { requireAuth(); return }
    if (!comment.trim()) return

    const newComment = {
      id: Date.now(),
      author: currentUser.name || currentUser.username || 'User',
      avatar: currentUser.profilePic || null,
      text: comment.trim(),
      date: new Date().toISOString(),
    }

    const stored = JSON.parse(localStorage.getItem('postComments') || '{}')
    const updated = { ...stored, [postId]: [newComment, ...(stored[postId] || [])] }
    localStorage.setItem('postComments', JSON.stringify(updated))

    setComments(prev => [newComment, ...prev])
    setComment('')
    toast.success('Comment posted!')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Copied!', { description: 'This article has been copied to your clipboard.' })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  }

  if (!post) return null

  const pageUrl = window.location.href

  return (
    <div>
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1 cursor-pointer transition-colors">
          ← Back
        </button>

        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4" style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}>
          {post.category}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">T</div>
          <span className="text-gray-600 font-medium">{post.author}</span>
          <span>|</span>
          <span>{formatDate(post.date)}</span>
        </div>

        <img src={post.image} alt={post.title} className="w-full h-72 md:h-96 object-cover rounded-2xl mb-8" />

        <div className="markdown">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between bg-stone-100 rounded-2xl px-4 py-3 mt-10 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-colors ${
              liked
                ? 'border-orange-300 bg-orange-50 text-orange-500'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SmilePlus size={16} />
            {likeCount}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
              <Copy size={15} />
              Copy
            </button>
            <a href={`https://www.facebook.com/share.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
              <FacebookIcon />
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
              <LinkedInIcon />
            </a>
            <a href={`https://www.twitter.com/share?&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
              <TwitterIcon />
            </a>
          </div>
        </div>

        {/* Comment section */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Comment{comments.length > 0 && <span className="text-gray-400 font-normal text-base ml-1">({comments.length})</span>}
          </h3>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="What are your thoughts?"
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <div className="flex justify-end mt-3">
            <button onClick={handleSend} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
              Send
            </button>
          </div>

          {comments.length > 0 && (
            <div className="mt-6 flex flex-col gap-5">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <CommentAvatar name={c.author} avatar={c.avatar} />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-gray-900">{c.author}</p>
                      <p className="text-xs text-gray-400">{formatDate(c.date)}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      {showDialog && <AuthDialog onClose={() => setShowDialog(false)} />}
    </div>
  )
}
