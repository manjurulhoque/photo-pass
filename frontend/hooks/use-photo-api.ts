import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    photoApi,
    type ChangeBackgroundRequest,
    type BrightnessRequest,
    type ContrastRequest,
    type SaturationRequest,
    type BlurRequest,
    type SharpenRequest,
    type ResizeRequest,
    type CropRequest,
    type RotateRequest,
    type FlipRequest,
} from "@/lib/photo-api";
import { toast } from "sonner";

// Query keys for React Query
export const photoQueryKeys = {
    all: ["photos"] as const,
    list: () => [...photoQueryKeys.all, "list"] as const,
    image: (filename: string) =>
        [...photoQueryKeys.all, "image", filename] as const,
};

// Custom hook for uploading images
export const useUploadImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.uploadImage,
        onSuccess: (data) => {
            toast.success("Image uploaded successfully!");
            // Invalidate and refetch the images list
            queryClient.invalidateQueries({ queryKey: photoQueryKeys.list() });
        },
        onError: (error: any) => {
            console.error("Upload error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to upload image"
            );
        },
    });
};

// Custom hook for changing background
export const useChangeBackground = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.changeBackground,
        onSuccess: (blob, variables) => {
            toast.success("Background changed successfully!");
            // Invalidate related queries
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Background change error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to change background"
            );
        },
    });
};

// Custom hook for adjusting brightness
export const useAdjustBrightness = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.adjustBrightness,
        onSuccess: (blob, variables) => {
            toast.success("Brightness adjusted successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Brightness adjustment error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to adjust brightness"
            );
        },
    });
};

// Custom hook for adjusting contrast
export const useAdjustContrast = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.adjustContrast,
        onSuccess: (blob, variables) => {
            toast.success("Contrast adjusted successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Contrast adjustment error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to adjust contrast"
            );
        },
    });
};

// Custom hook for adjusting saturation
export const useAdjustSaturation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.adjustSaturation,
        onSuccess: (blob, variables) => {
            toast.success("Saturation adjusted successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Saturation adjustment error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to adjust saturation"
            );
        },
    });
};

// Custom hook for applying blur
export const useApplyBlur = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.applyBlur,
        onSuccess: (blob, variables) => {
            toast.success("Blur applied successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Blur application error:", error);
            toast.error(error.response?.data?.detail || "Failed to apply blur");
        },
    });
};

// Custom hook for applying sharpen
export const useApplySharpen = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.applySharpen,
        onSuccess: (blob, variables) => {
            toast.success("Sharpening applied successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Sharpening error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to apply sharpening"
            );
        },
    });
};

// Custom hook for converting to grayscale
export const useConvertGrayscale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.convertGrayscale,
        onSuccess: (blob, filename) => {
            toast.success("Image converted to grayscale successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(filename),
            });
        },
        onError: (error: any) => {
            console.error("Grayscale conversion error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to convert to grayscale"
            );
        },
    });
};

// Custom hook for applying sepia
export const useApplySepia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.applySepia,
        onSuccess: (blob, filename) => {
            toast.success("Sepia effect applied successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(filename),
            });
        },
        onError: (error: any) => {
            console.error("Sepia application error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to apply sepia effect"
            );
        },
    });
};

// Custom hook for resizing images
export const useResizeImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.resizeImage,
        onSuccess: (blob, variables) => {
            toast.success("Image resized successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Image resize error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to resize image"
            );
        },
    });
};

// Custom hook for cropping images
export const useCropImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.cropImage,
        onSuccess: (blob, variables) => {
            toast.success("Image cropped successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Image crop error:", error);
            toast.error(error.response?.data?.detail || "Failed to crop image");
        },
    });
};

// Custom hook for rotating images
export const useRotateImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.rotateImage,
        onSuccess: (blob, variables) => {
            toast.success("Image rotated successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Image rotation error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to rotate image"
            );
        },
    });
};

// Custom hook for flipping images
export const useFlipImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.flipImage,
        onSuccess: (blob, variables) => {
            toast.success("Image flipped successfully!");
            queryClient.invalidateQueries({
                queryKey: photoQueryKeys.image(variables.filename),
            });
        },
        onError: (error: any) => {
            console.error("Image flip error:", error);
            toast.error(error.response?.data?.detail || "Failed to flip image");
        },
    });
};

// Custom hook for listing images
export const useListImages = () => {
    return useQuery({
        queryKey: photoQueryKeys.list(),
        queryFn: photoApi.listImages,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Custom hook for deleting images
export const useDeleteImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: photoApi.deleteImage,
        onSuccess: (data, filename) => {
            toast.success("Image deleted successfully!");
            // Invalidate and refetch the images list
            queryClient.invalidateQueries({ queryKey: photoQueryKeys.list() });
        },
        onError: (error: any) => {
            console.error("Delete error:", error);
            toast.error(
                error.response?.data?.detail || "Failed to delete image"
            );
        },
    });
};
