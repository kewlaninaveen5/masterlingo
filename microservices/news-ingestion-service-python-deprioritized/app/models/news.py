from datetime import datetime
from pydantic import BaseModel, HttpUrl, ConfigDict
from app.enums.language import Language

class NewsArticle(BaseModel):
    model_config = ConfigDict(
        frozen=True,
        extra="forbid",
    )


    title: str
    content : str
    source : str
    desc : str
    url : HttpUrl
    published_at : datetime
    language : Language
