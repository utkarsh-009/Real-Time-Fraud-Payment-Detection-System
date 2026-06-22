def create_features(txn):
    """Extract features from transaction for fraud detection.
    
    Args:
        txn: Transaction dictionary with keys: amount, createdAt, location, deviceId
        
    Returns:
        dict: Features dictionary with 5 keys for model prediction
    """
    features = {}

    features["amount"] = txn["amount"]

    features["is_high_amount"] = 1 if txn["amount"] > 50000 else 0

    # Extract hour from timestamp (format: "YYYY-MM-DD HH:MM:SS")
    try:
        hour = int(txn["createdAt"][11:13])
        features["is_night"] = 1 if hour < 5 else 0
    except (ValueError, IndexError):
        features["is_night"] = 0

    features["location_risk"] = 1 if txn["location"] not in ["Mumbai", "Delhi"] else 0

    features["new_device"] = 1 if txn["deviceId"].startswith("NEW") else 0

    return features