const shortId = (value) => {
    const text = String(value ?? "Unknown");
    return text.length > 18 ? `${text.slice(0, 8)}…${text.slice(-6)}` : text;
};

function RiskBar({ score = 0 }) {
    const normalized = Math.max(0, Math.min(1, Number(score) || 0));
    const tone = normalized >= .7 ? "critical" : normalized >= .4 ? "warning" : "safe";
    return <div className="risk-cell"><div className="risk-track"><span className={tone} style={{ width: `${normalized * 100}%` }}/></div><strong>{normalized.toFixed(2)}</strong></div>;
}

function FraudAlerts({ alerts }) {
    return (
        <section className="panel feed-panel" id="live-feed">
            <div className="panel-heading">
                <div><div className="title-row"><h2>Live transaction feed</h2><span className="live-chip"><i/>Live</span></div><p>Incoming transactions scored by the detection engine</p></div>
                <span className="record-count">{alerts.length} records</span>
            </div>
            {alerts.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-radar"><i/><i/><i/></span>
                    <h3>Listening for transactions</h3>
                    <p>New activity will appear here as soon as the detection engine receives it.</p>
                    <div className="skeleton-lines" aria-hidden="true"><span/><span/><span/></div>
                </div>
            ) : (
                <div className="table-scroll">
                    <table>
                        <thead><tr><th>Transaction</th><th>User</th><th>Risk score</th><th>Received</th><th>Status</th></tr></thead>
                        <tbody>
                            {alerts.map((alert) => (
                                <tr key={alert.eventId}>
                                    <td data-label="Transaction"><strong className="transaction-id">{shortId(alert.transactionId)}</strong></td>
                                    <td data-label="User"><span className="user-id">{shortId(alert.userId)}</span></td>
                                    <td data-label="Risk score"><RiskBar score={alert.riskScore}/></td>
                                    <td data-label="Received"><span className="time-cell">{alert.receivedAt}</span></td>
                                    <td data-label="Status"><span className={`status-badge ${alert.isFraud ? "fraud" : "safe"}`}><i/>{alert.isFraud ? "Fraudulent" : "Verified safe"}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default FraudAlerts;
