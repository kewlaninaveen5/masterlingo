
from datetime import datetime

import httpx
from pydantic import BaseModel, ConfigDict, HttpUrl

from app.enums.language import Language
from app.models.news import NewsArticle


class FreeNewsArticleResponse(BaseModel):
    """The external provider's article response."""

    model_config = ConfigDict(extra="ignore")

    title: str
    url: HttpUrl
    published_at: datetime
    host: str
    sitename: str | None = None
    description: str | None = None
    text: str | None = None
    content: str | None = None
    lang: str


class FreeNewsSearchResponse(BaseModel):
    """The external provider's search response."""

    model_config = ConfigDict(extra="ignore")

    results: list[FreeNewsArticleResponse]


class FreeNewsClient:
    BASE_URL = "https://freenewsapi.ai/v1"

    def __init__(self, timeout: float = 20.0) -> None:
        self._client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            timeout=timeout,
        )

    async def fetch_recent_articles(
        self,
        limit: int = 10,
    ) -> list[NewsArticle]:
        response = await self._client.get(
            "/search",
            params={
                "lang": "en",
                "date": "24h",
                "sort": "date",
                "size": limit,
                "full_text": "true",
            },
        )
        response.raise_for_status()

        payload = FreeNewsSearchResponse.model_validate(
            response.json()
        )
        print("payload : ", payload)

        articles: list[NewsArticle] = []

        for item in payload.results:
            shortDesc = item.description
            content = item.text if item.text is not None else item.content if item.content is not None else item.description

            # Skip articles without usable body/summary text.
            if not content or not content.strip():
                continue

            articles.append(
                NewsArticle(
                    title=item.title,
                    desc = shortDesc,
                    content=content,
                    source=item.sitename or item.host,
                    url=item.url,
                    published_at=item.published_at,
                    language=Language.ENGLISH,
                )
            )

        return articles

    async def close(self) -> None:
        await self._client.aclose()
