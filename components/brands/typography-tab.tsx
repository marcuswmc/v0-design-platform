"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Loader2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BrandFont {
  id: string
  name: string
  font_family: string
  font_type: string
}

interface TypographyTabProps {
  brandId: string
  fonts: BrandFont[]
}

const popularFonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Playfair Display",
  "Merriweather",
  "Source Sans Pro",
  "Nunito",
  "Ubuntu",
  "Oswald",
  "Libre Baskerville",
  "DM Sans",
  "Space Grotesk",
  "Geist",
  "Helvetica Now Display",
]

const fontTypes = [
  { value: "heading", label: "Heading" },
  { value: "body", label: "Body" },
  { value: "display", label: "Display" },
  { value: "accent", label: "Accent" },
]

export function TypographyTab({ brandId, fonts: initialFonts }: TypographyTabProps) {
  const router = useRouter()
  const supabase = createClient()
  const [fonts, setFonts] = useState(initialFonts || [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [newFont, setNewFont] = useState({
    name: "",
    font_family: "",
    font_type: "heading",
  })

  const handleAddFont = async () => {
    if (!newFont.name.trim() || !newFont.font_family.trim()) return
    setIsLoading(true)

    const { data, error } = await supabase
      .from("brand_fonts")
      .insert({
        brand_id: brandId,
        name: newFont.name,
        font_family: newFont.font_family,
        font_type: newFont.font_type,
      })
      .select()
      .single()

    if (!error && data) {
      setFonts([...fonts, data])
      setNewFont({ name: "", font_family: "", font_type: "heading" })
      setIsDialogOpen(false)
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleDeleteFont = async (id: string) => {
    const { error } = await supabase
      .from("brand_fonts")
      .delete()
      .eq("id", id)

    if (!error) {
      setFonts(fonts.filter(f => f.id !== id))
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Typography</h2>
          <p className="text-sm text-muted-foreground">Define your brand typography system</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Font
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add Font</DialogTitle>
              <DialogDescription>
                Add a font to your brand typography system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="font-name">Font Name</Label>
                <Input
                  id="font-name"
                  value={newFont.name}
                  onChange={(e) => setNewFont({ ...newFont, name: e.target.value })}
                  placeholder="e.g., Helvetica Now Display"
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={newFont.font_family}
                  onValueChange={(value) => setNewFont({ ...newFont, font_family: value, name: newFont.name || value })}
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularFonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Or enter a custom font family below</p>
                <Input
                  value={newFont.font_family}
                  onChange={(e) => setNewFont({ ...newFont, font_family: e.target.value })}
                  placeholder="Custom font family"
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label>Font Type</Label>
                <Select
                  value={newFont.font_type}
                  onValueChange={(value) => setNewFont({ ...newFont, font_type: value })}
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              {newFont.font_family && (
                <div className="space-y-2 pt-2">
                  <Label>Preview</Label>
                  <div className="rounded-lg border border-border bg-secondary/50 p-4">
                    <p className="text-3xl font-bold text-foreground" style={{ fontFamily: newFont.font_family }}>
                      {newFont.name || newFont.font_family}
                    </p>
                    <p className="text-lg text-foreground mt-2" style={{ fontFamily: newFont.font_family }}>
                      Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
                    </p>
                    <p className="text-foreground mt-2" style={{ fontFamily: newFont.font_family }}>
                      The quick brown fox jumps over the lazy dog. 1234567890
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFont} disabled={isLoading || !newFont.name.trim() || !newFont.font_family.trim()}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Font
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {fonts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {fonts.map((font) => (
            <Card key={font.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{font.name}</CardTitle>
                  <CardDescription className="capitalize">{font.font_type}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteFont(font.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <p className="text-3xl font-bold text-foreground" style={{ fontFamily: font.font_family }}>
                    Aa
                  </p>
                  <p className="text-lg text-foreground mt-2" style={{ fontFamily: font.font_family }}>
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                  <p className="text-foreground" style={{ fontFamily: font.font_family }}>
                    abcdefghijklmnopqrstuvwxyz
                  </p>
                  <p className="text-foreground mt-1" style={{ fontFamily: font.font_family }}>
                    1234567890!@#$%
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-3 font-mono">{font.font_family}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl font-bold text-primary mb-4">Aa</div>
            <h3 className="text-lg font-medium text-foreground mb-1">No fonts defined</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Add fonts to define your brand typography system
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Font
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
