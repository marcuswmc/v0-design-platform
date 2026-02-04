"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FeedCard } from "@/components/feed/feed-card"
import { cn } from "@/lib/utils"

const categories = [
  "All",
  "Branding",
  "UI/UX",
  "Typography",
  "Color",
  "Trends",
  "Inspiration",
]

// Sample design feed data
const feedItems = [
  {
    id: "1",
    title: "Modern Brand Guidelines: A Complete Framework",
    description: "Learn how to create comprehensive brand guidelines that scale with your organization.",
    image_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop",
    category: "Branding",
    source: "Design Weekly",
    read_time: 8,
  },
  {
    id: "2",
    title: "The Psychology of Color in Brand Design",
    description: "How color choices influence perception and create emotional connections with your audience.",
    image_url: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=600&h=800&fit=crop",
    category: "Color",
    source: "Color Theory Hub",
    read_time: 6,
  },
  {
    id: "3",
    title: "Typography Trends 2026",
    description: "Explore the latest typography trends shaping digital and print design this year.",
    image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    category: "Typography",
    source: "Type Foundry",
    read_time: 5,
  },
  {
    id: "4",
    title: "Minimalist UI Design Principles",
    description: "Master the art of less is more in interface design.",
    image_url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&h=600&fit=crop",
    category: "UI/UX",
    source: "UI Collective",
    read_time: 7,
  },
  {
    id: "5",
    title: "Building a Cohesive Design System",
    description: "Step-by-step guide to creating design systems that work across teams.",
    image_url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=450&fit=crop",
    category: "Branding",
    source: "System Design",
    read_time: 10,
  },
  {
    id: "6",
    title: "The Rise of Variable Fonts",
    description: "How variable fonts are revolutionizing web typography and brand flexibility.",
    image_url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=700&fit=crop",
    category: "Typography",
    source: "Font Weekly",
    read_time: 4,
  },
  {
    id: "7",
    title: "Dark Mode Design Best Practices",
    description: "Creating beautiful and accessible dark mode experiences for your products.",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    category: "UI/UX",
    source: "Dark Mode Guide",
    read_time: 6,
  },
  {
    id: "8",
    title: "Gradient Design in 2026",
    description: "Explore the evolution of gradients from subtle to bold expressions.",
    image_url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=500&fit=crop",
    category: "Color",
    source: "Gradient Lab",
    read_time: 5,
  },
  {
    id: "9",
    title: "Design Inspiration: Pitch Decks",
    description: "A curated collection of the best startup pitch deck designs.",
    image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
    category: "Inspiration",
    source: "Deck Gallery",
    read_time: 3,
  },
]

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = feedItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Design Feed</h1>
          <p className="mt-1 text-muted-foreground">
            Discover design inspiration and stay up to date with trends
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filteredItems.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
