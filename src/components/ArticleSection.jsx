import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const categories = ['Highlight', 'Cat', 'Inspiration', 'General']

const articles = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/e739huvlalbfz9eynysc.jpg",
    category: "General",
    title: "The Art of Mindfulness: Finding Peace in a Busy World",
    description: "Discover the transformative power of mindfulness and how it can help you navigate the challenges of modern life with greater ease and contentment.",
    author: "Thompson P.",
    date: "11 September 2024",
    likes: 321,
    content: "## 1. Understanding Mindfulness\n\nMindfulness is the practice of being fully present and engaged in the moment, aware of your thoughts and feelings without distraction or judgment.\n\n## 2. Benefits of Mindfulness\n\nRegular mindfulness practice can reduce stress, improve focus, enhance emotional regulation, and boost overall well-being.",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449811/my-blog-post/xpm2dirwbymkjpxbcczz.jpg",
    category: "Cat",
    title: "The Fascinating World of Cats: Why We Love Our Furry Friends",
    description: "Cats have captivated human hearts for thousands of years. Whether lounging in a sunny spot or playfully chasing a string, these furry companions bring warmth and joy.",
    author: "Thompson P.",
    date: "11 September 2024",
    likes: 214,
    content: "## 1. A Brief History of Cats\n\nCats were first domesticated in the Near East around 7500 BC, and have since become one of the world's most popular pets.\n\n## 2. Understanding Cat Behavior\n\nCats communicate through vocalizations, body language, and scent marking.",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449848/my-blog-post/xzmrpkutzrymxjlhyhkf.jpg",
    category: "Inspiration",
    title: "Finding Motivation: How to Stay Inspired Through Life's Challenges",
    description: "This article explores strategies to maintain motivation when faced with personal or professional challenges. From setting small goals to practicing mindfulness.",
    author: "Thompson P.",
    date: "11 September 2024",
    likes: 178,
    content: "## 1. The Nature of Motivation\n\nMotivation is a driving force that compels us to take action. It can be intrinsic or extrinsic.\n\n## 2. Building Resilience\n\nResilience is the ability to bounce back from setbacks and keep moving forward.",
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449876/my-blog-post/uug11xjbzyvfg4ycxnwx.jpg",
    category: "Cat",
    title: "The Science of the Cat's Purr: How It Benefits Cats and Humans Alike",
    description: "Discover the fascinating science behind the cat's purr, including its potential healing properties for both cats and humans. Learn how this unique sound is produced.",
    author: "Thompson P.",
    date: "11 September 2024",
    likes: 256,
    content: "## 1. How Cats Purr\n\nCats purr by using their laryngeal muscles to dilate and constrict the glottis rapidly during inhalation and exhalation.\n\n## 2. Healing Frequencies\n\nCat purrs vibrate at frequencies between 25-150 Hz, which may promote bone healing.",
  },
  {
    id: 5,
    image: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449907/my-blog-post/oqzihwlbcj3ljcnhxhvn.jpg",
    category: "Inspiration",
    title: "Unlocking Creativity: Simple Habits to Spark Inspiration Daily",
    description: "Discover practical ways to nurture creativity in your everyday life. Whether it's through journaling, taking breaks, or exploring new hobbies, this article offers simple habits.",
    author: "Thompson P.",
    date: "11 September 2024",
    likes: 143,
    content: "## 1. The Creative Mindset\n\nCreativity is not just for artists. It's a way of approaching problems and seeing the world with fresh eyes.\n\n## 2. Daily Creative Habits\n\nSimple practices like morning pages, walks, and curiosity journaling can unlock creativity.",
  },
  {
    id: 6,
    image: "https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449935/my-blog-post/sypm46dqruv2h2gltq8b.jpg",
    category: "Cat",
    title: "Top 10 Health Tips to Keep Your Cat Happy and Healthy",
    description: "This guide offers essential tips on keeping your cat in peak health. Covering topics like proper nutrition, regular vet visits, grooming, and mental stimulation.",
    author: "Thompson P.",
    date: "11 September 2024",
    likes: 189,
    content: "## 1. Proper Nutrition\n\nFeeding your cat a balanced diet is the foundation of good health. Look for high-protein, low-carbohydrate cat foods.\n\n## 2. Regular Vet Checkups\n\nAnnual wellness exams help catch health issues early.",
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
