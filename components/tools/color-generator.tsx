"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shuffle, Copy, Check, Lock, Unlock, Download } from "lucide-react"

interface Color {
  hex: string
  locked: boolean
}

const COLOR_HARMONIES = [
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "split-complementary", label: "Split Complementary" },
  { value: "tetradic", label: "Tetradic" },
  { value: "monochromatic", label: "Monochromatic" },
]

function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function generateHarmony(baseHue: number, harmony: string): number[] {
  switch (harmony) {
    case "complementary":
      return [baseHue, (baseHue + 180) % 360]
    case "analogous":
      return [(baseHue - 30 + 360) % 360, baseHue, (baseHue + 30) % 360]
    case "triadic":
      return [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360]
    case "split-complementary":
      return [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360]
    case "tetradic":
      return [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360]
    case "monochromatic":
      return [baseHue, baseHue, baseHue, baseHue, baseHue]
    default:
      return [baseHue]
  }
}

export function ColorGenerator() {
  const [colors, setColors] = useState<Color[]>([
    { hex: "#2DD4BF", locked: false },
    { hex: "#A78BFA", locked: false },
    { hex: "#FB923C", locked: false },
    { hex: "#F472B6", locked: false },
    { hex: "#38BDF8", locked: false },
  ])
  const [harmony, setHarmony] = useState("analogous")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [baseColor, setBaseColor] = useState("#2DD4BF")

  const generatePalette = useCallback(() => {
    const { h } = hexToHsl(baseColor)
    const hues = generateHarmony(h, harmony)

    const newColors = colors.map((color, index) => {
      if (color.locked) return color

      const hue = hues[index % hues.length]
      const saturation = 60 + Math.random() * 30
      const lightness = harmony === "monochromatic" ? 30 + index * 15 : 45 + Math.random() * 20

      return {
        hex: hslToHex(hue, saturation, lightness),
        locked: false,
      }
    })

    setColors(newColors)
  }, [baseColor, harmony, colors])

  const toggleLock = (index: number) => {
    setColors((prev) => prev.map((color, i) => (i === index ? { ...color, locked: !color.locked } : color)))
  }

  const copyColor = async (hex: string, index: number) => {
    await navigator.clipboard.writeText(hex)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const exportPalette = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join("\n")
    const blob = new Blob([`:root {\n${css}\n}`], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "palette.css"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Color Palette Generator</CardTitle>
          <CardDescription>Generate harmonious color palettes based on color theory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="base-color">Base Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="base-color"
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-28 font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color Harmony</Label>
              <Select value={harmony} onValueChange={setHarmony}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_HARMONIES.map((h) => (
                    <SelectItem key={h.value} value={h.value}>
                      {h.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generatePalette} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Palette
            </Button>
            <Button variant="outline" onClick={exportPalette}>
              <Download className="h-4 w-4 mr-2" />
              Export CSS
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-5 gap-4 h-64">
        {colors.map((color, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden group transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: color.hex }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2 mb-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => toggleLock(index)}
                >
                  {color.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => copyColor(color.hex, index)}
                >
                  {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <span className="text-white font-mono text-sm">{color.hex.toUpperCase()}</span>
            </div>
            {color.locked && (
              <div className="absolute top-2 right-2">
                <Lock className="h-4 w-4 text-white drop-shadow-md" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
