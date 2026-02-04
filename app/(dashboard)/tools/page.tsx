"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorGenerator } from "@/components/tools/color-generator"
import { GradientCreator } from "@/components/tools/gradient-creator"
import { ContrastChecker } from "@/components/tools/contrast-checker"
import { Palette, Blend, Eye } from "lucide-react"

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState("colors")

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Design Tools</h1>
        <p className="text-muted-foreground mt-1">
          Generate color palettes, create gradients, and check contrast
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="colors" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Palette className="h-4 w-4" />
            Color Generator
          </TabsTrigger>
          <TabsTrigger value="gradients" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Blend className="h-4 w-4" />
            Gradient Creator
          </TabsTrigger>
          <TabsTrigger value="contrast" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Eye className="h-4 w-4" />
            Contrast Checker
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="mt-6">
          <ColorGenerator />
        </TabsContent>

        <TabsContent value="gradients" className="mt-6">
          <GradientCreator />
        </TabsContent>

        <TabsContent value="contrast" className="mt-6">
          <ContrastChecker />
        </TabsContent>
      </Tabs>
    </div>
  )
}
