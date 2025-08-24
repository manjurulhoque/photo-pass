"use client";

import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Upload,
    ImageIcon,
    Download,
    Scissors,
    Zap,
    FileImage,
    Loader2,
} from "lucide-react";
import {
    useUploadImage,
    useChangeBackground,
    useResizeImage,
} from "@/hooks/use-photo-api";
import { PhotoFilters } from "@/components/photo-filters";
import { blobToDataUrl, validateImageFile, formatFileSize } from "@/lib/utils";
import { toast } from "sonner";

const PHOTO_SIZES = {
    passport: {
        name: "Passport Size",
        width: 600,
        height: 600,
        displaySize: "2x2 inches",
    },
    indianVisa: {
        name: "Indian Visa",
        width: 350,
        height: 350,
        displaySize: "2x2 inches",
    },
    usVisa: {
        name: "US Visa",
        width: 600,
        height: 600,
        displaySize: "2x2 inches",
    },
    ukVisa: {
        name: "UK Visa",
        width: 600,
        height: 750,
        displaySize: "45x35mm",
    },
    schengenVisa: {
        name: "Schengen Visa",
        width: 827,
        height: 1063,
        displaySize: "35x45mm",
    },
    canadaVisa: {
        name: "Canada Visa",
        width: 420,
        height: 540,
        displaySize: "50x70mm",
    },
};

const BACKGROUND_COLORS = {
    white: { name: "White", color: "#ffffff", class: "bg-white" },
    lightBlue: { name: "Light Blue", color: "#dbeafe", class: "bg-blue-100" },
    lightGray: { name: "Light Gray", color: "#f3f4f6", class: "bg-gray-100" },
    lightRed: { name: "Light Red", color: "#fee2e2", class: "bg-red-100" },
};

const PRESET_TEMPLATES = {
    usPassport: {
        name: "US Passport",
        description: "2x2 inches, White background",
        size: "usVisa",
        background: "white",
        icon: "🇺🇸",
    },
    indianVisa: {
        name: "Indian Visa",
        description: "2x2 inches, White background",
        size: "indianVisa",
        background: "white",
        icon: "🇮🇳",
    },
    ukVisa: {
        name: "UK Visa",
        description: "45x35mm, Light Blue background",
        size: "ukVisa",
        background: "lightBlue",
        icon: "🇬🇧",
    },
    schengenVisa: {
        name: "Schengen Visa",
        description: "35x45mm, White background",
        size: "schengenVisa",
        background: "white",
        icon: "🇪🇺",
    },
    canadaVisa: {
        name: "Canada Visa",
        description: "50x70mm, White background",
        size: "canadaVisa",
        background: "white",
        icon: "🇨🇦",
    },
    generalPassport: {
        name: "General Passport",
        description: "2x2 inches, Light Gray background",
        size: "passport",
        background: "lightGray",
        icon: "📘",
    },
};

export function PhotoEditorEnhanced() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedBackground, setSelectedBackground] = useState<string | null>(
        null
    );
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
        null
    );
    const [backgroundRemoved, setBackgroundRemoved] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<"jpeg" | "png">(
        "jpeg"
    );
    const [uploadedFilename, setUploadedFilename] = useState<string | null>(
        null
    );
    const [imageDimensions, setImageDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // React Query hooks
    const uploadMutation = useUploadImage();
    const changeBackgroundMutation = useChangeBackground();
    const resizeMutation = useResizeImage();

    // Extract image dimensions from file
    const extractImageDimensions = (
        file: File
    ): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.src = URL.createObjectURL(file);
        });
    };

    // Handle file upload with API integration
    const handleFileUpload = useCallback(
        async (file: File) => {
            if (!validateImageFile(file)) {
                toast.error(
                    "Invalid file type or size. Please upload a valid image (JPEG, PNG, WebP) under 10MB."
                );
                return;
            }

            try {
                // Extract image dimensions
                const dimensions = await extractImageDimensions(file);
                setImageDimensions(dimensions);

                // Show preview immediately
                const reader = new FileReader();
                reader.onload = (e) => {
                    setUploadedImage(e.target?.result as string);
                    setProcessedImage(null);
                    setSelectedSize(null);
                    setSelectedBackground(null);
                    setSelectedTemplate(null);
                    setBackgroundRemoved(false);
                };
                reader.readAsDataURL(file);

                // Upload to backend
                const result = await uploadMutation.mutateAsync(file);
                setUploadedFilename(result.filename);
                toast.success(
                    `Image uploaded successfully! Filename: ${result.filename}`
                );
            } catch (error) {
                console.error("Upload failed:", error);
                // Reset preview on upload failure
                setUploadedImage(null);
                setProcessedImage(null);
                setImageDimensions(null);
            }
        },
        [uploadMutation]
    );

    // Handle file input change
    const handleFileInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                handleFileUpload(file);
            }
        },
        [handleFileUpload]
    );

    // Handle drag and drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileUpload(file);
            }
        },
        [handleFileUpload]
    );

    // Apply preset template with API integration
    const applyPresetTemplate = useCallback(
        async (templateKey: string) => {
            if (!uploadedImage || !uploadedFilename) {
                toast.error("Please upload an image first");
                return;
            }

            const template =
                PRESET_TEMPLATES[templateKey as keyof typeof PRESET_TEMPLATES];
            setSelectedTemplate(templateKey);
            setSelectedSize(template.size);
            setSelectedBackground(template.background);

            try {
                // First resize the image
                const size =
                    PHOTO_SIZES[template.size as keyof typeof PHOTO_SIZES];
                const resizeResult = await resizeMutation.mutateAsync({
                    filename: uploadedFilename,
                    width: size.width,
                    height: size.height,
                });

                // Then change background
                const bgColor =
                    BACKGROUND_COLORS[
                        template.background as keyof typeof BACKGROUND_COLORS
                    ].color;
                const backgroundResult =
                    await changeBackgroundMutation.mutateAsync({
                        filename: uploadedFilename,
                        background_color: bgColor,
                    });

                // Convert blob to data URL for display
                const processedDataUrl = await blobToDataUrl(backgroundResult);
                setProcessedImage(processedDataUrl);

                toast.success(
                    `${template.name} template applied successfully!`
                );
            } catch (error) {
                console.error("Template application failed:", error);
                toast.error("Failed to apply template. Please try again.");
            }
        },
        [
            uploadedImage,
            uploadedFilename,
            resizeMutation,
            changeBackgroundMutation,
        ]
    );

    // Change background with API integration
    const changeBackground = useCallback(
        async (colorKey: string) => {
            if (!uploadedImage || !uploadedFilename) {
                toast.error("Please upload an image first");
                return;
            }

            setSelectedBackground(colorKey);
            const bgColor =
                BACKGROUND_COLORS[colorKey as keyof typeof BACKGROUND_COLORS]
                    .color;

            try {
                const result = await changeBackgroundMutation.mutateAsync({
                    filename: uploadedFilename,
                    background_color: bgColor,
                });

                const processedDataUrl = await blobToDataUrl(result);
                setProcessedImage(processedDataUrl);
                toast.success("Background changed successfully!");
            } catch (error) {
                console.error("Background change failed:", error);
                toast.error("Failed to change background. Please try again.");
            }
        },
        [uploadedImage, uploadedFilename, changeBackgroundMutation]
    );

    // Remove background with API integration

    const removeBackground = useCallback(async () => {
        if (!uploadedImage || !uploadedFilename) {
            toast.error("Please upload an image first");
            return;
        }

        try {
            const bgColor =
                BACKGROUND_COLORS[
                    selectedBackground as keyof typeof BACKGROUND_COLORS
                ].color;

            const result = await changeBackgroundMutation.mutateAsync({
                filename: uploadedFilename,
                background_color: bgColor,
            });

            const processedDataUrl = await blobToDataUrl(result);
            setProcessedImage(processedDataUrl);
            toast.success("Background removed successfully!");
        } catch (error) {
            console.error("Background removal failed:", error);
            toast.error("Failed to remove background. Please try again.");
        }
    }, [uploadedImage, uploadedFilename, changeBackgroundMutation]);

    // Process image size with API integration
    const processImageSize = useCallback(
        async (sizeKey: string) => {
            if (!uploadedImage || !uploadedFilename) {
                toast.error("Please upload an image first");
                return;
            }

            setSelectedSize(sizeKey);
            const size = PHOTO_SIZES[sizeKey as keyof typeof PHOTO_SIZES];

            try {
                const result = await resizeMutation.mutateAsync({
                    filename: uploadedFilename,
                    width: size.width,
                    height: size.height,
                });

                // then change background if selected
                if (selectedBackground) {
                    const backgroundResult =
                        await changeBackgroundMutation.mutateAsync({
                            filename: uploadedFilename,
                            background_color: selectedBackground,
                        });
                    // Convert blob to data URL for display
                    const processedDataUrl = await blobToDataUrl(backgroundResult);
                    setProcessedImage(processedDataUrl);
                    toast.success("Image size processed successfully!");
                } else {
                    const processedDataUrl = await blobToDataUrl(result);
                    setProcessedImage(processedDataUrl);
                    toast.success("Image size processed successfully!");
                }
            } catch (error) {
                console.error("Size processing failed:", error);
                toast.error("Failed to process image size. Please try again.");
            }
        },
        [uploadedImage, uploadedFilename, resizeMutation]
    );

    // Download processed image
    const downloadImage = useCallback(() => {
        if (!processedImage) return;

        let filename = "passport-photo";
        if (selectedTemplate) {
            const templateName =
                PRESET_TEMPLATES[
                    selectedTemplate as keyof typeof PRESET_TEMPLATES
                ].name;
            filename = templateName.toLowerCase().replace(/\s+/g, "-");
        } else if (selectedSize) {
            const sizeName =
                PHOTO_SIZES[selectedSize as keyof typeof PHOTO_SIZES].name;
            filename = sizeName.toLowerCase().replace(/\s+/g, "-");
        }

        if (selectedBackground) {
            const bgName =
                BACKGROUND_COLORS[
                    selectedBackground as keyof typeof BACKGROUND_COLORS
                ].name;
            filename += `-${bgName.toLowerCase().replace(/\s+/g, "-")}-bg`;
        }

        const timestamp = new Date().toISOString().slice(0, 10);
        filename += `-${timestamp}`;

        const link = document.createElement("a");
        link.download = `${filename}.${selectedFormat}`;
        link.href = processedImage;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [
        processedImage,
        selectedTemplate,
        selectedSize,
        selectedBackground,
        selectedFormat,
    ]);

    // Handle image processed by filters
    const handleImageProcessed = useCallback(async (blob: Blob) => {
        const processedDataUrl = await blobToDataUrl(blob);
        setProcessedImage(processedDataUrl);
    }, []);

    // Reset all selections
    const resetSelections = useCallback(() => {
        setUploadedImage(null);
        setProcessedImage(null);
        setSelectedSize(null);
        setSelectedBackground(null);
        setSelectedTemplate(null);
        setBackgroundRemoved(false);
        setUploadedFilename(null);
        setImageDimensions(null);
    }, []);

    const isProcessing =
        uploadMutation.isPending ||
        changeBackgroundMutation.isPending ||
        resizeMutation.isPending;

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
                            <h1 className="text-2xl font-bold text-foreground">
                                PhotoPass
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Professional Passport & Visa Photo Editor
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_3fr] gap-8">
                        {/* Left Column: Photo Filters & Effects */}
                        <div className="space-y-6">
                            <PhotoFilters
                                uploadedFilename={uploadedFilename}
                                isProcessing={isProcessing}
                                onImageProcessed={handleImageProcessed}
                                imageDimensions={imageDimensions}
                            />
                        </div>

                        {/* Center Column: Image Upload/Display */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        {processedImage
                                            ? "Processed Photo"
                                            : "Upload Your Photo"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!uploadedImage ? (
                                        <div
                                            className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-medium text-foreground">
                                                        Drop your photo here
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        or click to browse files
                                                    </p>
                                                </div>
                                                <Button variant="outline">
                                                    Choose File
                                                </Button>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileInputChange}
                                                className="hidden"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="relative bg-muted rounded-lg p-4">
                                                {isProcessing ? (
                                                    <div className="flex items-center justify-center h-96">
                                                        <div className="text-center">
                                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                                                            <p className="text-sm text-muted-foreground">
                                                                Processing
                                                                image...
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={
                                                            processedImage ||
                                                            uploadedImage
                                                        }
                                                        alt="Photo"
                                                        className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                                                    />
                                                )}
                                            </div>

                                            {uploadedFilename && (
                                                <div className="text-center p-2 bg-accent/10 rounded-lg">
                                                    <p className="text-sm font-medium text-accent">
                                                        Uploaded:{" "}
                                                        {uploadedFilename}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-2 flex-wrap">
                                                {selectedTemplate && (
                                                    <div className="text-center p-2 bg-accent/10 rounded-lg flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-accent">
                                                            {
                                                                PRESET_TEMPLATES[
                                                                    selectedTemplate as keyof typeof PRESET_TEMPLATES
                                                                ].name
                                                            }{" "}
                                                            Template
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedSize && (
                                                    <div className="text-center p-2 bg-primary/10 rounded-lg flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-primary">
                                                            {
                                                                PHOTO_SIZES[
                                                                    selectedSize as keyof typeof PHOTO_SIZES
                                                                ].name
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                PHOTO_SIZES[
                                                                    selectedSize as keyof typeof PHOTO_SIZES
                                                                ].displaySize
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedBackground && (
                                                    <div className="text-center p-2 bg-secondary/10 rounded-lg flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-secondary">
                                                            {
                                                                BACKGROUND_COLORS[
                                                                    selectedBackground as keyof typeof BACKGROUND_COLORS
                                                                ].name
                                                            }{" "}
                                                            Background
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="flex-1"
                                                    disabled={isProcessing}
                                                >
                                                    Change Photo
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={resetSelections}
                                                    className="flex-1"
                                                    disabled={isProcessing}
                                                >
                                                    Remove
                                                </Button>
                                            </div>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileInputChange}
                                                className="hidden"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Templates, Sizes, Background Options, Export */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="w-5 h-5" />
                                        Quick Templates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {Object.entries(PRESET_TEMPLATES).map(
                                        ([key, template]) => (
                                            <Button
                                                key={key}
                                                variant={
                                                    selectedTemplate === key
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className={`w-full justify-start text-left ${
                                                    selectedTemplate === key
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-card hover:bg-accent hover:text-accent-foreground text-foreground"
                                                }`}
                                                disabled={
                                                    !uploadedImage ||
                                                    isProcessing
                                                }
                                                onClick={() =>
                                                    applyPresetTemplate(key)
                                                }
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <span className="text-lg">
                                                        {template.icon}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium">
                                                            {template.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            {
                                                                template.description
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>
                                        )
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Photo Sizes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {Object.entries(PHOTO_SIZES).map(
                                        ([key, size]) => (
                                            <Button
                                                key={key}
                                                variant={
                                                    selectedSize === key
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className={`w-full justify-start ${
                                                    selectedSize === key
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-card hover:bg-accent hover:text-accent-foreground text-foreground"
                                                }`}
                                                disabled={
                                                    !uploadedImage ||
                                                    isProcessing
                                                }
                                                onClick={() =>
                                                    processImageSize(key)
                                                }
                                            >
                                                {size.name} ({size.displaySize})
                                            </Button>
                                        )
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Background Options</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-4 gap-2">
                                        {Object.entries(BACKGROUND_COLORS).map(
                                            ([key, bg]) => (
                                                <button
                                                    key={key}
                                                    className={`w-12 h-12 ${
                                                        bg.class
                                                    } border-2 ${
                                                        selectedBackground ===
                                                        key
                                                            ? "border-primary"
                                                            : "border-border"
                                                    } rounded-lg hover:border-primary transition-colors`}
                                                    disabled={
                                                        !uploadedImage ||
                                                        isProcessing
                                                    }
                                                    onClick={() =>
                                                        changeBackground(key)
                                                    }
                                                    title={bg.name}
                                                />
                                            )
                                        )}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full bg-card hover:bg-accent hover:text-accent-foreground text-foreground"
                                        disabled={
                                            !uploadedImage || isProcessing
                                        }
                                        onClick={() => removeBackground()}
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
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            File Format
                                        </label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={
                                                    selectedFormat === "jpeg"
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedFormat("jpeg")
                                                }
                                                className="flex-1"
                                            >
                                                JPEG
                                            </Button>
                                            <Button
                                                variant={
                                                    selectedFormat === "png"
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedFormat("png")
                                                }
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
                                    <Button
                                        className="w-full"
                                        disabled={
                                            !processedImage || isProcessing
                                        }
                                        onClick={downloadImage}
                                    >
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
    );
}
