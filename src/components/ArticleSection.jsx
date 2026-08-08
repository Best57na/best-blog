import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useLanguage } from '../lib/language'

const ALL_CATEGORY = "All"

const API_URL = "https://best-blog-server.vercel.app/posts"
const CATEGORIES_URL = "https://best-blog-server.vercel.app/categories"

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function SearchBox({ className = '' }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }
    const timer = setTimeout(async () => {
      const response = await axios.get(API_URL, { params: { keyword: query, limit: 10 } })
      setResults(response.data.posts || [])
      setShowDropdown(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (id) => {
    setShowDropdown(false)
    setQuery('')
    navigate(`/post/${id}`)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Input
        placeholder={t('article.searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        className="pr-8 rounded-full"
      />
      <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

      {showDropdown && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-50 px-4 py-3 text-sm text-gray-400 dark:text-gray-500 text-center">
          {t('article.noResults')}
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <ul className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg z-50 overflow-hidden">
          {results.map((post) => (
            <li key={post.id}>
              <button
                onMouseDown={() => handleSelect(post.id)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {post.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function BlogCard({ id, image, category, title, description, author, date }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <Link to={`/post/${id}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover hover:opacity-90 transition-opacity"
        />
      </Link>
      <div className="p-4">
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-2"
          style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}>
          {category}
        </span>
        <Link to={`/post/${id}`}>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-2 hover:underline">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-[9px] font-semibold text-gray-600 dark:text-gray-300">T</div>
          </div>
          <span className="text-gray-600 dark:text-gray-300 text-xs font-medium">{author}</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}

export default function ArticleSection() {
  const { t } = useLanguage()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    axios.get(CATEGORIES_URL)
      .then((response) => setCategories((response.data.categories || []).map((c) => c.name)))
      .catch((error) => console.error("Error fetching categories:", error))
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const params = { page, limit: 6 }
        if (selectedCategory !== ALL_CATEGORY) params.category = selectedCategory
        const response = await axios.get(API_URL, { params })
        if (!cancelled) {
          setPosts((prev) => page === 1 ? response.data.posts : [...prev, ...response.data.posts])
          setHasMore(response.data.currentPage < response.data.totalPages)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchPosts()
    return () => { cancelled = true }
  }, [page, selectedCategory])

  const handleCategoryChange = (cat) => {
    if (cat === selectedCategory) return
    setPosts([])
    setHasMore(true)
    setPage(1)
    setSelectedCategory(cat)
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  return (
    <div className="px-4 md:px-6 py-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('article.latestArticles')}</h2>

      {/* Desktop: tabs + search */}
      <div className="hidden md:flex items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-full px-4 py-1.5 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {[ALL_CATEGORY, ...categories].map((cat) => (
            <button
              key={cat}
              disabled={selectedCategory === cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 transition-colors rounded-full text-sm font-medium ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <SearchBox className="w-56" />
      </div>

      {/* Mobile: search + select */}
      <div className="md:hidden w-full flex flex-col gap-3 mb-6">
        <SearchBox className="w-full" />
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{t('article.category')}</p>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full py-3 rounded-sm text-gray-600 dark:text-gray-300">
              <SelectValue placeholder={t('article.selectCategoryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {[ALL_CATEGORY, ...categories].map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(article => (
          <BlogCard
            key={article.id}
            id={article.id}
            image={article.image}
            category={article.category}
            title={article.title}
            description={article.description}
            author={article.author}
            date={formatDate(article.date)}
          />
        ))}
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-300 rounded-full animate-spin" />
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('article.loading')}</span>
        </div>
      )}

      {/* View more */}
      {hasMore && !isLoading && (
        <div className="text-center mt-8 mb-4">
          <button
            onClick={handleLoadMore}
            className="text-sm text-gray-500 dark:text-gray-400 underline underline-offset-4 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {t('article.viewMore')}
          </button>
        </div>
      )}
    </div>
  )
}
