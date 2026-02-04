"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, X, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 0

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

function getWCAGLevel(ratio: number): { aa: boolean; aaLarge: boolean; aaa: boolean; aaaLarge: boolean } {
  return {
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  }
}

export function ContrastChecker() {
  const [foreground, setForeground] = useState("#FFFFFF")
  const [background, setBackground] = useState("#1A1A2E")

  const contrastRatio = useMemo(() => getContrastRatio(foreground, background), [foreground, background])
  const wcagLevels = useMemo(() => getWCAGLevel(contrastRatio), [contrastRatio])

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
  }

  const getRatingColor = (passes: boolean) => (passes ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30")

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Contrast Checker</CardTitle>
          <CardDescription>Check WCAG accessibility compliance for your colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={swapColors} className="w-full bg-transparent">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Swap Colors
          </Button>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <span className="text-muted-foreground">Contrast Ratio</span>
              <span className="text-2xl font-bold text-foreground">{contrastRatio.toFixed(2)}:1</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${getRatingColor(wcagLevels.aa)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AA Normal</span>
                  {wcagLevels.aa ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <span className="text-xs opacity-70">4.5:1 required</span>
              </div>

              <div className={`p-3 rounded-lg border ${getRatingColor(wcagLevels.aaLarge)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AA Large</span>
                  {wcagLevels.aaLarge ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <span className="text-xs opacity-70">3:1 required</span>
              </div>

              <div className={`p-3 rounded-lg border ${getRatingColor(wcagLevels.aaa)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AAA Normal</span>
                  {wcagLevels.aaa ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <span className="text-xs opacity-70">7:1 required</span>
              </div>

              <div className={`p-3 rounded-lg border ${getRatingColor(wcagLevels.aaaLarge)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AAA Large</span>
                  {wcagLevels.aaaLarge ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <span className="text-xs opacity-70">4.5:1 required</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="overflow-hidden border-border">
          <div
            className="p-8 space-y-4"
            style={{ backgroundColor: background }}
          >
            <h2
              className="text-4xl font-bold"
              style={{ color: foreground }}
            >
              Heading Text
            </h2>
            <p
              className="text-lg"
              style={{ color: foreground }}
            >
              This is a sample paragraph text to demonstrate how your chosen colors work together in a realistic context.
            </p>
            <p
              className="text-sm"
              style={{ color: foreground }}
            >
              Smaller text like captions and labels need higher contrast ratios to remain readable.
            </p>
            <button
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: foreground, color: background }}
            >
              Sample Button
            </button>
          </div>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <Label className="text-xs text-muted-foreground">Quick Reference</Label>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Normal text: at least 4.5:1 for AA</li>
              <li>Large text (18px+ or 14px+ bold): at least 3:1 for AA</li>
              <li>Non-text content (icons, borders): at least 3:1</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
