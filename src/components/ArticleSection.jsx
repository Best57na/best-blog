import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const categories = ['Highlight', 'Cat', 'Inspiration', 'General']

const articles = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/cat11/600/400',
    category: 'Cat',
    title: 'Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do',
    description: 'Dive into the curious world of cat behavior, exploring why cats knead, purr, and chase imaginary prey. This article helps pet owners decode their feline\'s actions a...',
    author: 'Thompson P.',
    date: '11 September 2024',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/cat22/600/400',
    category: 'Cat',
    title: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    description: 'Cats have captivated human hearts for thousands of years. Whether lounging in a sunny spot or playfully chasing a string, these furry companions bring warmth an...',
    author: 'Thompson P.',
    date: '11 September 2024',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/inspire1/600/400',
    category: 'Cat',
    title: 'Finding Motivation: How to Stay Inspired Through Life\'s Challenges',
    description: 'This article explores strategies to maintain motivation when faced with personal or professional challenges. From setting small goals to practicing mindfulness and s...',
    author: 'Thompson P.',
    date: '11 September 2024',
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/cat33/600/400',
    category: 'Cat',
    title: 'The Science of the Cat\'s Purr: How It Benefits Cats and Humans Alike',
    description: 'Discover the fascinating science behind the cat\'s purr, including its potential healing properties for both cats and humans. Learn how this unique sound is prod...',
    author: 'Thompson P.',
    date: '11 September 2024',
  },
  {
    id: 5,
    image: 'https://picsum.photos/seed/creative1/600/400',
    category: 'Cat',
    title: 'Unlocking Creativity: Simple Habits to Spark Inspiration Daily',
    description: 'Discover practical ways to nurture creativity in your everyday life. Whether it\'s through journaling, taking breaks, or exploring new hobbies, this article offers simp...',
    author: 'Thompson P.',
    date: '11 September 2024',
  },
  {
    id: 6,
    image: 'https://picsum.photos/seed/cat44/600/400',
    category: 'Cat',
    title: 'Top 10 Health Tips to Keep Your Cat Happy and Healthy',
    description: 'This guide offers essential tips on keeping your cat in peak health. Covering topics like proper nutrition, regular vet visits, grooming, and mental stimulation, it\'s a mu...',
    author: 'Thompson P.',
    date: '11 September 2024',
  },
]

function ArticleCard({ article }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-52 object-cover"
      />
      <div className="p-4">
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full mb-2"
          style={{ backgroundColor: '#D7F2E9', color: '#12B279' }}>
          {article.category}
        </span>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-[9px] font-semibold text-gray-600">T</div>
          </div>
          <span className="text-gray-600 text-xs font-medium">{article.author}</span>
          <span className="text-gray-300">|</span>
          <span>{article.date}</span>
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
        <div className="flex items-center gap-1">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                i === 0
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
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
      <div className="md:hidden flex flex-col gap-3 mb-6">
        <div className="relative">
          <Input placeholder="Search" className="pr-10 rounded-full" />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1.5">Category</p>
          <select className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none cursor-pointer"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
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
