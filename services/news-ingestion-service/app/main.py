
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException

from app.clients.free_news_api import FreeNewsClient


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = FreeNewsClient()
    app.state.news_client = client
    try:
        yield
    finally:
        await client.close()


app = FastAPI(
    title="MasterLingo News Ingestion Service",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.get("/test/news")
async def test_news():
    try:
        articles = await app.state.news_client.fetch_recent_articles(
            limit=5
        )
        return {
            "count": len(articles),
            "articles": [
                article.model_dump(mode="json")
                for article in articles
            ],
        }
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"News provider request failed: {type(exc).__name__}",
        ) from exc
