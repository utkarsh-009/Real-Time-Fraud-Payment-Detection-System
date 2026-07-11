import logging
from consumer import consumer
from producer import send_fraud_event
from model import model
from feature_engineering import create_features

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("Starting Fraud Detection Engine...")

try:
    for message in consumer:
        try:
            txn = message.value
            
            # Validate transaction has required fields
            required_fields = ["transactionId", "userId", "amount", "createdAt", "location", "deviceId"]
            if not all(field in txn for field in required_fields):
                logger.warning(f"Transaction missing required fields: {txn}")
                continue
            
            # Extract features and predict
            features = create_features(txn)
            risk_score = model.predict_proba([list(features.values())])[0][1]
            
            result = {
                "transactionId": txn["transactionId"],
                "userId": txn["userId"],
                "riskScore": float(risk_score),
                "isFraud": bool(risk_score > 0.8)
            }
            
            # Send prediction result
            send_fraud_event(result)
            
            # Log result
            log_level = logging.WARNING if result["isFraud"] else logging.INFO
            logger.log(log_level, f"Fraud Detection: {result}")
            
        except KeyError as e:
            logger.error(f"Missing key in transaction: {e}")
        except Exception as e:
            logger.error(f"Error processing transaction: {e}", exc_info=True)
            
except KeyboardInterrupt:
    logger.info("Shutting down Fraud Detection Engine...")
except Exception as e:
    logger.error(f"Fatal error in consumer: {e}", exc_info=True)
