# Photo Pass API

A professional FastAPI-based photo editing service with comprehensive image processing capabilities.

## Features

- **Image Upload & Management**: Secure file upload with validation
- **Basic Adjustments**: Brightness, contrast, saturation
- **Effects**: Blur, sharpen, grayscale, sepia
- **Transformations**: Resize, crop, rotate, flip
- **High Performance**: Async processing with optimized image handling
- **Professional Quality**: High-quality output with configurable parameters

## API Endpoints

### Image Management
- `POST /api/v1/upload` - Upload an image
- `GET /api/v1/list` - List all uploaded images
- `DELETE /api/v1/delete/{filename}` - Delete an image

### Image Editing
- `POST /api/v1/brightness` - Adjust brightness
- `POST /api/v1/contrast` - Adjust contrast
- `POST /api/v1/saturation` - Adjust saturation
- `POST /api/v1/blur` - Apply blur effect
- `POST /api/v1/sharpen` - Apply sharpening
- `POST /api/v1/grayscale` - Convert to grayscale
- `POST /api/v1/sepia` - Apply sepia effect
- `POST /api/v1/resize` - Resize image
- `POST /api/v1/crop` - Crop image
- `POST /api/v1/rotate` - Rotate image
- `POST /api/v1/flip` - Flip image

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd photo-pass/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the application**
   ```bash
   python main.py
   # Or with uvicorn
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Usage

### Starting the Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Example Requests

#### Upload Image
```bash
curl -X POST "http://localhost:8000/api/v1/upload" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@your_image.jpg"
```

#### Adjust Brightness
```bash
curl -X POST "http://localhost:8000/api/v1/brightness" \
     -H "accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"filename": "your_image.jpg", "factor": 1.5}'
```

#### Apply Sepia Effect
```bash
curl -X POST "http://localhost:8000/api/v1/sepia" \
     -H "accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"filename": "your_image.jpg"}'
```

## Configuration

The application can be configured through environment variables or a `.env` file:

```env
# API Settings
API_V1_STR=/api/v1
PROJECT_NAME=Photo Pass API

# CORS Settings
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
PROCESSED_DIR=processed

# Image Processing Settings
SUPPORTED_FORMATS=[".jpg",".jpeg",".png",".bmp",".tiff",".webp"]
MAX_IMAGE_DIMENSION=4096

# Security Settings
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Project Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py          # Configuration settings
│   ├── routers/
│   │   ├── __init__.py
│   │   └── photo_editing.py   # API endpoints
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── photo_editing.py   # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   └── image_processor.py # Image processing logic
│   └── __init__.py
├── main.py                     # FastAPI application
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Dependencies

- **FastAPI**: Modern, fast web framework
- **Pillow (PIL)**: Image processing library
- **OpenCV**: Advanced image processing
- **NumPy**: Numerical computing
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints throughout
- Document all functions and classes

### Testing
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Adding New Features
1. Create new schema in `app/schemas/`
2. Add processing logic in `app/services/`
3. Create endpoint in `app/routers/`
4. Update documentation

## Performance Considerations

- Images are processed asynchronously
- Large files are handled efficiently
- Processed images are cached
- Memory usage is optimized

## Security Features

- File type validation
- File size limits
- CORS configuration
- Input validation with Pydantic

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For support and questions, please open an issue on GitHub.
