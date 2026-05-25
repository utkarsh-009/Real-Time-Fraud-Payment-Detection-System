def create_feature(txn): 
    features = {}

    features["amount"] = txn["amount"]

    features["is_high_amount"] = 1 if txn["amount"] > 50000 else 0

    features["is_night"] = 1 if "00:00" <= txn["createdAt"][11:16] <= "05:00" else 0

    features["location_risk"] = 1 if txn["location"] not in ["Mumbai", "Delhi"] else 0

    features["new_device"] = 1 if txn["deviceId"].startswith("NEW") else 0

    return features