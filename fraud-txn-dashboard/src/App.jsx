import { useEffect, useMemo, useState } from "react";
import FraudSummary from "./components/FraudSummary";
import FraudCharts from "./components/FraudCharts";
import FraudAlerts from "./components/FraudAlerts";
import { connectWebSocket, disconnectWebSocket } from "./services/websocket";
import "./App.css";

const Icon = ({ name, size = 20 }) => {
    const paths = {
        grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
        activity: <><path d="M3 12h4l2.5-7 5 14 2.5-7h4"/><path d="M3 4v16h18"/></>,
        alert: <><path d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2h16a1.4 1.4 0 0 0 1.2-2L12 3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
        search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
        bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
        menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
        shield: <><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></>,
        chevron: <path d="m9 18 6-6-6-6"/>,
    };
    return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

function App() {
    const [alerts, setAlerts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const MAX_ALERTS = 100;
    const MAX_CHART_DATA = 100;

    useEffect(() => {
        connectWebSocket(
            (data) => {
                const event = {
                    ...data,
                    eventId: `${data.transactionId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    receivedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                };
                setConnectionStatus("connected");
                setAlerts((prev) => [event, ...prev].slice(0, MAX_ALERTS));
                setChartData((prev) => [{
                    eventId: event.eventId,
                    transactionId: event.transactionId,
                    transactionLabel: `${event.transactionId} ${event.receivedAt}`,
                    receivedAt: event.receivedAt,
                    riskScore: event.riskScore
                }, ...prev].slice(0, MAX_CHART_DATA));
            },
            () => setConnectionStatus("error"),
            () => setConnectionStatus("connected")
        );
        return () => disconnectWebSocket();
    }, []);

    const dateLabel = useMemo(() => new Intl.DateTimeFormat("en-US", {
        weekday: "long", month: "long", day: "numeric"
    }).format(new Date()), []);

    return (
        <div className="app-shell">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`} aria-label="Primary navigation">
                <div className="brand">
                    <span className="brand-mark"><Icon name="shield" size={22}/></span>
                    <span><strong>FraudShield</strong><small>AI Command Center</small></span>
                </div>
                <nav className="sidebar-nav">
                    <p className="nav-label">Workspace</p>
                    <a className="nav-item active" href="#overview"><Icon name="grid"/>Overview</a>
                    <a className="nav-item" href="#live-feed"><Icon name="activity"/>Transactions</a>
                    <a className="nav-item" href="#risk-analysis"><Icon name="alert"/>Risk analysis</a>
                </nav>
                <div className="sidebar-status">
                    <span className={`status-orb ${connectionStatus}`}/>
                    <span><strong>Detection engine</strong><small>{connectionStatus === "connected" ? "Monitoring live" : connectionStatus === "error" ? "Connection interrupted" : "Establishing link"}</small></span>
                </div>
                <div className="user-card">
                    <span className="avatar">FS</span>
                    <span><strong>Security Ops</strong><small>Administrator</small></span>
                    <Icon name="chevron" size={16}/>
                </div>
            </aside>
            {sidebarOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)}/>}

            <div className="app-body">
                <header className="topbar">
                    <button className="icon-button menu-button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><Icon name="menu"/></button>
                    <div className="search-field" role="search">
                        <Icon name="search" size={18}/>
                        <label className="sr-only" htmlFor="global-search">Search transactions</label>
                        <input id="global-search" placeholder="Search transaction ID, user…" />
                        <kbd>⌘ K</kbd>
                    </div>
                    <div className="topbar-actions">
                        <span className={`connection-badge ${connectionStatus}`}><i/>{connectionStatus === "connected" ? "Live" : connectionStatus === "error" ? "Offline" : "Connecting"}</span>
                        <button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell"/>{alerts.some((a) => a.isFraud) && <span className="notification-dot"/>}</button>
                    </div>
                </header>

                <main id="main-content" className="main-content">
                    <section className="page-heading" id="overview">
                        <div>
                            <p className="eyebrow">{dateLabel}</p>
                            <h1>Fraud intelligence overview</h1>
                            <p>Monitor transaction health and investigate emerging threats in real time.</p>
                        </div>
                        <div className="system-pill"><span className="pulse-dot"/><span><strong>System operational</strong><small>Live scoring enabled</small></span></div>
                    </section>
                    <FraudSummary alerts={alerts}/>
                    <FraudCharts data={chartData}/>
                    <FraudAlerts alerts={alerts}/>
                    <footer>FraudShield AI <span>•</span> Real-time protection active</footer>
                </main>
            </div>
        </div>
    );
}

export default App;
