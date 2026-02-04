"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Copy, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Color {
  hex: string
  name: string
}

interface ColorPalette {
  id: string
  name: string
  colors: Color[]
  is_primary: boolean
}

interface ColorPalettesTabProps {
  brandId: string
  palettes: ColorPalette[]
}

export function ColorPalettesTab({ brandId, palettes: initialPalettes }: ColorPalettesTabProps) {
  const router = useRouter()
  const supabase = createClient()
  const [palettes, setPalettes] = useState(initialPalettes || [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const [newPalette, setNewPalette] = useState({
    name: "",
    colors: [
      { hex: "#60D9C4", name: "Primary" },
      { hex: "#FFB5C5", name: "Secondary" },
      { hex: "#A5B4FC", name: "Accent" },
      { hex: "#1A1A2E", name: "Dark" },
      { hex: "#FFFFFF", name: "Light" },
    ],
  })

  const handleAddPalette = async () => {
    if (!newPalette.name.trim()) return
    setIsLoading(true)

    const { data, error } = await supabase
      .from("color_palettes")
      .insert({
        brand_id: brandId,
        name: newPalette.name,
        colors: newPalette.colors,
        is_primary: palettes.length === 0,
      })
      .select()
      .single()

    if (!error && data) {
      setPalettes([...palettes, data])
      setNewPalette({
        name: "",
        colors: [
          { hex: "#60D9C4", name: "Primary" },
          { hex: "#FFB5C5", name: "Secondary" },
          { hex: "#A5B4FC", name: "Accent" },
          { hex: "#1A1A2E", name: "Dark" },
          { hex: "#FFFFFF", name: "Light" },
        ],
      })
      setIsDialogOpen(false)
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleDeletePalette = async (id: string) => {
    const { error } = await supabase
      .from("color_palettes")
      .delete()
      .eq("id", id)

    if (!error) {
      setPalettes(palettes.filter(p => p.id !== id))
      router.refresh()
    }
  }

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const updateNewColor = (index: number, field: "hex" | "name", value: string) => {
    const updatedColors = [...newPalette.colors]
    updatedColors[index] = { ...updatedColors[index], [field]: value }
    setNewPalette({ ...newPalette, colors: updatedColors })
  }

  const addNewColor = () => {
    setNewPalette({
      ...newPalette,
      colors: [...newPalette.colors, { hex: "#000000", name: `Color ${newPalette.colors.length + 1}` }],
    })
  }

  const removeNewColor = (index: number) => {
    setNewPalette({
      ...newPalette,
      colors: newPalette.colors.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Color Palettes</h2>
          <p className="text-sm text-muted-foreground">Manage your brand color schemes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Palette
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create Color Palette</DialogTitle>
              <DialogDescription>
                Add a new color palette to your brand
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="palette-name">Palette Name</Label>
                <Input
                  id="palette-name"
                  value={newPalette.name}
                  onChange={(e) => setNewPalette({ ...newPalette, name: e.target.value })}
                  placeholder="e.g., Primary Colors, Brand Palette"
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Colors</Label>
                  <Button variant="ghost" size="sm" onClick={addNewColor}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Color
                  </Button>
                </div>
                <div className="grid gap-3">
                  {newPalette.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateNewColor(index, "hex", e.target.value)}
                        className="h-10 w-10 rounded cursor-pointer border border-border"
                      />
                      <Input
                        value={color.hex}
                        onChange={(e) => updateNewColor(index, "hex", e.target.value)}
                        className="w-28 bg-secondary font-mono text-sm"
                      />
                      <Input
                        value={color.name}
                        onChange={(e) => updateNewColor(index, "name", e.target.value)}
                        placeholder="Color name"
                        className="flex-1 bg-secondary"
                      />
                      {newPalette.colors.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeNewColor(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex rounded-lg overflow-hidden h-16">
                  {newPalette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPalette} disabled={isLoading || !newPalette.name.trim()}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Palette
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {palettes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {palettes.map((palette) => (
            <Card key={palette.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{palette.name}</CardTitle>
                  {palette.is_primary && (
                    <CardDescription className="text-primary">Primary Palette</CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePalette(palette.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* Color Strip */}
                <div className="flex rounded-lg overflow-hidden h-12 mb-4">
                  {palette.colors?.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
                {/* Color Swatches */}
                <div className="flex flex-wrap gap-2">
                  {palette.colors?.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(color.hex)}
                      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <div
                        className="h-5 w-5 rounded border border-border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-mono text-xs text-muted-foreground">{color.hex}</span>
                      {copiedColor === color.hex ? (
                        <Check className="h-3 w-3 text-primary" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex -space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full border-2 border-card bg-[#60D9C4]" />
              <div className="h-10 w-10 rounded-full border-2 border-card bg-[#FFB5C5]" />
              <div className="h-10 w-10 rounded-full border-2 border-card bg-[#A5B4FC]" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No color palettes yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Create your first color palette to define your brand colors
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Palette
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
