import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import blogPosts from '@/data/blogPosts'

const categories = ["Highlight", "Adventure", "Culture", "Food", "Tips"]

function BlogCard({ image, category, title, description, author, date }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <img
        src={image}
        alt={title}
        className="w-full h-52 object-cover"
      />
      <div className="p-4">
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-2"
          style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}>
          {category}
        </span>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-[9px] font-semibold text-gray-600">T</div>
          </div>
          <span className="text-gray-600 text-xs font-medium">{author}</span>
          <span className="text-gray-300">|</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}

export default function ArticleSection() {
  return (
    <div className="px-4 md:px-6 py-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest articles</h2>

      {/* Desktop: tabs + search */}
      <div className="hidden md:flex items-center justify-between mb-6 bg-white rounded-2xl px-4 py-2.5 border border-gray-100">
        <div className="hidden md:flex space-x-2">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-3 transition-colors rounded-sm text-sm text-muted-foreground font-medium cursor-pointer ${
                i === 0 ? 'bg-[#DAD6D1]' : ''
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <Input placeholder="Search" className="w-48 pr-8 rounded-full" />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Mobile: search + select */}
      <div className="md:hidden w-full flex flex-col gap-3 mb-6">
        <div className="relative">
          <Input placeholder="Search" className="pr-10 rounded-full" />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Category</p>
          <Select defaultValue="Highlight">
            <SelectTrigger className="w-full py-3 rounded-sm text-muted-foreground">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogPosts.map(article => (
          <BlogCard
            key={article.id}
            image={article.image}
            category={article.category}
            title={article.title}
            description={article.description}
            author={article.author}
            date={article.date}
          />
        ))}
      </div>

      {/* View more */}
      <div className="text-center mt-8 mb-4">
        <button className="text-sm text-gray-500 underline underline-offset-4 cursor-pointer hover:text-gray-900 transition-colors">
          View more
        </button>
      </div>
    </div>
  )
}
