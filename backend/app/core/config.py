from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str

    SECRET_KEY: str

    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    MONGODB_URL: str

    DATABASE_NAME: str

    # Email Services
    RESEND_API_KEY: str | None = None
    BREVO_API_KEY: str | None = None

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str

    CLOUDINARY_API_KEY: str

    CLOUDINARY_API_SECRET: str

    class Config:
        env_file = ".env"


settings = Settings()