
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from kafka import KafkaProducer

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")


def create_producer():
    ca_path = Path(os.environ["KAFKA_CA_FILE"])
    if not ca_path.is_absolute():
        ca_path = ROOT / ca_path

    return KafkaProducer(
        bootstrap_servers=os.environ["KAFKA_BOOTSTRAP_SERVERS"],
        security_protocol=os.environ["KAFKA_SECURITY_PROTOCOL"],
        sasl_mechanism=os.environ["KAFKA_SASL_MECHANISM"],
        sasl_plain_username=os.environ["KAFKA_USERNAME"],
        sasl_plain_password=os.environ["KAFKA_PASSWORD"],
        ssl_cafile=str(ca_path),
        value_serializer=lambda value: json.dumps(value).encode("utf-8"),
    )


def publish_article(producer, article: dict) -> None:
    producer.send(
        os.environ.get("KAFKA_TOPIC", "news-stream"),
        key=str(article["url"]).encode("utf-8"),
        value=article,
    ).get(timeout=15)
