import React, { useEffect, useState } from "react";
import FraudAlerts from "./components/FraudAlerts";
import FraudCharts from "./components/FraudCharts";
import { connectWebSocket } from "./services/websocket";

function App() {

    const [alerts, setAlerts] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {

        connectWebSocket((data) => {

            console.log("Received:", data);

            // update alerts list
            setAlerts((prev) => [data, ...prev]);

            // update chart data
            setChartData((prev) => [
                ...prev,
                {
                    transactionId: data.transactionId,
                    riskScore: data.riskScore
                }
            ]);
        });

    }, []);

    return (
        <div style={{ fontFamily: "Arial" }}>

            <h1 style={{ textAlign: "center" }}>
                FraudShield AI Dashboard
            </h1>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >

                <div style={{ width: "45%" }}>
                    <FraudAlerts alerts={alerts} />
                </div>

                <div style={{ width: "50%" }}>
                    <FraudCharts data={chartData} />
                </div>

            </div>

        </div>
    );
}

export default App;