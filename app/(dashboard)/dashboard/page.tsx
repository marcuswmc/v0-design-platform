import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Palette, Type, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrandCard } from "@/components/brands/brand-card"

export default async function DashboardPage() {
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
    .limit(4)

  const { count: totalBrands } = await supabase
    .from("brands")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  const { count: totalPalettes } = await supabase
    .from("color_palettes")
    .select("*, brands!inner(user_id)", { count: "exact", head: true })
    .eq("brands.user_id", user?.id)

  const { count: totalFonts } = await supabase
    .from("brand_fonts")
    .select("*, brands!inner(user_id)", { count: "exact", head: true })
    .eq("brands.user_id", user?.id)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your brand assets and design system
          </p>
        </div>
        <Button asChild>
          <Link href="/brands/new">
            <Plus className="mr-2 h-4 w-4" />
            New Brand
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Brands</CardTitle>
            <Palette className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalBrands || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Brand profiles created</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Color Palettes</CardTitle>
            <div className="flex -space-x-1">
              <div className="h-4 w-4 rounded-full bg-[#60D9C4]" />
              <div className="h-4 w-4 rounded-full bg-[#FFB5C5]" />
              <div className="h-4 w-4 rounded-full bg-[#A5B4FC]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalPalettes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Palettes saved</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Typography</CardTitle>
            <Type className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalFonts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Font families</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Brands */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Brands</h2>
          <Button variant="ghost" asChild className="text-primary">
            <Link href="/brands">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {brands && brands.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No brands yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Create your first brand to start organizing your design assets
              </p>
              <Button asChild>
                <Link href="/brands/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Brand
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/tools">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">AI Color Generator</h3>
                  <p className="text-sm text-muted-foreground">Generate palettes with AI</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/feed">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Type className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Design Feed</h3>
                  <p className="text-sm text-muted-foreground">Discover design inspiration</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/brands/new">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">New Brand</h3>
                  <p className="text-sm text-muted-foreground">Start a new project</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
