from pydantic import BaseModel, Field
from typing import Literal


class BrightnessRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    factor: float = Field(
        ..., ge=0.1, le=3.0, description="Brightness factor (0.1 to 3.0)"
    )


class ContrastRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    factor: float = Field(
        ..., ge=0.1, le=3.0, description="Contrast factor (0.1 to 3.0)"
    )


class SaturationRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    factor: float = Field(
        ..., ge=0.0, le=3.0, description="Saturation factor (0.0 to 3.0)"
    )


class BlurRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    radius: int = Field(..., ge=1, le=20, description="Blur radius (1 to 20)")


class SharpenRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    factor: float = Field(
        ..., ge=0.1, le=3.0, description="Sharpening factor (0.1 to 3.0)"
    )


class GrayscaleRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")


class SepiaRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")


class ResizeRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    width: int = Field(..., ge=1, le=4096, description="Target width (1 to 4096)")
    height: int = Field(..., ge=1, le=4096, description="Target height (1 to 4096)")


class CropRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    x: int = Field(..., ge=0, description="Starting X coordinate")
    y: int = Field(..., ge=0, description="Starting Y coordinate")
    width: int = Field(..., ge=1, description="Crop width")
    height: int = Field(..., ge=1, description="Crop height")


class RotateRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    angle: float = Field(
        ..., ge=-360, le=360, description="Rotation angle in degrees (-360 to 360)"
    )


class FlipRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    direction: Literal["horizontal", "vertical"] = Field(
        ..., description="Flip direction"
    )


class ImageInfo(BaseModel):
    filename: str
    size: int
    size_mb: float
    width: int
    height: int
    format: str


class ProcessingResult(BaseModel):
    message: str
    original_filename: str
    processed_filename: str
    processing_time: float


class ChangeBackgroundRequest(BaseModel):
    filename: str = Field(..., description="Name of the uploaded image file")
    background_color: str = Field(
        ..., description="Background color in hex format (e.g. '#000000')"
    )
