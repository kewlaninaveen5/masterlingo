from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    news_api_key: str
    kafka_bootstrap_servers: str
    kafka_topic: str = "news-stream"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()