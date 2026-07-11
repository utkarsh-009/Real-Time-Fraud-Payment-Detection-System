import {
    Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer,
    Tooltip, XAxis, YAxis
} from "recharts";

const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    return <div className="chart-tooltip"><span>Transaction</span><strong>{point.transactionId}</strong><div><span>Risk score</span><b>{Number(point.riskScore).toFixed(2)}</b></div></div>;
};

function FraudCharts({ data }) {
    const chronologicalData = [...data].reverse();
    return (
        <section className="panel chart-panel" id="risk-analysis">
            <div className="panel-heading">
                <div><h2>Risk score activity</h2><p>Real-time model confidence across recent transactions</p></div>
                <div className="chart-legend"><span><i className="line-key"/>Risk score</span><span><i className="dash-key"/>Critical threshold</span></div>
            </div>
            {data.length === 0 ? (
                <div className="chart-empty" aria-label="Waiting for transaction data">
                    <div className="chart-placeholder"><i/><i/><i/><i/><i/><i/></div>
                    <p>Chart populates as transactions arrive</p>
                </div>
            ) : (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chronologicalData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                            <defs><linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6c7cff" stopOpacity=".32"/><stop offset="100%" stopColor="#6c7cff" stopOpacity="0"/></linearGradient></defs>
                            <CartesianGrid vertical={false} stroke="#283349" strokeDasharray="3 6"/>
                            <XAxis dataKey="receivedAt" tick={{ fill: "#758198", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={40}/>
                            <YAxis domain={[0, 1]} ticks={[0, .25, .5, .75, 1]} tick={{ fill: "#758198", fontSize: 11 }} axisLine={false} tickLine={false}/>
                            <ReferenceLine y={.7} stroke="#f05d6d" strokeDasharray="5 5"/>
                            <Tooltip content={<ChartTooltip/>} cursor={{ stroke: "#6876f5", strokeDasharray: "4 4" }}/>
                            <Area type="monotone" dataKey="riskScore" stroke="#7c89ff" strokeWidth={2.5} fill="url(#riskGradient)" activeDot={{ r: 5, fill: "#9ba5ff", stroke: "#111827", strokeWidth: 3 }} dot={false}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}

export default FraudCharts;
