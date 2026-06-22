import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

function FraudCharts({ data }) {
    return (
        <div style={{ padding: "0", width: "100%" }}>
            <h2 style={{
                color: "#333",
                fontSize: "24px",
                fontWeight: "600",
                marginTop: "0",
                marginBottom: "25px",
                textAlign: "center"
            }}>
                📊 Risk Score Trend Analysis
            </h2>

            {data.length === 0 ? (
                <p style={{ 
                    color: "#999", 
                    fontStyle: "italic",
                    textAlign: "center",
                    fontSize: "16px",
                    padding: "40px"
                }}>
                    Waiting for transaction data... Chart will appear once data is received.
                </p>
            ) : (
                <div style={{ display: "flex", justifyContent: "center", overflowX: "auto" }}>
                    <LineChart
                        width={Math.max(800, data.length * 100)}
                        height={400}
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

                        <XAxis 
                            dataKey="transactionId" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            style={{ fontSize: "12px" }}
                        />

                        <YAxis 
                            domain={[0, 1]}
                            style={{ fontSize: "12px" }}
                            label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }}
                        />

                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "#f9f9f9",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "10px"
                            }}
                            formatter={(value) => value.toFixed(2)}
                        />

                        <Line
                            type="monotone"
                            dataKey="riskScore"
                            stroke="#ff4d4f"
                            strokeWidth={3}
                            dot={{ fill: "#ff4d4f", r: 5 }}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                </div>
            )}
        </div>
    );
}

export default FraudCharts;