import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowRight, Palette, Type, Sparkles, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Palette className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Designary</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Design Management Platform
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance max-w-4xl mx-auto">
            Your brand guidelines,{" "}
            <span className="text-primary">beautifully organized</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Manage color palettes, typography, and design assets in one central hub. 
            Create consistent brand experiences across all your projects.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Everything you need for brand management
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From color palettes to typography systems, manage all your brand assets in one place.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Color Palettes</h3>
              <p className="text-muted-foreground">
                Create and manage unlimited color palettes with hex, RGB, and HSL values.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Type className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Typography</h3>
              <p className="text-muted-foreground">
                Define your type system with fonts, sizes, and hierarchy.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI Tools</h3>
              <p className="text-muted-foreground">
                Generate color palettes and get design suggestions powered by AI.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Multi-Brand</h3>
              <p className="text-muted-foreground">
                Manage multiple brands and projects from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Color Preview */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Beautiful color management
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Create stunning color palettes and export them in any format you need.
              </p>
            </div>
            <div className="flex h-24">
              <div className="flex-1 bg-[#60D9C4]" />
              <div className="flex-1 bg-[#FFB5C5]" />
              <div className="flex-1 bg-[#A5B4FC]" />
              <div className="flex-1 bg-[#F9D976]" />
              <div className="flex-1 bg-[#1A1A2E]" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to organize your brand?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start managing your brand guidelines today. Free to get started.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Create your Designary
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Palette className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Designary</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for designers, by designers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
