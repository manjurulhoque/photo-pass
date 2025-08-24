"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Sun,
    Contrast,
    Palette,
    Zap,
    ImageIcon,
    Camera,
    Eye,
} from "lucide-react";
import {
    useAdjustBrightness,
    useAdjustContrast,
    useAdjustSaturation,
    useApplyBlur,
    useApplySharpen,
    useConvertGrayscale,
    useApplySepia,
} from "@/hooks/use-photo-api";
import { toast } from "sonner";

interface PhotoFiltersProps {
    uploadedFilename: string | null;
    isProcessing: boolean;
    onImageProcessed: (blob: Blob) => void;
}

export function PhotoFilters({
    uploadedFilename,
    isProcessing,
    onImageProcessed,
}: PhotoFiltersProps) {
    // State for slider values
    const [brightness, setBrightness] = useState(1.0);
    const [contrast, setContrast] = useState(1.0);
    const [saturation, setSaturation] = useState(1.0);
    const [blurRadius, setBlurRadius] = useState(5);

    // State for toggle effects
    const [isGrayscale, setIsGrayscale] = useState(false);
    const [isSepia, setIsSepia] = useState(false);
    const [isBlurred, setIsBlurred] = useState(false);
    const [isSharpened, setIsSharpened] = useState(false);

    // React Query hooks
    const brightnessMutation = useAdjustBrightness();
    const contrastMutation = useAdjustContrast();
    const saturationMutation = useAdjustSaturation();
    const blurMutation = useApplyBlur();
    const sharpenMutation = useApplySharpen();
    const grayscaleMutation = useConvertGrayscale();
    const sepiaMutation = useApplySepia();

    // Check if any processing is happening
    const isAnyProcessing =
        isProcessing ||
        brightnessMutation.isPending ||
        contrastMutation.isPending ||
        saturationMutation.isPending ||
        blurMutation.isPending ||
        sharpenMutation.isPending ||
        grayscaleMutation.isPending ||
        sepiaMutation.isPending;

    // Handle brightness adjustment
    const handleBrightnessChange = async (value: number[]) => {
        if (!uploadedFilename) {
            toast.error("Please upload an image first");
            return;
        }

        const newValue = value[0];
        setBrightness(newValue);

        try {
            const result = await brightnessMutation.mutateAsync({
                filename: uploadedFilename,
                factor: newValue,
            });
            onImageProcessed(result);
            toast.success("Brightness adjusted successfully!");
        } catch (error) {
            console.error("Brightness adjustment failed:", error);
            toast.error("Failed to adjust brightness. Please try again.");
            // Revert the slider to previous value on error
            setBrightness(1.0);
        }
    };

    // Handle contrast adjustment
    const handleContrastChange = async (value: number[]) => {
        if (!uploadedFilename) {
            toast.error("Please upload an image first");
            return;
        }

        const newValue = value[0];
        setContrast(newValue);

        try {
            const result = await contrastMutation.mutateAsync({
                filename: uploadedFilename,
                factor: newValue,
            });
            onImageProcessed(result);
            toast.success("Contrast adjusted successfully!");
        } catch (error) {
            console.error("Contrast adjustment failed:", error);
            toast.error("Failed to adjust contrast. Please try again.");
            // Revert the slider to previous value on error
            setContrast(1.0);
        }
    };

    // Handle saturation adjustment
    const handleSaturationChange = async (value: number[]) => {
        if (!uploadedFilename) {
            toast.error("Please upload an image first");
            return;
        }

        const newValue = value[0];
        setSaturation(newValue);

        try {
            const result = await saturationMutation.mutateAsync({
                filename: uploadedFilename,
                factor: newValue,
            });
            onImageProcessed(result);
            toast.success("Saturation adjusted successfully!");
        } catch (error) {
            console.error("Saturation adjustment failed:", error);
            toast.error("Failed to adjust saturation. Please try again.");
            // Revert the slider to previous value on error
            setSaturation(1.0);
        }
    };

    // Handle blur effect
    const handleBlurToggle = async (checked: boolean) => {
        if (!uploadedFilename) {
            toast.error("Please upload an image first");
            return;
        }

        setIsBlurred(checked);

        if (checked) {
            try {
                const result = await blurMutation.mutateAsync({
                    filename: uploadedFilename,
                    radius: blurRadius,
                });
                onImageProcessed(result);
                toast.success("Blur effect applied successfully!");
            } catch (error) {
                console.error("Blur application failed:", error);
                toast.error("Failed to apply blur effect. Please try again.");
                setIsBlurred(false);
            }
        }
    };

    // Handle sharpen effect
    const handleSharpenToggle = async (checked: boolean) => {
        if (!uploadedFilename) {
            toast.error("Please upload an image first");
            return;
        }

        setIsSharpened(checked);

        if (checked) {
            try {
                const result = await sharpenMutation.mutateAsync({
                    filename: uploadedFilename,
                    factor: 1.5, // Default sharpening factor
                });
                onImageProcessed(result);
                toast.success("Sharpening effect applied successfully!");
            } catch (error) {
                console.error("Sharpening failed:", error);
                toast.error(
                    "Failed to apply sharpening effect. Please try again."
                );
                setIsSharpened(false);
            }
        }
    };

    // Handle grayscale conversion
    const handleGrayscaleToggle = async (checked: boolean) => {
        if (!uploadedFilename) {
            toast.error("Please upload an image first");
            return;
        }

        setIsGrayscale(checked);

        if (checked) {
            try {
                const result = await grayscaleMutation.mutateAsync(
                    uploadedFilename
                );
                onImageProcessed(result);
                toast.success("Grayscale effect applied successfully!");
            } catch (error) {
                console.error("Grayscale conversion failed:", error);
                toast.error(
                    "Failed to apply grayscale effect. Please try again."
                );
                setIsGrayscale(false);
            }
        }
    };

    // Handle sepia effect
    const handleSepiaToggle = async (checked: boolean) => {
        if (!uploadedFilename) {
            toast.error("Please upload an image first");
            return;
        }

        setIsSepia(checked);

        if (checked) {
            try {
                const result = await sepiaMutation.mutateAsync(
                    uploadedFilename
                );
                onImageProcessed(result);
                toast.success("Sepia effect applied successfully!");
            } catch (error) {
                console.error("Sepia application failed:", error);
                toast.error("Failed to apply sepia effect. Please try again.");
                setIsSepia(false);
            }
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setBrightness(1.0);
        setContrast(1.0);
        setSaturation(1.0);
        setBlurRadius(5);
        setIsGrayscale(false);
        setIsSepia(false);
        setIsBlurred(false);
        setIsSharpened(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Photo Filters & Effects
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Brightness Slider */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Sun className="w-4 h-4 text-yellow-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Adjust the overall brightness of the image
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Label className="text-sm font-medium">
                            Brightness
                        </Label>
                        <span className="text-xs text-muted-foreground ml-auto">
                            {brightness.toFixed(1)}
                        </span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <Slider
                            value={[brightness]}
                            onValueChange={handleBrightnessChange}
                            min={0.1}
                            max={3.0}
                            step={0.1}
                            disabled={!uploadedFilename || isAnyProcessing}
                            className="w-full [&_.bg-muted]:bg-gray-300 [&_.bg-primary]:bg-blue-600"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Dark</span>
                        <span>Normal</span>
                        <span>Bright</span>
                    </div>
                </div>

                {/* Contrast Slider */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Contrast className="w-4 h-4 text-blue-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Adjust the difference between light and dark
                                    areas
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Label className="text-sm font-medium">Contrast</Label>
                        <span className="text-xs text-muted-foreground ml-auto">
                            {contrast.toFixed(1)}
                        </span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <Slider
                            value={[contrast]}
                            onValueChange={handleContrastChange}
                            min={0.1}
                            max={3.0}
                            step={0.1}
                            disabled={!uploadedFilename || isAnyProcessing}
                            className="w-full [&_.bg-muted]:bg-gray-300 [&_.bg-primary]:bg-blue-600"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>Normal</span>
                        <span>High</span>
                    </div>
                </div>

                {/* Saturation Slider */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Palette className="w-4 h-4 text-green-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Adjust the intensity of colors in the image
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Label className="text-sm font-medium">
                            Saturation
                        </Label>
                        <span className="text-xs text-muted-foreground ml-auto">
                            {saturation.toFixed(1)}
                        </span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <Slider
                            value={[saturation]}
                            onValueChange={handleSaturationChange}
                            min={0.0}
                            max={3.0}
                            step={0.1}
                            disabled={!uploadedFilename || isAnyProcessing}
                            className="w-full [&_.bg-muted]:bg-gray-300 [&_.bg-primary]:bg-blue-600"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>B&W</span>
                        <span>Normal</span>
                        <span>Vivid</span>
                    </div>
                </div>

                {/* Blur Effect */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Eye
                                    className={`w-4 h-4 ${
                                        isBlurred
                                            ? "text-purple-500"
                                            : "text-muted-foreground"
                                    } cursor-help`}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Apply a blur effect to soften the image</p>
                            </TooltipContent>
                        </Tooltip>
                        <Label
                            className={`text-sm font-medium ${
                                isBlurred ? "text-purple-600" : ""
                            }`}
                        >
                            Blur Effect
                        </Label>
                        <Switch
                            checked={isBlurred}
                            onCheckedChange={handleBlurToggle}
                            disabled={!uploadedFilename || isAnyProcessing}
                            className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-gray-400"
                        />
                    </div>
                    {isBlurred && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                                Blur Radius: {blurRadius}
                            </Label>
                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                                <Slider
                                    value={[blurRadius]}
                                    onValueChange={(value) =>
                                        setBlurRadius(value[0])
                                    }
                                    min={1}
                                    max={20}
                                    step={1}
                                    disabled={
                                        !uploadedFilename || isAnyProcessing
                                    }
                                    className="w-full [&_.bg-muted]:bg-gray-300 [&_.bg-primary]:bg-blue-600"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sharpen Effect */}
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Zap
                                className={`w-4 h-4 ${
                                    isSharpened
                                        ? "text-orange-500"
                                        : "text-muted-foreground"
                                } cursor-help`}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Apply sharpening to enhance image details</p>
                        </TooltipContent>
                    </Tooltip>
                    <Label
                        className={`text-sm font-medium ${
                            isSharpened ? "text-orange-600" : ""
                        }`}
                    >
                        Sharpen Effect
                    </Label>
                    <Switch
                        checked={isSharpened}
                        onCheckedChange={handleSharpenToggle}
                        disabled={!uploadedFilename || isAnyProcessing}
                        className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-gray-400"
                    />
                </div>

                {/* Grayscale Effect */}
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ImageIcon
                                className={`w-4 h-4 ${
                                    isGrayscale
                                        ? "text-gray-500"
                                        : "text-muted-foreground"
                                } cursor-help`}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Convert the image to black and white</p>
                        </TooltipContent>
                    </Tooltip>
                    <Label
                        className={`text-sm font-medium ${
                            isGrayscale ? "text-gray-600" : ""
                        }`}
                    >
                        Grayscale
                    </Label>
                    <Switch
                        checked={isGrayscale}
                        onCheckedChange={handleGrayscaleToggle}
                        disabled={!uploadedFilename || isAnyProcessing}
                        className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-400"
                    />
                </div>

                {/* Sepia Effect */}
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ImageIcon
                                className={`w-4 h-4 ${
                                    isSepia
                                        ? "text-amber-600"
                                        : "text-muted-foreground"
                                } cursor-help`}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Apply a vintage sepia tone to the image</p>
                        </TooltipContent>
                    </Tooltip>
                    <Label
                        className={`text-sm font-medium ${
                            isSepia ? "text-amber-700" : ""
                        }`}
                    >
                        Sepia
                    </Label>
                    <Switch
                        checked={isSepia}
                        onCheckedChange={handleSepiaToggle}
                        disabled={!uploadedFilename || isAnyProcessing}
                        className="data-[state=unchecked]:bg-gray-400"
                    />
                </div>

                {/* Current Values Display */}
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <Label className="text-xs font-medium text-muted-foreground">
                        Current Values
                    </Label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                            <span>Brightness:</span>
                            <span className="font-mono">
                                {brightness.toFixed(1)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Contrast:</span>
                            <span className="font-mono">
                                {contrast.toFixed(1)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Saturation:</span>
                            <span className="font-mono">
                                {saturation.toFixed(1)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Blur Radius:</span>
                            <span className="font-mono">{blurRadius}</span>
                        </div>
                    </div>
                </div>

                {/* Reset Button */}
                <Button
                    variant="outline"
                    onClick={resetFilters}
                    disabled={!uploadedFilename || isAnyProcessing}
                    className="w-full"
                >
                    Reset All Filters
                </Button>
            </CardContent>
        </Card>
    );
}
