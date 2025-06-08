"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"

interface VideoTutorialProps {
  title: string
  description: string
  videoUrl: string
}

export function VideoTutorial({ title, description, videoUrl }: VideoTutorialProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
          <Play className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-blue-700">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
              <p className="text-lg font-medium">Video Tutorial</p>
              <p className="text-sm opacity-70">Step-by-step guide for activation</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
