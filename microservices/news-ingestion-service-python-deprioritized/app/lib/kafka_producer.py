from kafka import KafkaProducer

import time

producer = KafkaProducer(
    bootstrap_servers="kafka-32889e90-kewlaninaveen5-88b8.f.aivencloud.com:28605",
    security_protocol="SASL_SSL",
    sasl_mechanism="SCRAM-SHA-256",
    sasl_plain_username="avnadmin",
    sasl_plain_password="<redacted>",
    ssl_cafile="ca.pem",
)

try:
    while True:
        key = "hello"
        value = "world"

        producer.send("news-stream", value.encode(), key.encode())

        print(f"Produced: key={key}, value={value} into topic news-stream", flush=True)

        time.sleep(1)

finally:
    producer.close()
