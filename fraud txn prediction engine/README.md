# Real-Time Fraud Payment Detection System

## Overview
A real-time fraud detection engine that processes payment transactions through Apache Kafka and predicts fraud probability using a machine learning model.

## Architecture

```
Producer (Transactions) → Kafka (transactions topic)
                          ↓
                    Consumer (Fraud Engine)
                          ↓
                    Feature Engineering
                          ↓
                    ML Model Prediction
                          ↓
                    Producer (Fraud Analysis)
                          ↓
                    Kafka (fraud-analysis topic)
```

## System Components

### 1. **app/main.py** - Main Fraud Detection Pipeline
- Consumes transactions from Kafka `transactions` topic
- Extracts features using feature engineering
- Predicts fraud probability using the trained model
- Publishes fraud detection results to `fraud-analysis` topic
- Includes comprehensive logging and error handling

### 2. **app/consumer.py** - Kafka Consumer
- Connects to Kafka broker on `localhost:9092`
- Subscribes to `transactions` topic
- Includes retry logic and connection error handling
- Automatic offset management and session handling

### 3. **app/producer.py** - Kafka Producer
- Sends fraud detection results to `fraud-analysis` topic
- Includes retry logic and acknowledgment guarantees
- Error handling for Kafka communication issues

### 4. **app/feature_engineering.py** - Feature Extraction
Extracts 5 key features from each transaction:
- **amount**: Transaction amount
- **is_high_amount**: 1 if amount > 50,000; 0 otherwise
- **is_night**: 1 if transaction time is between 00:00-05:00; 0 otherwise
- **location_risk**: 1 if location is not Mumbai/Delhi; 0 otherwise
- **new_device**: 1 if deviceId starts with "NEW"; 0 otherwise

### 5. **app/model.py** - ML Model Loading
- Loads pre-trained RandomForest model from `model/fraud_model.pkl`
- Fallback: Creates a dummy model if trained model not available
- Includes model validation and error handling

### 6. **app/schema.py** - Data Schema
Defines Pydantic model for transaction validation:
```
TransactionEvent:
  - transactionId (str)
  - userId (str)
  - amount (float)
  - merchant (str)
  - location (str)
  - deviceId (str)
  - createdAt (str)
```

### 7. **train_model.py** - Model Training
- Generates synthetic training data (1,000 samples)
- Trains RandomForest classifier with optimized parameters
- Saves model to `model/fraud_model.pkl` (614KB)
- Achieves 77.75% train accuracy, 72.5% test accuracy

## Prerequisites

- Python 3.10+
- Apache Kafka running on `localhost:9092`
- Kafka topics: `transactions`, `fraud-analysis`

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Train the model (one-time setup)
python train_model.py
```

## Running the Fraud Detection Engine

### Option 1: Direct Python
```bash
python app/main.py
```

### Option 2: Docker
```bash
# Build the image
docker build -t fraud-detection:latest .

# Run the container
docker run --network host fraud-detection:latest
```

## Expected Input Format (Kafka transactions topic)
```json
{
  "transactionId": "txn_123456",
  "userId": "user_789",
  "amount": 75000.50,
  "merchant": "Amazon",
  "location": "Bangalore",
  "deviceId": "NEW_device_xyz",
  "createdAt": "2026-06-21 02:30:45"
}
```

## Expected Output Format (Kafka fraud-analysis topic)
```json
{
  "transactionId": "txn_123456",
  "userId": "user_789",
  "riskScore": 0.85,
  "isFraud": true
}
```

## Fraud Detection Logic

- **Risk Threshold**: `riskScore > 0.8` → Fraud flagged
- **Features Impact**: Transactions with multiple risk factors (high amount, night time, risky location, new device) score higher

## Model Performance

- **Training Set Accuracy**: 77.75%
- **Test Set Accuracy**: 72.50%
- **Dataset**: 1,000 synthetic samples (31.5% fraud, 68.5% legitimate)
- **Algorithm**: RandomForestClassifier (100 estimators, max_depth=10)

## Logging

The system logs important events with timestamps:
- Model loading status
- Transaction processing
- Fraud detection alerts (WARNING level)
- Errors and exceptions (ERROR level)

Example log output:
```
2026-06-21 10:30:45,123 - INFO - Starting Fraud Detection Engine...
2026-06-21 10:30:46,456 - INFO - Model loaded successfully from model/fraud_model.pkl
2026-06-21 10:30:50,789 - WARNING - Fraud Detection: {'transactionId': 'txn_123', 'userId': 'user_1', 'riskScore': 0.92, 'isFraud': True}
```

## Troubleshooting

### EOFError on Model Load
**Cause**: Empty or corrupted model file
**Solution**: Run `python train_model.py` to regenerate

### KafkaError: Connection refused
**Cause**: Kafka broker not running
**Solution**: Ensure Kafka is running on `localhost:9092`

### KeyError in Transaction Processing
**Cause**: Missing required fields in transaction
**Solution**: Ensure all fields in schema are present in Kafka messages

## Future Enhancements

1. Add model versioning and A/B testing
2. Implement feature importance tracking
3. Add real-time model retraining
4. Create dashboard for fraud monitoring
5. Integrate with notification system
6. Add batch prediction mode
7. Implement model performance metrics tracking

## Files Summary

| File | Purpose | Status |
|------|---------|--------|
| main.py | Fraud detection pipeline | ✅ Enhanced with logging & error handling |
| consumer.py | Kafka consumer | ✅ Added retry logic |
| producer.py | Kafka producer | ✅ Added retry logic |
| feature_engineering.py | Feature extraction | ✅ Fixed time logic, added error handling |
| model.py | Model loading | ✅ Added validation & logging |
| schema.py | Data validation | ✅ Pydantic model |
| train_model.py | Model training | ✅ Synthetic data generation |
| Dockerfile | Container setup | ✅ Created |
| requirements.txt | Dependencies | ✅ Updated with pydantic |
| .gitignore | Git exclusions | ✅ Created |

---
**Last Updated**: 2026-06-21  
**Version**: 1.0.0
