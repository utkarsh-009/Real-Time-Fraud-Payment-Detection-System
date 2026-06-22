import joblib
import os
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import logging

logger = logging.getLogger(__name__)

model_path = "model/fraud_model.pkl"

# Load or create model
try:
    if os.path.exists(model_path) and os.path.getsize(model_path) > 0:
        model = joblib.load(model_path)
        logger.info(f"Model loaded successfully from {model_path} (size: {os.path.getsize(model_path)} bytes)")
    else:
        logger.warning(f"Model file not found or empty at {model_path}. Creating dummy model...")
        # Train a simple model with dummy data
        X_dummy = np.array([
            [50000, 1, 0, 1, 1],
            [1000, 0, 1, 0, 0],
            [150000, 1, 1, 1, 0],
            [5000, 0, 0, 0, 1],
        ])
        y_dummy = np.array([1, 0, 1, 0])
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_dummy, y_dummy)
        
        os.makedirs("model", exist_ok=True)
        joblib.dump(model, model_path)
        logger.info(f"Dummy model created and saved to {model_path}")
except Exception as e:
    logger.error(f"Failed to load/create model: {e}")
    raise