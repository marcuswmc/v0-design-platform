"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Type, Calendar } from "lucide-react"

interface ColorPalette {
  id: string
  name: string
  colors: Array<{ hex: string; name: string }>
  is_primary: boolean
}

interface BrandFont {
  id: string
  name: string
  font_family: string
  font_type: string
}

interface Brand {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
  color_palettes: ColorPalette[]
  brand_fonts: BrandFont[]
}

interface BrandOverviewProps {
  brand: Brand
}

export function BrandOverview({ brand }: BrandOverviewProps) {
  const primaryPalette = brand.color_palettes?.find(p => p.is_primary) || brand.color_palettes?.[0]
  const primaryFont = brand.brand_fonts?.find(f => f.font_type === "heading") || brand.brand_fonts?.[0]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Brand Identity Card */}
      <Card className="bg-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle>Brand Identity</CardTitle>
          <CardDescription>Preview of your brand guidelines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-secondary">
            <div className="absolute inset-0 flex items-center justify-center">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url || "/placeholder.svg"}
                  alt={brand.name}
                  className="max-h-32 max-w-[200px] object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl font-bold text-foreground mb-2">{brand.name.charAt(0)}</div>
                  <div className="text-2xl font-semibold text-foreground">{brand.name}</div>
                </div>
              )}
            </div>
            
            {/* Color Strip */}
            {primaryPalette && primaryPalette.colors && primaryPalette.colors.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 flex h-8">
                {primaryPalette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Colors Summary */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Color Palettes</CardTitle>
            <CardDescription>{brand.color_palettes?.length || 0} palettes defined</CardDescription>
          </div>
          <Palette className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          {primaryPalette && primaryPalette.colors && primaryPalette.colors.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{primaryPalette.name}</p>
              <div className="flex gap-2">
                {primaryPalette.colors.slice(0, 6).map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="h-10 w-10 rounded-lg border border-border shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {color.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No color palettes added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Typography Summary */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Typography</CardTitle>
            <CardDescription>{brand.brand_fonts?.length || 0} fonts defined</CardDescription>
          </div>
          <Type className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          {primaryFont ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{primaryFont.font_type || "Primary"}</p>
                <p className="text-2xl font-semibold text-foreground" style={{ fontFamily: primaryFont.font_family }}>
                  {primaryFont.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{primaryFont.font_family}</p>
              </div>
              <div className="text-lg text-foreground" style={{ fontFamily: primaryFont.font_family }}>
                Aa Bb Cc Dd Ee Ff Gg
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No typography defined yet</p>
          )}
        </CardContent>
      </Card>

      {/* Brand Info */}
      <Card className="bg-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Brand Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-foreground">{new Date(brand.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-foreground">{new Date(brand.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
