from kafka import KafkaProducer
from kafka.errors import KafkaError
import json
import logging
import time

logger = logging.getLogger(__name__)

# Initialize Kafka Producer with retry logic
max_retries = 3
retry_count = 0
producer = None

while retry_count < max_retries:
    try:
        producer = KafkaProducer(
            bootstrap_servers="localhost:9092",
            value_serializer=lambda x: json.dumps(x).encode("utf-8"),
            retries=5,
            acks='all',
            request_timeout_ms=10000
        )
        logger.info("KafkaProducer connected successfully")
        break
    except Exception as e:
        retry_count += 1
        logger.warning(f"Producer connection attempt {retry_count}/{max_retries} failed: {e}")
        if retry_count < max_retries:
            time.sleep(2)
        else:
            logger.error("Failed to connect to Kafka after retries")
            raise

def send_fraud_event(event):
    """Send fraud detection result to Kafka.
    
    Args:
        event: Dictionary with fraud detection result
    """
    try:
        future = producer.send("fraud-analysis", event)
        record_metadata = future.get(timeout=10)
        logger.debug(f"Event sent to partition {record_metadata.partition} at offset {record_metadata.offset}")
    except KafkaError as e:
        logger.error(f"Failed to send event to Kafka: {e}")
    except Exception as e:
        logger.error(f"Unexpected error sending event: {e}")