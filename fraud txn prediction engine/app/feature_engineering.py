import math


HIGH_RISK_LOCATIONS = {
    "Russia",
    "Nigeria",
    "North Korea",
    "Iran",
    "Unknown",
}

SAFE_LOCATIONS = {
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
}

RISKY_MERCHANT_KEYWORDS = (
    "crypto",
    "gift",
    "betting",
    "casino",
    "wire",
)


def extract_hour(timestamp):
    """Accept Java LocalDateTime arrays and ISO/string timestamps."""
    if isinstance(timestamp, list) and len(timestamp) >= 4:
        return int(timestamp[3])

    if isinstance(timestamp, str):
        return int(timestamp[11:13])

    return None


def create_features(txn):
    """Extract features from transaction for fraud detection.
    
    Args:
        txn: Transaction dictionary with keys: amount, createdAt, location, deviceId
        
    Returns:
        dict: Features dictionary for model prediction
    """
    amount = float(txn["amount"])
    location = str(txn.get("location", "Unknown"))
    merchant = str(txn.get("merchant", ""))
    device_id = str(txn.get("deviceId", ""))

    features = {}

    features["amount"] = amount

    features["amount_log"] = math.log1p(amount)

    features["is_high_amount"] = 1 if amount > 50000 else 0

    features["is_very_high_amount"] = 1 if amount > 100000 else 0

    # Java may serialize LocalDateTime as [year, month, day, hour, minute, ...].
    try:
        hour = extract_hour(txn["createdAt"])
        features["hour"] = hour if hour is not None else 12
        features["is_night"] = 1 if hour is not None and (hour < 5 or hour > 23) else 0
    except (TypeError, ValueError, IndexError):
        features["hour"] = 12
        features["is_night"] = 0

    features["location_risk"] = 1 if location not in SAFE_LOCATIONS else 0

    features["high_risk_location"] = 1 if location in HIGH_RISK_LOCATIONS else 0

    features["new_device"] = 1 if device_id.startswith("NEW") or device_id.endswith("999") else 0

    features["risky_merchant"] = 1 if any(keyword in merchant.lower() for keyword in RISKY_MERCHANT_KEYWORDS) else 0

    features["risk_factor_count"] = (
        features["is_high_amount"]
        + features["is_very_high_amount"]
        + features["is_night"]
        + features["location_risk"]
        + features["high_risk_location"]
        + features["new_device"]
        + features["risky_merchant"]
    )

    return features
