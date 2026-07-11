"""
Training script to create a pretrained fraud detection model
"""
import joblib
import numpy as np
from app.feature_engineering import create_features
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, VotingClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
import os

SAFE_LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"]
MEDIUM_RISK_LOCATIONS = ["Dubai", "Singapore", "London", "New York", "Bangkok"]
HIGH_RISK_LOCATIONS = ["Russia", "Nigeria", "North Korea", "Iran", "Unknown"]
MERCHANTS = ["Amazon", "Flipkart", "Swiggy", "Uber", "Netflix", "CryptoExchange", "GiftCardHub", "CasinoPay"]


def generate_transaction():
    amount = float(np.random.choice(
        [499, 999, 2499, 4999, 9999, 24999, 49999, 75000, 120000, 180000, 250000],
        p=[0.09, 0.11, 0.12, 0.14, 0.14, 0.12, 0.08, 0.07, 0.06, 0.04, 0.03],
    ))

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

    # Strong suspicious combinations should be treated as high risk.
    if features["is_very_high_amount"] and features["high_risk_location"]:
        score += 1.2
    if features["is_high_amount"] and features["new_device"]:
        score += 0.8
    if features["is_night"] and features["location_risk"]:
        score += 0.7

    return 1 / (1 + np.exp(-(score - 3.2)))


def generate_training_data(n_samples=25000):
    X = []
    y = []
    
    for _ in range(n_samples):
        txn = generate_transaction()
        features = create_features(txn)
        X.append(list(features.values()))

        label = 1 if np.random.random() < fraud_probability(features) else 0
        y.append(label)
    
    return np.array(X), np.array(y)

# Generate data
print("Generating training data...")
X, y = generate_training_data(n_samples=25000)

print(f"Training data shape: X={X.shape}, y={y.shape}")
print(f"Fraud cases: {np.sum(y)} ({np.sum(y)/len(y)*100:.1f}%)")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train model
print("\nTraining ensemble model...")
rf_model = RandomForestClassifier(
    n_estimators=350,
    max_depth=12,
    min_samples_leaf=4,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)
gb_model = GradientBoostingClassifier(
    n_estimators=180,
    learning_rate=0.05,
    max_depth=3,
    random_state=42,
)
model = VotingClassifier(
    estimators=[("rf", rf_model), ("gb", gb_model)],
    voting="soft",
    weights=[1, 2],
)
model.fit(X_train, y_train)

# Evaluate
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"Train Accuracy: {train_score:.4f}")
print(f"Test Accuracy: {test_score:.4f}")

y_prob = model.predict_proba(X_test)[:, 1]
y_pred = (y_prob >= 0.5).astype(int)
print(f"ROC AUC: {roc_auc_score(y_test, y_prob):.4f}")
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred, digits=4))

# Save model
model_dir = "model"
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, "fraud_model.pkl")

joblib.dump(model, model_path)
print(f"\nModel saved to {model_path}")
print(f"Model file size: {os.path.getsize(model_path)} bytes")
