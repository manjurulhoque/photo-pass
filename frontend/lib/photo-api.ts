import api from "./api";

// Types for API requests
export interface UploadResponse {
    message: string;
    filename: string;
    original_name: string;
    size: number;
}

export interface ChangeBackgroundRequest {
    filename: string;
    background_color: string;
}

export interface BrightnessRequest {
    filename: string;
    factor: number;
}

export interface ContrastRequest {
    filename: string;
    factor: number;
}

export interface SaturationRequest {
    filename: string;
    factor: number;
}

export interface BlurRequest {
    filename: string;
    radius: number;
}

export interface SharpenRequest {
    filename: string;
    factor: number;
}

export interface ResizeRequest {
    filename: string;
    width: number;
    height: number;
}

export interface CropRequest {
    filename: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface RotateRequest {
    filename: string;
    angle: number;
}

export interface FlipRequest {
    filename: string;
    direction: "horizontal" | "vertical";
}

export interface ImageInfo {
    filename: string;
    size: number;
    size_mb: number;
}

// Photo editing API functions
export const photoApi = {
    // Upload image
    uploadImage: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/api/v1/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },

    // Change background
    changeBackground: async (
        request: ChangeBackgroundRequest
    ): Promise<Blob> => {
        const response = await api.get("/api/v1/change-background", {
            params: request,
            responseType: "blob",
        });

        return response.data;
    },

    // Adjust brightness
    adjustBrightness: async (request: BrightnessRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/brightness", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // Adjust contrast
    adjustContrast: async (request: ContrastRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/contrast", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // Adjust saturation
    adjustSaturation: async (request: SaturationRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/saturation", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // Apply blur
    applyBlur: async (request: BlurRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/blur", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // Apply sharpen
    applySharpen: async (request: SharpenRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/sharpen", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // Convert to grayscale
    convertGrayscale: async (filename: string): Promise<Blob> => {
        const response = await api.post(
            "/api/v1/grayscale",
            { filename },
            {
                responseType: "blob",
            }
        );

        return response.data;
    },

    // Apply sepia
    applySepia: async (filename: string): Promise<Blob> => {
        const response = await api.post(
            "/api/v1/sepia",
            { filename },
            {
                responseType: "blob",
            }
        );

        return response.data;
    },

    // Resize image
    resizeImage: async (request: ResizeRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/resize", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // Crop image
    cropImage: async (request: CropRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/crop", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // Rotate image
    rotateImage: async (request: RotateRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/rotate", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // Flip image
    flipImage: async (request: FlipRequest): Promise<Blob> => {
        const response = await api.post("/api/v1/flip", request, {
            responseType: "blob",
        });

        return response.data;
    },

    // List uploaded images
    listImages: async (): Promise<{ images: ImageInfo[] }> => {
        const response = await api.get("/api/v1/list");
        return response.data;
    },

    // Delete image
    deleteImage: async (filename: string): Promise<{ message: string }> => {
        const response = await api.delete(`/api/v1/delete/${filename}`);
        return response.data;
    },
};

export default photoApi;
