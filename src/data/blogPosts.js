const blogPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&fit=crop",
    category: "Adventure",
    title: "10 Hidden Gems in Southeast Asia You Must Visit in 2025",
    description: "From the misty highlands of Northern Vietnam to the untouched beaches of the Philippines, Southeast Asia hides countless treasures far from the tourist crowds.",
    author: "Thanakrit W.",
    date: "11 September 2024",
    likes: 412,
    content:
      "## 1. Phong Nha, Vietnam\n\nHome to the world's largest cave systems, Phong Nha offers breathtaking landscapes and underground rivers that will leave you speechless.\n\n## 2. El Nido, Palawan\n\nCrystal-clear waters, dramatic limestone karsts, and pristine coral reefs make El Nido one of the most beautiful places on Earth.\n\n## 3. Hsipaw, Myanmar\n\nA charming town surrounded by tea plantations and tribal villages, offering authentic trekking experiences far off the beaten path.\n\n## 4. Kampot, Cambodia\n\nA sleepy riverside town famous for its pepper farms, French colonial architecture, and laid-back atmosphere.\n\n## 5. Nusa Penida, Indonesia\n\nJust a short ferry from Bali, Nusa Penida offers dramatic cliffs, turquoise waters, and encounters with manta rays.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
    category: "Culture",
    title: "The Ultimate Guide to Solo Travel in Japan: Culture, Etiquette & Must-Sees",
    description: "Japan is one of the safest and most rewarding destinations for solo travelers. Discover how to navigate its unique culture, transportation, and hidden local spots.",
    author: "Thanakrit W.",
    date: "15 September 2024",
    likes: 538,
    content:
      "## 1. Understanding Japanese Etiquette\n\nBowing, removing shoes, and avoiding loud conversations in public are key customs that will earn you respect from locals.\n\n## 2. Getting Around\n\nThe Japan Rail Pass offers incredible value for long-distance travel, while IC cards handle local trains and buses seamlessly.\n\n## 3. Must-Visit Cities\n\nBeyond Tokyo and Kyoto, cities like Kanazawa, Hiroshima, and Nara offer rich history and culture without the crowds.\n\n## 4. Food Etiquette\n\nSlurping noodles is acceptable and even a compliment to the chef. Tipping, however, is considered rude in Japan.\n\n## 5. Accommodation Options\n\nFrom budget-friendly capsule hotels to traditional ryokans with onsen baths, Japan has something for every type of traveler.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop",
    category: "Culture",
    title: "Exploring Ancient Rome: Walking Through 2,000 Years of History",
    description: "Every cobblestone in Rome tells a story. This guide takes you through the Colosseum, the Forum, and the hidden neighborhoods that most tourists never see.",
    author: "Thanakrit W.",
    date: "20 September 2024",
    likes: 297,
    content:
      "## 1. The Colosseum at Dawn\n\nArriving at the Colosseum early in the morning lets you experience this iconic landmark without the crowds, bathed in golden light.\n\n## 2. Trastevere: Rome's Living Neighborhood\n\nJust across the Tiber, Trastevere offers authentic Roman life with vine-covered restaurants and charming piazzas.\n\n## 3. The Roman Forum\n\nWalk through the heart of ancient Rome and imagine senators debating in the shadow of temples that still partially stand today.\n\n## 4. Hidden Gems\n\nThe Aventine Keyhole, the Protestant Cemetery, and the underground basilica of San Clemente are Rome's best-kept secrets.\n\n## 5. Practical Tips\n\nBook tickets in advance for the Vatican and Colosseum. Many churches are free and house masterpieces by Caravaggio and Michelangelo.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=400&fit=crop",
    category: "Food",
    title: "Street Food Adventures: The Best Night Markets in Bangkok",
    description: "Bangkok's night markets are a sensory overload in the best possible way. Pad thai, mango sticky rice, boat noodles — here's where to find the most authentic bites.",
    author: "Thanakrit W.",
    date: "25 September 2024",
    likes: 384,
    content:
      "## 1. Or Tor Kor Market\n\nThis market is renowned for having the freshest produce and highest quality street food in Bangkok, beloved by locals and chefs alike.\n\n## 2. Chatuchak Weekend Market\n\nBeyond shopping, Chatuchak is a paradise for food lovers with hundreds of stalls serving everything from grilled seafood to fresh coconut ice cream.\n\n## 3. Yaowarat (Chinatown)\n\nBangkok's Chinatown comes alive at night with roasted duck, dim sum, and fresh seafood grilled right on the street.\n\n## 4. Asiatique The Riverfront\n\nA riverside night market combining shopping and dining with stunning views of the Chao Phraya River.\n\n## 5. Food Safety Tips\n\nLook for stalls with high turnover, eat where locals eat, and don't be afraid to point at what looks good — most vendors are happy to help.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop",
    category: "Adventure",
    title: "Trekking Patagonia: What You Need to Know Before You Go",
    description: "The W Circuit and the full O Circuit through Torres del Paine are bucket-list treks. Here's everything you need to plan the adventure of a lifetime in Patagonia.",
    author: "Thanakrit W.",
    date: "1 October 2024",
    likes: 461,
    content:
      "## 1. Best Time to Visit\n\nPatagonia's trekking season runs from October to April. January and February offer the most stable weather, though wind is always a factor.\n\n## 2. Booking Refugios in Advance\n\nCampsites and refugios along the W Circuit fill up months in advance. Book as early as possible, especially for December and January.\n\n## 3. Packing Essentials\n\nLayering is key. Pack a windproof jacket, trekking poles, waterproof boots, and a sleeping bag rated for sub-zero temperatures.\n\n## 4. The W Circuit Highlights\n\nThe trek passes through Valle del Francés, Mirador Base Las Torres, and the Grey Glacier — each a world-class natural spectacle.\n\n## 5. Leave No Trace\n\nPatagonia's ecosystem is fragile. Carry out all waste, stay on marked trails, and never pick plants or disturb wildlife.",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
    category: "Tips",
    title: "Santorini on a Budget: How to Experience Greece Without Overspending",
    description: "Santorini has a reputation for being expensive, but with the right tips you can enjoy white-washed villages, volcanic beaches, and stunning sunsets without breaking the bank.",
    author: "Thanakrit W.",
    date: "5 October 2024",
    likes: 329,
    content:
      "## 1. Stay in Fira or Perissa\n\nOia is picturesque but pricey. Fira offers similar views at half the cost, while Perissa on the black sand beach is perfect for budget travelers.\n\n## 2. Ferry Over Flying\n\nTaking a high-speed ferry from Athens to Santorini is significantly cheaper than flying and offers stunning views of the Aegean Sea.\n\n## 3. Eat Like a Local\n\nSkip the cliffside restaurants and head inland for tavernas serving fresh gyros, souvlaki, and fresh fish at a fraction of the tourist price.\n\n## 4. Free Attractions\n\nThe caldera views, the black and red sand beaches, and the ancient site of Akrotiri (entrance fee only) are among the best experiences on the island.\n\n## 5. Visit in Shoulder Season\n\nMay, June, and September offer warm weather and fewer crowds. Prices for accommodation and tours drop significantly compared to peak July–August.",
  },
]

export default blogPosts
