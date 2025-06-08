"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string>("")
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadedUrl("")
    }
  }

  const uploadToBlob = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select an APK file to upload.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      setUploadProgress(100)
      setUploadedUrl(result.url)

      toast({
        title: "Upload Successful!",
        description: "Your APK file has been uploaded to Vercel Blob.",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "URL copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mx-auto">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl text-gray-800">Upload APK to Vercel Blob</CardTitle>
            <CardDescription className="text-lg">
              Upload your Easypaisa Beta APK file to Vercel Blob storage for reliable hosting
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* File Selection */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm font-semibold text-gray-700">
                Select APK File
              </Label>
              <Input
                id="file"
                type="file"
                accept=".apk"
                onChange={handleFileSelect}
                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
              {file && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {file.name}
                  </Badge>
                  <Badge variant="outline">{(file.size / (1024 * 1024)).toFixed(2)} MB</Badge>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={uploadToBlob}
              disabled={!file || uploading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload to Vercel Blob
                </>
              )}
            </Button>

            {/* Success Result */}
            {uploadedUrl && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Upload Successful!</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Blob URL:</Label>
                    <div className="flex gap-2">
                      <Input value={uploadedUrl} readOnly className="flex-1 bg-white border-green-300 text-sm" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(uploadedUrl)}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(uploadedUrl, "_blank")}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Copy the Blob URL above</li>
                      <li>Update your download button to use this URL</li>
                      <li>Test the download functionality</li>
                      <li>Deploy your changes to production</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-amber-900">Important Notes:</h4>
              </div>
              <ul className="text-sm text-amber-700 space-y-2">
                <li>• APK files should be under 50MB for optimal performance</li>
                <li>• Vercel Blob provides reliable CDN hosting worldwide</li>
                <li>• The generated URL will be permanent and can be used in production</li>
                <li>• Make sure to test the download before deploying</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
