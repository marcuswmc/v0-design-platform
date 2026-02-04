"use client"

import { useState } from "react"
import { Bookmark, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FeedItem {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  source: string
  read_time: number
}

interface FeedCardProps {
  item: FeedItem
}

export function FeedCard({ item }: FeedCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="bg-card border-border overflow-hidden break-inside-avoid mb-4 group cursor-pointer hover:border-primary/30 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={item.image_url || "/placeholder.svg"}
            alt={item.title}
            className={cn(
              "w-full object-cover transition-transform duration-500",
              isHovered && "scale-105"
            )}
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity",
            isHovered && "opacity-100"
          )} />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {item.category}
            </span>
          </div>

          {/* Save Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            onClick={(e) => {
              e.stopPropagation()
              setIsSaved(!isSaved)
            }}
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-primary text-primary")} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{item.read_time} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{item.source}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
