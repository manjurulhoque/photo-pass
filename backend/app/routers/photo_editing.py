from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from typing import Optional
import os
import uuid
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np
from app.core.config import settings
from app.services.image_processor import ImageProcessor
from app.schemas.photo_editing import (
    BrightnessRequest,
    ContrastRequest,
    SaturationRequest,
    BlurRequest,
    SharpenRequest,
    GrayscaleRequest,
    SepiaRequest,
    ResizeRequest,
    CropRequest,
    RotateRequest,
    FlipRequest,
    ChangeBackgroundRequest,
)

router = APIRouter()


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image for editing
    """
    # Validate file type
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in settings.SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {settings.SUPPORTED_FORMATS}",
        )

    # Validate file size
    if file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024)}MB",
        )

    # Generate unique filename
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        return {
            "message": "Image uploaded successfully",
            "filename": filename,
            "original_name": file.filename,
            "size": len(content),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


@router.get("/change-background")
async def change_background(request: ChangeBackgroundRequest):
    """
    Change the background of an image
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.change_background(
            request.filename, request.background_color
        )
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/brightness")
async def adjust_brightness(request: BrightnessRequest):
    """
    Adjust image brightness
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.adjust_brightness(
            request.filename, request.factor
        )
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/contrast")
async def adjust_contrast(request: ContrastRequest):
    """
    Adjust image contrast
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.adjust_contrast(request.filename, request.factor)
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/saturation")
async def adjust_saturation(request: SaturationRequest):
    """
    Adjust image saturation
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.adjust_saturation(
            request.filename, request.factor
        )
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/blur")
async def apply_blur(request: BlurRequest):
    """
    Apply blur effect to image
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.apply_blur(request.filename, request.radius)
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sharpen")
async def apply_sharpen(request: SharpenRequest):
    """
    Apply sharpening effect to image
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.apply_sharpen(request.filename, request.factor)
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/grayscale")
async def convert_grayscale(request: GrayscaleRequest):
    """
    Convert image to grayscale
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.convert_grayscale(request.filename)
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sepia")
async def apply_sepia(request: SepiaRequest):
    """
    Apply sepia effect to image
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.apply_sepia(request.filename)
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/resize")
async def resize_image(request: ResizeRequest):
    """
    Resize image to specified dimensions
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.resize_image(
            request.filename, request.width, request.height
        )
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/crop")
async def crop_image(request: CropRequest):
    """
    Crop image to specified dimensions
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.crop_image(
            request.filename, request.x, request.y, request.width, request.height
        )
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rotate")
async def rotate_image(request: RotateRequest):
    """
    Rotate image by specified angle
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.rotate_image(request.filename, request.angle)
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/flip")
async def flip_image(request: FlipRequest):
    """
    Flip image horizontally or vertically
    """
    try:
        processor = ImageProcessor()
        result_path = await processor.flip_image(request.filename, request.direction)
        return FileResponse(result_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
async def list_uploaded_images():
    """
    List all uploaded images
    """
    try:
        files = []
        for filename in os.listdir(settings.UPLOAD_DIR):
            if any(
                filename.lower().endswith(ext) for ext in settings.SUPPORTED_FORMATS
            ):
                file_path = os.path.join(settings.UPLOAD_DIR, filename)
                file_size = os.path.getsize(file_path)
                files.append(
                    {
                        "filename": filename,
                        "size": file_size,
                        "size_mb": round(file_size / (1024 * 1024), 2),
                    }
                )
        return {"images": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete/{filename}")
async def delete_image(filename: str):
    """
    Delete an uploaded image
    """
    try:
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Image not found")

        os.remove(file_path)
        return {"message": f"Image {filename} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
