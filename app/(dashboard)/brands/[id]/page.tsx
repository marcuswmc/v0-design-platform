import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPalettesTab } from "@/components/brands/color-palettes-tab"
import { TypographyTab } from "@/components/brands/typography-tab"
import { BrandOverview } from "@/components/brands/brand-overview"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: brand, error } = await supabase
    .from("brands")
    .select(`
      *,
      color_palettes(*),
      brand_fonts(*)
    `)
    .eq("id", id)
    .single()

  if (error || !brand) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/brands">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{brand.name}</h1>
            {brand.description && (
              <p className="mt-1 text-muted-foreground">{brand.description}</p>
            )}
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="colors">Color Palettes</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BrandOverview brand={brand} />
        </TabsContent>

        <TabsContent value="colors">
          <ColorPalettesTab brandId={brand.id} palettes={brand.color_palettes} />
        </TabsContent>

        <TabsContent value="typography">
          <TypographyTab brandId={brand.id} fonts={brand.brand_fonts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
