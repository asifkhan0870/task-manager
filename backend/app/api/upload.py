from fastapi import APIRouter, UploadFile, File
import cloudinary
import cloudinary.uploader

from app.core.config import settings

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

print("Cloud Name:", settings.CLOUDINARY_CLOUD_NAME)
print("API Key Loaded:", bool(settings.CLOUDINARY_API_KEY))
print("API Secret Loaded:", bool(settings.CLOUDINARY_API_SECRET))


@router.post("/audio")
async def upload_audio(file: UploadFile = File(...)):
    result = cloudinary.uploader.upload(
        file.file,
        resource_type="video"
    )

    return {
        "audio_url": result["secure_url"]
    }