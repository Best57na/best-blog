import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const categories = ["Highlight", "Adventure", "Culture", "Food", "Tips"]

const articles = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&fit=crop",
    category: "Adventure",
    title: "10 Hidden Gems in Southeast Asia You Must Visit in 2025",
    description: "From the misty highlands of Northern Vietnam to the untouched beaches of the Philippines, Southeast Asia hides countless treasures far from the tourist crowds.",
    author: "Thompson P.",
    date: "11 September 2024",
    likes: 412,
    content: "## 1. Phong Nha, Vietnam\n\nHome to the world's largest cave systems, Phong Nha offers breathtaking landscapes and underground rivers that will leave you speechless.\n\n## 2. El Nido, Palawan\n\nCrystal-clear waters, dramatic limestone karsts, and pristine coral reefs make El Nido one of the most beautiful places on Earth.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
    category: "Culture",
    title: "The Ultimate Guide to Solo Travel in Japan: Culture, Etiquette & Must-Sees",
    description: "Japan is one of the safest and most rewarding destinations for solo travelers. Discover how to navigate its unique culture, transportation, and hidden local spots.",
    author: "Thompson P.",
    date: "15 September 2024",
    likes: 538,
    content: "## 1. Understanding Japanese Etiquette\n\nBowing, removing shoes, and avoiding loud conversations in public are key customs that will earn you respect from locals.\n\n## 2. Getting Around\n\nThe Japan Rail Pass offers incredible value for long-distance travel, while IC cards handle local trains and buses seamlessly.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop",
    category: "Culture",
    title: "Exploring Ancient Rome: Walking Through 2,000 Years of History",
    description: "Every cobblestone in Rome tells a story. This guide takes you through the Colosseum, the Forum, and the hidden neighborhoods that most tourists never see.",
    author: "Thompson P.",
    date: "20 September 2024",
    likes: 297,
    content: "## 1. The Colosseum at Dawn\n\nArriving at the Colosseum early in the morning lets you experience this iconic landmark without the crowds, bathed in golden light.\n\n## 2. Trastevere: Rome's Living Neighborhood\n\nJust across the Tiber, Trastevere offers authentic Roman life with vine-covered restaurants and charming piazzas.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=400&fit=crop",
    category: "Food",
    title: "Street Food Adventures: The Best Night Markets in Bangkok",
    description: "Bangkok's night markets are a sensory overload in the best possible way. Pad thai, mango sticky rice, boat noodles — here's where to find the most authentic bites.",
    author: "Thompson P.",
    date: "25 September 2024",
    likes: 384,
    content: "## 1. Or Tor Kor Market\n\nThis market is renowned for having the freshest produce and highest quality street food in Bangkok, beloved by locals and chefs alike.\n\n## 2. Chatuchak Weekend Market\n\nBeyond shopping, Chatuchak is a paradise for food lovers with hundreds of stalls serving everything from grilled seafood to fresh coconut ice cream.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop",
    category: "Adventure",
    title: "Trekking Patagonia: What You Need to Know Before You Go",
    description: "The W Circuit and the full O Circuit through Torres del Paine are bucket-list treks. Here's everything you need to plan the adventure of a lifetime in Patagonia.",
    author: "Thompson P.",
    date: "1 October 2024",
    likes: 461,
    content: "## 1. Best Time to Visit\n\nPatagonia's trekking season runs from October to April. January and February offer the most stable weather, though wind is always a factor.\n\n## 2. Booking Refugios in Advance\n\nCampsites and refugios along the W Circuit fill up months in advance. Book as early as possible, especially for December and January.",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
    category: "Tips",
    title: "Santorini on a Budget: How to Experience Greece Without Overspending",
    description: "Santorini has a reputation for being expensive, but with the right tips you can enjoy white-washed villages, volcanic beaches, and stunning sunsets without breaking the bank.",
    author: "Thompson P.",
    date: "5 October 2024",
    likes: 329,
    content: "## 1. Stay in Fira or Perissa\n\nOia is picturesque but pricey. Fira offers similar views at half the cost, while Perissa on the black sand beach is perfect for budget travelers.\n\n## 2. Ferry Over Flying\n\nTaking a high-speed ferry from Athens to Santorini is significantly cheaper than flying and offers stunning views of the Aegean Sea.",
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
