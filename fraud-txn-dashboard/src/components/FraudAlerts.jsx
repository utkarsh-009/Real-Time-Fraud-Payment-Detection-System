import React from "react";

function FraudAlerts({ alerts }) {
    return (
        <div style={{ padding: "10px" }}>
            <h2>Live Fraud Alerts</h2>

            {alerts.length === 0 && (
                <p style={{ color: "#666", fontStyle: "italic" }}>
                    Waiting for fraud alerts... Make a transaction to see alerts here.
                </p>
            )}

            {alerts.map((alert) => (
                <div
                    key={alert.transactionId}
                    style={{
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                        padding: "10px",
                        borderRadius: "8px",
                        background:
                            alert.isFraud ? "#ffdddd" : "#ddffdd"
                    }}
                >
                    <p>
                        <b>Transaction ID:</b> {alert.transactionId}
                    </p>

                    <p>
                        <b>User ID:</b> {alert.userId}
                    </p>

                    <p>
                        <b>Risk Score:</b>{" "}
                        {alert.riskScore?.toFixed(2)}
                    </p>

                    <p>
                        <b>Status:</b>{" "}
                        {alert.isFraud ? "FRAUD" : "SAFE"}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default FraudAlerts;