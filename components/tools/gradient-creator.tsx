"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Copy, Check, Plus, X, Shuffle } from "lucide-react"

interface GradientStop {
  color: string
  position: number
}

const GRADIENT_PRESETS = [
  { name: "Sunset", stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FFE66D", position: 100 }] },
  { name: "Ocean", stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }] },
  { name: "Forest", stops: [{ color: "#11998e", position: 0 }, { color: "#38ef7d", position: 100 }] },
  { name: "Aurora", stops: [{ color: "#00c6fb", position: 0 }, { color: "#005bea", position: 50 }, { color: "#9d50bb", position: 100 }] },
  { name: "Peach", stops: [{ color: "#FFB88C", position: 0 }, { color: "#DE6262", position: 100 }] },
  { name: "Mint", stops: [{ color: "#2DD4BF", position: 0 }, { color: "#06B6D4", position: 100 }] },
]

export function GradientCreator() {
  const [stops, setStops] = useState<GradientStop[]>([
    { color: "#2DD4BF", position: 0 },
    { color: "#A78BFA", position: 100 },
  ])
  const [gradientType, setGradientType] = useState("linear")
  const [angle, setAngle] = useState(90)
  const [copied, setCopied] = useState(false)

  const generateGradientCSS = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const stopsString = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ")

    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${stopsString})`
    } else if (gradientType === "radial") {
      return `radial-gradient(circle, ${stopsString})`
    } else {
      return `conic-gradient(from ${angle}deg, ${stopsString})`
    }
  }

  const addStop = () => {
    if (stops.length >= 5) return
    const newPosition = Math.round((stops[stops.length - 1].position + stops[0].position) / 2)
    setStops([...stops, { color: "#FFFFFF", position: newPosition }])
  }

  const removeStop = (index: number) => {
    if (stops.length <= 2) return
    setStops(stops.filter((_, i) => i !== index))
  }

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    setStops(stops.map((stop, i) => (i === index ? { ...stop, ...updates } : stop)))
  }

  const copyCSS = async () => {
    const css = `background: ${generateGradientCSS()};`
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const applyPreset = (preset: typeof GRADIENT_PRESETS[number]) => {
    setStops(preset.stops)
  }

  const randomizeGradient = () => {
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`
    setStops([
      { color: randomColor(), position: 0 },
      { color: randomColor(), position: 100 },
    ])
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Gradient Creator</CardTitle>
          <CardDescription>Design beautiful gradients for your brand</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label>Gradient Type</Label>
                <Select value={gradientType} onValueChange={setGradientType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(gradientType === "linear" || gradientType === "conic") && (
                <div className="space-y-2 flex-1">
                  <Label>Angle: {angle}deg</Label>
                  <Slider
                    value={[angle]}
                    onValueChange={([v]) => setAngle(v)}
                    max={360}
                    step={1}
                    className="mt-3"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Color Stops</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addStop}
                  disabled={stops.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Stop
                </Button>
              </div>

              {stops.map((stop, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(index, { color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={stop.color}
                    onChange={(e) => updateStop(index, { color: e.target.value })}
                    className="flex-1 font-mono"
                  />
                  <div className="flex items-center gap-2 w-24">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) => updateStop(index, { position: Number(e.target.value) })}
                      className="font-mono"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeStop(index)}
                    disabled={stops.length <= 2}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="flex flex-wrap gap-2">
              {GRADIENT_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  size="sm"
                  variant="outline"
                  onClick={() => applyPreset(preset)}
                  className="text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={randomizeGradient} variant="outline">
              <Shuffle className="h-4 w-4 mr-2" />
              Randomize
            </Button>
            <Button onClick={copyCSS} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy CSS"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div
          className="h-64 rounded-xl shadow-lg"
          style={{ background: generateGradientCSS() }}
        />
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <Label className="text-xs text-muted-foreground">CSS Code</Label>
            <code className="block mt-2 p-3 bg-secondary/50 rounded-lg text-sm font-mono text-foreground break-all">
              background: {generateGradientCSS()};
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
