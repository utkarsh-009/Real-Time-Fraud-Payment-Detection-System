import React from "react";

function FraudSummary({ alerts }) {
    const fraudTransactions = alerts.filter(alert => alert.isFraud);
    const safeTransactions = alerts.filter(alert => !alert.isFraud);
    
    const totalTransactions = alerts.length;
    const fraudCount = fraudTransactions.length;
    const safeCount = safeTransactions.length;
    
    const fraudAvgRiskScore = fraudCount > 0 
        ? (fraudTransactions.reduce((sum, t) => sum + t.riskScore, 0) / fraudCount).toFixed(2)
        : 0;
    
    const safeAvgRiskScore = safeCount > 0
        ? (safeTransactions.reduce((sum, t) => sum + t.riskScore, 0) / safeCount).toFixed(2)
        : 0;
    
    const fraudPercentage = totalTransactions > 0
        ? ((fraudCount / totalTransactions) * 100).toFixed(2)
        : 0;
    
    const safePercentage = totalTransactions > 0
        ? ((safeCount / totalTransactions) * 100).toFixed(2)
        : 0;

    return (
        <div style={{
            display: "flex",
            gap: "30px",
            padding: "30px",
            justifyContent: "center",
            flexWrap: "wrap"
        }}>
            {/* Safe Transactions Card */}
            <div style={{
                backgroundColor: "#d4edda",
                border: "2px solid #28a745",
                borderRadius: "12px",
                padding: "30px",
                width: "350px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(40, 167, 69, 0.2)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
            }}>
                <h2 style={{
                    color: "#155724",
                    margin: "0 0 25px 0",
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center"
                }}>
                    ✓ Safe Transactions
                </h2>
                
                <div style={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "15px"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        borderBottom: "1px solid #28a745",
                        paddingBottom: "15px"
                    }}>
                        <span style={{ fontWeight: "bold", color: "#155724" }}>Total Count:</span>
                        <span style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745" }}>{safeCount}</span>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        borderBottom: "1px solid #28a745",
                        paddingBottom: "15px"
                    }}>
                        <span style={{ fontWeight: "bold", color: "#155724" }}>Avg Risk Score:</span>
                        <span style={{ fontSize: "18px", fontWeight: "bold", color: "#28a745" }}>{safeAvgRiskScore}</span>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        borderBottom: "1px solid #28a745",
                        paddingBottom: "15px"
                    }}>
                        <span style={{ fontWeight: "bold", color: "#155724" }}>Status:</span>
                        <span style={{ fontSize: "16px", fontWeight: "bold", color: "#28a745" }}>SAFE ✓</span>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <span style={{ fontWeight: "bold", color: "#155724" }}>Percentage:</span>
                        <span style={{ fontSize: "18px", fontWeight: "bold", color: "#28a745" }}>{safePercentage}%</span>
                    </div>
                </div>
            </div>

            {/* Fraud Transactions Card */}
            <div style={{
                backgroundColor: "#f8d7da",
                border: "2px solid #dc3545",
                borderRadius: "12px",
                padding: "30px",
                width: "350px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(220, 53, 69, 0.2)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
            }}>
                <h2 style={{
                    color: "#721c24",
                    margin: "0 0 25px 0",
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center"
                }}>
                    ✗ Fraud Transactions
                </h2>
                
                <div style={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "15px"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        borderBottom: "1px solid #dc3545",
                        paddingBottom: "15px"
                    }}>
                        <span style={{ fontWeight: "bold", color: "#721c24" }}>Total Count:</span>
                        <span style={{ fontSize: "20px", fontWeight: "bold", color: "#dc3545" }}>{fraudCount}</span>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        borderBottom: "1px solid #dc3545",
                        paddingBottom: "15px"
                    }}>
                        <span style={{ fontWeight: "bold", color: "#721c24" }}>Avg Risk Score:</span>
                        <span style={{ fontSize: "18px", fontWeight: "bold", color: "#dc3545" }}>{fraudAvgRiskScore}</span>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        borderBottom: "1px solid #dc3545",
                        paddingBottom: "15px"
                    }}>
                        <span style={{ fontWeight: "bold", color: "#721c24" }}>Status:</span>
                        <span style={{ fontSize: "16px", fontWeight: "bold", color: "#dc3545" }}>FRAUD ✗</span>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <span style={{ fontWeight: "bold", color: "#721c24" }}>Percentage:</span>
                        <span style={{ fontSize: "18px", fontWeight: "bold", color: "#dc3545" }}>{fraudPercentage}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FraudSummary;
