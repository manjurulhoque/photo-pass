"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Download, Scissors, Zap, FileImage } from "lucide-react"

const PHOTO_SIZES = {
  passport: { name: "Passport Size", width: 600, height: 600, displaySize: "2×2 inches" },
  indianVisa: { name: "Indian Visa", width: 600, height: 600, displaySize: "2×2 inches" },
  usVisa: { name: "US Visa", width: 600, height: 600, displaySize: "2×2 inches" },
  ukVisa: { name: "UK Visa", width: 413, height: 531, displaySize: "45×35mm" },
  schengenVisa: { name: "Schengen Visa", width: 531, height: 413, displaySize: "35×45mm" },
  canadaVisa: { name: "Canada Visa", width: 420, height: 540, displaySize: "50×70mm" },
}

const BACKGROUND_COLORS = {
  white: { name: "White", color: "#ffffff", class: "bg-white" },
  lightBlue: { name: "Light Blue", color: "#dbeafe", class: "bg-blue-100" },
  lightGray: { name: "Light Gray", color: "#f3f4f6", class: "bg-gray-100" },
  lightRed: { name: "Light Red", color: "#fee2e2", class: "bg-red-100" },
}

const PRESET_TEMPLATES = {
  usPassport: {
    name: "US Passport",
    description: "2×2 inches, White background",
    size: "usVisa",
    background: "white",
    icon: "🇺🇸",
  },
  indianVisa: {
    name: "Indian Visa",
    description: "2×2 inches, White background",
    size: "indianVisa",
    background: "white",
    icon: "🇮🇳",
  },
  ukVisa: {
    name: "UK Visa",
    description: "45×35mm, Light Blue background",
    size: "ukVisa",
    background: "lightBlue",
    icon: "🇬🇧",
  },
  schengenVisa: {
    name: "Schengen Visa",
    description: "35×45mm, White background",
    size: "schengenVisa",
    background: "white",
    icon: "🇪🇺",
  },
  canadaVisa: {
    name: "Canada Visa",
    description: "50×70mm, White background",
    size: "canadaVisa",
    background: "white",
    icon: "🇨🇦",
  },
  generalPassport: {
    name: "General Passport",
    description: "2×2 inches, Light Gray background",
    size: "passport",
    background: "lightGray",
    icon: "📘",
  },
}

export default function PhotoEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [backgroundRemoved, setBackgroundRemoved] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<"jpeg" | "png">("jpeg")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const downloadImage = () => {
    if (!processedImage) return

    let filename = "passport-photo"

    if (selectedTemplate) {
      const templateName = PRESET_TEMPLATES[selectedTemplate as keyof typeof PRESET_TEMPLATES].name
      filename = templateName.toLowerCase().replace(/\s+/g, "-")
    } else if (selectedSize) {
      const sizeName = PHOTO_SIZES[selectedSize as keyof typeof PHOTO_SIZES].name
      filename = sizeName.toLowerCase().replace(/\s+/g, "-")
    }

    if (selectedBackground) {
      const bgName = BACKGROUND_COLORS[selectedBackground as keyof typeof BACKGROUND_COLORS].name
      filename += `-${bgName.toLowerCase().replace(/\s+/g, "-")}-bg`
    }

    const timestamp = new Date().toISOString().slice(0, 10)
    filename += `-${timestamp}`

    const link = document.createElement("a")
    link.download = `${filename}.${selectedFormat}`

    if (selectedFormat === "png" && !processedImage.includes("data:image/png")) {
      const canvas = canvasRef.current
      if (canvas) {
        link.href = canvas.toDataURL("image/png", 1.0)
      } else {
        link.href = processedImage
      }
    } else if (selectedFormat === "jpeg" && processedImage.includes("data:image/png")) {
      const canvas = canvasRef.current
      if (canvas) {
        link.href = canvas.toDataURL("image/jpeg", 0.95)
      } else {
        link.href = processedImage
      }
    } else {
      link.href = processedImage
    }

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const applyPresetTemplate = async (templateKey: string) => {
    if (!uploadedImage || !canvasRef.current) return

    const template = PRESET_TEMPLATES[templateKey as keyof typeof PRESET_TEMPLATES]
    setIsProcessing(true)
    setSelectedTemplate(templateKey)
    setSelectedSize(template.size)
    setSelectedBackground(template.background)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.crossOrigin = "anonymous"
    img.onload = () => {
      const size = PHOTO_SIZES[template.size as keyof typeof PHOTO_SIZES]
      canvas.width = size.width
      canvas.height = size.height

      const bgColor = BACKGROUND_COLORS[template.background as keyof typeof BACKGROUND_COLORS].color
      ctx!.fillStyle = bgColor
      ctx?.fillRect(0, 0, size.width, size.height)

      const imgAspect = img.width / img.height
      const canvasAspect = size.width / size.height

      let drawWidth,
        drawHeight,
        offsetX = 0,
        offsetY = 0

      if (imgAspect > canvasAspect) {
        drawHeight = size.height
        drawWidth = drawHeight * imgAspect
        offsetX = (size.width - drawWidth) / 2
      } else {
        drawWidth = size.width
        drawHeight = drawWidth / imgAspect
        offsetY = (size.height - drawHeight) / 2
      }

      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      const processedDataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setProcessedImage(processedDataUrl)
      setIsProcessing(false)
    }

    img.src = processedImage || uploadedImage
  }

  const removeBackground = async () => {
    if (!uploadedImage || !canvasRef.current) return

    setIsProcessing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.crossOrigin = "anonymous"
    img.onload = () => {
      const currentSize = selectedSize
        ? PHOTO_SIZES[selectedSize as keyof typeof PHOTO_SIZES]
        : { width: 600, height: 600 }
      canvas.width = currentSize.width
      canvas.height = currentSize.height

      const imgAspect = img.width / img.height
      const canvasAspect = currentSize.width / currentSize.height

      let drawWidth,
        drawHeight,
        offsetX = 0,
        offsetY = 0

      if (imgAspect > canvasAspect) {
        drawHeight = currentSize.height
        drawWidth = drawHeight * imgAspect
        offsetX = (currentSize.width - drawWidth) / 2
      } else {
        drawWidth = currentSize.width
        drawHeight = drawWidth / imgAspect
        offsetY = (currentSize.height - drawHeight) / 2
      }

      // Draw image first
      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      const imageData = ctx?.getImageData(0, 0, currentSize.width, currentSize.height)
      if (imageData) {
        const data = imageData.data

        // More sophisticated background removal
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Check for light backgrounds (common in photos)
          const brightness = r * 0.299 + g * 0.587 + b * 0.114
          const saturation = Math.max(r, g, b) - Math.min(r, g, b)

          // Remove light, low-saturation pixels (typical background)
          if (brightness > 180 && saturation < 30) {
            data[i + 3] = 0 // Make transparent
          }
          // Also remove very bright pixels
          else if (brightness > 240) {
            data[i + 3] = Math.max(0, data[i + 3] - 150)
          }
        }

        ctx?.putImageData(imageData, 0, 0)
      }

      const processedDataUrl = canvas.toDataURL("image/png", 0.9)
      setProcessedImage(processedDataUrl)
      setBackgroundRemoved(true)
      setIsProcessing(false)
    }

    img.src = processedImage || uploadedImage
  }

  const changeBackground = async (colorKey: string) => {
    if (!uploadedImage || !canvasRef.current) return

    setIsProcessing(true)
    setSelectedBackground(colorKey)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.crossOrigin = "anonymous"
    img.onload = () => {
      const currentSize = selectedSize
        ? PHOTO_SIZES[selectedSize as keyof typeof PHOTO_SIZES]
        : { width: 600, height: 600 }
      canvas.width = currentSize.width
      canvas.height = currentSize.height

      const bgColor = BACKGROUND_COLORS[colorKey as keyof typeof BACKGROUND_COLORS].color
      ctx!.fillStyle = bgColor
      ctx?.fillRect(0, 0, currentSize.width, currentSize.height)

      const imgAspect = img.width / img.height
      const canvasAspect = currentSize.width / currentSize.height

      let drawWidth,
        drawHeight,
        offsetX = 0,
        offsetY = 0

      if (imgAspect > canvasAspect) {
        drawHeight = currentSize.height
        drawWidth = drawHeight * imgAspect
        offsetX = (currentSize.width - drawWidth) / 2
      } else {
        drawWidth = currentSize.width
        drawHeight = drawWidth / imgAspect
        offsetY = (currentSize.height - drawHeight) / 2
      }

      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      const processedDataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setProcessedImage(processedDataUrl)
      setIsProcessing(false)
    }

    img.src = backgroundRemoved ? processedImage! : uploadedImage
  }

  const processImageSize = async (sizeKey: string) => {
    if (!uploadedImage || !canvasRef.current) return

    setIsProcessing(true)
    setSelectedSize(sizeKey)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.crossOrigin = "anonymous"
    img.onload = () => {
      const size = PHOTO_SIZES[sizeKey as keyof typeof PHOTO_SIZES]
      canvas.width = size.width
      canvas.height = size.height

      const bgColor = selectedBackground
        ? BACKGROUND_COLORS[selectedBackground as keyof typeof BACKGROUND_COLORS].color
        : "#ffffff"
      ctx!.fillStyle = bgColor
      ctx?.fillRect(0, 0, size.width, size.height)

      const imgAspect = img.width / img.height
      const canvasAspect = size.width / size.height

      let drawWidth,
        drawHeight,
        offsetX = 0,
        offsetY = 0

      if (imgAspect > canvasAspect) {
        drawHeight = size.height
        drawWidth = drawHeight * imgAspect
        offsetX = (size.width - drawWidth) / 2
      } else {
        drawWidth = size.width
        drawHeight = drawWidth / imgAspect
        offsetY = (size.height - drawHeight) / 2
      }

      ctx?.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      const processedDataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setProcessedImage(processedDataUrl)
      setIsProcessing(false)
    }

    img.src = processedImage || uploadedImage
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setProcessedImage(null)
        setSelectedSize(null)
        setSelectedBackground(null)
        setSelectedTemplate(null)
        setBackgroundRemoved(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setProcessedImage(null)
        setSelectedSize(null)
        setSelectedBackground(null)
        setSelectedTemplate(null)
        setBackgroundRemoved(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <canvas ref={canvasRef} className="hidden" />

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <ImageIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">PhotoPass</h1>
              <p className="text-sm text-muted-foreground">Professional Passport & Visa Photo Editor</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    {processedImage ? "Processed Photo" : "Upload Your Photo"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!uploadedImage ? (
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-foreground">Drop your photo here</p>
                          <p className="text-sm text-muted-foreground">or click to browse files</p>
                        </div>
                        <Button variant="outline">Choose File</Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative bg-muted rounded-lg p-4">
                        {isProcessing ? (
                          <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                              <p className="text-sm text-muted-foreground">Processing image...</p>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={processedImage || uploadedImage || "/placeholder.svg"}
                            alt="Photo"
                            className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                          />
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {selectedTemplate && (
                          <div className="text-center p-2 bg-accent/10 rounded-lg flex-1 min-w-0">
                            <p className="text-sm font-medium text-accent">
                              {PRESET_TEMPLATES[selectedTemplate as keyof typeof PRESET_TEMPLATES].name} Template
                            </p>
                          </div>
                        )}
                        {selectedSize && (
                          <div className="text-center p-2 bg-primary/10 rounded-lg flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary">
                              {PHOTO_SIZES[selectedSize as keyof typeof PHOTO_SIZES].name} -{" "}
                              {PHOTO_SIZES[selectedSize as keyof typeof PHOTO_SIZES].displaySize}
                            </p>
                          </div>
                        )}
                        {selectedBackground && (
                          <div className="text-center p-2 bg-secondary/10 rounded-lg flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary">
                              {BACKGROUND_COLORS[selectedBackground as keyof typeof BACKGROUND_COLORS].name} Background
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                          Change Photo
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setUploadedImage(null)
                            setProcessedImage(null)
                            setSelectedSize(null)
                            setSelectedBackground(null)
                            setSelectedTemplate(null)
                            setBackgroundRemoved(false)
                          }}
                          className="flex-1"
                        >
                          Remove
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(PRESET_TEMPLATES).map(([key, template]) => (
                    <Button
                      key={key}
                      variant={selectedTemplate === key ? "default" : "outline"}
                      className={`w-full justify-start text-left ${
                        selectedTemplate === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-accent hover:text-accent-foreground text-foreground"
                      }`}
                      disabled={!uploadedImage || isProcessing}
                      onClick={() => applyPresetTemplate(key)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{template.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{template.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Photo Sizes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(PHOTO_SIZES).map(([key, size]) => (
                    <Button
                      key={key}
                      variant={selectedSize === key ? "default" : "outline"}
                      className={`w-full justify-start ${
                        selectedSize === key
                          ? "bg-primary text-primary-foreground"
                          : "bg-card hover:bg-accent hover:text-accent-foreground text-foreground"
                      }`}
                      disabled={!uploadedImage || isProcessing}
                      onClick={() => processImageSize(key)}
                    >
                      {size.name} ({size.displaySize})
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Background Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(BACKGROUND_COLORS).map(([key, bg]) => (
                      <button
                        key={key}
                        className={`w-12 h-12 ${bg.class} border-2 ${
                          selectedBackground === key ? "border-primary" : "border-border"
                        } rounded-lg hover:border-primary transition-colors`}
                        disabled={!uploadedImage || isProcessing}
                        onClick={() => changeBackground(key)}
                        title={bg.name}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-card hover:bg-accent hover:text-accent-foreground text-foreground"
                    disabled={!uploadedImage || isProcessing}
                    onClick={removeBackground}
                  >
                    <Scissors className="w-4 h-4 mr-2" />
                    Remove Background
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="w-5 h-5" />
                    Export Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">File Format</label>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedFormat === "jpeg" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFormat("jpeg")}
                        className="flex-1"
                      >
                        JPEG
                      </Button>
                      <Button
                        variant={selectedFormat === "png" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFormat("png")}
                        className="flex-1"
                      >
                        PNG
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedFormat === "jpeg"
                        ? "Smaller file size, good for printing"
                        : "Larger file size, supports transparency"}
                    </p>
                  </div>
                  <Button className="w-full" disabled={!processedImage} onClick={downloadImage}>
                    <Download className="w-4 h-4 mr-2" />
                    Download {selectedFormat.toUpperCase()}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
