import React, { useEffect, useState } from "react";
import FraudSummary from "./components/FraudSummary";
import FraudCharts from "./components/FraudCharts";
import { connectWebSocket, disconnectWebSocket } from "./services/websocket";

// Mock initial data
const INITIAL_ALERTS = [
    { transactionId: "TXN-00001", userId: "USER-101", riskScore: 0.92, isFraud: true },
    { transactionId: "TXN-00002", userId: "USER-102", riskScore: 0.15, isFraud: false },
    { transactionId: "TXN-00003", userId: "USER-103", riskScore: 0.78, isFraud: true },
    { transactionId: "TXN-00004", userId: "USER-104", riskScore: 0.22, isFraud: false },
    { transactionId: "TXN-00005", userId: "USER-105", riskScore: 0.85, isFraud: true },
    { transactionId: "TXN-00006", userId: "USER-106", riskScore: 0.10, isFraud: false },
    { transactionId: "TXN-00007", userId: "USER-107", riskScore: 0.65, isFraud: true },
    // { transactionId: "TXN-00008", userId: "USER-108", riskScore: 0.30, isFraud: false },
];

const INITIAL_CHART_DATA = INITIAL_ALERTS.map(alert => ({
    transactionId: alert.transactionId,
    riskScore: alert.riskScore
}));

function App() {

    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const [chartData, setChartData] = useState(INITIAL_CHART_DATA);
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    const MAX_ALERTS = 100;
    const MAX_CHART_DATA = 100;

    useEffect(() => {
        let isConnected = false;

        connectWebSocket(
            (data) => {
                isConnected = true;
                setConnectionStatus("connected");
                console.log("Received:", data);

                // update alerts list with limit
                setAlerts((prev) => {
                    const updated = [data, ...prev];
                    return updated.slice(0, MAX_ALERTS);
                });

                // update chart data with limit
                setChartData((prev) => {
                    const updated = [
                        ...prev,
                        {
                            transactionId: data.transactionId,
                            riskScore: data.riskScore
                        }
                    ];
                    return updated.slice(0, MAX_CHART_DATA);
                });
            },
            (error) => {
                setConnectionStatus("error");
                console.error("WebSocket Error:", error);
            }
        );

        // Cleanup function on unmount
        return () => {
            disconnectWebSocket();
        };

    }, []);

    return (
        <div style={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "100vh",
            padding: "40px 20px"
        }}>
            {/* Header Section */}
            <div style={{
                textAlign: "center",
                marginBottom: "40px",
                color: "white"
            }}>
                <h1 style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    margin: "0 0 15px 0",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
                }}>
                    🛡️ FraudShield AI Dashboard
                </h1>
                <p style={{
                    fontSize: "18px",
                    margin: "0",
                    opacity: 0.9,
                    fontWeight: "300"
                }}>
                    Real-Time Fraud Detection & Analysis
                </p>
            </div>

            {/* Status Badge */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <span style={{
                    padding: "12px 24px",
                    borderRadius: "50px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    backgroundColor: connectionStatus === "connected" ? "#28a745" : connectionStatus === "error" ? "#dc3545" : "#ffc107",
                    color: connectionStatus === "connected" ? "white" : connectionStatus === "error" ? "white" : "#333",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    display: "inline-block",
                    letterSpacing: "0.5px"
                }}>
                    {connectionStatus === "connected" ? "✓ Connected" : connectionStatus === "error" ? "✗ Connection Error" : "⟳ Connecting..."}
                </span>
            </div>

            {/* Main Content Container */}
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto"
            }}>
                {/* Summary Cards Section */}
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "40px 20px",
                    marginBottom: "40px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)"
                }}>
                    <h2 style={{
                        textAlign: "center",
                        color: "#333",
                        marginTop: "0",
                        marginBottom: "30px",
                        fontSize: "28px",
                        fontWeight: "600"
                    }}>
                        Transaction Summary
                    </h2>
                    <FraudSummary alerts={alerts} />
                </div>

                {/* Chart Section */}
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "40px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <FraudCharts data={chartData} />
                </div>
            </div>

        </div>
    );
}

export default App;