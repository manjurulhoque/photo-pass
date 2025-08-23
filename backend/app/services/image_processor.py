from rembg import remove
import os
import time
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np
from app.core.config import settings


class ImageProcessor:
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR
        self.processed_dir = settings.PROCESSED_DIR

    def _get_image_path(self, filename: str) -> str:
        """Get the full path of an uploaded image"""
        return os.path.join(self.upload_dir, filename)

    def _get_processed_path(self, filename: str, suffix: str = "_processed") -> str:
        """Get the path for a processed image"""
        name, ext = os.path.splitext(filename)
        processed_name = f"{name}{suffix}{ext}"
        return os.path.join(self.processed_dir, processed_name)

    def _load_image(self, filename: str) -> Image.Image:
        """Load an image using PIL"""
        image_path = self._get_image_path(filename)
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image {filename} not found")
        return Image.open(image_path)

    def _save_image(self, image: Image.Image, output_path: str) -> str:
        """Save an image and return the path"""
        # Convert to RGB if necessary
        if image.mode in ("RGBA", "LA", "P"):
            image = image.convert("RGB")

        image.save(output_path, "JPEG", quality=95)
        return output_path

    async def change_background(self, filename: str, background_color: str) -> str:
        """Remove old background and apply a new background color"""
        start_time = time.time()

        # Load original
        image = self._load_image(filename)

        # Remove background -> result has transparency
        image_no_bg = remove(image)  # returns RGBA with transparent bg

        # Create a new background
        background = Image.new("RGBA", image_no_bg.size, background_color)

        # Paste the subject onto new background
        background.paste(image_no_bg, (0, 0), image_no_bg)

        # Convert to RGB (no alpha) if you want JPEG
        background = background.convert("RGB")

        output_path = self._get_processed_path(filename, f"_background_{background_color}")
        self._save_image(background, output_path)

        processing_time = time.time() - start_time
        print(f"Background change completed in {processing_time:.2f}s")

        return output_path

    async def adjust_brightness(self, filename: str, factor: float) -> str:
        """Adjust image brightness"""
        start_time = time.time()

        image = self._load_image(filename)
        enhancer = ImageEnhance.Brightness(image)
        adjusted_image = enhancer.enhance(factor)

        output_path = self._get_processed_path(filename, f"_brightness_{factor}")
        self._save_image(adjusted_image, output_path)

        processing_time = time.time() - start_time
        print(f"Brightness adjustment completed in {processing_time:.2f}s")

        return output_path

    async def adjust_contrast(self, filename: str, factor: float) -> str:
        """Adjust image contrast"""
        start_time = time.time()

        image = self._load_image(filename)
        enhancer = ImageEnhance.Contrast(image)
        adjusted_image = enhancer.enhance(factor)

        output_path = self._get_processed_path(filename, f"_contrast_{factor}")
        self._save_image(adjusted_image, output_path)

        processing_time = time.time() - start_time
        print(f"Contrast adjustment completed in {processing_time:.2f}s")

        return output_path

    async def adjust_saturation(self, filename: str, factor: float) -> str:
        """Adjust image saturation"""
        start_time = time.time()

        image = self._load_image(filename)
        enhancer = ImageEnhance.Color(image)
        adjusted_image = enhancer.enhance(factor)

        output_path = self._get_processed_path(filename, f"_saturation_{factor}")
        self._save_image(adjusted_image, output_path)

        processing_time = time.time() - start_time
        print(f"Saturation adjustment completed in {processing_time:.2f}s")

        return output_path

    async def apply_blur(self, filename: str, radius: int) -> str:
        """Apply blur effect to image"""
        start_time = time.time()

        image = self._load_image(filename)
        blurred_image = image.filter(ImageFilter.GaussianBlur(radius=radius))

        output_path = self._get_processed_path(filename, f"_blur_{radius}")
        self._save_image(blurred_image, output_path)

        processing_time = time.time() - start_time
        print(f"Blur effect completed in {processing_time:.2f}s")

        return output_path

    async def apply_sharpen(self, filename: str, factor: float) -> str:
        """Apply sharpening effect to image"""
        start_time = time.time()

        image = self._load_image(filename)
        enhancer = ImageEnhance.Sharpness(image)
        sharpened_image = enhancer.enhance(factor)

        output_path = self._get_processed_path(filename, f"_sharpen_{factor}")
        self._save_image(sharpened_image, output_path)

        processing_time = time.time() - start_time
        print(f"Sharpening completed in {processing_time:.2f}s")

        return output_path

    async def convert_grayscale(self, filename: str) -> str:
        """Convert image to grayscale"""
        start_time = time.time()

        image = self._load_image(filename)
        grayscale_image = image.convert("L").convert("RGB")

        output_path = self._get_processed_path(filename, "_grayscale")
        self._save_image(grayscale_image, output_path)

        processing_time = time.time() - start_time
        print(f"Grayscale conversion completed in {processing_time:.2f}s")

        return output_path

    async def apply_sepia(self, filename: str) -> str:
        """Apply sepia effect to image"""
        start_time = time.time()

        image = self._load_image(filename)
        image_array = np.array(image)

        # Sepia transformation matrix
        sepia_matrix = np.array(
            [[0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131]]
        )

        # Apply sepia effect
        sepia_image = image_array.dot(sepia_matrix.T)
        sepia_image /= sepia_image.max()
        sepia_image = (sepia_image * 255).astype(np.uint8)

        sepia_pil = Image.fromarray(sepia_image)

        output_path = self._get_processed_path(filename, "_sepia")
        self._save_image(sepia_pil, output_path)

        processing_time = time.time() - start_time
        print(f"Sepia effect completed in {processing_time:.2f}s")

        return output_path

    async def resize_image(self, filename: str, width: int, height: int) -> str:
        """Resize image to specified dimensions"""
        start_time = time.time()

        image = self._load_image(filename)
        resized_image = image.resize((width, height), Image.Resampling.LANCZOS)

        output_path = self._get_processed_path(filename, f"_resize_{width}x{height}")
        self._save_image(resized_image, output_path)

        processing_time = time.time() - start_time
        print(f"Resize completed in {processing_time:.2f}s")

        return output_path

    async def crop_image(
        self, filename: str, x: int, y: int, width: int, height: int
    ) -> str:
        """Crop image to specified dimensions"""
        start_time = time.time()

        image = self._load_image(filename)
        cropped_image = image.crop((x, y, x + width, y + height))

        output_path = self._get_processed_path(
            filename, f"_crop_{x}_{y}_{width}x{height}"
        )
        self._save_image(cropped_image, output_path)

        processing_time = time.time() - start_time
        print(f"Crop completed in {processing_time:.2f}s")

        return output_path

    async def rotate_image(self, filename: str, angle: float) -> str:
        """Rotate image by specified angle"""
        start_time = time.time()

        image = self._load_image(filename)
        rotated_image = image.rotate(
            angle, expand=True, resample=Image.Resampling.BICUBIC
        )

        output_path = self._get_processed_path(filename, f"_rotate_{angle}")
        self._save_image(rotated_image, output_path)

        processing_time = time.time() - start_time
        print(f"Rotation completed in {processing_time:.2f}s")

        return output_path

    async def flip_image(self, filename: str, direction: str) -> str:
        """Flip image horizontally or vertically"""
        start_time = time.time()

        image = self._load_image(filename)

        if direction == "horizontal":
            flipped_image = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        elif direction == "vertical":
            flipped_image = image.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        else:
            raise ValueError("Direction must be 'horizontal' or 'vertical'")

        output_path = self._get_processed_path(filename, f"_flip_{direction}")
        self._save_image(flipped_image, output_path)

        processing_time = time.time() - start_time
        print(f"Flip {direction} completed in {processing_time:.2f}s")

        return output_path

    def get_image_info(self, filename: str) -> dict:
        """Get information about an image"""
        image_path = self._get_image_path(filename)
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image {filename} not found")

        image = Image.open(image_path)
        file_size = os.path.getsize(image_path)

        return {
            "filename": filename,
            "size": file_size,
            "size_mb": round(file_size / (1024 * 1024), 2),
            "width": image.width,
            "height": image.height,
            "format": image.format,
            "mode": image.mode,
        }
