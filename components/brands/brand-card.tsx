import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Type } from "lucide-react"

interface Brand {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
  color_palettes: { count: number }[]
  brand_fonts: { count: number }[]
}

interface BrandCardProps {
  brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
  const paletteCount = brand.color_palettes?.[0]?.count || 0
  const fontCount = brand.brand_fonts?.[0]?.count || 0

  return (
    <Link href={`/brands/${brand.id}`}>
      <Card className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group h-full">
        <CardContent className="p-0">
          {/* Brand Logo/Preview */}
          <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary overflow-hidden rounded-t-lg">
            {brand.logo_url ? (
              <img
                src={brand.logo_url || "/placeholder.svg"}
                alt={brand.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-card/80 backdrop-blur text-foreground font-bold text-2xl">
                  {brand.name.charAt(0)}
                </div>
              </div>
            )}
          </div>

          {/* Brand Info */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {brand.name}
            </h3>
            {brand.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {brand.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Palette className="h-3.5 w-3.5" />
                {paletteCount} palettes
              </span>
              <span className="flex items-center gap-1">
                <Type className="h-3.5 w-3.5" />
                {fontCount} fonts
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
