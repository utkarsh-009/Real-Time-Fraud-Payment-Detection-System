from kafka import KafkaConsumer
from kafka.errors import KafkaError
import json
import logging
import os
import time

logger = logging.getLogger(__name__)
bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")

# Initialize Kafka Consumer with retry logic
max_retries = 3
retry_count = 0
consumer = None

while retry_count < max_retries:
    try:
        consumer = KafkaConsumer(
            "transactions",
            bootstrap_servers=bootstrap_servers,
            value_deserializer=lambda x: json.loads(x.decode("utf-8")),
            auto_offset_reset='earliest',
            enable_auto_commit=True,
            group_id='fraud-detection-group',
            session_timeout_ms=30000,
            request_timeout_ms=60000
        )
        logger.info("KafkaConsumer connected successfully")
        break
    except Exception as e:
        retry_count += 1
        logger.warning(f"Consumer connection attempt {retry_count}/{max_retries} failed: {e}")
        if retry_count < max_retries:
            time.sleep(2)
        else:
            logger.error("Failed to connect to Kafka after retries")
            raise
