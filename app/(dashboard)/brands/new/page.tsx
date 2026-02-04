"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewBrandPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError("You must be logged in to create a brand")
      setIsLoading(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from("brands")
      .insert({
        name,
        description: description || null,
        user_id: user.id,
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.push(`/brands/${data.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/brands">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brands
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Brand</h1>
        <p className="mt-1 text-muted-foreground">
          Set up a new brand profile to organize your design assets
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Brand Details</CardTitle>
          <CardDescription>
            Enter the basic information about your brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Moonit, Acme Corp"
                required
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A brief description of your brand..."
                rows={4}
                className="bg-secondary resize-none"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Brand
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/brands">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
