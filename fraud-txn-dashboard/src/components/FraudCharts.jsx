import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

function FraudChart({ data }) {
    return (
        <div style={{ padding: "10px" }}>
            <h2>Risk Score Trend</h2>

            <LineChart
                width={700}
                height={300}
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="transactionId" />

                <YAxis domain={[0, 1]} />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="riskScore"
                    stroke="#ff4d4f"
                />
            </LineChart>
        </div>
    );
}

export default FraudChart;