from consumer import consumer
from producer import send_fraud_event
from model import model
from feature_engineering import create_features

for message in consumer:
    txn = message.value

    features = create_features(txn)

    risk_score = model.predict_proba([list(features.values())])[0][1]

    result = {
        "transactionId": txn["transactionId"],
        "userId": txn["userId"],
        "riskScore": float(risk_score),
        "isFraud": risk_score > 0.8
    }

    send_fraud_event(result)

    print(result)