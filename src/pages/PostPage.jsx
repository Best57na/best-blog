import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { NavBar, Footer } from '../components/Sections'
import { SmilePlus, Copy, X, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '../lib/language'
import { API_BASE } from '../utils/api'

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
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl px-10 py-10 max-w-sm w-full text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-snug">{t('post.authPromptTitle')}</h2>
        <Link to="/signup" className="block w-full py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium text-sm text-center cursor-pointer hover:bg-gray-700 dark:hover:bg-white transition-colors mb-4">
          {t('post.createAccount')}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="underline font-medium text-gray-900 dark:text-gray-100">{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  )
}

function CommentAvatar({ name, avatar }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      {avatar
        ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
        : <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{initials}</span>
      }
    </div>
  )
}

export default function PostPage() {
  const { t } = useLanguage()
  const { postId } = useParams()
  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const isLoggedIn = !!currentUser

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [likeBusy, setLikeBusy] = useState(false)

  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [sendingComment, setSendingComment] = useState(false)

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE}/posts/${postId}`)
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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_BASE}/posts/${postId}/comments`)
        setComments(res.data)
      } catch {
        toast.error(t('post.commentLoadFailed'))
      }
    }
    fetchComments()
  }, [postId])

  useEffect(() => {
    if (!isLoggedIn) return
    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE}/posts/${postId}/likes/me`, { headers: authHeaders() })
        setLiked(res.data.liked)
        setLikeCount(res.data.likes_count)
      } catch {
        // silently ignore, keep default (not liked)
      }
    }
    fetchLikeStatus()
  }, [postId, isLoggedIn])

  const requireAuth = () => { setShowDialog(true) }

  const handleLike = async () => {
    if (!isLoggedIn) { requireAuth(); return }
    if (likeBusy) return
    setLikeBusy(true)
    try {
      const res = await axios.post(`${API_BASE}/posts/${postId}/likes/toggle`, null, { headers: authHeaders() })
      setLiked(res.data.liked)
      setLikeCount(res.data.likes_count)
    } catch {
      toast.error(t('post.likeFailed'))
    } finally {
      setLikeBusy(false)
    }
  }

  const handleSend = async () => {
    if (!isLoggedIn) { requireAuth(); return }
    if (!comment.trim() || sendingComment) return

    setSendingComment(true)
    try {
      const res = await axios.post(
        `${API_BASE}/posts/${postId}/comments`,
        { comment_text: comment.trim() },
        { headers: authHeaders() }
      )
      setComments(prev => [res.data, ...prev])
      setComment('')
      toast.success(t('post.commentPosted'))
    } catch {
      toast.error(t('post.commentPostFailed'))
    } finally {
      setSendingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_BASE}/posts/${postId}/comments/${commentId}`, { headers: authHeaders() })
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success(t('post.commentDeleted'))
    } catch {
      toast.error(t('post.commentDeleteFailed'))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t('post.copiedTitle'), { description: t('post.copiedDesc') })
  }

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400">{t('post.loading')}</div>
  }

  if (!post) return null

  const pageUrl = window.location.href

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 flex items-center gap-1 cursor-pointer transition-colors">
          {t('post.back')}
        </button>

        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4" style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}>
          {post.category}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500 mb-6">
          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">T</div>
          <span className="text-gray-600 dark:text-gray-300 font-medium">{post.author}</span>
          <span>|</span>
          <span>{formatDate(post.date)}</span>
        </div>

        <img src={post.image} alt={post.title} className="w-full h-72 md:h-96 object-cover rounded-2xl mb-8" />

        <div className="markdown">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between bg-stone-100 dark:bg-gray-800 rounded-2xl px-4 py-3 mt-10 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-colors ${
              liked
                ? 'border-orange-300 dark:border-orange-500/60 bg-orange-50 dark:bg-orange-500/10 text-orange-500'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <SmilePlus size={16} />
            {likeCount}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Copy size={15} />
              {t('post.copy')}
            </button>
            <a href={`https://www.facebook.com/share.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <FacebookIcon />
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <LinkedInIcon />
            </a>
            <a href={`https://www.twitter.com/share?&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <TwitterIcon />
            </a>
          </div>
        </div>

        {/* Comment section */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('post.comment')}{comments.length > 0 && <span className="text-gray-400 dark:text-gray-500 font-normal text-base ml-1">({comments.length})</span>}
          </h3>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={t('post.commentPlaceholder')}
            rows={4}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <div className="flex justify-end mt-3">
            <button onClick={handleSend} disabled={sendingComment} className="px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-full cursor-pointer hover:bg-gray-700 dark:hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {t('post.send')}
            </button>
          </div>

          {comments.length > 0 && (
            <div className="mt-6 flex flex-col gap-5">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <CommentAvatar name={c.author} avatar={c.avatar} />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.author}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(c.created_at)}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{c.comment_text}</p>
                  </div>
                  {isLoggedIn && currentUser.id === c.user_id && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      title={t('post.deleteComment')}
                      className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer self-start"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
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
