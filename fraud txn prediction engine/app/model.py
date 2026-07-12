import logging
import os

import joblib
import numpy as np
from feature_engineering import create_features
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, VotingClassifier
from sklearn.model_selection import train_test_split

logger = logging.getLogger(__name__)

MODEL_PATH = "model/fraud_model.pkl"

SAFE_LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"]
MEDIUM_RISK_LOCATIONS = ["Dubai", "Singapore", "London", "New York", "Bangkok"]
HIGH_RISK_LOCATIONS = ["Russia", "Nigeria", "North Korea", "Iran", "Unknown"]
MERCHANTS = ["Amazon", "Flipkart", "Swiggy", "Uber", "Netflix", "CryptoExchange", "GiftCardHub", "CasinoPay"]


def generate_transaction():
    amount = float(
        np.random.choice(
            [499, 999, 2499, 4999, 9999, 24999, 49999, 75000, 120000, 180000, 250000],
            p=[0.09, 0.11, 0.12, 0.14, 0.14, 0.12, 0.08, 0.07, 0.06, 0.04, 0.03],
        )
    )

    location = np.random.choice(
        SAFE_LOCATIONS + MEDIUM_RISK_LOCATIONS + HIGH_RISK_LOCATIONS,
        p=[0.12, 0.12, 0.10, 0.09, 0.08, 0.08, 0.06, 0.05, 0.05, 0.04, 0.04, 0.08, 0.04, 0.02, 0.02, 0.01],
    )

    merchant = np.random.choice(
        MERCHANTS,
        p=[0.24, 0.20, 0.12, 0.11, 0.10, 0.08, 0.10, 0.05],
    )

    if np.random.random() < 0.22:
        hour = int(np.random.choice([0, 1, 2, 3, 4]))
    else:
        hour = int(np.random.choice(range(5, 24)))

    device_id = np.random.choice(
        ["DEV101", "DEV102", "DEV103", "DEV201", "DEV999", "NEW001", "NEW777"],
        p=[0.20, 0.18, 0.17, 0.15, 0.08, 0.14, 0.08],
    )

    return {
        "transactionId": "synthetic",
        "userId": "synthetic-user",
        "amount": amount,
        "merchant": merchant,
        "location": location,
        "deviceId": device_id,
        "createdAt": [2026, 5, 17, hour, 15],
    }


def fraud_probability(features):
    score = 0.0
    score += 1.0 if features["is_high_amount"] else 0.0
    score += 1.2 if features["is_very_high_amount"] else 0.0
    score += 0.8 if features["is_night"] else 0.0
    score += 0.9 if features["location_risk"] else 0.0
    score += 1.5 if features["high_risk_location"] else 0.0
    score += 0.9 if features["new_device"] else 0.0
    score += 0.8 if features["risky_merchant"] else 0.0

    if features["is_very_high_amount"] and features["high_risk_location"]:
        score += 1.2
    if features["is_high_amount"] and features["new_device"]:
        score += 0.8
    if features["is_night"] and features["location_risk"]:
        score += 0.7

    return 1 / (1 + np.exp(-(score - 3.2)))


def generate_training_data(n_samples=5000):
    feature_rows = []
    labels = []

    for _ in range(n_samples):
        txn = generate_transaction()
        features = create_features(txn)
        feature_rows.append(list(features.values()))
        labels.append(1 if np.random.random() < fraud_probability(features) else 0)

    return np.array(feature_rows), np.array(labels)


def train_compatible_model():
    logger.warning("Training a local compatible fallback model because the saved model could not be loaded.")
    X, y = generate_training_data()
    X_train, _, y_train, _ = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    rf_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_leaf=4,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    gb_model = GradientBoostingClassifier(
        n_estimators=120,
        learning_rate=0.05,
        max_depth=3,
        random_state=42,
    )
    fallback_model = VotingClassifier(
        estimators=[("rf", rf_model), ("gb", gb_model)],
        voting="soft",
        weights=[1, 2],
    )
    fallback_model.fit(X_train, y_train)

    os.makedirs("model", exist_ok=True)
    joblib.dump(fallback_model, MODEL_PATH)
    logger.info("Compatible fallback model trained and saved to %s", MODEL_PATH)
    return fallback_model


def load_or_create_model():
    if os.path.exists(MODEL_PATH) and os.path.getsize(MODEL_PATH) > 0:
        try:
            loaded_model = joblib.load(MODEL_PATH)
            logger.info(
                "Model loaded successfully from %s (size: %s bytes)",
                MODEL_PATH,
                os.path.getsize(MODEL_PATH),
            )
            return loaded_model
        except Exception as exc:
            logger.warning("Existing model at %s is incompatible: %s", MODEL_PATH, exc)

    return train_compatible_model()


model = load_or_create_model()
