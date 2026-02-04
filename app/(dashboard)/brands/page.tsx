import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrandCard } from "@/components/brands/brand-card"

export default async function BrandsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: brands } = await supabase
    .from("brands")
    .select(`
      *,
      color_palettes(count),
      brand_fonts(count)
    `)
    .eq("user_id", user?.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Brands</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all your brand profiles and design systems
          </p>
        </div>
        <Button asChild>
          <Link href="/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            New Brand
          </Link>
        </Button>
      </div>

      {brands && brands.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">No brands yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Create your first brand to start organizing your color palettes, typography, and design assets.
            </p>
            <Button asChild size="lg">
              <Link href="/brands/new">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Brand
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
