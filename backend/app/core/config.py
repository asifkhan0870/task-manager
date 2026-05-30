from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str

    SECRET_KEY: str

    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    MONGODB_URL: str

    DATABASE_NAME: str

    SMTP_EMAIL: str

    SMTP_PASSWORD: str

    SMTP_HOST: str

    SMTP_PORT: int

    class Config:
        env_file = ".env"


settings = Settings()