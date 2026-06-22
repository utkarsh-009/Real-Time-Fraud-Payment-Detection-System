"""
Training script to create a pretrained fraud detection model
"""
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import os

# Generate synthetic training data based on feature engineering logic
def generate_training_data(n_samples=1000):
    """
    Generate synthetic training data with features:
    - amount: transaction amount
    - is_high_amount: 1 if amount > 50000
    - is_night: 1 if transaction between 00:00-05:00
    - location_risk: 1 if location is not Mumbai/Delhi
    - new_device: 1 if deviceId starts with "NEW"
    """
    X = []
    y = []
    
    for _ in range(n_samples):
        amount = np.random.choice([500, 5000, 25000, 75000, 150000])
        is_high_amount = 1 if amount > 50000 else 0
        is_night = np.random.choice([0, 1], p=[0.7, 0.3])
        location_risk = np.random.choice([0, 1], p=[0.6, 0.4])
        new_device = np.random.choice([0, 1], p=[0.8, 0.2])
        
        features = [amount, is_high_amount, is_night, location_risk, new_device]
        X.append(features)
        
        # Fraud logic: higher probability if multiple risk factors
        risk_score = is_high_amount + is_night + location_risk + new_device
        
        # Probabilistic fraud assignment based on risk score
        if risk_score >= 3:
            fraud_prob = 0.8
        elif risk_score == 2:
            fraud_prob = 0.5
        elif risk_score == 1:
            fraud_prob = 0.2
        else:
            fraud_prob = 0.05
        
        label = 1 if np.random.random() < fraud_prob else 0
        y.append(label)
    
    return np.array(X), np.array(y)

# Generate data
print("Generating training data...")
X, y = generate_training_data(n_samples=1000)

print(f"Training data shape: X={X.shape}, y={y.shape}")
print(f"Fraud cases: {np.sum(y)} ({np.sum(y)/len(y)*100:.1f}%)")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train model
print("\nTraining RandomForestClassifier...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluate
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"Train Accuracy: {train_score:.4f}")
print(f"Test Accuracy: {test_score:.4f}")

# Save model
model_dir = "model"
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, "fraud_model.pkl")

joblib.dump(model, model_path)
print(f"\nModel saved to {model_path}")
print(f"Model file size: {os.path.getsize(model_path)} bytes")
