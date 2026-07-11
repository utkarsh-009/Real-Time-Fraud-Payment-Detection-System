const MetricIcon = ({ type }) => {
    const paths = {
        total: <><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="18" cy="18" r="2"/></>,
        safe: <><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></>,
        fraud: <><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4M12 17h.01"/></>,
        risk: <><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></>,
    };
    return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[type]}</svg>;
};

function FraudSummary({ alerts }) {
    const fraudTransactions = alerts.filter((alert) => alert.isFraud);
    const safeTransactions = alerts.filter((alert) => !alert.isFraud);
    const total = alerts.length;
    const fraudCount = fraudTransactions.length;
    const safeCount = safeTransactions.length;
    const averageRisk = total ? alerts.reduce((sum, item) => sum + (Number(item.riskScore) || 0), 0) / total : 0;
    const fraudPercentage = total ? (fraudCount / total) * 100 : 0;

    const metrics = [
        { type: "total", label: "Total transactions", value: total.toLocaleString(), detail: "Live session volume", tone: "blue" },
        { type: "safe", label: "Verified safe", value: safeCount.toLocaleString(), detail: total ? `${((safeCount / total) * 100).toFixed(1)}% of traffic` : "Awaiting activity", tone: "green" },
        { type: "fraud", label: "Fraud detected", value: fraudCount.toLocaleString(), detail: total ? `${fraudPercentage.toFixed(1)}% fraud rate` : "No threats detected", tone: "red" },
        { type: "risk", label: "Average risk score", value: averageRisk.toFixed(2), detail: averageRisk >= .7 ? "Critical exposure" : averageRisk >= .4 ? "Elevated exposure" : "Low exposure", tone: "amber" },
    ];

    return (
        <section className="metric-grid" aria-label="Transaction summary">
            {metrics.map((metric) => (
                <article className={`metric-card ${metric.tone}`} key={metric.type}>
                    <div className="metric-card-head">
                        <span className="metric-label">{metric.label}</span>
                        <span className="metric-icon"><MetricIcon type={metric.type}/></span>
                    </div>
                    <strong className="metric-value">{metric.value}</strong>
                    <div className="metric-detail"><span className="mini-dot"/>{metric.detail}</div>
                </article>
            ))}
        </section>
    );
}

export default FraudSummary;
